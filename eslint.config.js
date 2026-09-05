import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import importPlugin from 'eslint-plugin-import'

export default tseslint.config(
  {
    ignores: [
      '**/._*',
      'dist',
      'functions',
      'coverage',
      'playwright-report',
      'test-results',
      'node_modules',
      'public',
      '*.config.ts',
      '*.config.js',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: { ...globals.browser },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      import: importPlugin,
    },
    settings: {
      'import/resolver': {
        typescript: { project: './tsconfig.app.json' },
      },
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'no-console': 'error',
      'no-debugger': 'error',
      'max-lines': ['error', { max: 400, skipBlankLines: true, skipComments: true }],
      'max-lines-per-function': ['error', { max: 60, skipBlankLines: true, skipComments: true }],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', ignoreRestSiblings: true },
      ],
      'import/no-restricted-paths': [
        'error',
        {
          zones: [
            { target: './src/modules/*/domain', from: './src/modules/*/application' },
            { target: './src/modules/*/domain', from: './src/modules/*/infrastructure' },
            { target: './src/modules/*/domain', from: './src/modules/*/presentation' },
            { target: './src/modules/*/application', from: './src/modules/*/infrastructure' },
            { target: './src/modules/*/application', from: './src/modules/*/presentation' },
          ],
        },
      ],
    },
  },
  {
    files: ['**/*.test.{ts,tsx}', 'e2e/**/*.spec.ts'],
    languageOptions: {
      globals: { ...globals.node },
    },
    rules: {
      'max-lines': 'off',
      'max-lines-per-function': 'off',
    },
  },
)
