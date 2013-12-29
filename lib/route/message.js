'use strict';

var debug = require('debug')('svcs:message');
var Houkou = require('houkou');

exports = module.exports = function Message(container, route) {

  this.logger = container.logger;
  this.stats = container.stats;
  this.params = [];
  this.router = new Houkou(route.replace(/\$/, "\\$"), configureRouter(route));

  var self = this;

  function configureRouter(route) {

    var params = route.match(/\:([a-zA-Z0-9]+)/g);
    var requirements = {};

    if (Array.isArray(params)) {
      params.forEach(function cleanParams(param) {
        var sparam = param.replace(/\:/, '');
        requirements[sparam] = "[a-zA-Z0-9_-]+";
      });
    }
    debug('requirements', requirements);
    return requirements;
  }

  this.parseRoutingKey = function(){
    var routingKey = this.fields.routingKey;
    debug('router', this.router);
    debug('routingKey', routingKey);

    if(routingKey) {
      this.params = this.router.match(routingKey);
      debug('params', this.params);
    }
  };
};
