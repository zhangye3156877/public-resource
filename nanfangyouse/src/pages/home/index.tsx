import React from 'react';
import {Button} from 'antd';
import router from 'umi/router';

const inputs = {
  "list": [
    {
      "name": "水星轮",
      "number": 10001,
      "elements":[
        {
          "name": 'Cu',
          "percentage": 24.78
        },
        {
          "name": 'Fe',
          "percentage": 25.78
        }
      ],
      "inventory": 10352,
      "required": false,
      "calculatePercentage": null
    },
    {
      "name": "莱科塔",
      "number": 10002,
      "elements":[
        {
          "name": "Cu",
          "percentage": 24.01
        },
        {
          "name": "Fe",
          "percentage": 31.02
        }
      ],
      "inventory": 5686,
      "required": true,
      "calculatePercentage": 51.23
    }
  ],
  "presetParameter": {
    "MatteTargetGradePercentage": 16.54,
    "ModelFactorPercentage": 14.44
  },
  "manuallyParameter":{
    "rawCoalPercentage": 12.36,
    "coldBurdenPercentage": 75.66
  },
  "elementsTargetList": [
    {
      "name": "Cu",
      "percentage": 33.63,
      "priority": 1
    },
    {
      "name": "Fe",
      "percentage": 33.63,
      "priority": 2
    },
    {
      "name": "S",
      "percentage": 33.63,
      "priority": 3
    }
  ]
}

const outputs = {
  "list": [
    {
      "name": "水星轮",
      "number": 10001,
      "inventoryBalance": 1346,
      "calculatePercentage": 31.23
    },
    {
      "name": "莱科塔",
      "number": 10002,
      "inventoryBalance": 5686,
      "calculatePercentage": 51.23
    }
  ],
  "calculateParameter":{
    "oxygenPercentage": 12.32,
    "SCuPercentage": 56.56,
    "paFlow": 200
  },
  "feedMixture": [
    {
      "name": "Cu",
      "percentage": 24.01
    },
    {
      "name": "Fe",
      "percentage": 31.02
    }
  ]
}

export default function(){
  return(
    <div>
      <p>p1页面</p>
       <Button type="danger" onClick={() => {router.push('/')}}>
            回首页
        </Button>
    </div>
  )
}