# WSMQ Server (Node.js)

```javascript
const { MessageQueueServer } = require('wsmq');

const port = 8080;

// Used for horizontal scaling
const nodes = ['ws://127.0.0.1:8081', 'ws://127.0.0.1:8082'];

const messageQueueServer = new MessageQueueServer(
    port,
    nodes,
);

messageQueueServer.listen();
```