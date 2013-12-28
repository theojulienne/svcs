'use strict';

var util = require('util');
var log = require('debug')('test:middleware:json');

var Container = require('../../lib/container');
var json = require('../../lib/middleware/json');

var chaiAsPromised = require("chai-as-promised");

var chai = require('chai');

chai.use(chaiAsPromised);

var expect = chai.expect;

var emptyMsg = {content: new Buffer(''), properties: {contentType: 'application/json'}};
var jsonMsg = {content: new Buffer('{"foo": "bar"}'), properties: {contentType: 'application/json'}};
var textMsg = {content: new Buffer('Hello world!'), properties: {contentType: 'application/text'}};
var unknownMsg = {content: new Buffer('Hello world!'), properties: {contentType: undefined}};

describe('JSON Middleware', function () {

  var jsonDecode = json();
  var container = new Container();

  before(function () {
    container.init();
  });

  after(function () {
    container.shutdown();
  });

  it('should be rejected with empty msg', function (done) {
    return expect(jsonDecode(emptyMsg)).to.eventually.be.rejectedWith(Error).and.notify(done);
  });

  it('should be resolved with a JSON msg', function (done) {
    return expect(jsonDecode(jsonMsg)).to.eventually.have.property("body").and.notify(done);
  });

  it('should be resolved with a non JSON msg and skip decoding', function (done) {
    return expect(jsonDecode(textMsg)).to.eventually.not.have.property("body").and.notify(done);
  });

  it('should be resolved with missing contentType and skip decoding', function (done) {
    return expect(jsonDecode(unknownMsg)).to.eventually.not.have.property("body").and.notify(done);
  });

  it('should setup a route and consume json', function (done) {

    container.use(jsonDecode);

    var open = container.route('$gw.*.events', {queue: 'gw_events'}, function (msg) {
      msg.ack();
      expect(msg).to.have.property('body');
      done();
    });

    open.then(function (conn) {
      var ok = conn.createChannel();
      ok = ok.then(function (ch) {
        ch.assertQueue('queue123');
        ch.publish('amq.topic', '$gw.123456.events', new Buffer(JSON.stringify({msg: 'some message'})), {contentType: 'application/json'});
      });
      return ok;
    }).then(null, console.warn);

  });

});