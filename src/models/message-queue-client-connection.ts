import { PublishCommand } from '../commands/publish';

export class MessageQueueClientConnection {
  constructor(public socket: any, public subscribedChannels: string[]) {}

  public isSubscribed(channel: string): boolean {
    return this.subscribedChannels.indexOf(channel) > -1;
  }

  public send(publishCommand: PublishCommand): void {
    this.socket.send(JSON.stringify(publishCommand));
  }

  public subscribe(channel: string): void {
    if (!this.isSubscribed(channel)) {
      this.subscribedChannels.push(channel);
    }
  }
}
