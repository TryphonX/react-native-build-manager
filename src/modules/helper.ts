import chalk from 'chalk';
import { exec } from 'child_process';
import { giveChoice, logReply, makeYesNoQuestion } from './common.js';

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

	console.log(`${greenBright('?')} The new APK version should increment:`);

	const choice = await giveChoice(versionIncrement);

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

export const buildApk = (): void => {
	const build = exec('react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle & cd ./android/ & gradlew assembleRelease');

	build.stdout.on('data', (data) => {
		console.log(data);
	});

	build.stderr.on('data', (data) => {
		console.log(data);
	});
};