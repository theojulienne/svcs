'use strict';

var Container = require('../lib/container');

var container = new Container();

/**
 * Main entry point for creating a svcs container.
 *
 * @type {createContainer}
 */
exports = module.exports = function createContainer(){

  container.init();
  container.logger.debug('Node env - %s', process.env.NODE_ENV);

  return container;
};

exports.container = container;
exports.logger = exports.container.logger;

exports.json = require('./middleware/json');
exports.stats = require('./middleware/topic_stats');

exports.runtime = require('./job/runtime');