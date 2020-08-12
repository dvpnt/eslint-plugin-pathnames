const _ = require('underscore');
const path = require('path');
const pkgDir = require('pkg-dir').sync;

const meta = {
	schema: {
		type: 'array',
		items: [{
			type: 'object',
			properties: {
				fileNames: {type: 'string', format: 'regex'},
				folderNames: {type: 'string', format: 'regex'},
				ignorePaths: {type: 'string', format: 'regex'}
			},
			required: ['fileNames'],
			additionalProperties: false
		}]
	}
};

const notFileRegex = /<.*>$/;

function create(context) {
	const {fileNames, folderNames, ignorePaths} = context.options[0];
	const fileRegex = new RegExp(fileNames);
	const folderRegex = new RegExp(folderNames || fileNames);
	const ignoreRegex = ignorePaths && new RegExp(ignorePaths);

	return {
		Program: (node) => {
			const absolutePath = path.resolve(context.getFilename());
			const relativePath = path.relative(pkgDir(absolutePath), absolutePath);

			if (notFileRegex.test(absolutePath)) {
				return;
			}

			if (ignoreRegex && ignoreRegex.test(relativePath)) {
				return;
			}

			if (!fileRegex.test(path.parse(absolutePath).name)) {
				context.report(node, 'Filename does not match the given pattern');
			}

			_(path.dirname(relativePath).split(path.sep)).each((folderName) => {
				if (folderName !== '.' && !folderRegex.test(folderName)) {
					context.report(
						node,
						`Folder name '${folderName}' does not match the given pattern`
					);
				}
			});
		}
	};
}

module.exports = {rules: {match: {meta, create}}};
