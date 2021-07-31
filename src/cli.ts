#! /usr/bin/env node
import { initAsync } from './index.js';
import chalk from 'chalk';

const { red } = chalk;

process.on('uncaughtException', () => {
	
	//error(err.message);

	console.log(`${red.bold('!')} Aborted!\n`);
	process.exit();
});

initAsync();