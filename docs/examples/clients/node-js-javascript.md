# WSMQ Client (Node.js)

```javascript
const { MessageQueueClient } = require('wsmq');

const host = 'ws://127.0.0.1:8080';

const channels = ['<insert-your-channel-here>'];

const messageQueueClient = new MessageQueueClient(
    host,
    (channel, data, messageQueueClient) => {
        // TODO: Handle messages here...
    },
    channels,
);

await messageQueueClient.connect();

messageQueueClient.send('<insert-your-channel-here>', '<insert-your-message-here>');
```