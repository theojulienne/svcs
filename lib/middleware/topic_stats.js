'use strict';

var when = require('when');
var log = require('debug')('svcs:middleware:topic_stats');

module.exports = function useTopicStats(){
  return function(msg) {

    var defer = when.defer();

    var topic = msg.fields.routingKey;

    log('stats', topic);

    if(topic){
      var metric = 'topic' + topic.replace(/\W/g, '_');
      msg.stats.increment(metric);
    }

    return defer.resolve(msg);
  };
};