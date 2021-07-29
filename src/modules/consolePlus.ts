import chalk from 'chalk';

export const warn = (msg: string): void => {
	console.warn(`${chalk.bgYellow.bold(' WARN ')}  ${chalk.yellow(msg)}`);
};

export const error = (msg: string): void => {
	console.error(`${chalk.bgRed.bold(' ERROR ')}  ${chalk.red(msg)}`);
};

export const info = (msg: string): void => {
	console.info(`${chalk.bgCyan.bold(' i ')}  ${chalk.cyan(msg)}`);
};