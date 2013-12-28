'use strict';

var events = require('events');
var util = require('util');
var logger = require('./core/logger');
var stats = require('./core/stats');
var Route = require('./route');

/**
 * Container holds all state around routes.
 *
 * @type {Container}
 */
var Container = function Container() {

  events.EventEmitter.call(this);

  this.init = function () {
    this.routes = [];
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
    this.stats = stats(this, {name: 'svcs'});
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

  this.route = function(route, options, handler){
    if ('function' != typeof handler) throw new Error('handler function required');

    var routeEndpoint = new Route(this, route, options, handler);

    this.routes.push(routeEndpoint);

    return routeEndpoint.init();
  };

};

util.inherits(Container, events.EventEmitter);

module.exports = Container;