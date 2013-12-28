'use strict';

var when = require('when');
var log = require('debug')('svcs:middleware:topic_stats');

module.exports = function useTopicStats(){
  return function(msg) {

    var defer = when.defer();

    var routingKey = msg.fields.routingKey;

    log('stats', routingKey);

    if(routingKey){
      var metric = 'topic_' + routingKey.replace(/\$/g, '').replace(/\W/g, '_');
      msg.stats.increment(metric);
    }

    return defer.resolve(msg);
  };
};