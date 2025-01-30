#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { transferRepository } from './transfer.js';
import { validateInputs } from './validation.js';
import { TransferOptions } from './types.js';

const program = new Command();

program
  .name('gh-to-hf')
  .description('Transfer a GitHub repository to Hugging Face Hub')
  .version('1.0.0')
  .requiredOption('-g, --github <url>', 'GitHub repository URL')
  .requiredOption('-t, --token <token>', 'Hugging Face API token')
  .requiredOption('-r, --repo <name>', 'Target repository name on Hugging Face')
  .option('-d, --description <text>', 'Repository description')
  .action(async (options) => {
    const spinner = ora();
    
    try {
      const transferOptions: TransferOptions = {
        githubUrl: options.github,
        hfToken: options.token,
        repoName: options.repo,
        description: options.description
      };

      spinner.start('Validating inputs...');
      await validateInputs(transferOptions);
      spinner.succeed('Inputs validated');

      await transferRepository(transferOptions, (message) => {
        spinner.text = message;
      });

      spinner.succeed(chalk.green('Repository transfer completed successfully!'));
    } catch (error) {
      spinner.fail(chalk.red(error instanceof Error ? error.message : 'Transfer failed'));
      process.exit(1);
    }
  });

program.parse();