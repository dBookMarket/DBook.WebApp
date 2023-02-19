# vue-cli4.0+vant搭建移动端项目模板

### 初始化项目
```
npm  install
```

### 启动项目
```
npm run dev
```

### 构建项目
```
npm run build:dev(测试环境)
npm run build:prd(生产环境)
```

### eslint
```
npm run lint
```
```
vue-h5-template
├─ .browserslistrc 
├─ .editorconfig
├─ .eslintrc.js (eslint 配置)
├─ .gitignore (忽略文件配置)
├─ babel.config.js (编译文件)
├─ package-lock.json
├─ package.json  (依赖文件)
├─ postcss.config.js (css文件转换配置)
├─ public
│  ├─ favicon.ico
│  └─ index.html
├─ README.md
├─ src
│  ├─ api (请求接口)
│  │  ├─ api.js
│  │  ├─ product.js
│  │  └─ users.js
│  ├─ App.vue
│  ├─ assets (静态资源)
│  │  ├─ icon
│  │  ├─ img
│  │  │  ├─ account-icon.png
│  │  │  ├─ delete-icon.png
│  │  │  ├─ loading.png
│  │  │  ├─ logo.png
│  │  │  ├─ no-data.png
│  │  │  ├─ p.gif
│  │  │  ├─ password-icon.png
│  │  │  └─ search-icon.png
│  │  └─ svg
│  ├─ components (公共组件)
│  ├─ main.js (入口文件)
│  ├─ router (路由配置)
│  │  └─ index.js
│  ├─ store (公共状态管理)
│  │  ├─ getters.js
│  │  ├─ index.js
│  │  └─ modules
│  │     └─ user.js
│  ├─ styles (样式文件)
│  │  ├─ common.scss (公共样式)
│  │  ├─ index.scss (css入口文件)
│  │  ├─ login.scss (登录样式)
│  │  ├─ mixin.scss (混入常用公共样式,可全局使用)
│  │  ├─ reset.scss (重置样式)
│  │  └─ _varibles.scss (全局变量样式)
│  ├─ utils (工具集合)
│  │  ├─ baseUrl.js (baseUrl配置)
│  │  ├─ reg.js (正则)
│  │  ├─ request.js (公共请求方法)
│  │  └─ util.js (常用工具函数)
│  └─ views (页面集合)
│     ├─ home
│     │  ├─ components (页面级组件)
│     │  └─ index.vue
│     └─ login
│        ├─ components
│        └─ login.vue
├─ vue.config.js (配置文件)
└─ yarn.lock

```

### 命名规范

```
1.文件夹命名规范
  index.js 或者 index.vue，统一使用小写字母开头的(kebab-case)命名规范
  
  属于组件或类的，统一使用大写字母开头的(PascalCase)命名规范
  
  其他非组件或类的，统一使用小写字母开头的(kebab-case)命名规范
  (参考src/components)

  属于components文件夹下的子文件夹，使用大写字母开头的PascalBase风格
      全局通用的组件放在 /src/components下
  
  其他业务页面中的组件，放在各自页面下的 ./components文件夹下
    每个components文件夹下最多只有一层文件夹，且文件夹名称为组件的名称，文件夹下必须有index.vue或
    index.js，其他.vue文件统一大写开头（Pascal case），components下的子文件夹名称统一大写开头（PascalCase）

  其他文件夹统一使用kebab-case的风格

  
```
```
2.组件命名规范
  2.1 组件名应该始终是多个单词的，根组件 App 除外

  2.2 有意义的名词、简短、具有可读性

  2.3 命名遵循 PascalCase(单词首字母大写命名) 约定
  
  2.4 公用组件以 Abcd (公司名缩写简称) 开头，如（AbcdDatePicker,AbcdTable）

  2.5 页面内部组件以组件模块名简写为开头，Item 为结尾，如(StaffBenchToChargeItem,
      StaffBenchAppNotArrItem）

  2.6 使用遵循 kebab-case(短横线分隔命名) 约定

  2.7 在页面中使用组件需要前后闭合，并以短线分隔，如(<abcd-date-picker></abcd-date-picker>，     <abcd-table></abcd-table>)

  2.8 导入及注册组件时，遵循 PascalCase(单词首字母大写命名) 约定

```
```
3.props 命名规范
  3.1 在声明 prop 的时候，其命名应该始终使用 camelCase，而在模板中应该始终使用 kebab-case
  
```
```
4.注释规范
   4.1 公共组件使用说明
   4.2 各组件中重要函数或者类说明
   4.3 复杂的业务逻辑处理说明
   4.4 特殊情况的代码处理说明,对于代码中特殊用途的变量、存在临界值、函数中使用的hack、使用了某种算法或思路等需要进行注释描述
   4.5 注释块必须以/**（至少两个星号）开头**/；
   4.6 单行注释使用//；
   4.7 多重 if 判断语句

   普通注释：
    // 单行文本注释
    /*
      *@param 参数名 {参数类型} 描述信息
      *@return {返回类型} 描述信息
      *@example 示例
     */ 
    // TODO  未处理、待完善功能

    文档注释
    @module 声明模块
    /**
      * 模块说明
      * 模块名
    */

    @class。声明类
    /**
    * 类说明
    * @class 类名
    * @constructor
    */

```

```
5.Git 分支规范
  master（生成环境），
  dev（测试环境），
  feature分支（各自开发）
  hotfix（线上问题紧急解决）

  5.1 开发新功能是都是从master上拉取最新分支
  5.2 开发完之后，合并到dev分支后提测
  5.3 待测试验收通过后,准备上线时,先更新master,然后合并到自己的分支上,最后再把自己的分支合并到master上(这样是为了减少合并到master上时产生的冲突),将自己的分支合并到master后一定要本地启动项目验证,验证没问题了后，再推送到远程。
```

```

```