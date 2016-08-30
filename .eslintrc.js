module.exports = {
	'extends': 'eslint:recommended',
	'env': {
		'browser': true,
		'node': true
	},
	'parserOptions': {
		'ecmaVersion': 6,
		'sourceType': 'module',
		'ecmaFeatures': {
			'jsx': true
		}
	},
	'plugins': [
		'react'
	],
	'rules': {
		'comma-dangle': ['error', 'never'],
		'indent': ['error', 'tab'],
		'linebreak-style': ['error', 'unix'],
		'quotes': ['error', 'single'],
		'semi': ['error', 'always'],
		'no-cond-assign': ['error', 'always'],
		'no-console': 'off',
		'react/jsx-uses-vars': 1
	}
};