'use strict';

var Logger = require('bunyan');

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

  return logger;
};