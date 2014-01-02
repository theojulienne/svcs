'use strict';

var createLogger = require('../../lib/core/logger');

describe('logger', function(){

  var logger;

  before(function(){
    logger = createLogger('test');
  });

  it('should have winston compat method', function(){
    logger.log('warn', 'test', {msg: 'test'});
  });

  it('shouldnt explode with a bad winston compat type', function(){
    logger.log('poop', 'test', {msg: 'test'});
  });

});