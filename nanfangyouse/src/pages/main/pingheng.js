import React from 'react';
import { Tabs, Divider, Card } from 'antd';
import Page3 from '@/pages/page3';
// import styles from './index.css';

const { TabPane } = Tabs;
export default function() {

  return (
    <div>
      <Divider style={{ marginTop: '5px' }} />
      <h1 style={{ textAlign: 'center', fontWeight: '900' }}>南方金属平衡项目</h1>
      <Tabs
        defaultActiveKey="1"
        size="large"
        tabBarStyle={{ paddingLeft: '50px' }}
        style={{ padding: '0 20px' }}
      >
        <TabPane tab="金属平衡" key="3">
          <Card>
            <Page3 />
          </Card>
        </TabPane>
      </Tabs>
    </div>
  )
}
