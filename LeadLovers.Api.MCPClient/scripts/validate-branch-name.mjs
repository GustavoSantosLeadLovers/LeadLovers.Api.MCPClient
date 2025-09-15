/* eslint-disable no-undef */
import { execSync } from 'node:child_process';

const allowedPrefixes = ['feat/', 'feature', 'fix/', 'hotfix/', 'improv/', 'improvement', 'chore/', 'docs/', 'style/', 'refactor/', 'test/'];

const exemptBranches = ['main', 'master', 'development', 'dev', 'staging'];

try {
	const branchName = execSync('git rev-parse --abbrev-ref HEAD')
		.toString()
		.trim();

	if (exemptBranches.includes(branchName)) {
		console.log(
			`Branch '${branchName}' is an exempt branch. Skipping validation.`,
		);
		process.exit(0);
	}

	const match = allowedPrefixes.some(prefix => branchName.startsWith(prefix));

	if (!match) {
		console.error(
			'\n************************************************************************',
		);
		console.error(
			`ERRO: O nome da branch '${branchName}' não segue o padrão!`,
		);
		console.error(
			'Nomes de branches devem começar com um dos seguintes prefixos:',
		);
		allowedPrefixes.forEach(prefix => console.error(`- ${prefix}`));
		console.error(
			'Exemplos: feature/login-page, fix/button-bug, hotfix/critical-error',
		);
		console.error(
			'************************************************************************\n',
		);
		process.exit(1);
	}

	console.log(`Branch name '${branchName}' is valid.`);
	process.exit(0);
} catch (error) {
	console.error(
		'An error occurred during branch name validation:',
		error.message,
	);
	process.exit(1);
}