# eslint-plugin-pathnames

[![Build Status](https://travis-ci.org/dvpnt/eslint-plugin-pathnames.svg?branch=master)](https://travis-ci.org/dvpnt/eslint-plugin-pathnames)
[![Coverage Status](https://coveralls.io/repos/github/dvpnt/eslint-plugin-pathnames/badge.svg?branch=master)](https://coveralls.io/github/dvpnt/eslint-plugin-pathnames?branch=master)
[![NPM Version](https://img.shields.io/npm/v/eslint-plugin-pathnames.svg)](https://www.npmjs.com/package/eslint-plugin-pathnames)

Matches names of files and folders against a regular expression

## Installation

```
$ npm install eslint-plugin-pathnames --save-dev
```


## Usage

Add `pathnames` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
	"plugins": [
		"pathnames"
	]
}
```


Then configure the rules you want to use under the rules section.

```json
{
	"rules": {
		"pathnames/match": [
			"error",
			{
				"fileNames": "^[0-9A-Za-z]+$",
				"folderNames": "^[-_.0-9A-Za-z]+$",
				"ignorePaths": "^(scripts|static)"
			}
		]
	}
}
```

where:
- `fileNames` is a regular expression that file names should match against (required);
- `folderNames` is a regular expression that folder names should match against (optional, defaults to `fileNames` value);
- `ignorePaths` is a regular expression that should match against relative paths of files that should be ignored (optional).
