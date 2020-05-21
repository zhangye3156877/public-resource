const Controller = require('egg').Controller;

class MainController extends Controller {
  async calculate() {
    const { ctx } = this;
    const data = {
      list: [
        {
          name: "水星轮",
          number: 10001,
          inventoryBalance: 1346,
          calculatePercentage: 31.23
        },
        {
          name: "莱科塔",
          number: 10002,
          inventoryBalance: 5686,
          calculatePercentage: 51.23
        }
      ],
      calculateParameter: {
        oxygenMaterialRatio: 12.32,
      },
      elementsMixtureList: [
        {
          name: "Cu",
          percentage: 24.01
        },
        {
          name: "Fe",
          percentage: 31.02
        }
      ]
    }
    console.log(ctx.request.body)
    ctx.body = JSON.stringify(data);
  }
}

module.exports = MainController;