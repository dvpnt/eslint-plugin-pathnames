# eslint-plugin-pathnames

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
                "fileNames": "...",
                "folderNames": "...",
                "ignorePaths": "..."
            }
        ]
    }
}
```

where:
- `fileNames` is a regular expression that file names should match against (required);
- `folderNames` is a regular expression that folder names should match against (optional, defaults to `fileNames` value);
- `ignorePaths` is a regular expression that should match against relative paths of files that should be ignored (optional).



