'use strict';

var debug = require('debug')('svcs:message');
var Houkou = require('houkou');

exports = module.exports = function Message(container, route) {

  debug('route', route);
  this.logger = container.logger;
  this.stats = container.stats;
  this.params = [];
  this.router = new Houkou(
    route
    .replace(/\$/, "\\$") // escape $ in the route because it is used in MQTT
    .replace(/_/g, "\\_"), // escape _ because it is used a delimiter in routing keys
    configureRouter(route));

  var self = this;

  function configureRouter(route) {

    var params = route.match(/\:([a-zA-Z0-9]+)/g);
    var requirements = {};

    if (Array.isArray(params)) {
      params.forEach(function cleanParams(param) {
        var sparam = param.replace(/\:/, '');
        requirements[sparam] = "[a-zA-Z0-9]+";
      });
    }
    debug('requirements', requirements);
    return requirements;
  }

  this.parseRoutingKey = function(){
    var routingKey = this.fields.routingKey;
    debug('router', this.router.pattern);
    debug('routingKey', routingKey);

    if(routingKey) {
      this.params = this.router.match(routingKey);
      debug('params', this.params);
    }
  };
};
