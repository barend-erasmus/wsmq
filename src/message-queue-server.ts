import * as WebSocket from 'ws';
import { CommandBuilder } from './builders/command-builder';
import { Command } from './commands/command';
import { PublishCommand } from './commands/publish';
import { SubscribeCommand } from './commands/subscribe';
import { MessageQueueClientConnection } from './models/message-queue-client-connection';

const server: WebSocket.Server = new WebSocket.Server({ port: 8801 });

const messageQueueClientConnections: MessageQueueClientConnection[] = [];

const commandBuilder: CommandBuilder = new CommandBuilder();

server.on('connection', (socket: WebSocket) => {
    const messageQueueClientConnection: MessageQueueClientConnection = new MessageQueueClientConnection(socket, []);

    messageQueueClientConnections.push(messageQueueClientConnection);

    messageQueueClientConnection.socket.on('message', (message: string) => {
        const command: Command = commandBuilder.build(JSON.parse(message));

        if (command instanceof PublishCommand) {
            const publishCommand: PublishCommand = command as PublishCommand;

            for (const c of messageQueueClientConnections) {
                if (c.subscribedChannels.indexOf(publishCommand.channel) > -1) {
                    c.socket.send(JSON.stringify(publishCommand));
                }
            }
        }

        if (command instanceof SubscribeCommand) {
            const subscribeCommand: SubscribeCommand = command as SubscribeCommand;

            messageQueueClientConnection.subscribe(subscribeCommand.channel);
        }

    });

    messageQueueClientConnection.socket.on('close', () => {
        const index: number = messageQueueClientConnections.indexOf(messageQueueClientConnection);

        if (index > -1) {
            messageQueueClientConnections.splice(index, 1);
        }
    });

});

console.log(`listening on port 8801`);
