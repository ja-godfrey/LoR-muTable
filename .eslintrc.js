module.exports = {
  root: true,
  env: {
    node: true,
    jest: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production'
      ? ['error', { allow: ['warn', 'error'] }] : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
  overrides: [{
    files: ['src/**'],
    rules: {
      'linebreak-style': 0,
      'no-plusplus': 0,
      'arrow-parens': 0,
      'arrow-body-style': 0,
      'no-alert': 0,
      'no-nested-ternary': 0,
      'no-confusing-arrow': 0,
      'object-curly-newline': 0,
      indent: ['error', 3],
      'function-paren-newline': 0,
      'no-else-return': 0,
      'max-len': 0, // disabled for scss theme lengths
      'no-underscore-dangle': 0,
      'vue/no-multiple-template-root': 0,
    },
  }],
};
