'use strict';

var Container = require('../lib/container');

var container = new Container();

exports = module.exports = function createContainer(){

  container.init();
  container.logger.debug('Node env - %s', process.env.NODE_ENV);

  return container;
};

exports.container = container;
exports.logger = exports.container.logger;

exports.json = require('./middleware/json');
exports.topicStats = require('./middleware/topic_stats');