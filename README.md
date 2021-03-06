# WSMQ

![Travis CI](https://api.travis-ci.org/barend-erasmus/wsmq.svg?branch=master)

Web Socket Message Queue (WSMQ) allows you to send and recieve messages to and from your clients on your website.

## Getting Started

### Installing

`npm install -g wsmq`

### Usage

`wsmq start --nodes ws://127.0.0.1:8081;ws://127.0.0.1:8082  --port 8080`

```
Usage: start [options]

  Options:

    -n --nodes <nodes>  Nodes
    -p --port <port>    Port
    -h, --help          output usage information
```

### Uninstalling

`npm uninstall -g wsmq`

## Examples

### Servers

* [Node.js (Typescript)](https://github.com/barend-erasmus/wsmq/blob/master/docs/examples/servers/node-js-typescript.md)
* [Node.js (Javascript)](https://github.com/barend-erasmus/wsmq/blob/master/docs/examples/servers/node-js-javascript.md)
* [Linux (Systemd)](https://github.com/barend-erasmus/wsmq/blob/master/docs/examples/servers/linux-systemd.md)

### Clients

* [Node.js (Typescript)](https://github.com/barend-erasmus/wsmq/blob/master/docs/examples/clients/node-js-typescript.md)
* [Node.js (Javascript)](https://github.com/barend-erasmus/wsmq/blob/master/docs/examples/clients/node-js-javascript.md)
* [CSharp (WebSockets)](https://github.com/barend-erasmus/wsmq/blob/master/docs/examples/clients/csharp-websockets.md)
* [CSharp (REST)](https://github.com/barend-erasmus/wsmq/blob/master/docs/examples/clients/csharp-rest.md)
* [cURL](https://github.com/barend-erasmus/wsmq/blob/master/docs/examples/clients/curl.md)
