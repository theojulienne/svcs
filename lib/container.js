'use strict';

var events = require('events');
var util = require('util');
var xtend = require('xtend');

var logger = require('./core/logger');
var stats = require('./core/stats');
var Route = require('./route');
var Job = require('./job');

/**
 * Container holds all state around routes.
 * @constructor
 */
var Container = function Container() {

  events.EventEmitter.call(this);

  var self = this;

  this.init = function () {
    this.routes = [];
    this.jobs = [];
    this.settings = {};
    this.middleware = [];
    this.defaultConfiguration();
  };

  this.shutdown = function(){
    this.routes.forEach(function(route){
      route.close();
    });
  };

  this.defaultConfiguration = function () {
    this.set('env', process.env.NODE_ENV || 'development');
    this.logger = logger('svcs');
    this.stats = stats(self, self.settings);
  };

  this.set = function (setting, val) {
    this.settings[setting] = val;
  };

  this.get = function (setting) {
    return this.settings[setting];
  };

  this.use = function(middleware){
    this.middleware.push(middleware);
  };

  this.job = function(interval, handler){

    var job = new Job(this, interval, handler);

    this.jobs.push(job.start());

  };

  this.route = function(route, options, handler){
    if ('function' != typeof handler) throw new Error('handler function required');

    var routeEndpoint = new Route(this, route, xtend(self.settings, options), handler);

    this.routes.push(routeEndpoint);

    return routeEndpoint.init();
  };

};

util.inherits(Container, events.EventEmitter);

module.exports = Container;