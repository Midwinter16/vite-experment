module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2022: true,
  },
  parser: 'vue-eslint-parser',
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-essential',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'eslint-config-prettier',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
  },
  plugins: ['vue', '@typescript-eslint', 'prettier'],
  rules: {
    'prettier/prettier': [
      2,
      {
        bracketSpacing: false,
        printWidth: 120,
        semi: false,
        singleQuote: true,
        tabWidth: 2,
        trailingComma: 'es5',
        endOfLine: 'auto',
      },
    ],
    'handle-callback-err': 0,
    'prefer-promise-reject-errors': [2, {allowEmptyReject: true}],
    'no-prototype-builtins': 0,
    'comma-dangle': 0,
    camelcase: 0,
    eqeqeq: 0,
    'vue/multi-word-component-names': 'off',
    '@typescript-eslint/no-explicit-any': ['off'],
    '@typescript-eslint/no-var-requires': 0,
  },
}
