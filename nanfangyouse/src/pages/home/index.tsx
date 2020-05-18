import React from 'react';
import {Button} from 'antd';
import router from 'umi/router';

const json = {
  list: [
    {
      name: 'shuixinglun',
      number: 10001,
      elements:[
        {
          name: 'Cu',
          share: 24.78
        },
        {
          name: 'Fe',
          share: 25.78
        }
      ],
      inventory: 10352,
      required: false,
      calculate: null
    },
    {
      name: 'laiketa',
      number: 10002,
      elements:[
        {
          name: 'Cu',
          share: 24.01
        },
        {
          name: 'Fe',
          share: 31.02
        }
      ],
      inventory: 5686,
      required: true,
      calculateShare: 51.23
    }
  ],
  presetParameter: {
    MatteTargetTasteShare: 16.54,
    ModelFactorShare: 14.44
  },
  manuallyParameter:{
    rawCoalShare: 12.36,
    coldBurdenShare: 75.66
  },
  elementsTargetList: [
    {
      name: 'Cu',
      share: 33.63,
      priority: 1
    },
    {
      name: 'Fe',
      share: 33.63,
      priority: 2
    },
    {
      name: 'S',
      share: 33.63,
      priority: 3
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