import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginVue from 'eslint-plugin-vue';
import vueParser from 'vue-eslint-parser';

/** @type {import('typescript-eslint').Config} */
export default tseslint.config(
  { ignores: ['node_modules/**', 'dist/**', 'worker.ts'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.vue'],
    plugins: { vue: pluginVue },
    processor: pluginVue.processors['.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tseslint.parser,
        sourceType: 'module',
      },
      globals: { ...globals.browser },
    },
    rules: {
      ...pluginVue.configs['flat/recommended'].reduce((acc, c) => ({ ...acc, ...c.rules }), {}),
      'vue/max-attributes-per-line': 'off',
      'vue/singleline-html-element-content-newline': 'off',
      'vue/html-self-closing': ['error', { html: { void: 'always', normal: 'never', component: 'always' } }],
    },
  },
  {
    files: ['**/*.{js,mjs,ts}'],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      'no-undef': 'off',
    },
  },
);
