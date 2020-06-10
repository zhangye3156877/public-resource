'use strict';

const Controller = require('egg').Controller;

class TestController extends Controller {
  async testFn() {

    const { ctx } = this;
    // console.log(ctx.request.body)
    let file = ctx.request.files[0] // file包含了文件名，文件类型，大小，路径等信息，可以自己打印下看看

    // 读取文件
    //let file = fs.readFileSync(file.filepath) //files[0]表示获取第一个文件，若前端上传多个文件则可以遍历这个数组对象
    console.log(file)
    
    ctx.body = JSON.stringify({message: 'ok'})
  }
}

module.exports = TestController;
