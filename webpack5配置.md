const HtmlWebpackPlugin = require('html-webpack-plugin'); // 通过 npm 安装
const webpack = require('webpack'); // 访问内置的插件
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const resolve = function (dir) {
  return path.join(__dirname, dir);
};
const APP_PATH = './src/app';

const config = {
  // 构建目标 默认是node  要改成web 热更新才有用
  // 而且target影响着输出代码的语法格式 如果项目里有browerslistrc 建议使用这个
  // target: 'browserslist',
  entry: {
    // 老版本
    render: `${APP_PATH}/main/index.js`,
    // v2.7.0演示版本入口
    demonstration: `${APP_PATH}/demonstration/index.js`,
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    scriptType: 'text/javascript',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: ['babel-loader'],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
            },
          },
        ],
      },
      {
        test: /\.scss$/,
        use: [
          // 将 JS 字符串生成为 style 节点
          {
            loader: 'style-loader',
          },
          // 将 CSS 转化成 CommonJS 模块
          {
            loader: 'css-loader',
          },
          'postcss-loader',
          // 将 Sass 编译成 CSS
          {
            loader: 'sass-loader',
          },
        ],
      },
    ],
  },
  resolve: {
    alias: {
      '@': resolve('src'),
      '@js': resolve('src/js'),
      '@scss': resolve('src/scss'),
    },
  },
  plugins: [
    new webpack.ProgressPlugin(),
    new CleanWebpackPlugin(),
    new ESLintPlugin({ fix: true }),
    // 入口1
    new HtmlWebpackPlugin({
      template: `${APP_PATH}/main/index.html`,
      filename: 'index.html',
      chunks: ['render'],
      scriptLoading: 'blocking',
      inject: 'head',
    }),
    // 入口2
    new HtmlWebpackPlugin({
      template: `${APP_PATH}/demonstration/index.html`,
      filename: 'demonstration.html',
      chunks: ['demonstration'],
      scriptLoading: 'blocking',
      inject: 'head',
    }),
  ],
  devServer: {
    host: '0.0.0.0',
    contentBase: path.join(__dirname, 'public'), // boolean | string | array, static file location
    hot: true, // hot module replacement. Depends on HotModuleReplacementPlugin
    noInfo: true, // only errors & warns on hot reload
    open: true,
    openPage: 'index.html',
    compress: true,
    overlay: true,
    inline: true,
    // ...
  },
};

module.exports = (env, argv) => {
  if (argv.mode === 'development') {
    config.devtool = 'source-map';
    config.target = 'web';
  }
  if (argv.mode === 'production') {
    //...
    config.optimization = {
      minimize: true,
      minimizer: [new TerserPlugin()],
    };
    config.target = 'browserslist';
  }
  return config;
};
