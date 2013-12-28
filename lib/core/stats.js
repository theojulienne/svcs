'use strict';

var os = require('os');
var xtend = require('xtend');
var StatsDClient = require('statsd-client');

var defaultConfig = {
  name: 'svcs',
  region: "home",
  statsd: {
    "host": "localhost",
    "env": "dev"
  }
};

module.exports = function createStats(container, options) {

  var config = xtend(defaultConfig, options);

  container.logger.info('statsd', config);

  var location = config.region;
  var env = config.statsd.env;
  var host = os.hostname().replace(/\W/g, '');
  var prefix = [location, env, config.name, host].join('.');

  container.logger.info('built stats client [' + prefix + ']');

  var statsd = new StatsDClient({
    host: config.statsd.host,
    port: 8125,
    debug: false,
    prefix: ''
  });

  return statsd;
};