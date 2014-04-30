'use strict';

var log4js = require('log4js');
var logger = log4js.getLogger();
var debug = require('debug')('svcs:core:logger');

var methods = ['error', 'warn', 'info', 'debug'];

module.exports = function createLogger(name) {

//  var logger;

  switch (process.env.NODE_ENV) {

    // development logger

    case 'development':

      log4js.configure({
        appenders: [
          {
            type: 'console',
            layout: {
              type: "pattern",
              pattern: "%p %c -%] %m%n"
            }
          }
        ]
      });

      break;

    // testing logger

    case 'test':

      log4js.configure({
        appenders: [
          { type: 'console' }
        ]
      });

      break;

    // production/staging logger

    default:

      log4js.configure({
        appenders: [
          {
            type: 'console',
            layout: {
              type: "pattern",
              pattern: "%p %c -%] %m%n"
            }
          }
        ]
      });

      break;
  }

  // add a method for winston comparability
  logger.log = winstonLog.bind(null, logger);

  return logger;
};

function winstonLog(logger) {

  var args = Array.prototype.slice.call(arguments);
  args.shift();
  var level = args.shift();

  debug('winstonLog', level, args);

  if (methods.indexOf(level) !== -1) {
    logger[level].apply(logger, args);
  }

}