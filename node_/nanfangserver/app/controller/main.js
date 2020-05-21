const Controller = require('egg').Controller;

class MainController extends Controller {
  async calculate() {
    const { ctx } = this;
    const data = {info :1234}

    ctx.body = JSON.stringify(data);
  }
}

module.exports = MainController;