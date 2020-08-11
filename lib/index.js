const path = require('path');
const pkgDir = require('pkg-dir').sync;

const meta = {
	schema: [{
		type: 'object',
		properties: {
			fileNames: {type: 'string'},
			folderNames: {type: 'string'},
			ignorePaths: {type: 'string'}
		},
		required: ['fileNames'],
		additionalProperties: false
	}]
};

const notFileRegexp = /\<.*\>$/;

function create(context) {
	const {fileNames, folderNames, ignorePaths} = context.options[0];
	const fileRegexp = new RegExp(fileNames);
	const folderRegexp = new RegExp(folderNames || fileNames);
	const ignoreRegexp = ignorePaths && new RegExp(ignorePaths);

	return {
		Program: (node) => {
			const absolutePath = path.resolve(context.getFilename());
			const relativePath = path.relative(pkgDir(absolutePath), absolutePath);

			if (notFileRegexp.test(absolutePath)) {
				return;
			}

			if (ignoreRegexp && ignoreRegexp.test(relativePath)) {
				return;
			}

			if (!fileRegexp.test(path.parse(absolutePath).name)) {
				context.report(
					node,
					`Filename ${relativePath} does not match the given pattern`
				);
			}

			for (const folderName of path.dirname(relativePath).split(path.sep)) {
				if (folderName !== '.' && !folderRegexp.test(folderName)) {
					context.report(
						node,
						`Folder name ${folderName} does not match the given pattern`
					);
				}
			}
		}
	};
}

module.exports = {rules: {match: {meta, create}}};
