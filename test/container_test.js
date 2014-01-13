'use strict';

var util = require('util');
var log = require('debug')('test:container');

var Container = require('../lib/container');

var expect = require('chai').expect;

describe('Container', function () {

  var container = new Container();

  after(function () {
    container.shutdown();
  });

  it('should init default components', function () {

    container.init();
    expect(container.logger).exists;

  });

  it('should setup a route and consume', function (done) {

    var open = container.route('$test.:thing.events.:then', {queue: 'test_events_params'}, function (msg) {
      log('msg', msg);
      msg.ack();
      expect(msg.params).to.have.property('thing');
      expect(msg.params.thing).to.equal('123456');
      done();
    });

    setTimeout(
      function () {
        open.then(function (conn) {
          var ok = conn.createChannel();
          ok = ok.then(function (ch) {
            ch.publish('amq.topic', '$test.123456.events.some', new Buffer(JSON.stringify({msg: 'some message'})), {contentType: 'application/json'});
          });
          return ok;
        }).then(null, console.warn);
      }, 100);

  });

});