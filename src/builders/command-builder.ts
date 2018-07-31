import { Command } from '../commands/command';
import { PublishCommand } from '../commands/publish';
import { SubscribeCommand } from '../commands/subscribe';
import { HeartbeatCommand } from '../commands/heartbeat';

export class CommandBuilder {
  constructor() {}

  public build(obj: any): Command {
    switch (obj.type) {
      case 'heartbeat':
        return new HeartbeatCommand();
      case 'publish':
        return new PublishCommand(obj.channel, obj.data);
      case 'subscribe':
        return new SubscribeCommand(obj.channel);
      default:
        throw new Error('Unsupported Command');
    }
  }
}
