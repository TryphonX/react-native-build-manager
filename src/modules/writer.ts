import { readFileSync, writeFileSync } from 'fs';
import { APP_JSON_PATH, BUILD_GRADLE_PATH, PACKAGE_JSON_PATH } from './common.js';

/**
 * Finds the build.gradle file and the app.json (if expo) and updates the `version`, `versionName` and `versionCode` accordingly.
 * @param newVerName The new version name.
 * @param newVerCode The new version code.
 * @param expo Whether the user uses expo.
 */
export const updateVersions = (newVerName: string, newVerCode: string, expo: boolean): void => {

	// app.json
	if (expo) {
		const appJsonObj = JSON.parse(readFileSync(APP_JSON_PATH, { encoding: 'utf8' }));
	
		appJsonObj.expo.version = newVerName;

		writeFileSync(APP_JSON_PATH, JSON.stringify(appJsonObj, null, '\t'));
	}

	// build.gradle
	const fileText = readFileSync(BUILD_GRADLE_PATH)
		.toString()
		.replace(/versionName "\d\.\d\.\d"/, `versionName "${newVerName}"`)
		.replace(/versionCode \d+/, `versionCode ${newVerCode}`);

	writeFileSync(BUILD_GRADLE_PATH, fileText);

	// package.json
	const packageJson = JSON.parse(readFileSync(PACKAGE_JSON_PATH, { encoding: 'utf8' }));

	packageJson.version = newVerName;

	writeFileSync(APP_JSON_PATH, JSON.stringify(packageJson, null, '\t'));
};