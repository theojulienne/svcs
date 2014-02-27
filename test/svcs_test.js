'use strict';

var log = require('debug')('test:container');
var svcs = require('../index');
var expect = require('chai').expect;

describe('svcs', function () {

  it('svcs should load default components exposed', function () {

    var container = svcs();

    // check the logger.
    expect(svcs.logger).exists;

  });

});
