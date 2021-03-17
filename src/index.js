// 入口文件

/*
    1.运行指令
        开发环境：webpack ./src/index.js -o ./build/built.js --mode=development
        生产环境：webpack ./src/index.js -o ./build/built.js --mode=production

        //webpack能处理 js/json
        //ES6模块化处理浏览器能处理的资源
*/
import './fontIcon/iconfont.css';
import './index.css';
import './index.less';

const add = (x, y) => x + y;
// eslint-disable-next-line
console.log(add(2, 3));
