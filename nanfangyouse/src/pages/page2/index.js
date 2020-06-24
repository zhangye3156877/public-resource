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
import { connect } from 'dva';
import request from '@/utils/request';
import { list2_1, columns1_3 } from '@/utils/data';
import styles from '../index.less';

const { TabPane } = Tabs;
const fkdata = [...list2_1];
const resultElementsMixtureListColumns = [...columns1_3];

function P(props) {
  const { config } = props;
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
  const [result, setResult] = useState(null);
  const [materialList, setMaterialList] = useState([{ name: '配方1' }, { name: '配方2' }]);
  const [tableLoading, setTableLoading] = useState(false);
  const [resultShow, setResultShow] = useState(false);
  let prevCountRef = useRef([...data]);
  useEffect(() => {
    prevCountRef.current = [...data];
  }, [data])

  function getInfo() {
    setTableLoading(true)
    request({
      method: 'GET',
      host: config.host,
      port: config.port,
      url: 'getFormula',
      cb: (res) => {
        const data = res.list;
        setData(data);
        const materialList = res.materialList.map((item) => {
          const o = {};
          item.elementsList.forEach((i) => {
            console.log(i)
            o[i.name] = i.percentage;
          })
          return {
            name: '配方' + item.formula,
            ...o
          }
        })
        setMaterialList(materialList);
        setTableLoading(false)
      }
    })
  }
  function onFinish(values) {
    const list = data
    console.log(list)
    const payload = {
      list,
      presetParameter: {
        matteGradePercentage: values.matteGradePercentage,
        maxMaterial: values.maxMaterial,
        ore: values.ore,
        oxygenPercentage: values.oxygenPercentage,
        slagCuPercentage: values.slagCuPercentage,
        slagSPercentage: values.slagSPercentage,
        slagFePercentage: values.slagFePercentage,
        slagSiO2Percentage: values.slagSiO2Percentage,
        peaCoal: values.peaCoal,
        FePercentage: values.FePercentage,
        CuPercentage: values.CuPercentage
      },
      oxygenMaterialRatio: {
        formula1: values.formula1,
        formula2: values.formula2,
      }
    }
    console.log(payload)
    setResult(null)
    setResultShow(true)
    request({
      method: 'POST',
      host: config.host,
      port: config.port,
      url: 'quick_adjust',
      payload,
      cb: (res) => {
        setResult(res)
      }
    })
  }
  function onFinishFailed(err) {
    console.log(err)
  }

  return (
    <div style={{ padding: '0 10px 10px 10px' }}>
      <div>
        <div style={{ marginBottom: '10px' }}>
          <Button type="primary"
            onClick={() => {
              getInfo()
            }}>
            获取
        </Button>
        </div>
        <Spin spinning={tableLoading}>
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
        </Spin>
      </div>
      <div>
        <Form
          // layout="inline"
          className={styles.block}
          labelCol={{ span: 12 }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <div>
            <Tabs defaultActiveKey="1" type="card">
              <TabPane tab="预设参数" key="1" forceRender>
                <Row className={styles.row}>
                  <Col span={4}>
                    <Form.Item
                      label="冰铜品味(%)"
                      name="matteGradePercentage"
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
                  <Col span={4}>
                    <Form.Item
                      label="最大物料数量"
                      name="maxMaterial"
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
                  <Col span={4}>
                    <Form.Item
                      label="给料矿量(t/h)"
                      name="ore"
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
                  <Col span={4}>
                    <Form.Item
                      label="氧浓(%)"
                      name="oxygenPercentage"
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
                  <Col span={4}>
                    <Form.Item
                      label="粒煤"
                      name="peaCoal"
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
                  <Col span={4}>
                    <Form.Item
                      label="Fe(%)"
                      name="FePercentage"
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
                  <Col span={4}>
                    <Form.Item
                      label="Cu(%)"
                      name="CuPercentage"
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
                  <Col span={4}>
                    <Form.Item
                      label="渣中Cu含量(%)"
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
                  <Col span={4}>
                    <Form.Item
                      label="渣中S含量(%)"
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
                  <Col span={4}>
                    <Form.Item
                      label="渣中Fe含量(%)"
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
                  <Col span={4}>
                    <Form.Item
                      //labelCol={12}
                      label="渣中SiO2含量(%)"
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
                {/* <Row className={styles.row}>
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
                </Row> */}
              </TabPane>

              <TabPane tab="氧料比" key="2" forceRender>
                <Row className={styles.row}>
                  <Col span={6}>
                    <Form.Item
                      label="配方1"
                      name="formula1"
                      initialValue=''
                      // rules={[
                      //   {
                      //     required: true
                      //   },
                      // ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item
                      label="配方2"
                      name="formula2"
                      initialValue=''
                      // rules={[
                      //   {
                      //     required: true
                      //   },
                      // ]}
                    >
                      <Input />
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
        <div>
          <Divider />
          <h1 style={{ textAlign: 'center', fontWeight: '900' }}>配方输出</h1>
          <Divider />
          <div style={{ marginTop: '20px' }}>
            {
              resultShow && (result === null ? <div style={{ paddingTop: 100, textAlign: 'center' }}>
                <Spin size="large" />
              </div> : <div>
                  <div>
                    <p>演算参数</p>
                    <Row className={styles.row}>
                      <Col span={6}>
                        <Input
                          style={{ width: '250px' }}
                          addonBefore={<span>氧料比(Nm<sup>3</sup>/t)</span>}
                          value={result.calculateParameter.oxygenMaterialRatio}
                        />
                      </Col>
                      <Col span={6}>
                        <Input
                          style={{ width: '250px' }}
                          addonBefore="总矿量(吨)"
                          value={result.calculateParameter.totalOre}
                        />
                      </Col>
                      <Col span={6}>
                        <Input
                          style={{ width: '250px' }}
                          addonBefore={<span>一次风量m<sup>3</sup>/h</span>}
                          value={result.calculateParameter.paFlow}
                        />
                      </Col>
                      <Col span={6}>
                        <Input
                          style={{ width: '250px' }}
                          addonBefore="S/Cu(%)"
                          value={result.calculateParameter.SCuRatio}
                        />
                      </Col>
                    </Row>
                    <Row className={styles.row}>
                      <Col span={6}>
                        <Input
                          style={{ width: '250px' }}
                          addonBefore="冰铜量(吨)"
                          value={result.calculateParameter.totalMatte}
                        />
                      </Col>
                      <Col span={6}>
                        <Input
                          style={{ width: '250px' }}
                          addonBefore="渣量(吨)"
                          value={result.calculateParameter.totalSlag}
                        />
                      </Col>
                      <Col span={6}>
                        <Input
                          style={{ width: '250px' }}
                          addonBefore="石英石(吨)"
                          value={result.calculateParameter.totalQuartz}
                        />
                      </Col>
                    </Row>
                  </div>
                  <div>
                    {/* <Button
                      type="primary"
                      style={{ width: '200px' }}
                      onClick={quickUpdate}
                    >
                      更新
                  </Button> */}
                  </div>
                  <div style={{ marginTop: '20px' }}>
                    <Table
                      rowKey={'name'}
                      columns={resultElementsMixtureListColumns}
                      dataSource={(() => {
                        let value = { name: '参数' }
                        result.elementsMixtureList.forEach((item) => {
                          value[item.name] = item.percentage
                        })
                        return [value]
                      })()}
                      pagination={false}
                      bordered
                    />
                  </div>
                </div>)
            }
          </div>
        </div>
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