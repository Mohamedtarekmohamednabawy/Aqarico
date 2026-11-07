import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      // Ignore PascalCase (components), ALL_CAPS (constants), and 'motion' (framer namespace)
      'no-unused-vars': ['warn', { varsIgnorePattern: '^([A-Z]|motion$|_)' }],
      // Context/provider files export both a context and a hook — standard React pattern
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
  // Relax fast-refresh rule for context/provider/i18n/theme files
  {
    files: ['**/context/**', '**/i18n/**', '**/theme/**'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
])
