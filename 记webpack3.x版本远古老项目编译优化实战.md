# 记webpack3.x版本远古老项目编译优化实战
> 本文内容只针对开发环境优化  生产环境可作参考
## 为何要优化？
1. 每次执行`npm run dev` 需要等待`24~28s`，每次`ctrl + s`触发热更新需要等待`4~8s`!叔可忍！婶婶不能忍！

### 优化前的编译速度
![在这里插入图片描述](https://img-blog.csdnimg.cn/2021031809295788.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM3NTQwMDA0,size_16,color_FFFFFF,t_70)
### 优化前的热更新速度
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210318110030347.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM3NTQwMDA0,size_16,color_FFFFFF,t_70)

实际只会比这些更慢！！！

## 优化之后  
> 写代码又感到了人生的幸福！
### 优化后的编译速度
> 2s左右结束战斗！
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210319113734101.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM3NTQwMDA0,size_16,color_FFFFFF,t_70)


### 优化后的热更新速度
> 秒更新  有木有！当然。。这是文件没变动的情况下 有变动大概800ms

![在这里插入图片描述](https://img-blog.csdnimg.cn/2021031809334333.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM3NTQwMDA0,size_16,color_FFFFFF,t_70)

## 优化思路
### 首先使用`speed-measure-webpack-plugin`来分析每个`loader`和`plugins`的速度
> 发现慢的使用多进程进行打包

### 使用`happypack`来加快`babel-loader`编译速度
1. 首先 安装 happypack  `npm i -D  happypack`
2. 改造`babel-loader`网上文章很多，就不细说了
3. 可以参考 [webpack优化之HappyPack 实战  ](https://www.jianshu.com/p/b9bf995f3712)
4. 要注意的是`happypack`对`url-loader`和`file-loader`支持度并不是很好，编译会报错，所以只用于`babel-loader`了

### 使用`happypack`的替代方案`thread-loader`来开启多线程
> 仅在耗时的loader中开启 因为开启它也需要时间 可用于多种耗时loader中 比happypack方便

### 使用`autodll-webpack-plugin`缓存一些不需要变动的依赖
> 可以参考这篇文章 [你真的需要 Webpack DllPlugin 吗？](https://www.cnblogs.com/skychx/p/webpack-dllplugin.html)

1. 使用`dll`缓存一些不变动的依赖，比如`vue`、`vuex`等
2. 要注意，有些包不用缓存。如按需加载的`lodash`，如果你缓存了，那就是整包缓存的，实际上我们不需要这样，按需加载的足够小，不需要缓存
3. `webpack3.x`版本的需要安装`autodll-webpack-plugin@0.3`
```js
// ···
plugins: [
    new AutoDllPlugin({
      inject: true,
      filename: "[name]-[hash].js",
      entry: {
        libs: ["axios", "echarts", "js-md5"],
        vendor: [
          "babel-polyfill",
          "vue",
          "vue-router",
          "vuex",
          "iview"
          // .... 更多插件
        ]
      }
    })
// ···
```
### 使用`HardSourceWebpackPlugin`进一步缓存
> 可以参考这篇文章 [你真的需要 Webpack DllPlugin 吗？](https://www.cnblogs.com/skychx/p/webpack-dllplugin.html)  提升模块转换阶段缓存

### 使用`html-webpack-plugin-for-multihtml`进一步缓存结果
```js
const HtmlWebpackPlugin = require("html-webpack-plugin-for-multihtml");

// ...
plugins: [
   new HtmlWebpackPlugin({
      filename: "index.html",
      template: "index.html",
      favicon: "src/assets/favicon3.ico",
      inject: true,
      multihtmlCache: true
    }),
]
// ...
```

### 引入`dynamic-import-node`
> 可以参考[解决 vue热加载编译速度慢问题](https://blog.csdn.net/weixin_42288182/article/details/114689305)
1. 有内容更改后，热更新编译速度又变成了`8s`，太惨了，引入这个插件能在产生变动的时候速度加快到`2s`左右

### `dev`环境关闭`gzip` 虽然包会变大 但是能提升点速度
> 开发环境看需求

### `dev`环境的`sourceMap`使用`cheap-module-eval-source-map`
> 开发环境建议直接关闭 可以参考这个文章[webpack之SourceMap](https://www.jianshu.com/p/f20d4ceb8827)

### 升级node版本！有奇效

### 其他优化
1. lodash按需加载
2. momentjs只引入本地语言的相关信息 
3. ……
