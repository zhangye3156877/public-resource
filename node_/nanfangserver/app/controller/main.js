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
        oxygenMaterialRatio: 12.32,
        totalConsumedAmount:12.32,
        totalLeftOver:12.32,
        best_y: 12.32
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
    const data = {
      list: [
        {
          name: "水星轮",
          number: 10001,
          inventoryBalance: 999,
          calculatePercentage: 99,
          adjustPercentage: 11
        },
        {
          name: "莱科塔",
          number: 10002,
          inventoryBalance: 999,
          calculatePercentage: 99
        }
      ],
      calculateParameter: {
        oxygenMaterialRatio: 12.32,
        totalConsumedAmount:1,
        totalLeftOver:1,
        best_y: 1
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
        {
          index: 0,
          required: true,
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
          ProductionTime: 1000,
          formula: '1'
        },
        {
          index: 0,
          required: false,
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
          ProductionTime: 1000,
          formula: '1'
        },
        {
          index: 2,
          required: true,
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
          ProductionTime: 1000,
          formula: '1'
        },
        {
          index: 3,
          required: false,
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
          ProductionTime: 1000,
          formula: '1'
        },
        {
          index: 4,
          required: false,
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
          ProductionTime: 1000,
          formula: '1'
        },
      ],
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
      calculateParameter: {
        oxygenMaterialRatio: 199,
        totalOre: 11,
        paFlow: 22,
        SCuRatio: 33,
        totalMatte: 44,
        totalSlag: 55,
        totalQuartz: 66
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
}

module.exports = MainController;