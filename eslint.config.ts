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
      'public/assets/**',
      'api/_start/**',
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
      'no-alert': 'off',
      'react/prop-types': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
    },
  },
  {
    files: ['src/features/**/use-*-page-model.tsx'],
    rules: {
      'max-lines': [
        'warn',
        {
          max: 220,
          skipBlankLines: true,
          skipComments: true,
        },
      ],
      'max-lines-per-function': [
        'warn',
        {
          max: 170,
          skipBlankLines: true,
          skipComments: true,
          IIFEs: true,
        },
      ],
      complexity: ['warn', { max: 15 }],
      'no-restricted-imports': [
        'warn',
        {
          patterns: [
            {
              group: ['#/components/**'],
              message:
                'Не импортируйте UI-компоненты напрямую в page-model; вынесите UI в card/route слой.',
            },
          ],
          paths: [
            {
              name: 'sonner',
              importNames: ['toast'],
              message:
                'Избегайте прямых toast-вызовов в page-model; используйте слой presentation/effects.',
            },
          ],
        },
      ],
      'no-restricted-syntax': [
        'warn',
        {
          selector: "CallExpression[callee.object.name='window'][callee.property.name='confirm']",
          message:
            'window.confirm в page-model смешивает бизнес-логику и UI. Перенесите подтверждение в слой view.',
        },
        {
          selector: "CallExpression[callee.name='confirm']",
          message:
            'confirm в page-model смешивает бизнес-логику и UI. Перенесите подтверждение в слой view.',
        },
        {
          selector: "CallExpression[callee.object.name='toast']",
          message:
            'toast в page-model указывает на смешение доменной логики и UI-эффектов. Вынесите в presentation слой.',
        },
        {
          selector: 'JSXElement',
          message:
            'JSX в page-model является антипаттерном. Верните JSX в UI-компонент/route, оставьте модель без представления.',
        },
      ],
    },
  },
)