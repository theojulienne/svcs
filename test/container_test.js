'use strict';

var util = require('util');
var log = require('debug')('test:container');

var Container = require('../lib/container');

var expect = require('chai').expect;

describe('Container', function(){

  var container = new Container();

  after(function(){
    container.shutdown();
  });

  it('should init default components', function(){

    container.init();
    expect(container.logger).exists;

  });

  it('should setup a route and consume', function(done){

    var open = container.route('$gw.*.events', {queue: 'gw_events'}, function(msg){
      msg.ack();
      done();
    });

    open.then(function(conn) {
      var ok = conn.createChannel();
      ok = ok.then(function(ch) {
        ch.assertQueue('queue123');
        ch.publish('amq.topic', '$gw.123456.events', new Buffer(JSON.stringify({msg: 'some message'})), {contentType: 'application/json'});
      });
      return ok;
    }).then(null, console.warn);

  });

});