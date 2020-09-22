const path = require('path');
const t = require('tap');
const {RuleTester} = require('eslint');
const {rules} = require('..');

const ruleTester = new RuleTester();

t.test('pathnames/match', (t) => {
	function makeCase([filename, options, errors]) {
		return {
			code: '2 * 2;',
			filename: path.join(process.cwd(), filename),
			options: [options],
			...errors && {
				errors: errors.map((message) => ({message, column: 1, line: 1}))
			}
		};
	}

	t.test('configuration', (t) => {
		function createTest(caseOptions, errorRegExp) {
			return (t) => {
				t.throws(
					() => ruleTester.run(
						'match',
						rules.match,
						{
							valid: [makeCase(caseOptions)],
							invalid: [makeCase(caseOptions)]
						}
					),
					errorRegExp
				);

				t.end();
			};
		}

		t.test(
			'no config object',
			createTest(['file.js'], /should be object/)
		);

		t.test(
			'no fileNames',
			createTest(['file.js', {}], /should have required property 'fileNames'/)
		);

		t.test(
			'invalid regex',
			createTest(
				['file.js', {fileNames: '^', folderNames: ']['}],
				/should match format "regex"/
			)
		);

		t.end();
	});

	t.test('rule', (t) => {
		ruleTester.run(
			'match',
			rules.match,
			{
				valid: [
					['<text>', {fileNames: '^$'}],
					['<input>', {fileNames: '^$'}],
					['quux.js', {fileNames: '^qu*x$'}],
					['foo/bar/baz/quux.js', {fileNames: '^$', ignorePaths: 'bar'}],
					[
						'foo/bar/baz/quux.js',
						{fileNames: '^[^ax]*$', folderNames: '^[^z]+$', ignorePaths: 'quux'}
					],
					['foo/bar/baz/quux.js', {fileNames: '^quux$', folderNames: '^[abforz]+$'}],
					['foo/bar/baz/quux.js', {fileNames: '^[a-z]+$'}]
				].map(makeCase),
				invalid: [
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
				].map(makeCase)
			}
		);

		t.end();
	});

	t.end();
});
