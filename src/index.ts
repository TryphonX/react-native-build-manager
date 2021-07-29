import { buildApk, getAppJSonVersion, getBuildGradleVersion, getConfig, getNewVersion, getNewVersionCode, updateVersions } from './modules/helper.js';
import chalk from 'chalk';
import { info, warn } from './modules/consolePlus.js';

const { cyan, bold, gray } = chalk;

export const runAsync = async(): Promise<void> => {
	console.log(cyan('============================'));
	console.log(bold.underline('React Native Android Builder'));
	console.log(cyan.italic.underline('By TryphonX'));
	console.log(cyan('============================'), '\n');

	const config = getConfig();

	const appJsonVer = config.expo ? getAppJSonVersion() : '';
	const { gradleVersion: currentVerName, versionCode: currentVerCode } = getBuildGradleVersion();

	const matchingVersions = config.expo ? appJsonVer === currentVerName : true;

	if (!matchingVersions) {
		warn('Mismatched versions. Using the version in build.gradle...');
	}

	console.log(gray(`Current version name: ${currentVerName}`));
	console.log(gray(`Current version code: ${currentVerCode}`), '\n');

	const newVersionName = await getNewVersion(currentVerName);
	const newVersionCode = getNewVersionCode(currentVerCode);

	info(`Version Name: ${newVersionName}`);
	info(`Version Code: ${newVersionCode}`);

	// Time to change the versions in the files
	updateVersions(newVersionName, newVersionCode, config.expo);

	// time to actually build the new version
	buildApk();
};