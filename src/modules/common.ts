import chalk from 'chalk';
import prompt from 'prompt-sync';
import cliSelect from 'cli-select';
import { cwd } from 'process';
import { checkForUncommited, getRandomPhrase } from './helper.js';
import { startManageBuildAsync } from '../cli/manage-build.js';

const { cyan, greenBright, gray, underline, yellow, bold } = chalk;

/**
 * Wrapper process.argv.slice(2).
 * @returns The cli args.
 */
export const getArgvNoBin = (): string[] => process.argv.slice(2);

export const initAsync = async(checkGit: boolean, callback = startManageBuildAsync): Promise<void> => {
	console.log(cyan('=========================='));
	console.log(bold('React Native Build Manager'));
	console.log(cyan.italic('By TryphonX'));
	console.log(cyan('==========================', '\n'));

	//console.log('Thank you for using my package!', '\n');

	console.log(getRandomPhrase());

	if (checkGit) checkForUncommited(callback ?? startManageBuildAsync);
};

/**
 * Look, don't blame me for these. I didn't write these (for the most part)
 * Blame the [Random Sentence Generator](https://randomwordgenerator.com/sentence.php).
 */
export const START_PHRASES = [
	'Thank you for using my package!',
	'Building again, huh?',
	// random generator below (mostly)
	'The beauty of the sunset was obscured by the industrial cranes... Let that sink in.',
	'It\'s okay, you tried.',
	'We should play with legos at camp.',
	'As you consider all the possible ways to improve yourself and the world, you notice John Travolta seems fairly unhappy.',
	'I had a Liam Neeson nightmare. I dreamt I kidnapped his daughter and he just wasn’t having it. They made 3 of those movies. At some point, you’d have to wonder if he’s just a bad parent.',
	'If you squeeze the toothpaste in the middle, you should consider yourself insane.',
	'<inspirational quote>',
	'Speed limits are not suggestions',
	'A kangaroo is really just a rabbit on steroids.',
	'This is idea really backfired, didn\'t it?',
];

/**
 * The names of the tasks to be executed.
 */
export enum BuildTask {
	Debug = 'Debug APK',
	ReleaseApk = 'Release APK',
	ReleaseBundle = 'Release AAB',
	ReleaseFull = 'Release APK & AAB',
}

export const APP_JSON_PATH = `${cwd()}/app.json`;
export const BUILD_GRADLE_PATH = `${cwd()}/android/app/build.gradle`;
export const PACKAGE_JSON_PATH = `${cwd()}/package.json`;

/**
 * Prompts the user to answer a question.
 * @param question The question to show to the user.
 * @returns The answer to the question.
 */
export const ask = (question: string): string => prompt()(`${greenBright.bold('?')} ${question} `);

/**
 * Logs the reply of a question.
 * @param reply The reply to log.
 * @returns 
 */
export const logReply = (reply: string): void => console.log(cyan(`> ${reply}`));

/**
 * Prompt the user to answer a yes/no question
 * @param question The question to show to the user.
 * @returns Whether the user answer yes or not.
 */
export const makeYesNoQuestion = (question: string): boolean => {

	const answer = ask(`${question} ${gray('(y/n)')}`);

	if (answer.match(/^y$/i) || !answer) {
		logReply('Yes\n');
		return true;
	}
	else if (answer.match(/^n$/i)) {
		logReply('No\n');
		return false;
	}
	else {
		return makeYesNoQuestion(question);
	}
};

interface ValuesObject<T> { [s: string]: T }

/**
 * Prompts the user to make a choice.
 * @param question The question to show to the user.
 * @param values The choices to show to the user.
 * @returns The user's choice.
 */
export const giveChoice = async(question: string, values: ValuesObject<string>): Promise<string> => {

	console.log(`${greenBright.bold('?')} ${question}`);

	const { value } = await cliSelect({
		values: values,
		selected: greenBright.bold('⬤'),
		unselected: yellow.bold('◯'),
		valueRenderer: (value, selected) => {
			if (selected) underline(value);
	
			return value;
		},
	});
	
	return value;
};