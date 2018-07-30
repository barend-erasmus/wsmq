# WSMQ Client (Node.js)

```typescript
import { MessageQueueClient } from 'wsmq';

const messageQueueClient: MessageQueueClient = new MessageQueueClient(
    'ws://127.0.0.1:8080',
    (channel: string, data: any, messageQueueClient: MessageQueueClient) => {
        // TODO: Handle messages here...
    },
    ['<insert-your-channel-here>'],
);

await messageQueueClient.connect();

messageQueueClient.send('<insert-your-channel-here>', '<insert-your-message-here>');
```