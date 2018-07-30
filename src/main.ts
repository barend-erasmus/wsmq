import * as commander from 'commander';
import chalk from 'chalk';
import { MessageQueueServer } from './message-queue-server';

commander
  .command('start')
  .option('-n --nodes <nodes>', 'Nodes')
  .option('-p --port <port>', 'Port')
  .action((command: any) => {
    if (!command.port) {
      console.log(`${chalk.red('Missing Parameter:')} ${chalk.white('Please provide a port')}`);
      return;
    }

    if (isNaN(command.port)) {
      console.log(`${chalk.red('Invalid Parameter:')} ${chalk.white('Please provide a valid port')}`);
      return;
    }

    const messageQueueServer: MessageQueueServer = new MessageQueueServer(
      command.port,
      command.nodes ? command.nodes.split(';') : null,
    );

    messageQueueServer.listen();

    console.log(chalk.green(`Listening on port ${command.port}`));
  });

commander.parse(process.argv);
