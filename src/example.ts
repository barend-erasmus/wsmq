import { MessageQueueClient } from './message-queue-client';
import { RPCMessage } from './messages/rpc';
import { RPCMessageQueueClient } from './rpc-message-queue-client';

// (async () => {
//     const messageQueueClient1: MessageQueueClient = new MessageQueueClient('ws://wsmq.openservices.co.za', async (channel: string, data: any, messageQueueClient: MessageQueueClient) => {
//         console.log(data);
//     },
//         [
//             'channel-1',
//         ]);

//     const messageQueueClient2: MessageQueueClient = new MessageQueueClient('ws://wsmq.openservices.co.za', async (channel: string, data: any, messageQueueClient: MessageQueueClient) => {
//         messageQueueClient.send('channel-1', 'PONG from Client 2');
//     },
//         [
//             'channel-2',
//         ]);

//     await messageQueueClient1.connect();
//     await messageQueueClient2.connect();

//     messageQueueClient1.send('channel-2', 'PING from Client 1');
// })();

(async () => {
    const rpcMessageQueueClient1: RPCMessageQueueClient = new RPCMessageQueueClient(
        'channel-1',
        'ws://wsmq.openservices.co.za',
        'client-1',
        async (message: RPCMessage) => {
            return 'PONG from Client 1';
        });

    const rpcMessageQueueClient2: RPCMessageQueueClient = new RPCMessageQueueClient(
        'channel-1',
        'ws://wsmq.openservices.co.za',
        'client-2',
        async (message: RPCMessage) => {
            // await delay(5000);

            return 'PONG from Client 2';
        });

    await rpcMessageQueueClient1.connect();
    await rpcMessageQueueClient2.connect();

    const response: any = await rpcMessageQueueClient1.send('PING from Client 1', 'client-2');

    console.log(response);
})();

function delay(milliseconds: number): Promise<void> {
    return new Promise((resolve: () => void) => setTimeout(resolve, milliseconds));
}
