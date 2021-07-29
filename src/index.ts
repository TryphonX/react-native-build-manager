/* eslint-disable @typescript-eslint/no-var-requires */
import { spawn } from 'child_process';
import { getAppJSonVersion, getBuildGradleVersion, getConfig, getNewVersion, getNewVersionCode, updateVersions } from './helper.js';
import chalk from 'chalk';
import { info, warn } from './consolePlus.js';
import { env } from 'process';

const runAsync = async() => {
	console.log(chalk.cyan('============================'));
	console.log(chalk.bold.underline('React Native Android Builder'));
	console.log(`v${env.npm_package_version}`);
	console.log(chalk.cyan.italic.underline('By TryphonX'));
	console.log(chalk.cyan('============================'));

	const config = getConfig();

	const appJsonVer = config.expo ? getAppJSonVersion() : '';
	const { gradleVersion, versionCode } = getBuildGradleVersion();

	const matchingVersions = config.expo ? appJsonVer === gradleVersion : true;

	if (!matchingVersions) {
		warn('Mismatched versions. Using the version in build.gradle...');
	}

	console.log();
	info(`Current APK version: ${gradleVersion}`);
	const newVersionName = await getNewVersion(gradleVersion);

	const newVersionCode = await getNewVersionCode(versionCode);

	console.log();
	info('New version:');
	info(`name: ${newVersionName}`);
	info(`code: ${newVersionCode}`);

	// Time to change the versions in the files
	updateVersions(newVersionName, newVersionCode, config.expo);
};

runAsync();