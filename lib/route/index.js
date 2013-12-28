'use strict';
var util = require('util');
var crypto = require('crypto');
var amqp = require('amqplib');
var xtend = require('xtend');
var when = require('when');
var pipeline = require('when/pipeline');
var debug = require('debug')('svcs:route');

var defaults = {
  amqpUrl: 'amqp://guest:guest@localhost:5672',
  exchange: 'amq.topic',
  queue: 'queue123' // todo routeToQueueName(route)
};

module.exports = function Router(container, route, options, handler) {

  this.options = xtend(defaults, options);
  this.options.route = route;
  this.options.handler = handler;
  this.container = container;

  this.baseMsg = {
    logger: container.logger,
    stats: container.stats
  };

  var self = this;

  function consumerTag() {
    return crypto.randomBytes(5).readUInt32BE(0).toString(16);
  }

  function subscribe(ch) {
    debug('subscribe', self.options.queue, self.options.exchange, self.options.route);

    function handleMessage(msg) {

      var svcsMsg = xtend(self.baseMsg, msg);

      svcsMsg.ack = ackMessage;

      function ackMessage() {
        debug('ack', 'message');
        ch.ack(msg);
      }


      pipeline(self.container.middleware, svcsMsg).then(function processMiddleware(updateMsg) {
        debug('updateMsg', 'msg');
        self.options.handler(updateMsg);
      });

    }

    return when.all([
      ch.assertExchange(self.options.exchange, 'topic'),
      ch.assertQueue(self.options.queue),
      ch.bindQueue(self.options.queue, self.options.exchange, '$gw.*.events'),
      ch.consume(self.options.queue, handleMessage, {consumerTag: self.consumerTag})
    ]);
  }

  function onErr(err) {
    self.container.logger.error(err);
  }

  this.init = function init() {
    debug('init', self.options.amqpUrl, self.route);
    this.consumerTag = consumerTag();

    var open = amqp.connect(this.options.amqpUrl);

    open.then(function (conn) {
      var ok = conn.createChannel();
      ok.then(subscribe);
      return ok;
    });
    this.connection = open;
    return open;
  };

  this.close = function close() {
    this.connection.then(function (conn) {
      conn.close();
    });
  };

};