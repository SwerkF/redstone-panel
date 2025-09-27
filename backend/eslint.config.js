import tsParser from '@typescript-eslint/parser'
import eslintConfigPrettier from 'eslint-config-prettier'

import { configApp } from '@adonisjs/eslint-config'

export default [
    {
        ignores: ['prisma/generated/**'],
    },
    ...configApp({
        files: ['backend/**/*.{ts,tsx}'],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                tsconfigRootDir: new URL('./backend', import.meta.url),
                project: ['./tsconfig.json'],
            },
        },
        rules: {},
    }),
    eslintConfigPrettier,
]
