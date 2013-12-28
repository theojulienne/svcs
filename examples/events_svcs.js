'use strict';

var svcs = require('../index');
var debug = require('debug')('event_svcs');

var container = svcs();

container.use(svcs.json());
container.use(svcs.topicStats());

// set up the container
var open = container.route('$gw.*.events', {queue: 'gw_events'}, function(msg){
//  msg.logger.debug('msg.body', msg.body);
  msg.ack();
});

// make a client based on the existing connection and send some messages
open.then(function(conn) {
  var ok = conn.createChannel();
  ok = ok.then(function(ch) {
    setInterval(function(){
      ch.publish('amq.topic', '$gw.123456.events', new Buffer(JSON.stringify({msg: 'some message'})), {contentType: 'application/json'});
    }, 1000);
  });
  return ok;
}).then(null, console.warn);