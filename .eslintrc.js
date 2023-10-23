/* eslint-disable comma-dangle */
module.exports = {
  env: {
    node: true,
    commonjs: true,
    es2021: true,
  },
  extends: 'airbnb',
  overrides: [
    {
      env: {
        node: true,
      },
      files: [
        '.eslintrc.{js,cjs}',
      ],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    semi: [
      'error',
      'never',
    ],
    indent: [
      'error',
      2
    ],
    'no-console': 0,
  },
}
