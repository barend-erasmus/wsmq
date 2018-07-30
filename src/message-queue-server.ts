import * as WS from 'ws';
import { CommandBuilder } from './builders/command-builder';
import { Command } from './commands/command';
import { PublishCommand } from './commands/publish';
import { SubscribeCommand } from './commands/subscribe';
import { MessageQueueClientConnection } from './models/message-queue-client-connection';

export class MessageQueueServer {
  protected commandBuilder: CommandBuilder = null;

  protected messageQueueClientConnections: Array<MessageQueueClientConnection> = null;

  protected server: WS.Server = null;

  constructor(protected port: number) {}

  public async listen(): Promise<void> {
    this.commandBuilder = new CommandBuilder();

    this.messageQueueClientConnections = [];

    this.server = new WS.Server({ port: this.port });

    this.server.on('connection', (socket: WebSocket) => this.onConnection(socket));
  }

  protected onConnection(socket: WS.WebSocket): void {
    const messageQueueClientConnection: MessageQueueClientConnection = new MessageQueueClientConnection(socket, []);

    this.messageQueueClientConnections.push(messageQueueClientConnection);

    messageQueueClientConnection.socket.on('message', (message: string) =>
      this.onMessage(message, messageQueueClientConnection),
    );

    messageQueueClientConnection.socket.on('close', () => this.onClose(messageQueueClientConnection));
  }

  protected onMessage(message: string, messageQueueClientConnection: MessageQueueClientConnection): void {
    const command: Command = this.commandBuilder.build(JSON.parse(message));

    if (command instanceof PublishCommand) {
      const publishCommand: PublishCommand = command as PublishCommand;

      for (const c of this.messageQueueClientConnections) {
        if (c.isSubscribed(publishCommand.channel)) {
          c.send(publishCommand);
        }
      }
    }

    if (command instanceof SubscribeCommand) {
      const subscribeCommand: SubscribeCommand = command as SubscribeCommand;

      messageQueueClientConnection.subscribe(subscribeCommand.channel);
    }
  }

  protected onClose(messageQueueClientConnection: MessageQueueClientConnection): void {
    this.removeMessageQueueClientConnection(messageQueueClientConnection);
  }

  protected removeMessageQueueClientConnection(messageQueueClientConnection: MessageQueueClientConnection): void {
    const index: number = this.messageQueueClientConnections.indexOf(messageQueueClientConnection);

    if (index > -1) {
      this.messageQueueClientConnections.splice(index, 1);
    }
  }
}
