'use strict';

var when = require('when');
var log = require('debug')('svcs:middleware:json');

var regexp = /^application\/json$/i;

module.exports = function useJson(options){

  var config = options || {};

  return function(msg) {

    log('json', 'message');
    log('options', config);

    var defer = when.defer();

    log('msg.properties.contentType', msg.properties.contentType);
    var contentType = msg.properties.contentType;

    if (!config.ignoreContentType) if (contentType === undefined) {
      log('promise', 'skipped', 'missing contentType', msg.properties.contentType);
      return defer.resolve(msg);
    } else {
      if (contentType && !contentType.match(regexp)) {
        log('promise', 'skipped', msg.contentType);
        return defer.resolve(msg);
      }
    }

    if (msg.content.length === 0){
      log('promise', 'reject');
      return defer.reject(new Error('invalid json, content empty'));
    } else {
      log('promise', 'resolve');
      try {
        msg.body = JSON.parse(msg.content);
        return defer.resolve(msg);
      } catch(err) {
        log('reject json parse issue.');
        return defer.reject(err);
      }
    }
  };
};