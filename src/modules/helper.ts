import chalk from 'chalk';
import { exec } from 'child_process';
import { BuildTask, giveChoice, logReply, makeYesNoQuestion } from './common.js';
import { warn } from './consolePlus.js';

const { greenBright } = chalk;

/**
 * The options for the new version name question.
 */
enum versionIncrement {
	Major = 'Major',
	Minor = 'Minor',
	Patch = 'Patch',
	None = 'None',
}

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

export const getBuildTask = async(): Promise<BuildTask> => await giveChoice('Build:', BuildTask) as BuildTask;

export const buildApk = (task: BuildTask): void => {

	const bundleCmd = 'react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle';

	let buildCmd: string;

	switch (task) {
	case BuildTask.Debug:
		buildCmd = 'cd ./android/ && gradlew assembleDebug';
		break;
	
	case BuildTask.ReleaseApk:
		buildCmd = 'cd ./android/ && gradlew assembleRelease';
		break;

	case BuildTask.ReleaseBundle:
		buildCmd = 'cd ./android/ && gradlew bundleRelease';
		break;

	case BuildTask.ReleaseFull:
		buildCmd = 'cd ./android/ && gradlew assembleRelease && gradlew bundleRelease';
		break;

	default:
		warn('Unexpected error @ helper');
		break;
	}

	const buildProcess = exec(`${bundleCmd} && ${buildCmd}`);

	buildProcess.stdout.on('data', (data) => {
		console.log(data);
	});

	buildProcess.stderr.on('data', (data) => {
		console.log(data);
	});
};