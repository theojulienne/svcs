'use strict';

var Logger = require('bunyan');

module.exports = function createLogger(name) {

  var logger;

  // development logger

  switch (process.env.NODE_ENV) {
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

    default:

      // production/staging logger

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

  return logger;
};