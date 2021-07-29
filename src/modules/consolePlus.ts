import chalk from 'chalk';

const { yellow, red, blue } = chalk;

export const warn = (msg: string): void => {
	console.warn(`${yellow.bold('warn')} ${msg}`);
};

export const error = (msg: string): void => {
	console.error(`${red.bold('error')} ${msg}`);
};

export const info = (msg: string): void => {
	console.info(`${blue.bold('i')} ${msg}`);
};