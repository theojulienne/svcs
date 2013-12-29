'use strict';

exports = module.exports = function Job(container, interval, handler){

  this.handler = handler;
  this.interval = interval;

  this.start = function start(){
    this.handle = setInterval(this.handler.bind(null, container), this.interval);
    return this;
  };

  this.stop = function stop(){
    clearInterval(this.handle);
  }

};