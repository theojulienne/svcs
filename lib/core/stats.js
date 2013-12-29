'use strict';

var os = require('os');
var xtend = require('xtend');
var StatsDClient = require('statsd-client');

var defaultConfig = {
  name: 'svcs',
  statsd: {
    "host": "localhost"
  }
};

module.exports = function createStats(container, options) {

  var config = xtend(defaultConfig, options);

  container.logger.info('statsd', config);

  var env = config.env;
  var host = os.hostname().replace(/\W/g, '');
  var prefix = [env, config.name, host].join('.');

  container.logger.info('built stats client [' + prefix + ']');

  var statsd = new StatsDClient({
    host: config.statsd.host,
    port: 8125,
    debug: false,
    prefix: prefix
  });

  return statsd;
};