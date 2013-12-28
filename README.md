# svcs

This library aims to simplify building queue based services in nodejs using AMQP.
It simplifies getting started and provides some out of the box monitoring / admin
for these services.

# API

To build a new service we just create the service and pass in our
handler(s).

```javascript
var svcs = require('svcs');
var container = svcs();

container.route('$gw.*.events', {host: localhost, prefetchCount: 5}, function handler(err, msg){
    var gatewayId = msg.params.gatewayId;
}

```

```javascript

var Endpoint = require('svcs').AmqpEndpoint;

var graphService =  new Endpoint({host: localhost, prefetchCount: 5, enableMultiAck: true});

graphService.connect('$gw.*.events', function handler(err, topic, message, params){

  var gatewayId = params[0];
}

```

# TODO

* Patch the AMQP message prototype and add some util methods

Need to build the following middleware.

* Build middleware for logging messages
* Add metrics middleware, the idea is to maintain per route counts to start with
* Encoding\decoding middleware



