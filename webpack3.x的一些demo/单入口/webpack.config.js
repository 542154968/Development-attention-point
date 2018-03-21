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
// 压缩JS
const uglify = require('uglifyjs-webpack-plugin');

// 提取公共JS
const CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");
  

module.exports = {
	entry: {
		app: './index.js'
		// jQuery: ['./dist/js/jquery.min.js']
		// 应用程序开始执行
	},
	devtool: 'inline-source-map',
	output: {
		filename: './js/[name].[hash:5].js', // 文件名称
		path: path.resolve(__dirname, 'pack'), // 打包后文件输出的目录
		publicPath: '' //指定资源文件引用的目录  这个目录对应着上面的pack 那个目录
	},
	devServer: {
		// 告诉服务器从哪里提供内容
		contentBase: path.join(__dirname, 'dist'),
		// 是否压缩
		compress: true,
		publicPath: '',
		// 指定端口号
		port: 9000,
		hot: true
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: [ 'babel-loader']
			},
			{
				test: /\.styl$/,
				exclude: /node_modules/,
				use: 
				
					[
						'style-loader',
						'css-loader',
						'stylus-loader'
					]
				
					// [
					// 		{ 
					// 			loader:'css-loader',
					// 			options: {
					// 				sourceMap: true
					// 			}
					// 		},
					// 		{
					// 			loader: 'postcss-loader',
					// 			options: {           // 如果没有options这个选项将会报错 No PostCSS Config found
					// 				plugins: (loader) => [
					// 					require('autoprefixer')(), //CSS浏览器兼容
					// 				],
					// 				sourceMap: true
					// 			}
					// 		},
					// 		{ 
					// 			loader:'stylus-loader',
					// 			options: {
					// 				sourceMap: true,
					// 				// preferPathResolver: 'webpack'
					// 				// use: [stylus_plugin()]
					// 			}
					// 		}
					// 	]


				// 提取出来的配置				
				// ExtractTextPlugin.extract({
				// 		fallback: 'style-loader',
				// 		use: [
				// 			{ 
				// 				loader:'css-loader',
				// 				options: {
				// 					sourceMap: true
				// 				}
				// 			},
				// 			{
				// 				loader: 'postcss-loader',
				// 				options: {           // 如果没有options这个选项将会报错 No PostCSS Config found
				// 					plugins: (loader) => [
				// 						require('autoprefixer')(), //CSS浏览器兼容
				// 					],
				// 					sourceMap: true
				// 				}
				// 			},
				// 			{ 
				// 				loader:'stylus-loader',
				// 				options: {
				// 					sourceMap: true,
				// 					preferPathResolver: 'webpack'
				// 					// use: [stylus_plugin()]
				// 				}
				// 			}
				// 		]
				//   	})
				
				
				// [
				// 			'style-loader',
				// 			'css-loader',
				// 			'stylus-loader'
				// 	]
			},
			// {
			// 	test: /\.(css)$/,
			// 	exclude: /node_modules/,
			// 	use: ExtractTextPlugin.extract({
			// 		fallback: 'style-loader',
			// 		use: [
			// 			{
			// 				loader: 'css-loader',
			// 				options: {
			// 					minimize: true,
			// 					alias: {
			// 						'./dist/images/': '../images/'
			// 					}
			// 				}
			// 			},
			// 			{
			// 				loader: 'postcss-loader',
			// 				options: {           // 如果没有options这个选项将会报错 No PostCSS Config found
			// 					plugins: (loader) => [
			// 						require('autoprefixer')(), //CSS浏览器兼容
			// 					]
			// 				}
			// 			}
			// 		]
			// 	})
			// },
			{
		        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
		        exclude: /node_modules|dist\/css/,
		        loader: 'url-loader',
		        options: {
		          	limit: 10000,
					name: '[name].[hash:5].[ext]',
		          	outputPath: './images/'  // './images/'
		        }
		    },
		    {
		    	test: /\.html$/,
		    	exclude: /node_modules/,
		    	use: [
					// {
                    //     loader: "file-loader",
                    //     options: {
                    //         name: "./css/[name]-.[ext]",
                    //     },
                    // },
                    // {
                    //     loader: "extract-loader",
                    // },
					'html-loader'
				]
		    }
		]
	},
	plugins: [
		// 压缩JS
		// new uglify(),
		// 启用HMR  webpack的热加载
		new webpack.HotModuleReplacementPlugin(),
		/*
		 * 生成带有hash的css js引用的html文件实例
		 * filename 指定要生成的html文件
		 * template 生成的html模板  可以指定你的原始html文件当做模板
		 * chunks 指定需要的快  比如下面的test就需要test里面的css、js啥的，就可以直接给个['test']就可以了
		 * */
		
		new HtmlWebpackPlugin({
			filename: './index.html',
			template: './index.html',
			chunks: ['jQuery', 'app'] // 可以配置公共JS的chunks
		}),
		// 清空dist目录实例
		new CleanWebpackPlugin(['pack']),
		// 提取并生成css实例  控制css的输出在这里
		new ExtractTextPlugin('./[name].[hash:5].css'),
		// new CommonsChunkPlugin({
        //     name: ["jQuery"],//页面上使用的时候Jquery
        //     //必须最先加载
        //     // filename:"chunk.js"//忽略则以name为输出文件的名字，
		// 		//否则以此为输出文件名字	
        //     minChunks: 2
		// })
	]
}


