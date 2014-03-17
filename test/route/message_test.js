'use strict';

var expect = require('chai').expect;
var xtend = require('xtend');
var Message = require('../../lib/route/message');

describe('Message', function(){

  it('should parse an MQTT routing key', function(){

    var mockMsg = {
      fields: {
        routingKey: '$test123.test456'
      }
    };

    var baseMsg = new Message({}, '$:item.:value');

    var msg = xtend(baseMsg, mockMsg);

    msg.parseRoutingKey();

    expect(msg.params.item).is.equal('test123');
    expect(msg.params.value).is.equal('test456');

  });

  it('should parse a normal route', function(){

    var mockMsg = {
      fields: {
        routingKey: 'act_test123_test456'
      }
    };

    var baseMsg = new Message({}, 'act_:item_:value');

    var msg = xtend(baseMsg, mockMsg);

    msg.parseRoutingKey();

    expect(msg.params.item).is.equal('test123');
    expect(msg.params.value).is.equal('test456');

  });

});
