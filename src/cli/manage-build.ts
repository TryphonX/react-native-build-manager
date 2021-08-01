#! /usr/bin/env node
import chalk from 'chalk';
import { initAsync, logReply } from '../modules/common.js';
import { info, warn } from '../modules/consolePlus.js';
import { askToConfirm, buildApk, getBuildTask, getNewVersionCode, getNewVersionName } from '../modules/helper.js';
import { getAppJSonVersion, getBuildGradleVersion, getConfig, getPackageVersion } from '../modules/reader.js';
import { updateVersions } from '../modules/writer.js';

const { red, cyan, yellow } = chalk;

process.on('uncaughtException', () => {
	
	//error(err.message);

	console.log(`${red.bold('!')} Aborted!\n`);
	process.exit();
});



export const startManageBuildAsync = async(): Promise<void> => {

	const config = getConfig();

	const appJsonVer = config.expo ? getAppJSonVersion() : '';
	const { versionName: currentVerName, versionCode: currentVerCode } = getBuildGradleVersion();
	const packageVersionName = getPackageVersion();

	const matchingVersions = config.expo ? appJsonVer === currentVerName && currentVerName === packageVersionName : currentVerName === packageVersionName;

	if (!matchingVersions) {
		warn('Mismatched versions. Using the version in build.gradle...');
	}

	const newVersionName = await getNewVersionName(currentVerName);
	const newVersionCode = getNewVersionCode(currentVerCode);

	info(`Version Name: ${yellow(currentVerName)} => ${cyan(newVersionName)}`);
	info(`Version Code: ${yellow(currentVerCode)} => ${cyan(newVersionCode)}\n`);

	const task = await getBuildTask();

	logReply(task);

	console.log();

	const confirmed = askToConfirm();

	// time to actually build the new version
	if (confirmed) {
		// Time to change the versions in the files
		updateVersions(newVersionName, newVersionCode, config.expo);
		buildApk(task);
	}
	else {
		console.log('Aborting...\n');
	}
};

initAsync(true);