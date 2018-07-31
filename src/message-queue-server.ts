import * as WS from 'ws';
import { CommandBuilder } from './builders/command-builder';
import { Command } from './commands/command';
import { PublishCommand } from './commands/publish';
import { SubscribeCommand } from './commands/subscribe';
import { MessageQueueClientConnection } from './models/message-queue-client-connection';
import * as http from 'http';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import { MessageQueueClient } from './message-queue-client';
import { DomainEvents } from './domain-events';

export class MessageQueueServer {
  protected commandBuilder: CommandBuilder = null;

  protected expressApplication: express.Application = null;

  protected httpServer: http.Server = null;

  protected messageQueueClientConnections: Array<MessageQueueClientConnection> = [];

  protected webSocketServer: WS.Server = null;

  constructor(protected port: number, protected nodes: Array<string>) {
    this.commandBuilder = new CommandBuilder();

    this.configureExpressApplication();

    this.configureHttpServer();

    this.configureWebSocketServer();

    this.connectToNodes();
  }

  public async listen(): Promise<void> {
    this.httpServer.listen(this.port);
  }

  protected configureExpressApplication(): void {
    this.expressApplication = express();

    this.expressApplication.use(bodyParser.json());

    this.expressApplication.post('/:channel', (request: express.Request, response: express.Response) => {
      this.onMessage(new PublishCommand(request.params.channel, request.body), null);

      response.send('OK');
    });
  }

  protected configureHttpServer(): void {
    this.httpServer = http.createServer(this.expressApplication);
  }

  protected configureWebSocketServer(): void {
    this.webSocketServer = new WS.Server({ server: this.httpServer });

    this.webSocketServer.on('connection', (socket: WebSocket) => this.onConnection(socket));
  }

  protected onConnection(socket: WebSocket): void {
    const messageQueueClientConnection: MessageQueueClientConnection = new MessageQueueClientConnection(socket, []);

    this.messageQueueClientConnections.push(messageQueueClientConnection);

    messageQueueClientConnection.socket.on('message', (message: string) =>
      this.onMessage(JSON.parse(message), messageQueueClientConnection),
    );

    messageQueueClientConnection.socket.on('close', () => this.onClose(messageQueueClientConnection));
  }

  protected onMessage(obj: any, messageQueueClientConnection: MessageQueueClientConnection): void {
    const command: Command = this.commandBuilder.build(obj);

    if (command instanceof PublishCommand) {
      const publishCommand: PublishCommand = command as PublishCommand;

      DomainEvents.onPublishCommandRecieved(null, publishCommand.channel, publishCommand.data);

      for (const c of this.messageQueueClientConnections) {
        if (c.isSubscribed('global-broadcast-channel')) {
          c.send(publishCommand);

          DomainEvents.onPublishCommandSent(null, publishCommand.channel, publishCommand.data);
        } else if (c.isSubscribed(publishCommand.channel)) {
          c.send(publishCommand);

          DomainEvents.onPublishCommandSent(null, publishCommand.channel, publishCommand.data);
        }
      }
    }

    if (command instanceof SubscribeCommand) {
      const subscribeCommand: SubscribeCommand = command as SubscribeCommand;

      // TODO: Implement
      // DomainEvents.onSubscribeCommandRecieved(null, subscribeCommand.channel);

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

  protected connectToNodes(): void {
    if (!this.nodes) {
      return;
    }
  
    for (const node of this.nodes) {
      const messageQueueClient: MessageQueueClient = new MessageQueueClient(node, (channel: string, data: any, messageQueueClient: MessageQueueClient) => {
        for (const c of this.messageQueueClientConnections) {
          if (c.isSubscribed(channel)) {
            const publishCommand: PublishCommand = new PublishCommand(channel, data);

            c.send(publishCommand);

            DomainEvents.onPublishCommandSent(null, publishCommand.channel, publishCommand.data);
          }
        }
      }, ['global-broadcast-channel']);

      messageQueueClient.connect();
    }
  }
}
