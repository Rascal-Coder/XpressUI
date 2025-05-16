import { colors, consola } from '@xpress/node-utils';

import { cac } from 'cac';

import { defineCheckCircularCommand } from './check-circular';
import { defineDepcheckCommand } from './check-dep';
import { defineCodeWorkspaceCommand } from './code-workspace';

try {
  const cli = cac('xpress');


  // xpress code-workspace
  defineCodeWorkspaceCommand(cli);

  // xpress check-circular
  defineCheckCircularCommand(cli);

  // xpress check-dep
  defineDepcheckCommand(cli);


  // Invalid command
  cli.on('command:*', () => {
    consola.error(colors.red('Invalid command!'));
    process.exit(1);
  });

  cli.usage('xpress');
  cli.help();
  cli.parse();
} catch (error) {
  consola.error(error);
  process.exit(1);
}
