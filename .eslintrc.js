// .eslintrc.js
// 更多配置规则可查看 https://eslint.vuejs.org/
module.exports = {
  "env": {
    "browser": true,
    "es2021": true,
    "node": true
  },
  "extends": [
    "plugin:vue/vue3-essential",
    "standard",
    "plugin:vue/vue3-recommended",
    // collections
    "vue-global-api/reactivity",
    "vue-global-api/lifecycle",
    "vue-global-api/component",
    // single apis
    "vue-global-api/ref",
    "vue-global-api/toRef",
  ],
  // 这是初始生成的 将其中的内容更改为下面的
  // parserOptions: {
  //   ecmaVersion: "latest",
  //   sourceType: "module"
  // },

  // 新的内容
  "parserOptions": {
    "ecmaVersion": 6,
    "sourceType": "module",
    "ecmaFeatures": {
      "modules": true
    },
    "requireConfigFile": false,
    "parser": "@babel/eslint-parser"
  },
  "plugins": [
    "vue"
  ],
  "rules": {
    "semi": [2, "never"], // 禁止尾部使用分号“ ; ”
    "no-var": "error", // 禁止使用 var
    "indent": ["error", 2], // 缩进2格
    "no-mixed-spaces-and-tabs": "error", // 不能空格与tab混用
    "quotes": [2, "single"], // 使用单引号
    "vue/html-closing-bracket-newline": "off", // 不强制换行
    "vue/singleline-html-element-content-newline": "off", // 不强制换行
    "vue/max-attributes-per-line": ["error", {
      "singleline": {
        "max": 5
      },
      "multiline": {
        "max": 5
      }
    }], // vue template模板元素第一行最多5个属性
    "vue/no-multiple-template-root": "off", // vue3支持不需要单一根元素，此处关闭，不做不校验
    "vue/require-v-for-key": "off", // 可以不用v-bind:key,当然我觉得还是保留好
    'vue/no-parsing-error': ['error', {
      'invalid-first-character-of-tag-name': false // 在{{ index < 0 }}插值表达式中，使用到 '<' 小于号的规则
    }],
    "prefer-promise-reject-errors": "off",
    // "prefer-promise-reject-errors": ["error", {
    //   "allowEmptyReject": true
    // }], // 允许promise reject 可以返回空的，不用特定加入错误信息
    "vue/multi-word-component-names": "off", // 关闭组件命名规则限制，建议还是不关闭，规范一下，具体可查看 https://eslint.vuejs.org/
    // "vue/multi-word-component-names": ["error", {
    //   "ignores": []
    // }], // 此规则要求组件名称始终为多字，根App 组件和 Vue 提供的内置组件除外，例如<transition>or <component>。这可以防止与现有和未来的 HTML 元素发生冲突，因为所有 HTML 元素都是一个单词。
    // 其它的规则可以去eslint查看，根据自己需要进行添加
  }
}
