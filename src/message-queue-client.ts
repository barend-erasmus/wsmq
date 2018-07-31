import * as WS from 'ws';
import { CommandBuilder } from './builders/command-builder';
import { Command } from './commands/command';
import { PublishCommand } from './commands/publish';
import { SubscribeCommand } from './commands/subscribe';
import { HeartbeatCommand } from './commands/heartbeat';
import { DomainEvents } from './domain-events';

export class MessageQueueClient {
  protected heartbeatInterval: NodeJS.Timer = null;

  protected socket: WebSocket = null;

  constructor(
    protected host: string,
    protected onMessageFn: (channel: string, data: any, messageQueueClient: MessageQueueClient) => void,
    protected subscribedChannels: string[],
  ) {}

  public connect(): Promise<void> {
    return new Promise((resolve: () => void, reject: (err: Error) => void) => {
      this.socket = typeof WebSocket === 'undefined' ? (new WS(this.host) as any) : (new WebSocket(this.host) as any);

      this.socket.onclose = (closeEvent: { code: number }) => this.onClose(closeEvent);

      this.socket.onmessage = (event: { data: any }) => this.onMessage(event);

      this.socket.onopen = (openEvent: {}) => {
        DomainEvents.onConnect(this.host);

        this.onOpen(openEvent, resolve);
      };

      this.socket.onerror = (event: Event) => {
        this.socket.onclose = () => {};
        this.socket.close();

        DomainEvents.onConnectFailure(this.host);

        this.delay(2000).then(() => {
          DomainEvents.onReconnect(this.host);
          this.connect();
        });
      };
    });
  }

  public send(channel: string, data: any): void {
    this.socket.send(JSON.stringify(new PublishCommand(channel, data)));

    DomainEvents.onPublishCommandSent(this.host, channel, data);
  }

  protected delay(milliseconds: number): Promise<void> {
    return new Promise((resolve: () => void, reject: (error: Error) => void) => {
      setTimeout(resolve, milliseconds);
    });
  }

  protected onClose(closeEvent: { code: number }): void {
    if (closeEvent.code === 1000) {
      DomainEvents.onDisconnect(this.host);
      return;
    }

    DomainEvents.onReconnect(this.host);

    this.connect();
  }

  protected onMessage(event: { data: any }): void {
    const commandBuilder: CommandBuilder = new CommandBuilder();

    const command: Command = commandBuilder.build(JSON.parse(event.data));

    if (command instanceof PublishCommand) {
      const publishCommand: PublishCommand = command as PublishCommand;
      
      DomainEvents.onPublishCommandRecieved(this.host, publishCommand.channel, publishCommand.data);

      if (this.onMessageFn) {
        this.onMessageFn(publishCommand.channel, publishCommand.data, this);
      }
    }
  }

  protected onOpen(event: {}, callback: () => void): void {
    if (this.socket.readyState === 1) {
      for (const channel of this.subscribedChannels) {
        const subscribeCommand: SubscribeCommand = new SubscribeCommand(channel);

        this.socket.send(JSON.stringify(subscribeCommand));

        DomainEvents.onSubscribeCommandSent(this.host, subscribeCommand.channel);
      }

      callback();
    }
  }

  // TODO: Not used
  protected startHeartbeatInterval(): void {
    this.heartbeatInterval = setInterval(() => {
      this.socket.send(JSON.stringify(new HeartbeatCommand()));
    }, 2000);
  }
}
