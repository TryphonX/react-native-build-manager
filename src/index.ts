import { buildApk, getNewVersionName, getNewVersionCode, getBuildTask } from './modules/helper.js';
import chalk from 'chalk';
import { info, warn } from './modules/consolePlus.js';
import { getAppJSonVersion, getBuildGradleVersion, getConfig } from './modules/reader.js';
import { updateVersions } from './modules/writer.js';
import { logReply } from './modules/common.js';

const { cyan, bold, yellow } = chalk;

export const runAsync = async(): Promise<void> => {
	console.log(cyan('=========================='));
	console.log(bold.underline('React Native Build Manager'));
	console.log(cyan.italic.underline('By TryphonX'));
	console.log(cyan('=========================='), '\n');

	const config = getConfig();

	const appJsonVer = config.expo ? getAppJSonVersion() : '';
	const { versionName: currentVerName, versionCode: currentVerCode } = getBuildGradleVersion();

	const matchingVersions = config.expo ? appJsonVer === currentVerName : true;

	if (!matchingVersions) {
		warn('Mismatched versions. Using the version in build.gradle...');
	}

	const newVersionName = await getNewVersionName(currentVerName);
	const newVersionCode = getNewVersionCode(currentVerCode);

	info(`Version Name: ${yellow(currentVerName)} => ${cyan(newVersionName)}`);
	info(`Version Code: ${yellow(currentVerCode)} => ${cyan(newVersionCode)}\n`);

	// Time to change the versions in the files
	updateVersions(newVersionName, newVersionCode, config.expo);

	const task = await getBuildTask();

	logReply(task);

	console.log();

	// time to actually build the new version
	buildApk(task);
};