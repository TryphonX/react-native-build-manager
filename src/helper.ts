/* eslint-disable @typescript-eslint/no-var-requires */
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { cwd } from 'process';
import { Config } from './types';
import prompt from 'prompt-sync';
import chalk from 'chalk';
import { error, warn } from './consolePlus.js';
import consoleChoice from 'cli-select';

const CONFIG_PATH = './config.json';

const APP_JSON_PATH = `${cwd()}/app.json`;
const BUILD_GRADLE_PATH = `${cwd()}/android/app/build.gradle`;

enum versionIncrement {
	Major = 'Major',
	Minor = 'Minor',
	Patch = 'Patch',
	None = 'None',
}

export const getConfig = (): Config => {
	if (!existsSync(CONFIG_PATH)) {

		warn('No previous configuration found. Creating a new one...');
	
		const usesExpo = makeYesNoQuestion('Do you use expo in your project?');

		const config: Config = {
			expo: usesExpo,
		};
	
		writeFileSync(CONFIG_PATH, JSON.stringify(config, null, '\t'));

		return config;
	}
	else {
		
		return JSON.parse(readFileSync(CONFIG_PATH, { encoding: 'utf8' }));
	}
};

/**
 * Gets the version specified in the app.json file.
 * @returns The version string.
 */
export const getAppJSonVersion = (): string => {

	if (!existsSync(APP_JSON_PATH)) {
		error('No app.json file found in this directory! Aborting...');
		process.exit();
	}
	else {
		const { expo } = JSON.parse(readFileSync(APP_JSON_PATH, { encoding: 'utf8' })) as { expo: { version: string } };

		return expo.version;
	}
};

export const updateVersions = (newVerName: string, newVerCode: string, expo: boolean): void => {

	// app.json
	if (expo) {
		const appJsonObj = JSON.parse(readFileSync(APP_JSON_PATH, { encoding: 'utf8' })) as { expo: { version: string } };
	
		appJsonObj.expo.version = newVerName;

		writeFileSync(APP_JSON_PATH, JSON.stringify(appJsonObj, null, '\t'));
	}

	// build.gradle
	const fileText = readFileSync(BUILD_GRADLE_PATH)
		.toString()
		.replace(/versionName "\d\.\d\.\d"/, `versionName "${newVerName}"`)
		.replace(/versionCode \d+/, `versionCode ${newVerCode}`);

	writeFileSync(BUILD_GRADLE_PATH, fileText);
};

export const getBuildGradleVersion = (): { gradleVersion: string, versionCode: string } => {

	

	if (!existsSync(BUILD_GRADLE_PATH)) {
		error('No build.gradle file found! Aborting...');
		process.exit();
	}
	else {
		const fileText = readFileSync(BUILD_GRADLE_PATH).toString();
		
		const versionName = fileText.match(/versionName "(\d\.\d\.\d)"/)[1];
		const versionCode = fileText.match(/versionCode (\d+)/)[1];

		return {
			gradleVersion: versionName,
			versionCode: versionCode,
		};
	}
};

const makeYesNoQuestion = (question: string): boolean => {

	// eslint-disable-next-line no-constant-condition
	const answer = ask(`${question} (y/n)`);

	if (answer.match(/^y$/i) || '') {
		return true;
	}
	else if (answer.match(/^n$/i)) {
		return false;
	}
	else {
		return makeYesNoQuestion(question);
	}
};

export const getNewVersion = async(version: string): Promise<string> => {

	const [majorStr, minorStr, patchStr] = version.split('.');

	let [major, minor, patch] = [~~majorStr, ~~minorStr, ~~patchStr];

	console.log(`${chalk.green(' > ')}  The new APK version should increment:`);

	const { value } = await  consoleChoice({
		values: [versionIncrement.Major, versionIncrement.Minor, versionIncrement.Patch, versionIncrement.None],
		valueRenderer: (value, selected) => {
			if (selected) {
				return chalk.underline(value);
			}
	
			return value;
		},
	});

	switch (value) {
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

const ask = (question: string) => prompt()(`${chalk.green(' > ')}  ${question} `);