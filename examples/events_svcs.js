'use strict';

var svcs = require('../index');
var debug = require('debug')('event_svcs');

var container = svcs();

container.use(svcs.json());
container.use(svcs.stats());

container.job(10000, svcs.runtime());

// set up the container, this returns a promise which yields an AMQP connection.
var open = container.route('$gw.:gwId.events', {queue: 'gw_events'}, function(msg){
//  msg.logger.debug('msg.params', msg.params);
  msg.ack();
});

// make a client based on the existing connection and send some messages
open.then(function(conn) {
  var ok = conn.createChannel();
  ok = ok.then(function(ch) {
    setInterval(function(){
      ch.publish('amq.topic', '$gw.123456.events', new Buffer(JSON.stringify({msg: 'some message'})), {contentType: 'application/json'});
    }, 1);
  });
  return ok;
}).then(null, console.warn);

/*
setInterval(function(){
  global.gc();
}, 10000)
*/
