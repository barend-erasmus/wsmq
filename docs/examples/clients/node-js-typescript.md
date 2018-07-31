# WSMQ Client (Node.js)

```typescript
import { MessageQueueClient } from 'wsmq';

const host: string = 'ws://127.0.0.1:8080';

const channels: Array<string> = ['<insert-your-channel-here>'];

const messageQueueClient: MessageQueueClient = new MessageQueueClient(
    host,
    (channel: string, data: any, messageQueueClient: MessageQueueClient) => {
        // TODO: Handle messages here...
    },
    channels,
);

await messageQueueClient.connect();

messageQueueClient.send('<insert-your-channel-here>', '<insert-your-message-here>');
```