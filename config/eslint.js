import eslint from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const ERROR = 'error';

/**
 * Check if a package is installed
 * @param {string} pkg
 * @returns {boolean}
 */
const has = (pkg) => {
  try {
    import.meta.resolve(pkg, import.meta.url);
    return true;
  } catch {
    return false;
  }
};

const hasTypeScript = has('typescript');
const hasReact = has('react');
const hasTestingLibrary = has('@testing-library/dom');
const hasJestDom = has('@testing-library/jest-dom');
const hasVitest = has('vitest');
const vitestFiles = ['**/__tests__/**/*', '**/*.test.*', '**/*.spec.*'];
const testFiles = ['**/tests/**', '**/#tests/**', ...vitestFiles];
const playwrightFiles = ['**/e2e/**'];

/** @type {import("eslint").Linter.Config[]} */
export const config = [
  {
    ignores: [
      '**/.cache/**',
      '**/node_modules/**',
      '**/build/**',
      '**/public/build/**',
      '**/playwright-report/**',
      '**/server-build/**',
      '**/dist/**',
      '**/coverage/**',
    ],
  },

  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.stylistic,

  // Global rules that apply to all files
  {
    plugins: {
      import: (await import('eslint-plugin-import')).default,
      perfectionist: (await import('eslint-plugin-perfectionist')).default,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        Bun: true,
      },
      parserOptions: {
        warnOnUnsupportedTypeScriptVersion: false,
      },
    },
    rules: {
      'array-callback-return': ERROR,
      'getter-return': ERROR,
      'import/no-duplicates': [ERROR, { 'prefer-inline': true }],
      'import/no-relative-packages': ERROR,
      'new-parens': ERROR,
      'no-array-constructor': ERROR,
      'no-caller': ERROR,
      'no-cond-assign': [ERROR, 'except-parens'],
      'no-console': ERROR,
      'no-const-assign': ERROR,
      'no-constant-condition': [ERROR, { checkLoops: false }],
      'no-control-regex': ERROR,
      'no-debugger': ERROR,
      'no-dupe-args': ERROR,
      'no-dupe-class-members': ERROR,
      'no-dupe-keys': ERROR,
      'no-duplicate-case': ERROR,
      'no-empty': [ERROR, { allowEmptyCatch: true }],
      'no-empty-character-class': ERROR,
      'no-empty-pattern': ERROR,
      'no-eval': ERROR,
      'no-ex-assign': ERROR,
      'no-extend-native': ERROR,
      'no-extra-bind': ERROR,
      'no-extra-boolean-cast': ERROR,
      'no-extra-label': ERROR,
      'no-func-assign': ERROR,
      'no-global-assign': ERROR,
      'no-implied-eval': ERROR,
      'no-invalid-regexp': ERROR,
      'no-label-var': ERROR,
      'no-labels': [ERROR, { allowLoop: true, allowSwitch: false }],
      'no-lone-blocks': ERROR,
      'no-loop-func': ERROR,
      'no-mixed-operators': [
        ERROR,
        {
          groups: [
            ['&', '|', '^', '~', '<<', '>>', '>>>'],
            ['==', '!=', '===', '!==', '>', '>=', '<', '<='],
            ['&&', '||'],
            ['in', 'instanceof'],
          ],
          allowSamePrecedence: false,
        },
      ],
      'no-new-func': ERROR,
      'no-new-object': ERROR,
      'no-new-wrappers': ERROR,
      'no-octal': ERROR,
      'no-process-env': ERROR,
      'no-redeclare': ERROR,
      'no-script-url': ERROR,
      'no-self-assign': ERROR,
      'no-self-compare': ERROR,
      'no-sequences': ERROR,
      'no-shadow-restricted-names': ERROR,
      'no-sparse-arrays': ERROR,
      'no-template-curly-in-string': ERROR,
      'no-this-before-super': ERROR,
      'no-throw-literal': ERROR,
      'no-undef': ERROR,
      'no-undef-init': ERROR,
      'no-unexpected-multiline': ERROR,
      'no-unreachable': ERROR,
      'no-unsafe-negation': ERROR,
      'no-unused-expressions': [
        ERROR,
        {
          allowShortCircuit: true,
          allowTernary: true,
          allowTaggedTemplates: true,
        },
      ],
      'no-unused-labels': ERROR,
      'no-use-before-define': [
        ERROR,
        { classes: false, functions: false, variables: false },
      ],
      'no-useless-computed-key': ERROR,
      'no-useless-concat': ERROR,
      'no-useless-rename': [
        ERROR,
        {
          ignoreDestructuring: false,
          ignoreImport: false,
          ignoreExport: false,
        },
      ],
      'no-var': ERROR,
      'no-warning-comments': [
        ERROR,
        { terms: ['FIXME'], location: 'anywhere' },
      ],
      'object-shorthand': ERROR,
      'perfectionist/sort-imports': ERROR,
      'perfectionist/sort-named-imports': ERROR,
      'perfectionist/sort-named-exports': ERROR,
      'prefer-const': ERROR,
      'prefer-object-spread': ERROR,
      'require-yield': ERROR,
      'unicode-bom': [ERROR, 'never'],
      'use-isnan': ERROR,
      'valid-typeof': ERROR,
      curly: [ERROR, 'multi-line'],
      eqeqeq: [ERROR, 'always', { null: 'ignore' }],

      // Disable rules from presets
      'dot-notation': 'off',
      'no-unused-vars': 'off',
      'no-useless-escape': 'off',
      'no-return-await': 'off',
    },
  },

  hasReact
    ? {
        settings: {
          react: {
            version: 'detect',
          },
        },
      }
    : null,

  // General rules for JSX/TSX files
  hasReact
    ? {
        files: ['**/*.tsx', '**/*.jsx'],
        plugins: {
          react: (await import('eslint-plugin-react')).default,
        },
        languageOptions: {
          globals: { React: 'readonly' },
          parser: hasTypeScript
            ? (await import('typescript-eslint')).parser
            : undefined,
          parserOptions: {
            jsx: true,
          },
        },
        rules: {
          'react/forbid-foreign-prop-types': [
            ERROR,
            { allowInPropTypes: true },
          ],
          'react/function-component-definition': [
            ERROR,
            {
              namedComponents: 'function-declaration',
              unnamedComponents: 'arrow-function',
            },
          ],
          'react/jsx-key': ERROR,
          'react/jsx-no-comment-textnodes': ERROR,
          'react/jsx-no-target-blank': ERROR,
          'react/jsx-no-undef': ERROR,
          'react/jsx-pascal-case': [ERROR, { allowAllCaps: true, ignore: [] }],
          'react/jsx-uses-react': ERROR,
          'react/jsx-uses-vars': ERROR,
          'react/no-danger-with-children': ERROR,
          'react/no-direct-mutation-state': ERROR,
          'react/no-find-dom-node': ERROR,
          'react/no-is-mounted': ERROR,
          'react/no-render-return-value': ERROR,
          'react/no-string-refs': ERROR,
          'react/no-typos': ERROR,
          'react/react-in-jsx-scope': 'off',
          'react/require-render-return': ERROR,
          'react/style-prop-object': ERROR,
        },
      }
    : null,

  // Rules specific to React hooks
  hasReact
    ? {
        files: ['**/*.ts?(x)', '**/*.js?(x)'],
        plugins: {
          'react-hooks': (await import('eslint-plugin-react-hooks')).default,
        },
        rules: {
          'react-hooks/exhaustive-deps': ERROR,
          'react-hooks/rules-of-hooks': ERROR,
        },
      }
    : null,

  // TS and TSX files
  hasTypeScript
    ? {
        files: ['**/*.ts?(x)'],
        languageOptions: {
          parser: (await import('typescript-eslint')).parser,
          parserOptions: {
            projectService: true,
          },
        },
        plugins: {
          '@typescript-eslint': (await import('typescript-eslint')).plugin,
        },
        rules: {
          '@typescript-eslint/consistent-type-imports': [
            ERROR,
            {
              prefer: 'type-imports',
              disallowTypeAnnotations: true,
              fixStyle: 'inline-type-imports',
            },
          ],
          '@typescript-eslint/naming-convention': [
            'error',
            {
              selector: 'typeLike',
              format: ['PascalCase'],
              filter: {
                regex: '^(__String|[A-Za-z]+_[A-Za-z]+)$',
                match: false,
              },
            },
            {
              selector: 'interface',
              format: ['PascalCase'],
              custom: { regex: '^I[A-Z]', match: false },
              filter: {
                regex: '^I(Arguments|TextWriter|O([A-Z][a-z]+[A-Za-z]*)?)$',
                match: false,
              },
            },
            {
              selector: 'variable',
              format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
              leadingUnderscore: 'allow',
              filter: {
                regex:
                  '^(_{1,2}filename|_{1,2}dirname|_+|[A-Za-z]+_[A-Za-z]+)$',
                match: false,
              },
            },
            {
              selector: 'function',
              format: ['camelCase', 'PascalCase'],
              leadingUnderscore: 'allow',
              filter: { regex: '^[A-Za-z]+_[A-Za-z]+$', match: false },
            },
            {
              selector: 'parameter',
              format: ['camelCase'],
              leadingUnderscore: 'allow',
              filter: { regex: '^(_+|[A-Za-z]+_[A-Z][a-z]+)$', match: false },
            },
            {
              selector: 'method',
              format: ['camelCase', 'PascalCase'],
              leadingUnderscore: 'allow',
              filter: { regex: '^([0-9]+|[A-Za-z]+_[A-Za-z]+)$', match: false },
            },
            {
              selector: 'memberLike',
              format: ['camelCase'],
              leadingUnderscore: 'allow',
              filter: { regex: '^([0-9]+|[A-Za-z]+_[A-Za-z]+)$', match: false },
            },
            {
              selector: 'enumMember',
              format: ['camelCase', 'PascalCase'],
              leadingUnderscore: 'allow',
              filter: { regex: '^[A-Za-z]+_[A-Za-z]+$', match: false },
            },
            { selector: 'property', format: null },
          ],
          '@typescript-eslint/no-floating-promises': ERROR,
          '@typescript-eslint/no-misused-promises': [
            ERROR,
            { checksVoidReturn: false },
          ],
          '@typescript-eslint/no-unused-expressions': [
            ERROR,
            { allowTernary: true },
          ],
          '@typescript-eslint/unified-signatures': ERROR,
          // Disallow the TypeScript `as` operator for type assertions.
          // Using `assertionStyle: "never"` forbids both `as` and angle-bracket
          // assertions, effectively preventing all direct casts.
          '@typescript-eslint/consistent-type-assertions': [
            ERROR,
            {
              assertionStyle: 'never',
            },
          ],

          // Disallow non-null assertions (the `!` postfix operator).
          '@typescript-eslint/no-non-null-assertion': ERROR,
          'import/consistent-type-specifier-style': [ERROR, 'prefer-inline'],

          // Disable rules from presets
          '@typescript-eslint/consistent-type-definitions': 'off',
          '@typescript-eslint/no-namespace': 'off',
          '@typescript-eslint/no-unused-vars': 'off',
        },
      }
    : null,

  // This assumes test files are those which are in the test directory or have
  // *.test.* or *.spec.* in the filename. If a file doesn't match this assumption,
  // then it will not be allowed to import test files.
  {
    files: ['**/*.ts?(x)', '**/*.js?(x)'],
    ignores: testFiles,
    rules: {
      'no-restricted-imports': [
        ERROR,
        {
          patterns: [
            {
              group: testFiles,
              message: 'Do not import test files in source files',
            },
          ],
        },
      ],
    },
  },

  {
    files: testFiles,
    rules: {
      // Disable `any` rules for tests
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
    },
  },

  hasTestingLibrary
    ? {
        files: testFiles,
        ignores: [...playwrightFiles],
        plugins: {
          'testing-library': (await import('eslint-plugin-testing-library'))
            .default,
        },
        rules: {
          'testing-library/no-unnecessary-act': [ERROR, { isStrict: false }],
          'testing-library/no-wait-for-side-effects': ERROR,
          'testing-library/prefer-find-by': ERROR,
        },
      }
    : null,

  hasJestDom
    ? {
        files: testFiles,
        ignores: [...playwrightFiles],
        plugins: {
          'jest-dom': (await import('eslint-plugin-jest-dom')).default,
        },
        rules: {
          'jest-dom/prefer-checked': ERROR,
          'jest-dom/prefer-enabled-disabled': ERROR,
          'jest-dom/prefer-focus': ERROR,
          'jest-dom/prefer-required': ERROR,
        },
      }
    : null,

  hasVitest
    ? {
        files: testFiles,
        ignores: [...playwrightFiles],
        plugins: {
          vitest: (await import('@vitest/eslint-plugin')).default,
        },
        rules: {
          'vitest/no-focused-tests': [ERROR, { fixable: false }],
        },
      }
    : null,
].filter(Boolean);

export default config;
