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
          calculatePercentage: 31.23,
          adjustPercentage: 11,
          productionTime: 1000,
        },
        {
          name: "莱科塔",
          number: 10002,
          inventoryBalance: 5686,
          calculatePercentage: 51.23,
          productionTime: 1000,
        }
      ],
      calculateParameter: {
        oxygenMaterialRatio: 12.32,
        totalConsumedAmount:12.32,
        totalLeftOver:12.32,
        best_y: 12.32,
        paFlow: 11,
        SCuRatio: 10,
        totalMatte: 10,
        totalSlag: 10,
        totalQuartz: 10
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
  async quickupdate() {
    const { ctx } = this;
    const {list} = ctx.request.body;
    const list_ = list.map((item) => {
      return {
        ...item,
        inventoryBalance: 999,
        calculatePercentage: 99
      }
    })
    const data = {
      list: list_,
      calculateParameter: {
        oxygenMaterialRatio: 12.32,
        totalConsumedAmount:1,
        totalLeftOver:1,
        best_y: 1,
        paFlow: 11,
        SCuRatio: 99,
        totalMatte: 99,
        totalSlag: 99,
        totalQuartz: 99
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
    ctx.body = JSON.stringify(data);
  }

  async getInventory() {
    const { ctx } = this;
    const data = {
      list: [
        {
          index: 0,
          required: true,
          delete: false,
          clean: true,
          name: '水星轮',
          number: 10001,
          Cu: 1,
          Fe: 2,
          S: 3,
          SiO2: 4,
          CaO: 5,
          As: 6,
          Zn: 7,
          Pb: 8,
          MgO: 9,
          Al2O3: 10,
          H2O: 11,
          inventory: 12,
          calculatePercentage: '',
          inventoryBalance: ''
        },
        {
          index: 0,
          required: false,
          delete: false,
          clean: false,
          name: '莱科塔',
          number: 10002,
          Cu: 13,
          Fe: 14,
          S: 15,
          SiO2: 15,
          CaO: 15,
          As: 15,
          Zn: 15,
          Pb: 15,
          MgO: 15,
          Al2O3: 15,
          H2O: 15,
          inventory: 1000,
          calculatePercentage: '',
          inventoryBalance: ''
        },
        {
          index: 2,
          required: true,
          delete: false,
          clean: false,
          name: '和盛',
          number: 10003,
          Cu: 16,
          Fe: 16,
          S: 16,
          SiO2: 16,
          CaO: 16,
          As: 16,
          Zn: 16,
          Pb: 16,
          MgO: 16,
          Al2O3: 16,
          H2O: 16,
          inventory: 16,
          calculatePercentage: '',
          inventoryBalance: ''
        },
        {
          index: 3,
          required: false,
          delete: false,
          clean: false,
          name: '方舟21',
          number: 10004,
          Cu: 20,
          Fe: 20,
          S: 20,
          SiO2: 20,
          CaO: 20,
          As: 20,
          Zn: 20,
          Pb: 20,
          MgO: 20,
          Al2O3: 20,
          H2O: 20,
          inventory: 20,
          calculatePercentage: '',
          inventoryBalance: ''
        },
        {
          index: 4,
          required: false,
          delete: false,
          clean: false,
          name: '江门商人',
          number: 10005,
          Cu: 30,
          Fe: 30,
          S: 30,
          SiO2: 30,
          CaO: 30,
          As: 30,
          Zn: 30,
          Pb: 30,
          MgO: 30,
          Al2O3: 30,
          H2O: 30,
          Sb:30,
          Bi:30,
          Ni:30,
          Ag:30,
          Au:30,
          inventory: 30,
          calculatePercentage: '',
          inventoryBalance: ''
        },
      ],
      materialList: [
        {
          name: "Cu",
          percentage: 24.01
        },
        {
          name: "Fe",
          percentage: 31.02
        },
        {
          name: "Ni",
          percentage: 31.02
        },
        {
          name: "Au",
          percentage: 31.02
        }
      ]
    }
    ctx.body = JSON.stringify(data);
  }

  async getFormula() {
    const { ctx } = this;
    const data = {
      list: [
       [
        {
          cohesion: true,
          name: '水星轮',
          number: 10001,
          Cu: 1,
          Fe: 2,
          S: 3,
          SiO2: 4,
          CaO: 5,
          As: 6,
          Zn: 7,
          Pb: 8,
          MgO: 9,
          Al2O3: 10,
          H2O: 11,
          inventory: 12,
          calculatePercentage: '',
          inventoryBalance: '',
          productionTime: 1000,
          formula: '1'
        },
        {
          cohesion: false,
          name: '莱科塔',
          number: 10002,
          Cu: 13,
          Fe: 14,
          S: 15,
          SiO2: 15,
          CaO: 15,
          As: 15,
          Zn: 15,
          Pb: 15,
          MgO: 15,
          Al2O3: 15,
          H2O: 15,
          inventory: 1000,
          calculatePercentage: '',
          inventoryBalance: '',
          productionTime: 1000,
          formula: '1'
        },
        {
          cohesion: true,
          name: '和盛',
          number: 10003,
          Cu: 16,
          Fe: 16,
          S: 16,
          SiO2: 16,
          CaO: 16,
          As: 16,
          Zn: 16,
          Pb: 16,
          MgO: 16,
          Al2O3: 16,
          H2O: 16,
          inventory: 16,
          calculatePercentage: '',
          inventoryBalance: '',
          productionTime: 1000,
          formula: '1'
        },
        {
          cohesion: false,
          name: '方舟21',
          number: 10004,
          Cu: 20,
          Fe: 20,
          S: 20,
          SiO2: 20,
          CaO: 20,
          As: 20,
          Zn: 20,
          Pb: 20,
          MgO: 20,
          Al2O3: 20,
          H2O: 20,
          inventory: 20,
          calculatePercentage: '',
          inventoryBalance: '',
          productionTime: 1000,
          formula: '2'
        },
        {
          cohesion: false,
          name: '江门商人',
          number: 10005,
          Cu: 30,
          Fe: 30,
          S: 30,
          SiO2: 30,
          CaO: 30,
          As: 30,
          Zn: 30,
          Pb: 30,
          MgO: 30,
          Al2O3: 30,
          H2O: 30,
          Sb:30,
          Bi:30,
          Ni:30,
          Ag:30,
          Au:30,
          inventory: 30,
          calculatePercentage: '',
          inventoryBalance: '',
          productionTime: 1000,
          formula: '1'
        },
        {
          cohesion: false,
          name: '江门商人',
          number: 10006,
          Cu: 30,
          Fe: 30,
          S: 30,
          SiO2: 30,
          CaO: 30,
          As: 30,
          Zn: 30,
          Pb: 30,
          MgO: 30,
          Al2O3: 30,
          H2O: 30,
          Sb:30,
          Bi:30,
          Ni:30,
          Ag:30,
          Au:30,
          inventory: 30,
          calculatePercentage: '',
          inventoryBalance: '',
          productionTime: 1000,
          formula: '2'
        },
       ],
       [
        {
          delete: false,
          name: '表2项目1',
          number: 10007,
          Cu: 20,
          Fe: 20,
          S: 20,
          SiO2: 20,
          CaO: 20,
          As: 20,
          Zn: 20,
          Pb: 20,
          MgO: 20,
          Al2O3: 20,
          H2O: 20,
          inventory: 20,
          calculatePercentage: '',
          inventoryBalance: 111,
          productionTime: 1000,
          formula: '2'
        },
        {
          delete: false,
          name: '表2项目2',
          number: 10008,
          Cu: 30,
          Fe: 30,
          S: 30,
          SiO2: 30,
          CaO: 30,
          As: 30,
          Zn: 30,
          Pb: 30,
          MgO: 30,
          Al2O3: 30,
          H2O: 30,
          Sb:30,
          Bi:30,
          Ni:30,
          Ag:30,
          Au:30,
          inventory: 30,
          calculatePercentage: '',
          inventoryBalance: 222,
          productionTime: 1000,
          formula: '1'
        },
        {
          delete: false,
          name: '表2项目3',
          number: 10009,
          Cu: 30,
          Fe: 30,
          S: 30,
          SiO2: 30,
          CaO: 30,
          As: 30,
          Zn: 30,
          Pb: 30,
          MgO: 30,
          Al2O3: 30,
          H2O: 30,
          Sb:30,
          Bi:30,
          Ni:30,
          Ag:30,
          Au:30,
          inventory: 30,
          calculatePercentage: '',
          inventoryBalance: '',
          productionTime: 1000,
          formula: '2'
        },
       ]
      ],
      oxygenMaterialRatio: {
        formula1: '配方1',
        formula2: '配方2',
        'formula*': '配方3'
      },
      materialList: [
        {
          formula: '1',
          elementsList:[
            {
              name: "Cu",
              percentage: 24.01
            },
            {
              name: "Fe",
              percentage: 31.02
            },
            {
              name: "Ni",
              percentage: 31.02
            },
            {
              name: "Au",
              percentage: 31.02
            }
          ]
        },
        {
          formula: '2',
          elementsList:[
            {
              name: "Cu",
              percentage: 24.01
            },
            {
              name: "Fe",
              percentage: 31.02
            },
            {
              name: "Ni",
              percentage: 31.02
            },
            {
              name: "Au",
              percentage: 31.02
            }
          ]
        }
      ]
    }
    ctx.body = JSON.stringify(data);
  }
  async quickAdjust() {
    const {ctx} = this;
    const data = {
      list: [
        {
          name: "水星轮",
          number: 10001,
          Cu:9,
          inventoryBalance: 1346,
          calculatePercentage: 31.23,
          adjustPercentage: 11,
          productionTime: 1000,
          adjustRatio: 11
        },
        {
          name: "莱科塔",
          number: 10002,
          Fe: 8,
          inventoryBalance: 5686,
          calculatePercentage: 51.23,
          productionTime: 1001,
          adjustRatio: '12'
        }
      ],
      calculateParameter: {
        oxygenMaterialRatio: 199,
        totalConsumedAmount: 11,
        paFlow: 22,
        SCuRatio: 33,
        totalMatte: 44,
        totalSlag: 55,
        totalQuartz: 66,
        totalLeftOver: 900
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
      ],
      recommended: '推荐的结果 \n 推荐的结果 \n 推荐的结果 \n 推荐的结果 \n'
    }
    ctx.body = JSON.stringify(data);
  }
  async quickupdate2() {
    const {ctx} = this;
    const data = {
      list: [
        {
          name: "水星轮",
          number: 10001,
          inventoryBalance: 1346,
          calculatePercentage: 31.23,
          adjustPercentage: 11
        },
        {
          name: "莱科塔",
          number: 10002,
          inventoryBalance: 5686,
          calculatePercentage: 51.23
        }
      ],
      calculateParameter: {
        oxygenMaterialRatio: 999,
        totalConsumedAmount: 999,
        paFlow: 999,
        SCuRatio: 999,
        totalMatte: 999,
        totalSlag: 999,
        totalQuartz: 999
      },
      elementsMixtureList: [
        {
          name: "Cu",
          percentage: 99
        },
        {
          name: "Fe",
          percentage: 99
        }
      ],
      recommended: '推荐的结果更新'
    }
    ctx.body = JSON.stringify(data);
  }
}

module.exports = MainController;