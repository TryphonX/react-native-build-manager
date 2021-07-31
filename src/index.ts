import { buildApk, getNewVersionName, getNewVersionCode, getBuildTask, askToConfirm, checkForUncommited } from './modules/helper.js';
import chalk from 'chalk';
import { info, warn } from './modules/consolePlus.js';
import { getAppJSonVersion, getBuildGradleVersion, getConfig, getPackageVersion } from './modules/reader.js';
import { updateVersions } from './modules/writer.js';
import { logReply } from './modules/common.js';

const { cyan, bold, yellow } = chalk;

export const initAsync = async(): Promise<void> => {
	console.log(cyan('=========================='));
	console.log(bold.underline('React Native Build Manager'));
	console.log(cyan.italic.underline('By TryphonX'));
	console.log(cyan('=========================='), '\n');

	checkForUncommited();
};

export const startAsync = async(hasUncommited: boolean): Promise<void> => {
	if (hasUncommited) {
		warn('You have uncommited changes in your repository. It is recommended you commit them before building.');
	}

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