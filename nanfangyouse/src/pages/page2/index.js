import React, { useState, useEffect, useRef } from 'react';
import EditTable, { TableContext } from '@/components/editTable';
import {
  Checkbox,
  Button,
  Form,
  Input,
  InputNumber,
  Row,
  Col,
  Space,
  Table,
  Spin,
  Divider,
  Tabs
} from 'antd';
import {connect} from 'dva';
import request from '@/utils/request';
import {list2_1, columns1_3} from '@/utils/data';
import styles from '../index.less';

const { TabPane } = Tabs;
const fkdata = [...list2_1];

function P(props) {
  const columns = [
    {
      title: '必选',
      dataIndex: 'required',
      render: (text, record, index) => <Checkbox
        checked={text}
        onChange={() => {
          const newData = [...prevCountRef.current]
          newData[index] = { ...record }
          newData[index].required = !text
          setData(newData)
        }}
      />
    },
    {
      title: '所属配方',
      dataIndex: 'formula',
    },
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '批次号',
      dataIndex: 'number',
    },
    {
      title: '库存/吨',
      dataIndex: 'inventory',
    },
    {
      title: '演算比例',
      dataIndex: 'calculatePercentage',
      //editable: true,
    },
    {
      title: '库存余量',
      dataIndex: 'inventoryBalance',
    },
    {
      title: '生产时间',
      dataIndex: 'ProductionTime',
    },
    {
      title: 'Cu',
      dataIndex: 'Cu',
    },
    {
      title: 'Fe',
      dataIndex: 'Fe',
    },
    {
      title: 'S',
      dataIndex: 'S',
    },
    {
      title: 'SiO2',
      dataIndex: 'SiO2'
    }, {
      title: 'CaO',
      dataIndex: 'CaO',
    },
    {
      title: 'As',
      dataIndex: 'As',
    }, {
      title: 'Zn',
      dataIndex: 'Zn',
    },
    {
      title: 'Pb',
      dataIndex: 'Pb',
    },
    {
      title: 'MgO',
      dataIndex: 'MgO',
    },
    {
      title: 'Al2O3',
      dataIndex: 'Al2O3',
    },
    {
      title: 'H2O',
      dataIndex: 'H2O',
    },
    {
      title: 'Sb',
      dataIndex: 'Sb',
    },
    {
      title: 'Bi',
      dataIndex: 'Bi',
    },
    {
      title: 'Ni',
      dataIndex: 'Ni',
    },
    {
      title: 'Ag(t/g)',
      dataIndex: 'Ag',
    },
    {
      title: 'Au(t/g)',
      dataIndex: 'Au',
    },
    
  ];

  const [data, setData] = useState(fkdata);
  const [materialList, setMaterialList] = useState([{name: '配方1'}, {name: '配方2'}]);
  let prevCountRef = useRef([...data]);
  useEffect(() => {
    prevCountRef.current = [...data];
  }, [data])
  
  function getInfo(){

  }
  function onFinish(values) {
    console.log(values)
  }
  function onFinishFailed(err){
    console.log(err)
  }

  return(
    <div style={{ padding: '0 10px 10px 10px' }}>
      <div>
      <div className={styles.block}>
        <Button type="primary" 
          onClick={() => {
            getInfo()
          }}>
          获取
        </Button>
      </div>
      <TableContext.Provider value={{
          columns,
          dataSource: data,
          setData
        }}>
          <EditTable />
        </TableContext.Provider >
        <Table
          className={styles.block}
          rowKey={'name'}
          columns={columns1_3}
          dataSource={materialList}
          pagination={false}
          bordered
        />
      </div>
      <div>
      <Form
          // layout="inline"
          className={styles.block}
          labelCol={{ span: 15 }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <div>
            <Tabs defaultActiveKey="1" type="card">
              <TabPane tab="预设参数" key="1" forceRender>
                <Row className={styles.row}>
                  <Col span={6}>
                    <Form.Item
                      label="冰铜目标品味(%)"
                      name="matteTargetGradePercentage"
                      initialValue={74}
                      rules={[
                        {
                          required: true
                        },
                      ]}
                    >
                      <InputNumber />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item
                      label="冰铜铁含量(%)"
                      name="matteFePercentage"
                      initialValue={3.5}
                      rules={[
                        {
                          required: true
                        },
                      ]}
                    >
                      <InputNumber />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item
                      label="冰铜硫含量(%)"
                      name="matteSPercentage"
                      initialValue={20.84}
                      rules={[
                        {
                          required: true
                        },
                      ]}
                    >
                      <InputNumber />
                    </Form.Item>
                  </Col>
                </Row>
                <Row className={styles.row}>
                  <Col span={6}>
                    <Form.Item
                      label="熔炉渣铜含量(%)"
                      name="slagCuPercentage"
                      initialValue={1.99}
                      rules={[
                        {
                          required: true
                        },
                      ]}
                    >
                      <InputNumber />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item
                      label="熔炉渣硫含量(%)"
                      name="slagSPercentage"
                      initialValue={.45}
                      rules={[
                        {
                          required: true
                        },
                      ]}
                    >
                      <InputNumber />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item
                      label="熔炉渣铁含量(%)"
                      name="slagFePercentage"
                      initialValue={48}
                      rules={[
                        {
                          required: true
                        },
                      ]}
                    >
                      <InputNumber />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item
                      //labelCol={12}
                      label="熔炉渣二氧化硅含量(%)"
                      name="slagSiO2Percentage"
                      initialValue={24}
                      rules={[
                        {
                          required: true
                        },
                      ]}
                    >
                      <InputNumber />
                    </Form.Item>
                  </Col>
                </Row>
                <Row className={styles.row}>
                  <Col span={6}>
                    <Form.Item
                      label="最大类别数"
                      name="maxType"
                      initialValue={4}
                      rules={[
                        {
                          required: true
                        },
                      ]}
                    >
                      <InputNumber />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item
                      label="模型因子alpha"
                      name="modelFactorAlpha"
                      initialValue={1}
                      rules={[
                        {
                          required: true
                        },
                      ]}
                    >
                      <InputNumber />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item
                      label="模型因子beta"
                      name="modelFactorBeta"
                      initialValue={1}
                      rules={[
                        {
                          required: true
                        },
                      ]}
                    >
                      <InputNumber />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item
                      label="模型因子gamma"
                      name="modelFactorGamma"
                      initialValue={1}
                      rules={[
                        {
                          required: true
                        },
                      ]}
                    >
                      <InputNumber />
                    </Form.Item>
                  </Col>
                </Row>
                <Row className={styles.row}>
                  <Col span={6}>
                    <Form.Item
                      label="优化算法种群数量"
                      name="gaPop"
                      initialValue={25}
                      rules={[
                        {
                          required: true
                        },
                      ]}
                    >
                      <InputNumber />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item
                      label="优化算法迭代次数"
                      name="gaEpoch"
                      initialValue={25}
                      rules={[
                        {
                          required: true
                        },
                      ]}
                    >
                      <InputNumber />
                    </Form.Item>
                  </Col>

                </Row>
              </TabPane>
              
              <TabPane tab="氧料比" key="2" forceRender>
                <Row className={styles.row}>
                  <Col span={6}>
                    <Form.Item
                      label="配方1"
                      name="oxygenMaterialRatioFormula1"
                      initialValue={0}
                      rules={[
                        {
                          required: true
                        },
                      ]}
                    >
                      <InputNumber />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item
                      label="配方2"
                      name="oxygenMaterialRatioFormula2"
                      initialValue={0}
                      rules={[
                        {
                          required: true
                        },
                      ]}
                    >
                      <InputNumber />
                    </Form.Item>
                  </Col>
                </Row>
              </TabPane>
            </Tabs>
          </div>
          <div>
            <Button htmlType="submit" type="primary" style={{ width: '200px' }}>
              演&nbsp;&nbsp;算
            </Button>
          </div>
        </Form>
      </div> 
    </div>
  )
}

function mapStateToProps(state) {
  const { config } = state.global;
  return {
    config
  };
}
export default connect(mapStateToProps)(P);