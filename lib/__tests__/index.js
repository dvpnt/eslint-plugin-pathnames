const path = require('path');
const t = require('tap');
const {RuleTester} = require('eslint');
const {rules} = require('..');

const ruleTester = new RuleTester();

function makeCase(filename, options, errors) {
  return {
    code: '2 * 2;',
    filename: path.join(process.cwd(), filename),
    options: [options],
    ...errors && {
      errors: errors.map(message => ({message, column: 1, line: 1})),
    },
  };
}

function testRuleForCase(valid, ...caseParams) {
  ruleTester.run(
    'match',
    rules.match,
    {
      // RuleTester must be run with both valid and invalid cases,
      // testing an individual case requires following workaround
      valid: [makeCase('valid.js', {fileNames: '.'})],
      invalid: [makeCase(
        'invalid.js',
        {fileNames: '^$'},
        ['Filename does not match the given pattern'],
      )],
      [valid ? 'valid' : 'invalid']: [makeCase(...caseParams)],
    },
  );
}

/* eslint-disable no-shadow */
t.test('pathnames/match', async t => {
  await t.test('configuration', async t => {
    await t.test('no config object', t => {
      t.throws(
        () => testRuleForCase(true, 'file.js'),
        /should be object/,
      );
      t.end();
    });

    await t.test('no fileNames', t => {
      t.throws(
        () => testRuleForCase(true, 'file.js', {}),
        /should have required property 'fileNames'/,
      );
      t.end();
    });

    await t.test('invalid regex', t => {
      t.throws(
        () => testRuleForCase(
          true,
          'file.js',
          {fileNames: '^', folderNames: ']['},
        ),
        /should match format "regex"/,
      );
      t.end();
    });
  });

  function createTest(...caseParams) {
    return t => {
      testRuleForCase(...caseParams);
      t.end();
    };
  }

  await t.test('valid cases', async t => {
    await t.test(
      '<text>',
      createTest(true, '<text>', {fileNames: '^$'}),
    );

    await t.test(
      '<input>',
      createTest(true, '<input>', {fileNames: '^$'}),
    );

    await t.test(
      'ignored path by folder',
      createTest(
        true,
        'foo/bar/baz/quux.js',
        {fileNames: '^$', ignorePaths: 'bar'},
      ),
    );

    await t.test(
      'ignored path by file',
      createTest(
        true,
        'foo/bar/baz/quux.js',
        {fileNames: '^[^ax]*$', folderNames: '^[^z]+$', ignorePaths: 'quux'},
      ),
    );

    await t.test(
      'valid path',
      createTest(
        true,
        'foo/bar/baz/quux.js',
        {fileNames: '^quux$', folderNames: '^[abforz]+$'},
      ),
    );

    await t.test(
      'valid path without folderNames in config',
      createTest(
        true,
        'foo/bar/baz/quux.js',
        {fileNames: '^[a-z]+$'},
      ),
    );
  });

  await t.test('invalid cases', async t => {
    await t.test(
      'invalid filename',
      createTest(
        false,
        'foo/bar/baz/quux.js',
        {fileNames: '^[^u]*$'},
        ['Filename does not match the given pattern'],
      ),
    );

    await t.test(
      'invalid foldernames',
      createTest(
        false,
        'foo/bar/baz/quux.js',
        {fileNames: '^[^a]*$'},
        [
          'Folder name \'bar\' does not match the given pattern',
          'Folder name \'baz\' does not match the given pattern',
        ],
      ),
    );

    await t.test(
      'invalid filename and foldernames',
      createTest(
        false,
        'foo/bar/baz/quux.js',
        {fileNames: '^[^ax]*$'},
        [
          'Filename does not match the given pattern',
          'Folder name \'bar\' does not match the given pattern',
          'Folder name \'baz\' does not match the given pattern',
        ],
      ),
    );

    await t.test(
      'invalid filename and foldername with folderNames specified',
      createTest(
        false,
        'foo/bar/baz/quux.js',
        {fileNames: '^[^ax]*$', folderNames: '^[^z]+$'},
        [
          'Filename does not match the given pattern',
          'Folder name \'baz\' does not match the given pattern',
        ],
      ),
    );

    await t.test(
      'invalid case not matching ignorePaths',
      createTest(
        false,
        'foo/bar/baz/quux.js',
        {fileNames: '^[^ax]*$', folderNames: '^[^z]+$', ignorePaths: 'quuux'},
        [
          'Filename does not match the given pattern',
          'Folder name \'baz\' does not match the given pattern',
        ],
      ),
    );

    t.end();
  });
});
/* eslint-enable no-shadow */
