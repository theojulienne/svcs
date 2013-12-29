# svcs [![Build Status](https://drone.io/github.com/wolfeidau/svcs/status.png)](https://drone.io/github.com/wolfeidau/svcs/latest)

[![NPM](https://nodei.co/npm/svcs.png)](https://nodei.co/npm/svcs/)
[![NPM](https://nodei.co/npm-dl/svcs.png)](https://nodei.co/npm/svcs/)

This library aims to simplify building queue based services in nodejs using AMQP.
It simplifies getting started and provides some out of the box monitoring / admin
for these services.

# Status

Don't use it in production, early adopters and hackers are welcome, the API is still in a state of flux as we work on
evolving some of the core features.

# API

To build a new service we just create the service and pass in our
handler(s).

```javascript
var svcs = require('svcs');
var container = svcs();

// override the default amqpUrl
container.set('amqpUrl', 'amqp://guest:guest@rabbitmq.example.com:5672');

// add a route which will process messages for the given routing key
// the attribute :gatewayId will be replaced with * when passed to bindQueue
container.route('$gw.:gatewayId.events', {queue: 'gw_events'}, function handler(err, msg){
    var gatewayId = msg.params.gatewayId;
}
```

## Middleware

There are a couple of modules which can be added to the container.

### JSON

This is a simple JSON decoder which will convert the payload of the incoming AMQP messages to JSON when the messages
 `contentType` is set to `application/json`.

```javascript
container.use(svcs.json());
```

### Routing Statistics

This will send per `routingKey` statistics to a statsd server using the `increment` function.

```javascript
container.use(svcs.stats());
```

# TODO

* Need to rework configuration and decide where the defaults should live.
* Need to review jobs as the api is pretty average at the moment.
* More testing..

## License
Copyright (c) 2013 Mark Wolfe released under the MIT license.