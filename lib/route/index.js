'use strict';
var crypto = require('crypto');
var amqp = require('amqplib');
var xtend = require('xtend');
var when = require('when');
var pipeline = require('when/pipeline');
var debug = require('debug')('svcs:route');

var Message = require('./message');

var defaults = {
  middleware: [],
  amqpUrl: 'amqp://guest:guest@localhost:5672',
  exchange: 'amq.topic',
  queue: 'queue123', // todo routeToQueueName(route)
  queueOpts: {durable: true, autoDelete: false, messageTtl: 30000, expires: 3600000},
  autoAck: false
};

/**
 *
 * Router which filters messages which pass through an exchange based on routing key.
 *
 * @param {Object} container
 * @param {String} route
 * @param {Object} options
 * @param {Function} handler
 * @constructor
 */
module.exports = function Router(container, route, options, handler) {

  if(options.middleware && !Array.isArray(options.middleware)){
    throw new Error('Middleware must be supplied in an array.');
  }

  this.options = xtend(defaults, options);
  this.options.route = route;
  this.options.handler = handler;
  this.container = container;
  this.baseMsg = new Message(container, route);

  var self = this;

  function consumerTag() {
    return crypto.randomBytes(5).readUInt32BE(0).toString(16);
  }

  function subscribe(ch) {
    debug('subscribe', self.options.queue, self.options.exchange, self.options.route);

    // callback which is invoked each time a message matches the configured route.
    function handleMessage(msg) {

      var svcsMsg = xtend(self.baseMsg, msg);

      svcsMsg.parseRoutingKey();

      svcsMsg.channel = ch;
      svcsMsg.ack = ackMessage;

      // Ack method for the msg
      function ackMessage() {
        ch.ack(msg);
      }

      var middleware = Array.isArray(self.options.middleware) ?
        self.container.middleware.concat(self.options.middleware) : self.container.middleware;

      // run all the middleware passing the message through each with the result being updateMsg
      pipeline(middleware, svcsMsg).then(function processMiddleware(updateMsg) {
        // cater for pipeline returning an array if the array of functions passed was empty!?
        if (Array.isArray(updateMsg)) {
          self.options.handler(updateMsg[0]);
        }
        else {
          self.options.handler(updateMsg);
        }
        debug('queue', self.options.queue);
        if(self.options.autoAck) {
          debug('autoAck', 'true');
          ackMessage();
        }
      }, onErr);

    }

    var routingKey = self.options.route.replace(/\:[a-zA-Z0-9]+/g, '*');
    debug('routingKey', routingKey);

    return when.all([
      ch.assertExchange(self.options.exchange, 'topic'),
      ch.assertQueue(self.options.queue, self.options.queueOpts),
      ch.bindQueue(self.options.queue, self.options.exchange, routingKey),
      ch.consume(self.options.queue, handleMessage, {consumerTag: self.consumerTag})
    ]);
  }

  function onErr(err) {
    self.container.logger.error(err);
  }

  /**
   * Initialise the route.
   *
   * @returns {Object}
   */
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