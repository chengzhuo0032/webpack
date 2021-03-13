const HtmlWebpackPliugin = require("html-webpack-plugin");
const {
    resolve
} = require("path");

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
                exclude:/\.(html|js|css|less|jpg|png|gif)$/,
                loader:'file-loader',
                options:{
                    name:'[name].[hash:8].[ext]',
                    outputPath:"media"
                }
            },
            {
                test: /\.css$/,
                use: [
                    //从下到上  从右到到左  依次执行
                    "style-loader", //创建style标签 添加到head中
                    "css-loader" //以commmon.js的形式加载到js中 
                ]
            },
            {
                test: /\.less$/,
                use: [  //多个loader use[]
                    "style-loader",
                    "css-loader",
                    "less-loader" //将less编译成css
                ]
            },
            {
                test:/\.(jpg|png|gif)$/,
                loader:"url-loader",  //url-loader file-loader
                options:{
                    //图片大小小于8KB 就会被base64处理
                    //优点：减少请求数量（减轻服务器压力）
                    //图片体积会更大（文件请求更慢）
                    limit:8 *1024,
                    //问题 因为url-loader默认使用es6去解析，而html-loader引入图片是common.js解析
                    name:'[name].[hash:8].[ext]', //图片命名  [hash:8]hash值的前8位  打包后会随机生成hash值命名   [ext]取图片原扩展名(png还是png)
                    outputPath:"imgs"
                }
            },
            {
                test:/\.html$/,
                //处理html文件img图片(负责引入这个图片，从而能被url-loader处理)
                loader:'html-loader',
            }
        ]
    },
    // plugins的配置
    plugins: [
        new HtmlWebpackPliugin({
            title: "chengzhuo app",
            template: resolve(__dirname, "src/index.html")
        })
    ],
    //模式
    // mode:"production"
    mode: "development",

    //开发服务器devServer 用来自动化（自动编译，自动刷新浏览器，自动打开浏览器）
    //只在内存中编译打包不会有任何输出
    //启动devServer指令为webpack-dev-server
    devServer:{
        contentBase:resolve(__dirname,'build'),
        compress:true,  //启动gzip压缩
        port:3000,
        open:true //自动打开浏览器
    }
}