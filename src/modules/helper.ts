import chalk from 'chalk';
import { exec } from 'child_process';
import { BuildTask, giveChoice, logReply, makeYesNoQuestion, START_PHRASES } from './common.js';
import { error, warn } from './consolePlus.js';
import os from 'os';

const { greenBright, red } = chalk;

/**
 * The options for the new version name question.
 */
enum versionIncrement {
	Major = 'Major',
	Minor = 'Minor',
	Patch = 'Patch',
	None = 'None',
}

enum osType {
	Windows = 'Windows_NT',
	Linux = 'Linux',
	MacOS = 'Darwin',
}

const currentOS = os.type();

const getIsLinux = () => currentOS === osType.Linux;

/**
 * Gets the random phrase
 * @returns a random phrase with a random emoji.
 */
export const getRandomPhrase = (): string => `🤯 ${START_PHRASES[Math.floor(Math.random()*START_PHRASES.length)]} \n`;

/**
 * Checks for uncommited changes.
 * @param callback The function to be called after checking for commit changes
 */
export const checkForUncommited = (callback: () => Promise<void>): void => {
	try {
		exec('git diff-index --quiet HEAD --').on('exit', (code) => {
			if (code === 1) warn('Your repository is not clean! It is recommended you commit all uncommited changes before proceeding.');

			callback();
		});
		
	} catch (err) {
		warn(`Failed to get git difference: ${err.message}`);
		warn('It is recommended you commit all uncommited changes before proceeding.');
		
		callback();
	}
};

/**
 * Asks the user questions about what the new version should be and determines the new versionName.
 * @param version The current version name.
 * @returns The new version name.
 */
export const getNewVersionName = async(version: string): Promise<string> => {

	// splitting the version by '.', we retrieve a tuple with the three numbers of the version name.
	const [majorStr, minorStr, patchStr] = version.split('.');
	// getting a new tuple by shifting the previous string tuple to numbers
	let [major, minor, patch] = [~~majorStr, ~~minorStr, ~~patchStr];

	const choice = await giveChoice('The new APK version should increment:', versionIncrement);

	switch (choice) {
	case versionIncrement.Major:
		major++;
		minor = patch = 0;
		break;

	case versionIncrement.Minor:
		minor++;
		patch = 0;
		break;
		
	case versionIncrement.Patch:
		patch++;
		break;
	
	// none
	default:
		break;
	}

	logReply(choice);

	return `${major}.${minor}.${patch}`;
};

export const getNewVersionCode = (_versionCode: string): string => {
	const inc = makeYesNoQuestion('Increment versionCode?');

	if (inc) {
		return (~~_versionCode + 1).toString();
	}
	else {
		return _versionCode;
	}
};

export const askToConfirm = (): boolean => makeYesNoQuestion('Confirm?');

export const getBuildTask = async(): Promise<BuildTask> => await giveChoice('Build:', BuildTask) as BuildTask;

export const buildApk = (task: BuildTask): void => {

	const bundleCmd = 'react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle';

	let buildCmd: string;

	switch (task) {
	case BuildTask.Debug:
		buildCmd = `${getIsLinux() ? './' : ''}gradlew assembleDebug`;
		break;
	
	case BuildTask.ReleaseApk:
		buildCmd = `${getIsLinux() ? './' : ''}gradlew assembleRelease`;
		break;

	case BuildTask.ReleaseBundle:
		buildCmd = `${getIsLinux() ? './' : ''}gradlew bundleRelease`;
		break;

	case BuildTask.ReleaseFull:
		buildCmd = `${getIsLinux() ? './' : ''}gradlew assembleRelease && ${getIsLinux() ? './' : ''}gradlew bundleRelease`;
		break;

	default:
		warn('Unexpected error @ helper');
		break;
	}

	const buildProcess = exec(`${bundleCmd} && cd ./android/ && ${buildCmd}`);

	let success = false;

	buildProcess.stdout.on('data', (data) => {
		console.log(data);
		if (data.toString().match(/build successful/i)) {
			success = true;
		}
	});

	buildProcess.stderr.on('data', (data) => {
		console.log(data);
	});

	buildProcess.stderr.on('error', (data) => error(data.message));

	buildProcess.stdout.on('end', () => {
		if (success) {
			console.log(greenBright.bold('Build Successful\n'));
		}
		else {
			console.log(red.bold('Build Failed\n'));
		}
	});
};