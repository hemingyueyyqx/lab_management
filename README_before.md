# 实验室管理系统(前世)

### 相关安装

- `npm install @vuelidate/core` @vuelidate/validators
- `npm i axios`
- `npm install vue-router --save`
  （timetable 页面）:

- npm install moment --save
- npm install element-plus --save
  其他 elementplus 配置根据:https://element-plus.org/zh-CN/guide/quickstart.html

（图表部分 graph）:

- npm install echarts --save

~~安装 vuex~~

~~- npm install vuex@next --save~~

安装 vueuse 来代替 vuex/pinia 和 Axios
`npm i @vueuse/core`

安装 sass

- npm install node-sass --save-dev //安装 node-sass
- npm install sass-loader --save-dev //安装依赖包 sass-loader
- npm install style-loader --save-dev //安装 style-loader
- npm install -D sass-embedded
  (解决 sass 全局变量)
  由于 scss-loader 版本号过高会导致报错，可直接复制下面版本号至 package.json，然后 npm i 即可；
  "sass": "^1.32.8",
  "node-sass": "^5.0.0",
  "sass-loader": "^10.0.2"

### 删除 node_modules

我们在开发项目的时候，每次安装的 node 包会出现版本和项目所需要的版本不一致的问题。因此需要删除 node 包，重新安装它，很多小伙伴只是把他给手动删除了，但是却没有删除包的缓存，因此在启动项目的时候还是会报错~

### 问题解决

- 登陆注册时显示找不到 store，老疑惑了，结果是 main.ts 那里忘记引入 store 了
  感谢博客 https://blog.csdn.net/weixin_45214268/article/details/127496619  
  启动后端的微服务后成功了。呜呜呜呜呜呜开心 ╥﹏╥

### update

**2024/12/30**

1.menu 菜单

**2024/12/29**

1. 拦截器与路由守卫

- 实现响应拦截器
- 实现请求拦截器
- 实现路由守卫（主要页面要登陆过后才能访问）permission.js

2. 配置 vit.config.ts
   ` css: {
  preprocessorOptions: {
    scss: {
      additionalData:`
   @import "@/styles/variables.scss";
   @import "@/styles/mixin.scss";
   `,
    },
  },
},
 `
3. 设置 sass 全局变量

**2024/12/28**

1. 登录请求

- 配置环境的 .env.development

- 登陆业务放在 app.js 中

**2024/12/27**

login 表单校验

- 利用 element-plus 中的表单校验 rules 实现对登录注册页面账号密码输入的校验
