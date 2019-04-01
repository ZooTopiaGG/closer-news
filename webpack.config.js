const webpack = require('webpack');
const path = require('path');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const CleanWebpackPlugin = require('clean-webpack-plugin');

const NODE_ENV = process.env.NODE_ENV;

const dllModules = [
  'react',
  'prop-types',
  'react-addons-css-transition-group',
  'jquery',
  'lodash',
  'redux',
  'react-redux',
  'react-dom',
  'redux-thunk',
  'immutable',
  'redux-immutable',
  'rc-queue-anim'
  ];

let entry = {
    bundle: './src/index.js'
  },
  output = {
    path: path.resolve(__dirname, 'public'),
    filename: 'resource/js/bundle.js'
  },
  modules = {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['react','es2015'],
          cacheDirectory: true
        }
      }, {
        test: /\.(css|scss)$/,
        use: ExtractTextWebpackPlugin.extract({
          publicPath: '../../',
          use: ['css-loader?minimize','sass-loader'],
          fallback: 'style-loader'
        })
      },{
        // 图片文件，生产环境使用url-loader，将小于10k的图片base64，并且名称hash化
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        query: {
          // publicPath: './',
          outputPath: 'resource/img/',
          name: '[name].[ext]'
        }
      }, {
        test: /\.json$/,
        use: 'json-loader'
      }
    ]
  },
  plugins = [
    // 项目中默认引用模块，免去手动require
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      _: 'lodash'
    }),
    
    // 单独打包css文件
    new ExtractTextWebpackPlugin({
      filename: 'resource/css/index.css',
      allChunks: true
    }),

    // 主html文件模板
    new HtmlWebpackPlugin({
      title: '',
      // 生成目标文件时加上hash值，防止缓存
      hash: true,
      // 传入自定义参数dll，值为dev环境下dll打包的公用模块，生成环境不单独打包第三方库
      dll: `<script type="text/javascript" src="resource/js/dll.js"></script>`,
      // html主文件打包到跟目录，方便在客户端中调试
      filename: 'sidenews.html',
      // html主模板文件
      template: './src/index.html'
    })
  ];
  
if (NODE_ENV == 'dll') {
  entry = {
    dll: dllModules
  };
  output.filename = 'resource/js/[name].js';
  output.library = '[name]'; // 当前Dll的所有内容都会存放在这个参数指定变量名的一个全局变量下，注意与DllPlugin的name参数保持一致
  plugins.push(
    ...[
      // 环境变量
      new webpack.DefinePlugin({
        process: {
          env: {
            NODE_ENV: JSON.stringify('production')
          }
        }
      }),
      new webpack.DllPlugin({
        // 本Dll文件中各模块的索引，供DllReferencePlugin读取使用
        path: 'manifest.json', 
        // 当前Dll的所有内容都会存放在这个参数指定变量名的一个全局变量下，注意与参数output.library保持一致
        name: '[name]', 
        // 指定一个路径作为上下文环境，需要与DllReferencePlugin的context参数保持一致，建议统一设置为项目根目录
        // context: pathParams.root, 
      }),
      // js压缩，生产环境进行代码压缩
      new webpack.optimize.UglifyJsPlugin()
    ]
  )
} else {
  let _plugins = [
      // 打包前清除上次打包文件
      // new CleanWebpackPlugin('public'),
      // 环境变量
      new webpack.DefinePlugin({
        process: {
          env: {
            NODE_ENV: JSON.stringify(NODE_ENV)
          }
        }
      }),
      // 根据manifest.json中的配置取到相应的第三方库
      new webpack.DllReferencePlugin({
        // context: pathParams.root, // 指定一个路径作为上下文环境，需要与DllPlugin的context参数保持一致，建议统一设置为项目根目录
        manifest: require('./manifest.json'), // 指定manifest.json
        // name: 'dll',  // 当前Dll的所有内容都会存放在这个参数指定变量名的一个全局变量下，注意与DllPlugin的name参数保持一致
      })
    ];
  NODE_ENV == 'production' && _plugins.push(new webpack.optimize.UglifyJsPlugin());
  plugins = plugins.concat(_plugins);
}
module.exports = {
  entry,
  output,
  module: modules,
  plugins
};