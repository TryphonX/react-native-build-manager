import { Config } from './types.js';
import { APP_JSON_PATH, BUILD_GRADLE_PATH, makeYesNoQuestion, PACKAGE_JSON_PATH } from './common.js';
import { error, info } from './consolePlus.js';
import { existsSync, writeFileSync, readFileSync } from 'fs';
import { cwd } from 'process';

const CONFIG_PATH = `${cwd()}/build-manager.json`;

/**
 * Looks for the config file. If there is none, one will be created for the user.
 * @returns The project configuration.
 */
export const getConfig = (): Config => {

	const packageJson = JSON.parse(readFileSync(PACKAGE_JSON_PATH, { encoding: 'utf8' }));

	const packageConfig = packageJson['rn-build-manager'];
	
	// if there is a configuration in package.json
	// get that over separate file
	if (packageConfig) return packageConfig as Config;

	// no package.json configuration 
	if (!existsSync(CONFIG_PATH)) {

		info('No previous configuration found. Creating a new one...');
	
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
 * Gets the version specified in the app.json file (expo).
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

/**
 * Finds the build.gradle file and fetches both the version `versionName` and the `versionCode` from it.
 * @returns The versionName and the versionCode.
 */
export const getBuildGradleVersion = (): { versionName: string, versionCode: string } => {

	if (!existsSync(BUILD_GRADLE_PATH)) {
		error('No build.gradle file found! Aborting...');
		process.exit();
	}
	else {
		const fileText = readFileSync(BUILD_GRADLE_PATH).toString();
		
		// I am not going to explain the regex, it's pretty straightforward
		const versionName = fileText.match(/versionName "(\d\.\d\.\d)"/)[1];
		const versionCode = fileText.match(/versionCode (\d+)/)[1];

		return {
			versionName,
			versionCode,
		};
	}
};

export const getPackageVersion = (): string => {
	if (!existsSync(PACKAGE_JSON_PATH)) {
		error('No package.json file found! Aborting...');
		process.exit();
	}
	else {
		const { version } = JSON.parse(readFileSync(PACKAGE_JSON_PATH, { encoding: 'utf8' })) as { version: string };

		return version;
	}
};