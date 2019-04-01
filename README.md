#### se侧边栏资讯
1. 目前有以下两个类型，如需修改，可在`src/config.js`配置中的`channels`处进行增减
  - [资讯](http://se.360.cn/product/sidenews.html)
  - [视频](http://se.360.cn/product/sidenews.html?type=video)

2. 项目基于`react` + `redux` + `immutable`架构，构建工具为`webpack`，使用[`@q/qcdn`](http://qnpm.qiwoo.org/package/@q/qcdn?sid=d3a07586e91c11e7a6860242ac150003)上传静态文件

--- 
#### 模块安装
1. `@q/qcdn`
  - `@q`是360内部qnpm源（http://registry.npm.qiwoo.org）模块的公共文件夹
    - 设置`npm config set @q:registry http://registry.npm.qiwoo.org`作用是，所有在@q命名空间下的模块会通过内部qnpm源安装，其他模块仍通过官方源安装。
  - `@q/qcdn`这个模块是360静态资源托管平台针对于node开发的模块，用于项目发布时的资源上传。`build.config.js`中有使用
    - `@q/qcdn`是一个工具类模块，建议全局安装`npm i -g @q/qcdn`
    - 执行`node build.config.js`上传静态资源时，因为node寻找模块的路径中并不包含通过npm安装的模块，所以使用全局安装的`@q/qcdn`前，请先为node设置全局变量`NODE_PATH`,具体方法见下文[NODE_PATH设置](#NODE_PATH)
2. 其他项目依赖模块
  - 直接使用`npm i`安装`package.json`中的其他模块到项目下
3. 其他
  - 一般建议将项目公共工具类模块安装到全局，比如`@q/qcdn`、`webpack`及一些相关loader或者plugins
  - 本项目依赖的webpack4，其他项目可能依赖了webpack3，所以本项目的webpack安装在了项目下，而非全局
  - 随着webpack版本的更新，以后可将本项目的webpack升级，对应的，升级一下`webpack.config.js`

---
#### CLI命令
1. `npm run dll`
  - 单独打包`react`、`lodash`等第三方模块为`dll.js`
  - 可在`webpack.config.js`中的`dllModules`添加新的第三方模块
  - 注：在添加新的第三方模块前，请勿重复构建dll，因为每次构建压缩后的dll文件md5值可能不同，cdn上传后生成的静态路径会改变，从而客户端打开页面时要重新请求新的dll文件，该文件压缩后400k+，加载该资源会影响首屏显示时间，体验变差
2. `npm run dev`/`npm run watch`
  - 开发阶段使用
  - 业务代码未压缩，方便调试
3. `npm run build`
  - 上传到测试机或发布前使用
  - 业务代码压缩
4. `node build.config.js`
  - 项目发布
  - 将静态文件（js、css、img）上传至cdn
  - 上传完毕后会生成`output`文件夹
  - 注：上传时的相关配置可在`build.config.js`中的`cdnOpts`参数中修改

---
<h4 id="NODE_PATH"></h4>
#### NODE_PATH设置
1. Windows系统
  - 首先获得npm的全局安装目录
    - 在命令行中执行`npm root -g`
    - 一般路径为`C:\Users\xxx\AppData\Roaming\npm\node_modules`，xxx为用户名，记录该路径，供下面设置环境变量用
  - 打开`电脑`->`属性`->`高级系统设置`->`环境变量`->`系统变量`->`新建`
    - 变量名：`NODE_PATH`
    - 变量值：`C:\Users\xxx\AppData\Roaming\npm\node_modules`
  - 验证是否设置成功
    - 在命令行中执行 `node`
    - 在node执行环境中输入`global.module.paths`
    - 查看数组中是否有刚才设置的变量值（有时设置完环境变量后需要重启命令行）
2. Mac OS
  - 获取npm的全局安装目录
    - 方法同上Windows系统
    - 一般路径为`/usr/local/lib/node_modules`
  - 在命令行中进行设置
    - 首先进入根目录`cd ~`
    - `vim .bash_profile`
    - 在最后加上`export NODE_PATH="/usr/local/lib/node_modules"`,保存退出
  - 验证方法同上Windows

---
#### 项目结构
```
|-output  项目资源上传至cdn后的目标文件
|-public  打包后的目标文件
|-src 项目源文件
  |-actions  所有action
  |-assets  工具、公共库、图片、样式等静态资源
  |-components  组件类
  |-containers  页面结构模块类
  |-reducers  所有reducer
  |-source  异步加载时的数据类
  |-config.js  相关配置
  |-index.html  入口模板
  |-index.js  页面逻辑入口
  |-initState.js  store的初始化数据
|-build.config.js  静态资源上传时的配置文件
|-manifest.json  webpack.DllPlugin生成的中间文件

```
