import eslint from '@eslint/js'
import { defineConfig } from 'eslint/config'
import globals from 'globals'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import reactPlugin from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import tseslint from 'typescript-eslint'

export default defineConfig(
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      '.tanstack/**',
      'src/routeTree.gen.ts',
    ],
  },
  eslint.configs.recommended,
  tseslint.configs.recommended,
  reactPlugin.configs.flat.recommended,
  reactPlugin.configs.flat['jsx-runtime'],
  reactHooks.configs.flat['recommended-latest'],
  {
    files: ['**/*.{jsx,mjsx,tsx,mtsx}'],
    ...jsxA11y.flatConfigs.strict,
    languageOptions: {
      ...jsxA11y.flatConfigs.strict.languageOptions,
      globals: {
        ...globals.browser,
        ...globals.serviceworker,
      },
    },
  },
  {
    files: ['**/*.{js,mjs,cjs,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      'react/no-deprecated': 'error',
      'react/jsx-no-constructed-context-values': 'error',
      'react/jsx-no-leaked-render': ['error', { validStrategies: ['ternary', 'coerce'] }],
      'react/no-array-index-key': 'warn',
      'react/no-unstable-nested-components': [
        'warn',
        {
          allowAsProps: true,
          propNamePattern: 'render*',
        },
      ],
      'react/self-closing-comp': 'warn',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react-hooks/incompatible-library': 'warn',
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/set-state-in-render': 'error',
      'react/prop-types': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
    },
  },
)