// @ts-check Let TS check this config file

import nshq from '@nshq/eslint-config'

export default nshq(
  {
    markdown: false,
  },
  {
    ignores: ['build/**', '.scaffold/**', 'node_modules/**', 'scripts/', 'addon/*.js', 'addon/content/lib/sso/index.js'],
  },
  {
    rules: {
      'no-restricted-globals': [
        'error',
        { message: 'Use `Zotero.getMainWindow()` instead.', name: 'window' },
        {
          message: 'Use `Zotero.getMainWindow().document` instead.',
          name: 'document',
        },
        {
          message: 'Use `Zotero.getActiveZoteroPane()` instead.',
          name: 'ZoteroPane',
        },
        'Zotero_Tabs',
      ],

      '@typescript-eslint/ban-ts-comment': [
        'warn',
        {
          'ts-expect-error': 'allow-with-description',
          'ts-ignore': 'allow-with-description',
          'ts-nocheck': 'allow-with-description',
          'ts-check': 'allow-with-description',
        },
      ],
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': [
        'off',
        {
          ignoreRestArgs: true,
        },
      ],
      '@typescript-eslint/no-non-null-assertion': 'off',
      'no-console': 'error',
      'eqeqeq': ['error', 'always', { null: 'ignore' }],
    },
  },
)
