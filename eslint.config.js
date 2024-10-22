// eslint.config.js
import customConfig from '@antfu/eslint-config'
import { FlatCompat } from '@eslint/eslintrc'

const compat = new FlatCompat()

export default customConfig(
  {
    ignores: [],
    rules: {
      'no-console': 'off',
    },
  },
  ...compat.config({
    extends: [
      'plugin:tailwindcss/recommended',
    ],
  }),
)
