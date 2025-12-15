import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default [
	{
		ignores: ['dist', 'node_modules', 'styled-system'],
	},
	{
		files: ['**/*.{js,jsx}'],
		languageOptions: {
			ecmaVersion: 2020,
			globals: {
				...globals.browser,
				...globals.node,
			},
			parserOptions: {
				ecmaVersion: 'latest',
				ecmaFeatures: { jsx: true },
				sourceType: 'module',
			},
		},
		plugins: {
			'react-hooks': reactHooks,
			'react-refresh': reactRefresh,
		},
		rules: {
			...js.configs.recommended.rules,
			...reactHooks.configs.recommended.rules,
			'react-refresh/only-export-components': [
				'warn',
				{ allowConstantExport: true },
			],
			'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
		},
	},
	{
		// TanStack Router files - disable react-refresh warnings
		files: ['**/routes/**/*.{js,jsx}'],
		rules: {
			'react-refresh/only-export-components': 'off',
		},
	},
];
