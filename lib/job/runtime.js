'use strict';

var os = require('os');

module.exports = function createStatsJob() {
  return function runtime(container) {

    container.logger.info('runtime job run');
    var statsd = container.stats;

    var load = os.loadavg();
    var memory = process.memoryUsage();

    statsd.gauge('os.gauge.load.long', load.pop());
    statsd.gauge('os.gauge.load.medium', load.pop());
    statsd.gauge('os.gauge.load.short', load.pop());
    statsd.gauge('node.gauge.process.rss', memory.rss);
    statsd.gauge('node.gauge.process.heapTotal', memory.heapTotal);
    statsd.gauge('node.gauge.process.heapUsed', memory.heapUsed);

  };
};