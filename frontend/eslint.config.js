import js from '@eslint/js'
import tsParser from '@typescript-eslint/parser'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { globalIgnores } from 'eslint/config'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config([
	globalIgnores(['dist']),
	{
		files: ['src/**/*.{ts,tsx}'],
		extends: [
			js.configs.recommended,
			tseslint.configs.recommended,
			reactHooks.configs['recommended-latest'],
			reactRefresh.configs.vite,
		],
		languageOptions: {
			parser: tsParser,
			ecmaVersion: 2020,
			globals: globals.browser,
			parserOptions: {
				tsconfigRootDir: import.meta.dirname,
				project: './tsconfig.app.json',
			},
		},
	},
	{
		files: ['vite.config.ts'],
		extends: [js.configs.recommended, tseslint.configs.recommended],
		languageOptions: {
			parser: tsParser,
			ecmaVersion: 2020,
			globals: globals.node,
			parserOptions: {
				tsconfigRootDir: import.meta.dirname,
				project: './tsconfig.node.json',
			},
		},
	},
	{
		files: ['*.config.js'],
		extends: [js.configs.recommended],
		languageOptions: {
			ecmaVersion: 2020,
			globals: globals.node,
		},
	},
])
