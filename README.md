# WSMQ

Web Socket Message Queue

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

### Server

* [Node.js (Typescript)]()
* [Node.js (Javascript)]()
* [Linux (Systemd)]()

### Example Client

```typescript
import { MessageQueueClient } from 'wsmq';

const messageQueueClient = new MessageQueueClient(
    'ws://127.0.0.1:8080',
    (channel: string, data: any, messageQueueClient: MessageQueueClient) => {
        // TODO: Handle messages here...
    },
    ['<your-channel-here>'],
);

await messageQueueClient.connect();

messageQueueClient.send('<your-channel-here>', {
    image: 'http://via.placeholder.com/150x150',
    message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    title: 'Hello World',
    url: 'https://example.com',
});

```
