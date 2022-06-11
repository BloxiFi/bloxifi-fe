const IS_PROD = process.env.NODE_ENV === 'production'

module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:prettier/recommended',
    'plugin:import/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:react-hooks/recommended',
  ],
  env: {
    es6: true,
    node: true,
    browser: true,
  },
  rules: {
    'react/jsx-curly-brace-presence': [
      1,
      { props: 'never', children: 'never' },
    ],
    'import/no-named-as-default-member': 0,
    'import/no-unresolved': [1, { commonjs: true, amd: true }],
    'import/first': 2,
    'import/newline-after-import': 1,
    'import/order': [1, { 'newlines-between': 'always' }],
    'import/no-duplicates': 2,
    'import/no-useless-path-segments': ['error', { noUselessIndex: true }],
    'import/extensions': 0,
    semi: ['warn', 'never'],
    quotes: [1, 'single', { allowTemplateLiterals: true }],
    strict: [2, 'never'],
    curly: [2, 'all'],
    'no-console': 1,
    'no-debugger': IS_PROD ? 'error' : 'warn',
    'no-confusing-arrow': 'error',
    'arrow-spacing': 'error',
    'no-unused-vars': 'off',
    'no-delete-var': 'error',
    'no-whitespace-before-property': 'error',
    'react/display-name': 'off',
    'arrow-parens': [1, 'as-needed'],
    'jsx-a11y/heading-has-content': 0,
    'prettier/prettier': 1,

    // TODO: turn on later
    'react/prop-types': 'off',
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true, // always try to resolve types under `<root>@types` directory even it doesn't contain any source code, like `@types/unist`
        project: ['packages/*/tsconfig.json', 'apps/*/tsconfig.json'],
      },
    },
  },
  overrides: [
    {
      files: ['*.mdx'],
      extends: 'plugin:mdx/recommended',
    },
    {
      files: ['*.ts', '*.tsx'], // Your TypeScript files extension

      // As mentioned in the comments, you should extend TypeScript plugins here,
      // instead of extending them outside the `overrides`.
      // If you don't want to extend any rules, you don't need an `extends` attribute.
      extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
      ],

      rules: {
        '@typescript-eslint/camelcase': 0,
        '@typescript-eslint/no-misused-promises': [
          'error',
          { checksVoidReturn: false },
        ],
        '@typescript-eslint/no-floating-promises': [
          'error',
          { ignoreVoid: true },
        ],
        '@typescript-eslint/no-unused-vars': 1,
        '@typescript-eslint/no-explicit-any': 0,
        '@typescript-eslint/no-var-requires': 0,
        '@typescript-eslint/restrict-template-expressions': 0,
        '@typescript-eslint/no-unsafe-assignment': 0,
        '@typescript-eslint/no-unsafe-member-access': 0,
        '@typescript-eslint/restrict-plus-operands': 0,
        '@typescript-eslint/no-unsafe-argument': 0,
        '@typescript-eslint/no-unsafe-return': 0,
        '@typescript-eslint/no-unsafe-call': 0,
        '@typescript-eslint/explicit-function-return-type': 0,
        '@typescript-eslint/member-delimiter-style': [
          'error',
          {
            multiline: {
              delimiter: 'none',
              requireLast: false,
            },
            singleline: {
              delimiter: 'semi',
              requireLast: false,
            },
          },
        ],
      },

      parserOptions: {
        project: ['./tsconfig.json'], // Specify it only for TypeScript files
      },
    },
  ],
}
