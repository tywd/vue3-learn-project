# Vue 3 + Vite

This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar)

# Vue3一些使用的新方法新特性
尤大推荐的神器`unplugin-vue-components`,解放双手，不需再手动引入组件 [unplugin-vue-components](https://github.com/antfu/unplugin-vue-components)
ui(Element-ui)库,vue hooks)
### unplugin-vue-components/vite
```js
// vite.config.js
import { defineConfig } from 'vite'
import Components from 'unplugin-vue-components/vite' // 自动导入UI
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
export default defineConfig({
  plugins: [
    vue(),
    // your plugin installation
    Components({
      resolvers: [
        AntDesignVueResolver(),
      ],
    }),
  ],
})
```
```js
import { message } from 'ant-design-vue';
import 'ant-design-vue/es/message/style/css'; //vite只能用 ant-design-vue/es 而非 ant-design-vue/lib
```
### unplugin-auto-import/vite
与react的hooks类似
```js 
// vite.config.js
import AutoImport from 'unplugin-auto-import/vite' // 自动导入Vue的hooks
export default defineConfig({
  plugins: [
    ...
    // 这些 自动导入Vue的hooks，刚入门vue3，建议暂时不加
    AutoImport({
      imports: ['vue', 'vue-router', 'vue-i18n', '@vueuse/head', '@vueuse/core'],
      // 可以选择auto-import.d.ts生成的位置，使用ts建议设置为'src/auto-import.d.ts'
      // dts: 'src/auto-import.d.ts'
    })
  ],
})
```
引入前后对比
注意：引入后要配置 .eslintrc.js
```js
// 引入前
import { ref, computed } from 'vue'
const num = ref(0)
const double = computed(() => num.value * 2)

// 引入后
const num = ref(0)
const double = computed(() => num.value * 2)
```

