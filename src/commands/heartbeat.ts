import { Command } from './command';

export class HeartbeatCommand extends Command {
  constructor() {
    super(null, 'heartbeat');
  }
}
