module.exports = {
	'env': {
		'browser': true,
		'commonjs': true,
		'es2022': true
	},
	'parser': 'vue-eslint-parser',
	'extends': [
		'eslint:recommended',
		'plugin:vue/vue3-essential',
		'plugin:@typescript-eslint/recommended'
	],
	'parserOptions': {
		'ecmaVersion': 'latest',
		'parser': '@typescript-eslint/parser',
		'sourceType': 'module', 
	},
	'plugins': [
		'vue',
		'@typescript-eslint'
	],
	'rules': {
		'indent': [
			'error',
			'tab'
		],
		'linebreak-style': [
			'error',
			'windows'
		],
		'quotes': [
			'error',
			'single'
		],
		'semi': [
			'error',
			'never'
		],
		'vue/multi-word-component-names':'off',
		'@typescript-eslint/no-explicit-any': ['off']
	}
}
