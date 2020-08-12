const _ = require('underscore');
const path = require('path');
const pkgDir = require('pkg-dir').sync;
const {RuleTester} = require('eslint');
const {match} = require('../lib').rules;

const ruleTester = new RuleTester();

const code = '2 * 2;';
const rootPath = pkgDir();
const defaultOptions = {
	fileNames: '^$',
	ignorePaths: '^$'
};

function makeContext([filename, options, errors]) {
	return {
		code,
		filename: path.join(rootPath, filename),
		options: [{...defaultOptions, ...options}],
		...errors && {
			errors: _(errors).map((message) => ({message, column: 1, line: 1}))
		}
	};
}

const cases = {
	valid: _([
		['<text>'],
		['<input>'],
		['foo/bar/baz/quux.js', {ignorePaths: 'baz'}],
		['foo/bar/baz/quux.js', {fileNames: '^quux$', folderNames: '^[abforz]+$'}],
		[
			'foo/bar/baz/quux.js',
			{fileNames: '^[^ax]*$', folderNames: '^[^z]+$', ignorePaths: 'quux'}
		]
	]).map(makeContext),
	invalid: _([
		[
			'foo/bar/baz/quux.js',
			{fileNames: '^[^u]*$'},
			['Filename does not match the given pattern']
		],
		[
			'foo/bar/baz/quux.js',
			{fileNames: '^[^a]*$'},
			[
				'Folder name \'bar\' does not match the given pattern',
				'Folder name \'baz\' does not match the given pattern'
			]
		],
		[
			'foo/bar/baz/quux.js',
			{fileNames: '^[^ax]*$'},
			[
				'Filename does not match the given pattern',
				'Folder name \'bar\' does not match the given pattern',
				'Folder name \'baz\' does not match the given pattern'
			]
		],
		[
			'foo/bar/baz/quux.js',
			{fileNames: '^[^ax]*$', folderNames: '^[^z]+$'},
			[
				'Filename does not match the given pattern',
				'Folder name \'baz\' does not match the given pattern'
			]
		],
		[
			'foo/bar/baz/quux.js',
			{fileNames: '^[^ax]*$', folderNames: '^[^z]+$', ignorePaths: 'quuux'},
			[
				'Filename does not match the given pattern',
				'Folder name \'baz\' does not match the given pattern'
			]
		]
	]).map(makeContext)
};

ruleTester.run('match', match, cases);
