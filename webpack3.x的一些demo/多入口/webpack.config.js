const webpack = require('webpack');
const path = require('path');

// 匹配文件
const glob = require('glob')

// 自动安装比如JS中的require import的未安装的依赖
const NpmInstallPlugin = require('npm-install-webpack-plugin');

// 提取css文件
const ExtractTextPlugin = require("extract-text-webpack-plugin");

// 清空打包后的目录
const CleanWebpackPlugin = require('clean-webpack-plugin');

//生成HTML模板 
const HtmlWebpackPlugin = require('html-webpack-plugin')

// webpack服务
const wepackDevServer = require('webpack-dev-server')

// 提取json
var GenerateAssetPlugin = require('generate-asset-webpack-plugin');

// 压缩混淆js
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

// 动态获取所有入口文件
const getEntries = () => {
	let obj = {};
	glob.sync(path.join(__dirname, './pages/*'), {}).forEach(item => {
		obj[`${item.split('/').pop()}`] = `${item}/index.js`
	})
	return obj
}


const webConfig = module.exports = {
//	entry: {
//		app: './pages/test/index.js',
//		// 应用程序开始执行
//	},
	entry: getEntries(),
	devtool: 'inline-source-map',

	output: {
		filename: './[name]/[name].[hash:5].js', // 文件名称
		path: path.resolve(__dirname, 'dist'), // 打包后文件输出的目录
		publicPath: '../', //指定资源文件引用的目录	 当前打包的文件夹
	},
	devServer: {
		// 告诉服务器从哪里提供内容
		contentBase: path.resolve(__dirname, 'static'),
		// 是否压缩
		compress: true,
		publicPath: '/',
		// 指定端口号
		port: 9000	
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: ['babel-loader']
			},
			{
				test: /\.(css|sass|less|scss)$/,
				exclude: /node_modules/,
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader', // 当css没有被提取的loader
					use: [
						{
							loader: 'css-loader',
							options: {
								 minimize: true //css压缩
							}
						},
						{
							loader: 'postcss-loader', // 浏览器兼容等
							options: {
								 minimize: true //css压缩
							}
						}
					]
				})
			},
			{
		        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
		        exclude: /node_modules/,
		        loader: 'url-loader',
		        options: {
		          	limit: 8192,
		          	name: '[name].[hash:5].[ext]',
		          	outputPath: './static/images/'
		        }
		    },
		    {
		        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
		        exclude: /node_modules/,
		        loader: 'url-loader',
		        options: {
		          	limit: 8192,
		          	name: '[name].[hash:5].[ext]',
		          	outputPath: './static/fonts/'
		          	// outputPath: './xy/fonts/'
		          	// outputPath: './test/fonts/'
		        }
		    },
		    {
		    	test: /\.html$/,
		    	exclude: /node_modules/,
		    	use: [{
		    		loader: 'html-loader',
		    		options: {
		    			minmize: true
		    		}
		    	}]
		    },
		    {
		    	test: /\.json$/,
		    	exclude: /node_modules/,
		    	loader: 'file-loader',
		    	options: {
		    		limit: 0,
		    		name: '[name].[hash:5].[ext]',
		    		outputPath: './static/json/',
		    	}
		    }

		]
	},
	plugins: [
		// 启用HMR  webpack的热加载
		new webpack.HotModuleReplacementPlugin(),
		/*
		 * 生成带有hash的css js引用的html文件实例
		 * filename 指定要生成的html文件
		 * template 生成的html模板  可以指定你的原始html文件当做模板
		 * chunks 指定需要的快  比如下面的test就需要test里面的css、js啥的，就可以直接给个['test']就可以了
		 * */
		
//		new HtmlWebpackPlugin({
//			filename: './test/index.html',
//			template: './pages/test/index.html',
//			chunks: ['test']
//		}),
//		
//		new HtmlWebpackPlugin({
//			filename: './xy/index.html',
//			template: './pages/xy/crm/index.html',
//			chunks: ['xy']
//		}),
		
		// 自动安装依赖
		//  new NpmInstallPlugin(),
		
		// 清空dist目录实例
		new CleanWebpackPlugin(['dist']),
		
		// 提取并生成css实例  控制css的输出在这里
		new ExtractTextPlugin('./[name]/[name].[hash:5].css'),
		
		new UglifyJSPlugin()
	]
}

	// 引入多入口的目录
	const pageArr = require('./pageArr.config.js')

	pageArr.forEach((page) => {
	  const htmlPlugin = new HtmlWebpackPlugin({
	    filename: `./${page}/index.html`, // 根目录是dist
	    template:  `./pages/${page}/index.html`, // 根目录就是当前根目录
	    chunks: [page],
//	    title: ,
//	    hash: true, // 为静态资源生成hash值
//	    minify: true,
//	    xhtml: true,
//	    showErrors: true
	  });
	  webConfig.plugins.push(htmlPlugin);
	});
	


