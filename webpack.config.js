/*
 * @Author: ChengZhuo
 * @Date: 2021-03-14 17:02:08
 * @LastEditors: ChengZhuo
 * @LastEditTime: 2021-03-14 21:37:44
 * @Description: file content
 */
const HtmlWebpackPliugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const {
  resolve
} = require("path");
const commonCssloader = [
  MiniCssExtractPlugin.loader, //将js中的css文件提取出来  并存放在指定文件夹
  "css-loader", //以commmon.js的形式加载到js中
  /*
    css兼容性处理 ：postcss -> postcss-loader postcss-preset-dev
    帮postcss找到browserslist找到package.json中的browserslist中的配置，通过配置加载指定的css兼容性样式
  */
  {
    loader: 'postcss-loader',
    options: {
      // ident: 'postcss',
      postcssOptions: {
        plugins: [
          ['postcss-preset-env']
        ] //postcss插件
      }
    }
  }
]

// process.env.NODE_ENV = 'development';


module.exports = {
  //入口文件
  entry: "./src/index.js",
  //输出
  output: {
    //__dirname  当前文件夹的绝对路径
    path: resolve(__dirname, "build"),
    filename: "js/chengzhuo.js"
  },
  //loader配置
  module: {
    rules: [
      {
        exclude: /\.(html|js|css|less|jpg|png|gif)$/,
        loader: 'file-loader',  //原封不动的输出文件
        options: {
          name: '[name].[hash:8].[ext]',
          outputPath: "media"
        }
      },
      {
        test: /\.css$/,
        use: [
          //从下到上  从右到到左  依次执行
          // "style-loader", //创建style标签 添加到head中
          ...commonCssloader
        ]
      },
      {
        test: /\.less$/,
        use: [  //多个loader use[]
          // "style-loader",
          ...commonCssloader,
          "less-loader" //将less编译成css
        ] 
      },
      {
        test: /\.(jpg|png|gif)$/,
        loader: "url-loader",  //url-loader file-loader
        options: {
          //图片大小小于8KB 就会被base64处理
          //优点：减少请求数量（减轻服务器压力）
          //图片体积会更大（文件请求更慢）
          limit: 8 * 1024,
          //问题 因为url-loader默认使用es6去解析，而html-loader引入图片是common.js解析
          name: '[name].[hash:8].[ext]', //图片命名  [hash:8]hash值的前8位  打包后会随机生成hash值命名   [ext]取图片原扩展名(png还是png)
          outputPath: "imgs",
          // esModule:false
        }
      },
      {
        test: /\.html$/,
        //处理html文件img图片(负责引入这个图片，从而能被url-loader处理)
        loader: 'html-loader',
      },
      /**
       * 正常来讲，一种文件只能被一个loader处理。
       * 当一个文件被多个loader处理，那么一定要指定loader的执行顺序
       *  先执行eslint 再执行babel
       */
      /*
        语法检查 eslint-loader eslint
            注意：只检查自己写的源代码。第三方库不检查
            设置检查规则
              package.json中的"eslintConfig"配置
              airbnb --> eslint-config-airbnb-base eslint-plugin-import eslint
      */
      {
        test:/\.js$/,
        exclude:/node_modules/,
         //优先执行
        enforce:'pre',
        loader:'eslint-loader',
        options:{
          //自动修复eslint错误
          fix:true
        }
      },
      {
        /*
          js兼容性处理 babe-loader  @babel/preset-env
            1.基本的js兼容性处理  --> @babel/preset-env
              问题：只能转换基本语法，如Promise不能转换
            2.全部js的兼容性处理  -->@babel/polyfill;
              问题：我只要解决部分兼容性处理，但是将所有的兼容性代码引入，体积太大！
            3.需要做兼容性处理的就做：按需加载  -->corejs
        */
       test:/\.js$/,
       exclude:/node_modules/,
       loader:'babel-loader',
       options:{
         //预设  指示babel会进行怎样的兼容性处理
         presets:[
           [
            '@babel/preset-env',
            {
              //按需加载  
              useBuiltIns:'usage',
              //指定core-js的版本
              corejs:{
                version:3
              },
              //指定兼容性做到哪个版本的兼容性
              targets:{
                ie:'9'
              }
            }
           ]
         ]
       }
      }
    ]
  },
  // plugins的配置
  plugins: [
    //https://github.com/jantimon/html-webpack-plugin#minification  HtmlWebpackPliugin配置详解
    new HtmlWebpackPliugin({
      title: "chengzhuo app",
      template: resolve(__dirname, "src/index.html"),
      minify:{
        collapseWhitespace:true, //移除空格
        removeComments:true //移除注释
      }
    }),
    new MiniCssExtractPlugin({
      filename: 'css/chengzhuo.css'
    }),
    //压缩css 代码压缩
    new OptimizeCssAssetsWebpackPlugin()
  ],
  //模式
  mode:"production",  //生产环境会自动压缩js代码
  // mode: "development",
  //开发服务器devServer 用来自动化（自动编译，自动刷新浏览器，自动打开浏览器）
  //只在内存中编译打包不会有任何输出
  //启动devServer指令为webpack-dev-server
  devServer: {
    contentBase: resolve(__dirname, 'build'),
    compress: true,  //启动gzip压缩
    port: 3000,
    open: true //自动打开浏览器
  }
}