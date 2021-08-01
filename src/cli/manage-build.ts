#! /usr/bin/env node
import chalk from 'chalk';
import { BuildTask, getArgvNoBin, initAsync, logReply } from '../modules/common.js';
import { info, warn } from '../modules/consolePlus.js';
import { askToConfirm, buildApk, getBuildTask, getNewVersionCode, getNewVersionName } from '../modules/helper.js';
import { getAppJSonVersion, getBuildGradleVersion, getConfig, getPackageVersion } from '../modules/reader.js';
import { updateVersions } from '../modules/writer.js';
import yargs from 'yargs';

enum OutputFlag {
	Debug = 'debug',
	ReleaseApk = 'release-apk',
	ReleaseAab = 'release-aab',
	ReleaseFull = 'release-full',
}

const getOutputChoices = () => Object.values(OutputFlag).filter((val) => val.toLowerCase() === val);

const parser = yargs(getArgvNoBin()).options({
	output: {
		alias: 'o',
		choices: getOutputChoices(),
		desc: 'Choose output type',
	},
	['same-version']: {
		type: 'boolean',
		desc: 'Do not increment the version',
		default: false,
	},
});

const { red, cyan, yellow } = chalk;

process.on('uncaughtException', () => {

	console.log(`${red.bold('!')} Aborted!\n`);
	process.exit();
});

const getTask = async(output?: OutputFlag) => {
	
	if (!output) return await getBuildTask();
	
	switch (output) {
	case OutputFlag.Debug:
		return BuildTask.Debug;
	
	case OutputFlag.ReleaseApk:
		return BuildTask.ReleaseApk;
	
	case OutputFlag.ReleaseAab:
		return BuildTask.ReleaseBundle;
	
	case OutputFlag.ReleaseFull:
		return BuildTask.ReleaseFull;
			
	default:
		console.warn('Unexpected error parsing output. Continuing as debug apk...');
		return BuildTask.Debug;
	}
};

const getVersion = async(verName: string, verCode: string, sameVersion?: boolean) => {
	if (sameVersion) {
		return {
			versionName: verName,
			versionCode: verCode,
		};
	}
	else {
		const newVersionName = await getNewVersionName(verName);
		const newVersionCode = getNewVersionCode(verCode);

		return {
			versionName: newVersionName,
			versionCode: newVersionCode,
		};
	}
};

export const startManageBuildAsync = async(): Promise<void> => {

	const args = await parser.argv;

	console.log(args['same-version']);

	const config = getConfig();

	const appJsonVer = config.expo ? getAppJSonVersion() : '';
	const { versionName: currentVerName, versionCode: currentVerCode } = getBuildGradleVersion();
	const packageVersionName = getPackageVersion();

	const matchingVersions = config.expo ? appJsonVer === currentVerName && currentVerName === packageVersionName : currentVerName === packageVersionName;

	if (!matchingVersions) {
		warn('Mismatched versions. Using the version in build.gradle...');
	}

	const { versionName: newVersionName, versionCode: newVersionCode } = await getVersion(currentVerName, currentVerCode, args['same-version']);

	info(`Version Name: ${yellow(currentVerName)} => ${cyan(newVersionName)}`);
	info(`Version Code: ${yellow(currentVerCode)} => ${cyan(newVersionCode)}\n`);

	const task = await getTask(args?.output);

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