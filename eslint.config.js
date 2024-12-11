import js from '@eslint/js';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],

      'no-var': 'error', // Use const or let instead (es6)
      'no-console': ['warn', { allow: ['warn', 'error'] }], // So we don't forget some console.log
      'no-else-return': 'warn', // Cleaner to use early return
      'no-useless-return': 'warn', // Can be a source of bugs
      'no-shadow': 'warn', // Can be a source of bugs
      yoda: 'warn', // false === var is not pretty
      'no-undef-init': 'warn', // const toto = undefined is useless
      'prefer-arrow-callback': 'warn', // Cleaner and easier to read
      'prefer-const': 'warn', // Can be a source of bugs
      'prefer-destructuring': 'warn', // Cleaner and easier to read
      'prefer-spread': 'warn', // Cleaner and easier to read
      'prefer-object-spread': 'warn', // Cleaner and easier to read
      'no-useless-rename': 'warn', // Cleaner and easier to read
      'object-shorthand': 'warn', // Cleaner and easier to read
      'prefer-template': 'warn', // Use es6 string template instead of concatenation
      'no-param-reassign': 'warn', // To avoid reassigning function parameters
      '@typescript-eslint/consistent-type-definitions': ['warn', 'interface'], // Use interface instead of type = Obj
      '@typescript-eslint/no-require-imports': 'warn', // Use es6 import instead of require
      '@typescript-eslint/no-empty-object-type': 'warn',
      '@typescript-eslint/no-unsafe-function-type': 'warn',
      '@typescript-eslint/no-wrapper-object-types': 'warn',
      '@typescript-eslint/array-type': 'warn', // Use T[] instead of Array<T>, cleaner

      // Overrides eslint:recommended
      'no-extra-boolean-cast': 'warn', // Error -> Warn
      'no-debugger': 'warn', // Error -> Warn
      'no-empty': ['warn', { allowEmptyCatch: true }], // Error -> Warn + Allow catch blocks to be empty
      'no-regex-spaces': 'warn', // Error -> Warn
      'no-unexpected-multiline': 'warn', // Error -> Warn
      'no-unreachable': 'warn', // Error -> Warn
      'use-isnan': 'warn', // Error -> Warn
      'no-empty-pattern': 'warn', // Error -> Warn
      'no-useless-catch': 'warn', // Error -> Warn
      'no-useless-escape': 'warn', // Error -> Warn
      'no-mixed-spaces-and-tabs': 'warn', // Error -> Warn
      'no-constant-condition': 'warn', // Error -> Warn
      'no-irregular-whitespace': 'warn', // Error -> Warn
      'constructor-super': 'off', // Not all constructors need to call super();

      // Overrides plugin:@typescript-eslint/recommended
      '@typescript-eslint/no-empty-interface': 'warn', // Error -> Warn
      '@typescript-eslint/no-inferrable-types': 'warn', // Error -> Warn
      '@typescript-eslint/no-var-requires': 'warn', // Error -> Warn
      '@typescript-eslint/prefer-namespace-keyword': 'warn', // Error -> Warn
      '@typescript-eslint/triple-slash-reference': 'warn', // Error -> Warn
      '@typescript-eslint/no-non-null-assertion': 'warn', // Error -> Warn
      '@typescript-eslint/explicit-function-return-type': 'off', // Some return types are explicits
      '@typescript-eslint/no-explicit-any': 'off', // Too much constraint
      '@typescript-eslint/prefer-string-starts-ends-with': 'off', // Use whatever you want to check strings
      '@typescript-eslint/no-use-before-define': 'off', // Declaration order doesn't matter
      '@typescript-eslint/camelcase': 'off', // Name your variables whatever you want
      '@typescript-eslint/no-empty-function': 'off', // Some functions needs to be empty () => {}
      '@typescript-eslint/member-delimiter-style': 'off', // Handled by prettier
      '@typescript-eslint/explicit-module-boundary-types': 'off', // Not requiring return type on exported functions

      'no-unused-vars': 'off', // Replaced by @typescript-eslint/no-unused-vars
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { ignoreRestSiblings: true },
      ], // Replaces no-unused-vars

      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
);
