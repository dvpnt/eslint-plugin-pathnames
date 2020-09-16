const path = require('path');

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
		}],
		minItems: 1,
		maxItems: 1
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
			const relativePath = path.relative(process.cwd(), absolutePath);
			const directory = path.dirname(relativePath);

			if (notFileRegex.test(absolutePath)) {
				return;
			}

			if (ignoreRegex && ignoreRegex.test(relativePath)) {
				return;
			}

			if (!fileRegex.test(path.parse(absolutePath).name)) {
				context.report(node, 'Filename does not match the given pattern');
			}

			if (directory === '.') {
				return;
			}

			directory.split(path.sep).forEach((folderName) => {
				if (!folderRegex.test(folderName)) {
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
