// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  //parser: 'babel-eslint',
  parserOptions: {
    parser: 'babel-eslint', // eslint-plugin-vue需配置在里面
    sourceType: 'module'
  },
  env: {
    browser: true,
    commonjs: true,
    es6: true
  },
  /*
   *To use the JavaScript Standard Style shareable config, first run this:
   *npm install --save-dev eslint-config-standard eslint-plugin-standard eslint-plugin-promise eslint-plugin-import eslint-plugin-node
   *Then, add this to your .eslintrc file:
   *{
   * "extends": "standard"
   *}
   */
  extends: [
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    'plugin:vue/essential',
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md,
    'standard'
  ],
  // required to lint *.vue files
  plugins: [
    //'html', //html文件中的<script></script>标签中启用eslint -> eslint-plugin-html
    'vue' // eslint-plugin-vue 内置 eslint-plugin-html
    //Initially, eslint-plugin-vue was using eslint-plugin-html to lint code inside script tags.
    // Since v3, eslint-plugin-vue is using its own parser, so it is incompatible with eslint-plugin-html.
    // You should remove eslint-plugin-html from your dependencies if you still have this.
  ],
  // add your custom rules here
  'rules': {
    /**
     * allow debugger during development
     */
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    //'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
    //"off"
    // or 0 - turn the rule off 不验证 "warn"==="off"
    // or 1 - turn the rule on as a warning(doesn’ t affect exit code) 警告 "warning"
    // or 2 - turn the rule on as an error(exit code is 1 when triggered) 错误  "error"
    // don't require .vue extension when importing
    // 'import/extensions': ['error', 'always', {
    //   js: 'never',
    //   vue: 'never'
    // }],
    // disallow reassignment of function parameters
    // disallow parameter object manipulation except for specific exclusions
    // allow optionalDependencies
    'import/no-extraneous-dependencies': ['error', {
      optionalDependencies: ['test/unit/index.js']
    }],
    "no-shadow": ["warn", { "builtinGlobals": false, "hoist": "functions", "allow": [] }],
    "no-param-reassign": ["warn", {
      "props": true,
      "ignorePropertyModificationsFor": [
        "bar",
        'state', // for vuex state
        'acc', // for reduce accumulators
        'e' // for e.returnvalue
      ]
    }],
    "max-len": ["off", { "comments": 100 }],
    /**
     * allow paren-less arrow functions
     */
    'arrow-parens': 0,
    /**
     * allow async-await
     */
    'generator-star-spacing': 'off',
    //'generator-star-spacing': 0,
    "indent": [
      "error",
      2,
      { "SwitchCase": 1 },
    ],
    "linebreak-style": [
      0,
      "error",
      "windows"
    ],
    "quotes": [
      "error",
      "single"
    ],
    "no-multi-assign": "off",
    "no-unused-vars": [ //没被使用的变量
      1
    ],
    "no-param-reassign": [1, { "props": false }], // 不允许重新赋值函数形参，但可以修改其属性值。
    "no-restricted-syntax": 0, // 不推荐用for-in for-of
    "eol-last": [ // 在末尾(';')，新的一行被要求
      0
    ],
    "space-before-function-paren": ["error", {
      "anonymous": "never",
      "named": "never",
      "asyncArrow": "always"
    }],
    /**
     * 名称不能在 ES6 环境中自动分配，则要求函数表达式具有名称
     */
    "func-names": ["error", "as-needed"],
    "no-nested-ternary": "off", //嵌套的三目运算
    "no-underscore-dangle": "off", //下划线
    "no-extend-native": ["error", { "exceptions": ["Promise"] }],
    "no-plusplus": ["error", { "allowForLoopAfterthoughts": true }],
    "no-bitwise": [0, { "allow": ["~"] }],
    /**
     * require semicolon(';')  when sentence end
     */
    "semi": [
      "error",
      "always"
    ],
  }
}