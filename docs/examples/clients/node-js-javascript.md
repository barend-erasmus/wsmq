# WSMQ Client (Node.js)

```javascript
const { MessageQueueClient } = require('wsmq');

const messageQueueClient = new MessageQueueClient(
    'ws://127.0.0.1:8080',
    (channel, data, messageQueueClient) => {
        // TODO: Handle messages here...
    },
    ['<insert-your-channel-here>'],
);

await messageQueueClient.connect();

messageQueueClient.send('<insert-your-channel-here>', '<insert-your-message-here>');
```