### vite-plugin-style-import
由于`unplugin-vue-components/vite`此插件无法处理非组件模块，如 message，这种组件需要手动加载：\
参考ant-design-vue文档[按需加载](https://www.antdv.com/docs/vue/getting-started-cn/
#%E6%8C%89%E9%9C%80%E5%8A%A0%E8%BD%BD)
引入方式参考[vite-plugin-style-import](https://github.com/vbenjs/vite-plugin-style-import)
完整写入如下
```js
npm i vite-plugin-style-import less -D
```
```js
// vite.config.js
import { createStyleImportPlugin, AndDesignVueResolve} from 'vite-plugin-style-import' // 自动导入非组件模块的样式，入弹窗提示andDesign的message
export default defineConfig({
  plugins: [
    ...
    createStyleImportPlugin({
      resolves: [
        AndDesignVueResolve(),
      ],
      libs: [
        // If you don’t have the resolve you need, you can write it directly in the lib, or you can provide us with PR
        {
          libraryName: 'ant-design-vue',
          esModule: true,
          resolveStyle: (name) => {
            return `ant-design-vue/es/${name}/style/index`
          },
        },
      ],
    }),
  ],
  // 1. If you are using the ant-design series, you need to configure this
  // 2. Make sure less is installed in the dependency `yarn add less -D`
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
})
```

# 引入ant-design-vue 主题
css里面添加即可
官方有样式文档[ant-design-vue主题色](https://www.antdv.com/docs/vue/customize-theme-cn)
```js
// vite.config.js
const { getThemeVariables } = require('ant-design-vue/dist/theme');
export default defineConfig({
  plugins: [],
  // 1. If you are using the ant-design series, you need to configure this
  // 2. Make sure less is installed in the dependency `yarn add less -D`
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        modifyVars: {
          'primary-color': '#1DA57A',
          'link-color': '#1DA57A',
          'border-radius-base': '2px',
        },
        /* modifyVars: getThemeVariables({
          dark: true, // 开启暗黑模式
        }), */
      },
    },
  },
})
```
# 配置alias
```js
export default defineConfig({
  ...
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "api": path.resolve(__dirname, "src/api"),
    }
  }
  ...
})
```

# 配置跨域代理
```js
export default defineConfig({
  ...
  server: {
    port: 3000, //启动端口
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:9111', //实际请求地址
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
    },
    cors: true
  }
  ...
})
```

# 前端工程化开发规范 editConfig+eslint+husky+lint-staged+jest/vitest
## editorConfig 跨多个编辑器和IDE一致代码风格 
EditorConfig 有助于维护跨多个编辑器和IDE从事同一项目的多个开发人员的一致编码风格，EditorConfig项目由一种用于定义编码样式的文件格式和一组文本编辑器插件组成，这些文本编辑器插件使编辑器可以读取文件格式并遵循定义的样式，EditorConfig 文件易于阅读，并且可以与版本控制系统很好地协同工作。

通俗地讲，就是由于开发人员的习惯不一样所用的开发编辑器可能不同，在不同的编辑器之前保持代码格式一致的风格。

安装 `npm install -D editorconfig`

对于vscode，需要安装扩展：EditorConfig for VS Code，然后项目根目录添加文件 .editorconfig，编写以下配置，更多配置参考 [官网-editorconfig.org](https://editorconfig.org/)：
```
# EditorConfig is awesome: https://EditorConfig.org

# top-most EditorConfig file
root = true

# Unix-style newlines with a newline ending every file
[*]
end_of_line = crlf
insert_final_newline = true

# Matches multiple files with brace expansion notation
# Set default charset
[*.{js}]
charset = utf-8
indent_style = space
indent_size = 2

# Tab indentation (no size specified)
# 可以是tab 或 space
# Indentation override for all JS under lib directory
[lib/**.js]
indent_style = space
indent_size = 2
trim_trailing_whitespace = true

# Matches the exact files either package.json
[{package.json}]
indent_style = space
indent_size = 2

[*.md]
insert_final_newline = false
trim_trailing_whitespace = false
```
## 配置 eslint 代码风格校验
js校验必备，注意eslint只针对js或ts做校验，按以下方式配置完后可做到保存时自动校验并修复。

安装 `npm install eslint -D`

安装vscode 扩展 eslint，设置文件 .vscode/settings.json 里添加配置

具体配置参考 [官网 - eslint.org](https://eslint.org/docs/user-guide/getting-started#installation-and-usage)

### 1、初始化配置EsLint
`npx eslint --init`

使用npx直接安装来选择一些开发的选项会直接安装一些eslint需要的npm包，省去特地去安装的功夫

选择模式： To check syntax, find problems, and enforce code style 严格模式
```js
You can also run this command directly using 'npm init @eslint/config'.
? How would you like to use ESLint? ... 
  To check syntax only
  To check syntax and find problems
> To check syntax, find problems, and enforce code style
```
选择语言模块：选择javascript
```js
? What type of modules does your project use? ...
> JavaScript modules (import/export)
  CommonJS (require/exports)
  None of these
```
选择语言框架 选择vue.js
```js
? Which framework does your project use? ...
  React
> Vue.js
  None of these
```
是否使用ts，视自己情况而定，我这里不用 选择的No
```js
 ? Does your project use TypeScript? » No / Yes
```
代码在哪里运行 使用空格键全选 浏览器+node
```js
? Where does your code run? ...  (Press <space> to select, <a> to toggle all, <i> to invert selection)
√ Browser
√ Node
```
选择一个风格：选择流行的即可
```js
? How would you like to define a style for your project? ...
> Use a popular style guide
  Answer questions about your style
```
你想遵循哪一种风格指南? 选择 Standard 这个社区指南，感觉很好。认可度也高
```js
? Which style guide do you want to follow? ...
  Airbnb: https://github.com/airbnb/javascript
> Standard: https://github.com/standard/standard
  Google: https://github.com/google/eslint-config-google
  XO: https://github.com/xojs/eslint-config-xo
```
您希望您的配置文件是什么格式? 选择js即可
```js
? What format do you want your config file to be in? ...
> JavaScript
  YAML
  JSON
```
可能会出现下面的提示，选择yes即可
```js
? The style guide "standard" requires eslint@^7.12.1. You are currently using eslint@8.10.0.
  Do you want to downgrade? » No / Yes
```
会问你是用npm安装还是yarn安装，视自己情况而定，我这里选择的npm(yes)
```js
? Would you like to install them now with npm? » No / Yes
```
安装完成后，在项目根目录会出现.eslintrc.js文件
```js
// .eslintrc.js 文件
module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'plugin:vue/essential',
    'standard'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: [
    'vue'
  ],
  rules: {
  }
}
```
### 2、安装vite-plugin-eslint
`npm i -D vite-plugin-eslint`
修改配置vite.config.js文件
```js
// vite.config.js 文件
import eslintPlugin from 'vite-plugin-eslint'

export default defineConfig({
  plugins: [
    // vite eslint
    eslintPlugin({
      include: ['src/**/*.js', 'src/**/*.vue', 'src/*.js', 'src/*.vue'],
      exclude: ['./node_modules/**'],
      cache: false // cache这个属性一定要带上false，否则修复的问题还是会不停报出来错，有毒。
    })
  ]
}
```
>PS: exclude 一直不生效，所以直接 新增了一个 .eslintignore 文件来做一些不需要走 eslint校验的路径
```js
// .eslintignore
src/static
```
修改eslint配置文件
```js
// .eslintrc.js
module.exports = {
  "env": {
    "browser": true,
    "es2021": true,
    "node": true
  },
  "extends": [
    "plugin:vue/essential",
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
      "singleline": { "max": 5 },
      "multiline": { "max": 5 }
    }] // vue template模板元素第一行最多5个属性
    // 其它的规则可以去eslint查看，根据自己需要进行添加
  }
}
```

接着再执行 `npm run dev` 也就是开始跑 `vite`，我这里发现有报错，`Can't find module '@babel/core/package.json'`

解决：安装下 `npm i -D @babel/core` 就好了，一般可能存在版本不兼容或者缺少了一些，然后再 run 一次，就能看到我们配置的报错了

像我这里就有了16个报错提示，去修改下哈哈
![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/aa865e1947c2456d977e8d7c06b0f524~tplv-k3u1fbpfcp-watermark.image?)

> 配置 eslint --fix，自动帮我们修复一些错误 警告
```js
"scripts": {
  "lint": "eslint --fix --ext .js,.vue src"
}

// 控制台执行
// npm run lint  // 这里还是有一些需要我们手动修复
// npm run dev
```
## 提交代码时的校验 husky+lint-staged
只是单纯引入 eslint 校验如果不强制要求就等于没做，总会有人偷懒，所以还是要约束一下。

husky用于git执行钩子前做校验，

lint-staged用于只校验git暂存区的文件。

这里要实现的功能是在git commit命令运行时先校验lint（包括eslint）是否通过，未通过则不予commit。

### 1、husky
husky 8.x 的使用参考 [官网 husky-usage](https://typicode.github.io/husky/#/?id=usage)
- 1. 初始化
```js
// 初始化
npx husky-init && npm install
```
初始化后根目录会出现一个新目录 `.husky` 下面有 .husky/pre-commit 和 .husky/_/.husky.sh 等

- 2. 在安装后自动启用 Git 挂钩，请编辑 package.json
`npm set-script prepare "husky install"` 配置如下
```json
// package.json
{
  "scripts": {
    "prepare": "husky install"
  }
}
```

- 3. 将命令添加到钩子或创建新命令 husky add
```js
// 执行下面命令会 将命令添加到钩子或创建新命令，请使用 husky add <file> [cmd]（不要忘记先运行 husky install）上面已经初始化过了。
npx husky add .husky/pre-commit "npm test"
```
- 4. 开始测试
根据我们 eslint 配置好的校验，故意给我们的文件做个错误示例，看会不会 commit 时 自动执行 .husky/pre-commit 中写的指令 npm test 对我们的代码进行校验

笔者特地给 某个文件的 双引号 改为 单引号，然后配置一个没有 --fix 自动修复的指令， 当执行了
```js
"scripts": {
  "test": "npm run lint",
  "lint:fix": "eslint --fix --ext .js,.vue src",
  "lint": "eslint --ext .js,.vue src",
},
```
当执行以下commit时
```js
git add .
git commit -m "test husky pre-commit"
```
出现了报错 如下, 提示应该根据 eslintrc 配置好的使用 单引号 singlequote
![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c857c0dedbcc48d1ba124cb95fdd7aeb~tplv-k3u1fbpfcp-watermark.image?)
至此配置 husky 成功

> PS： 出错后可以继续使用 `npm run lint:fix` 修复错误

- 5. Uninstall(卸载husky)
`npm uninstall husky && git config --unset core.hooksPath`


### 2、lint-staged
前面说了 `lint-staged` 用于只校验git暂存区的文件。在代码提交之前，进行代码规则检查能够确保进入git库的代码都是符合代码规则的。但是整个项目上运行lint速度会很慢

优点：lint-staged能够让lint只检测暂存区的文件，所以速度很快。

lint-staged过滤文件采用glob模式。

- 1. 安装 lint-staged
`npm i -D lint-staged`

- 2. 配置 lint-staged
这里其实就是配置将我们上面配的 husky 执行 的lint 放到 lint-staged

git commit时触发pre-commit钩子，运行lint-staged命令，对*.js等执行eslint命令。eslint要提前配置好。
```js
// package.json
"scripts": {
  "lint": "lint-staged", // 此处将之前的lint 改为 lint-stage的，将之前lint的指令放到 下面 lint-staged
},
"lint-staged": {
  "*.{js,vue}": [
      "eslint --ext .js,.vue src" // 执行eslint 校验
    // "git add" // 也可以执行 eslint --fix 这样直接配合 git add ，fix 后 重新 git add，我这里是有错误 直接 停止 --ext
  ]
}
```
再次模拟之前 的故意写个 错误的 eslint 示范，比如句尾加个 ';'，或者改单引号为双引号，结果报错如下
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f3ef40f154354bb98e19cf1aed3f2e48~tplv-k3u1fbpfcp-watermark.image?)
> PS： 出错后可以继续使用 `npm run lint:fix` 修复错误

至此配置 lint-staged 成功
## 单元测试jest
[官方入门文档](https://jestjs.io/zh-Hans/docs/getting-started)
### 1. 安装
`npm install --save-dev jest`

### 2. 配置一个测试函数
举个例子，我们先写一个两数相加的函数。 首先，根目录创建 `tests/unit/sum.js` 文件︰
```js
function sum(a, b) {
  return a + b;
}
module.exports = sum;
```
然后，根目录创建 `tests/unit/sum.test.js` 的文件。 此文件中将包含我们的实际测试︰
```js
const sum = require('./sum');

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});
```
### 3. 配置 package.json
随后，将下列配置内容添加到您的 package.json：
```js
// package.json
"scripts": {
  "test:unit": "jest",
}
```
最后，运行 `npm run test:unit` ，Jest将打印下面这个消息：
```
tests/unit/sum.test.js
✓ adds 1 + 2 to equal 3 (5ms)
```
如图
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2bdf10b4df0b424a8d34abd4dff71331~tplv-k3u1fbpfcp-watermark.image?)

### 4. 生成配置文件 jest.config.js 并初始化
 - 执行 `npx jest --init` 然后会有下面这些选项，选完后 根目录会生成一个 `jest.config.js` 文件
```shell
✔ Would you like to use Jest when running "test" script in "package.json"? … no // 这里由于我们已经配置了 test:unit，所以选no
✔ Would you like to use Typescript for the configuration file? … no
✔ Choose the test environment that will be used for testing › node
✔ Do you want Jest to add coverage reports? … yes
✔ Which provider should be used to instrument code for coverage? › babel
✔ Automatically clear mock calls, instances, contexts and results before every test? … yes
```
 - 修改 package.json，让jest自动监控测试文件，一有更新，就自动运行测试。在package.json中的jest那里加上--watchAll参数
```js
"script": {
  "test:unit": "jest --watchAll"
}
```

 - 生成测试覆盖率报告
 如果想修改测试覆盖率报告的文件夹名称，可以在jest.config.js中配置，
修改这一项 coverageDirectory: "coverage",
```js
// coverageDirectory: "coverage",
// 也可以修改为其他名字
coverageDirectory: "reports",
```
执行命令 `npx jest --coverage`
在项目根目录下会生成一个文件夹coverage，存放测试覆盖率的文件，或者将package.json 里面增加，然后 `npm run coverage`
```json
"scripts": {
  "coverage": "jest --coverage"
}
```
![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/28988ea6cdd846fb9a672a4383e10ff2~tplv-k3u1fbpfcp-watermark.image?)


### 5. 配置可以用esModule模块导入的测试环境
我们运行Jest的时候 当前坏境是一个node环境【node 不支持import ，nodejs采用的是CommonJS的模块化规范，使用require引入模块；而import是ES6的模块化规范关键字】，Jest在node环境下对于esModule的语法无法解析，只辨识commonJS的模块语法

esModule 写法：
```js
// math.js
export function add(a, b) {
    return a + b
}

// math.test.js
import {add} from './math'
```

实际项目中更多使用的是ES的语法来定义module，但是如果我们直接改成了ES语法，则运行jest就报错了。如何做兼容呢，我们可以使用babel【必须引入babel转义支持，通过babel进行编译，使其变成node的模块化代码。】

安装 babel 支持，我们已经安装过 @babel/core@7.18.2 接下来安装相同版本的 @babel/preset-env@7.18.2

`npm i @babel/core@7.18.2 @babel/preset-env@7.18.2 -D`
配置babel在项目根目录新建.babelrc文件，并写入以下内容
```js
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "targets": {
          "node": "current"
        }
      }
    ]
  ]
}
```
配置完毕，可将sum.js 改为 esModule 的方式引入，再运行`npm run test:unit`，就不会报错

这个过程：
  - 在运行npm run test之后
  - jest内部集成一个插件babel-jest
  - 它会检测当前项目是否安装了babel-core
  - 如果安装了则会去读取.babelrc配置
  - 在运行测试之前，会根据babel配置对代码进行转换
  - 最后，运行转化后的测试用例代码

```js
// sum.js
function sum(a, b) {
    return a + b;
}
// module.exports = sum; // CommonJs
export default sum // EsModule

// sum.test.js
// const sum = require('./sum'); // CommonJs
import sum from './sum' // EsModule

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});
```

记得配置忽略我们 `jest.config.js` 的 `eslint` 校验 这个就没必要校验了
```js
// .eslitignore
/src/static
/tests/unit
/jest.config.js
```


## 基于 vite 的 单元测试框架 vitest
[# vue官网介绍 - vitest](https://staging-cn.vuejs.org/guide/scaling-up/testing.html#recipes)
[# vitest 中文官网](https://cn.vitest.dev/)
