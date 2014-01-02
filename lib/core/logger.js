'use strict';

var Logger = require('bunyan');
var debug = require('debug')('svcs:core:logger');

var methods = ['error', 'warn', 'info', 'debug'];

module.exports = function createLogger(name) {

  var logger;

  switch (process.env.NODE_ENV) {

    // development logger

    case 'development':
      logger = new Logger({
        name: name || 'dev',
        streams: [
          {
            stream: process.stdout,
            level: 'debug'
          }
        ]
      });

      break;

    // testing logger

    case 'test':
      logger = new Logger({
        name: name || 'dev',
        streams: [
          {
            stream: process.stdout,
            level: 'warn'
          }
        ]
      });

      break;

    // production/staging logger

    default:

      logger = new Logger({
        name: name || 'prod',
        streams: [
          {
            stream: process.stdout,
            level: 'info'
          }
        ]
      });


      break;
  }

  // add a method for winston comparability
  logger.log = winstonLog.bind(null, logger);

  return logger;
};

function winstonLog(logger){

  var args = Array.prototype.slice.call(arguments);
  args.shift();
  var level = args.shift();

  debug('winstonLog', level, args);

  if(methods.indexOf(level) !== -1){
    logger[level].apply(logger, args);
  }

}