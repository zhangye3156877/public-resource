import React, { useState, useEffect, useRef } from 'react';
import { Tabs, Divider, Card } from 'antd';
import Page1 from '@/pages/page1'
//import styles from './index.css';

const { TabPane } = Tabs;
export default function (props) {
  return (
    <div>
      <Divider style={{ marginTop: '5px' }} />
      <h1 style={{ textAlign: 'center', fontWeight: '900' }}>南方有色配料项目</h1>
      <Tabs
        defaultActiveKey="1"
        size="large"
        tabBarStyle={{ paddingLeft: '50px' }}
        style={{ padding: '0 20px' }}
      >
        <TabPane tab="新增配方" key="1">
          <Card>
            <Page1 />
          </Card>
        </TabPane>
        <TabPane tab="配方衔接" key="2">
        <Card>
            123456
          </Card>
      </TabPane>
      </Tabs>
    </div>
  )
}