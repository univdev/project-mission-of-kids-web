module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    'airbnb-base',
    'plugin:nuxt/recommended',
  ],
  // add your custom rules here
  rules: {
    'vue/order-in-components': 0,
    'no-param-reassign': 0,
    'object-curly-newline': 0,
    'import/extensions': 'off',
    'import/no-unresolved': 'off',
    'arrow-parens': 0,
    'no-underscore-dangle': 0,
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-restricted-syntax': [0, 'ForOfStatement'],
    'no-lonely-if': 'off',
    'no-shadow': 'off',
  }
}
