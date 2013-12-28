'use strict';

var Container = require('../../lib/container');
var ts = require('../../lib/middleware/topic_stats');

var chaiAsPromised = require("chai-as-promised");

var chai = require('chai');

chai.use(chaiAsPromised);

var expect = chai.expect;

var jsonMsg = {
  content: new Buffer('{"foo": "bar"}'),
  properties: {
    contentType: 'application/json'
  },
  fields: {
    routingKey: '12345'
  },
  stats: {
    increment: function () {}
  }
};

describe('Topic Stats Middleware', function () {

  var topicStats = ts();
  var container = new Container();

  before(function () {
    container.init();
  });

  after(function () {
    container.shutdown();
  });

  it('should be counted', function (done) {
    return expect(topicStats(jsonMsg)).to.eventually.be.fulfilled.and.notify(done);
  });

});
