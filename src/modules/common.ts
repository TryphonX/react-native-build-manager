import chalk from 'chalk';
import prompt from 'prompt-sync';
import cliSelect from 'cli-select';
import { cwd } from 'process';

const { cyan, greenBright, gray, underline } = chalk;

export const APP_JSON_PATH = `${cwd()}/app.json`;
export const BUILD_GRADLE_PATH = `${cwd()}/android/app/build.gradle`;

export const ask = (question: string): string => prompt()(`${greenBright('?')} ${question} `);

export const logReply = (reply: string): void => console.log(cyan(`> ${reply}`));

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

export const giveChoice = async(values: ValuesObject<string>): Promise<string> => {
	const { value } = await cliSelect({
		values: values,
		selected: greenBright('⬤'),
		unselected: '◯',
		valueRenderer: (value, selected) => {
			if (selected) {
				return underline(value);
			}
	
			return value;
		},
	});
	
	return value;
};