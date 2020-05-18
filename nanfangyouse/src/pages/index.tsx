import React from 'react';
import {Button} from 'antd';
import router from 'umi/router';
import styles from './index.css';

export default function(props:any) {

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
  return (
    <div className={styles.normal}>
      <div className={styles.welcome} />
      <ul className={styles.list}>
        <li>To get started, edit <code>src/pages/index.js</code> and save to reload.</li>
        <li>
          <Button type="danger" onClick={() => {router.push('/home')}}>
            start
          </Button>
        </li>
      {props.children}
      </ul>
    </div>
  );
}
