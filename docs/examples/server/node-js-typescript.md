# WSMQ Server (Node.js)

```typescript
import { MessageQueueServer } from 'wsmq';

const port: number = 8080;

// Used for horizontal scaling
const nodes: string = ['ws://127.0.0.1:8081', 'ws://127.0.0.1:8082'];

const messageQueueServer: MessageQueueServer = new MessageQueueServer(
    port,
    nodes,
);

messageQueueServer.listen();
```