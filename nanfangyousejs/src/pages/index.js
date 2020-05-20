import React, { useState } from 'react';
import EditTable, { TableContext } from '@/components/editTable';
import { Checkbox, Button, Form, Input, InputNumber, Row, Col, Space } from 'antd';
import styles from './index.css';

const fkcolumns = [
  {
    title: '必选',
    dataIndex: 'required',
    render: (text, record, index) => <Checkbox
      onChange={() => { console.log(text, record, index) }}
    />
  },
  {
    title: '排除',
    dataIndex: 'delete',
    render: (text, record, index) => <Checkbox
      onChange={() => { console.log(text, record, index) }}
    />
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
    title: 'Cu',
    dataIndex: 'Cu',
    editable: true,
  },
  {
    title: 'Fe',
    dataIndex: 'Fe'
  },
  {
    title: 'S',
    dataIndex: 'S'
  },
  {
    title: 'SiO2',
    dataIndex: 'SiO2'
  }, {
    title: 'Cao',
    dataIndex: 'Cao'
  },
  {
    title: 'As',
    dataIndex: 'As'
  }, {
    title: 'Zn',
    dataIndex: 'Zn'
  },
  {
    title: 'Pb',
    dataIndex: 'Pb'
  },
  {
    title: 'MgO',
    dataIndex: 'MgO'
  },
  {
    title: 'Al2O3',
    dataIndex: 'Al2O3'
  },
  {
    title: 'H2O',
    dataIndex: 'H2O'
  },
  {
    title: '库存/顿',
    dataIndex: 'inventory'
  },
  {
    title: '演算比例',
    dataIndex: 'calculatePercentage'
  },
  {
    title: '库存余量',
    dataIndex: 'inventoryBalance'
  },
];
const fkdata = [
  {
    index: 0,
    required: false,
    delete: false,
    name: '水星轮',
    number: 10001,
    Cu: 1,
    Fe: 1,
    S: 1,
    SiO2: 1,
    Cao: 1,
    As: 1,
    Zn: 1,
    Pb: 1,
    MgO: 1,
    Al2O3: 1,
    H2O: 1,
    inventory: 1000,
    calculatePercentage: ' ',
    inventoryBalance: 100
  },
  {
    index: 1,
    required: false,
    delete: false,
    name: '莱科塔',
    number: 10002,
    Cu: 1,
    Fe: 1,
    S: 1,
    SiO2: 1,
    Cao: 1,
    As: 1,
    Zn: 1,
    Pb: 1,
    MgO: 1,
    Al2O3: 1,
    H2O: 1,
    inventory: 1000,
    calculatePercentage: 'a',
    inventoryBalance: 100
  },
  {
    index: 2,
    required: false,
    delete: false,
    name: '和盛',
    number: 10003,
    Cu: 1,
    Fe: 1,
    S: 1,
    SiO2: 1,
    Cao: 1,
    As: 1,
    Zn: 1,
    Pb: 1,
    MgO: 1,
    Al2O3: 1,
    H2O: 1,
    inventory: 1000,
    calculatePercentage: 'a',
    inventoryBalance: 100
  },
  {
    index: 3,
    required: false,
    delete: false,
    name: '方舟21',
    number: 10004,
    Cu: 1,
    Fe: 1,
    S: 1,
    SiO2: 1,
    Cao: 1,
    As: 1,
    Zn: 1,
    Pb: 1,
    MgO: 1,
    Al2O3: 1,
    H2O: 1,
    inventory: 1000,
    calculatePercentage: 'a',
    inventoryBalance: 100
  },
  {
    index: 4,
    required: false,
    delete: false,
    name: '江门商人',
    number: 10005,
    Cu: 1,
    Fe: 1,
    S: 1,
    SiO2: 1,
    Cao: 1,
    As: 1,
    Zn: 1,
    Pb: 1,
    MgO: 1,
    Al2O3: 1,
    H2O: 1,
    inventory: 1000,
    calculatePercentage: 'a',
    inventoryBalance: 100
  },
]


export default function () {
  const [columns, setColumns] = useState(fkcolumns);
  const [data, setData] = useState(fkdata);
  function onFinish(values) {
    console.log(values)
  }
  function onFinishFailed(errorInfo) {
    console.log('Failed:', errorInfo);
  }
  return (
    <div style={{ padding: '20px' }}>
      <TableContext.Provider value={{
        columns,
        data
      }}>
        <EditTable
          setData={setData}
        />
      </TableContext.Provider >
      <div>
        <p>预设参数</p>
        <div>
          <Form
            layout="inline"
            labelCol={{ span: 12 }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Row className={styles.row}>
              <Col span={6}>
                <Form.Item
                  label="冰铜目标品味(%)"
                  name="MatteTargetGradeRatio"
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
                  label="模型因子比重(%)"
                  name="ModelFactorRatio"
                  rules={[
                    {
                      required: true,
                      message: 'Please input your username!',
                    },
                  ]}
                >
                  <InputNumber />
                </Form.Item>
              </Col>
              {/* <Col span={8}>

                <Form.Item
                  label="cc"
                  name="cc"
                  rules={[
                    {
                      required: true,
                      message: 'Please input your username!',
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col> */}
            </Row>
            <Row className={styles.row}>
              <Col span={6}>
               <Space>
               <Form.Item
                  name="checkboxCu"
                  valuePropName="checked"
                  noStyle={true}
                >
                  <Checkbox onChange={(v) => { console.log(v) }} />
                </Form.Item>
                <span className={styles.elementspan}>Cu(%)</span>
                <Form.Item
                  name="Cu"
                  noStyle={true}
                >
                  <InputNumber />
                </Form.Item>
                <Form.Item
                  name="priorityCu"
                  noStyle={true}
                >
                  <InputNumber
                    placeholder="优先级" />
                </Form.Item>
               </Space>
              </Col>
              <Col span={6}>
                <Space>
                <Form.Item
                  name="checkboxSiO2"
                  valuePropName="checked"
                  noStyle={true}
                >
                  <Checkbox onChange={(v) => { console.log(v) }} />
                </Form.Item>
                <span className={styles.elementspan}>SiO2(%)</span>
                <Form.Item
                  name="SiO2"
                  noStyle={true}
                >
                  <InputNumber />
                </Form.Item>
                <Form.Item
                  name="prioritySiO2"
                  noStyle={true}
                >
                  <InputNumber placeholder="优先级"/>
                </Form.Item>
                </Space>
              </Col>
              <Col span={6}>
               <Space>
               <Form.Item
                  name="checkboxZn"
                  valuePropName="checked"
                  noStyle={true}
                >
                  <Checkbox onChange={(v) => { console.log(v) }} />
                </Form.Item>
                <span className={styles.elementspan}>Zn(%)</span>
                <Form.Item
                  name="Zn"
                  noStyle={true}
                >
                  <InputNumber />
                </Form.Item>
                <Form.Item
                  name="priorityZn"
                  noStyle={true}
                >
                  <InputNumber placeholder="优先级" />
                </Form.Item>
               </Space>
              </Col>
              <Col span={6}>
               <Space>
               <Form.Item
                  name="checkboxAl2O3"
                  valuePropName="checked"
                  noStyle={true}
                >
                  <Checkbox onChange={(v) => { console.log(v) }} />
                </Form.Item>
                <span className={styles.elementspan}>Al2O3(%)</span>
                <Form.Item
                  name="Al2O3"
                  noStyle={true}
                >
                  <InputNumber />
                </Form.Item>
                <Form.Item
                  name="priorityAl2O3"
                  noStyle={true}
                >
                  <InputNumber placeholder="优先级" />
                </Form.Item>
               </Space>
              </Col>
            </Row>
            <Row className={styles.row}>
              <Col span={6}>
                <Space>
                <Form.Item
                  name="checkboxFe"
                  valuePropName="checked"
                  noStyle={true}
                >
                  <Checkbox onChange={(v) => { console.log(v) }} />
                </Form.Item>
                <span className={styles.elementspan}>Fe(%)</span>
                <Form.Item
                  name="Fe"
                  noStyle={true}
                >
                  <InputNumber />
                </Form.Item>
                <Form.Item
                  name="priorityFe"
                  noStyle={true}
                >
                  <InputNumber placeholder="优先级" />
                </Form.Item>
                </Space>
              </Col>
              <Col span={6}>
                <Space>
                <Form.Item
                  name="checkboxCao"
                  valuePropName="checked"
                  noStyle={true}
                >
                  <Checkbox onChange={(v) => { console.log(v) }} />
                </Form.Item>
                <span className={styles.elementspan}>Cao(%)</span>
                <Form.Item
                  name="Cao"
                  noStyle={true}
                >
                  <InputNumber />
                </Form.Item>
                <Form.Item
                  name="priorityCao"
                  noStyle={true}
                >
                  <InputNumber placeholder="优先级" />
                </Form.Item>
                </Space>
              </Col>
              <Col span={6}>
                <Space>
                  <Form.Item
                    name="checkboxPb"
                    valuePropName="checked"
                    noStyle={true}
                  >
                    <Checkbox onChange={(v) => { console.log(v) }} />
                  </Form.Item>
                  <span className={styles.elementspan}>Pb(%)</span>
                  <Form.Item
                    name="Pb"
                    noStyle={true}
                  >
                    <InputNumber />
                  </Form.Item>
                  <Form.Item
                    name="priorityPb"
                    noStyle={true}
                  >
                    <InputNumber placeholder="优先级"/>
                  </Form.Item>
                </Space>
              </Col>
              <Col span={6}>
                <Space>
                  <Form.Item
                    name="checkboxH2O"
                    valuePropName="checked"
                    noStyle={true}
                  >
                    <Checkbox onChange={(v) => { console.log(v) }} />
                  </Form.Item>
                  <span className={styles.elementspan}>H2O(%)</span>
                  <Form.Item
                    name="H2O"
                    noStyle={true}
                  >
                    <InputNumber />
                  </Form.Item>
                  <Form.Item
                    name="priorityH2O"
                    noStyle={true}
                  >
                    <InputNumber placeholder="优先级" />
                  </Form.Item>
                </Space>
              </Col>
            </Row>
            <Row className={styles.row}>
              <Col span={6}>
                <Space>
                  <Form.Item
                    name="checkboxS"
                    valuePropName="checked"
                    noStyle={true}
                  >
                    <Checkbox onChange={(v) => { console.log(v) }} />
                  </Form.Item>
                  <span className={styles.elementspan}>S(%)</span>
                  <Form.Item
                    name="S"
                    noStyle={true}
                  >
                    <InputNumber />
                  </Form.Item>
                  <Form.Item
                    name="priorityS"
                    noStyle={true}
                  >
                    <InputNumber placeholder="优先级"/>
                  </Form.Item>
                </Space>
              </Col>
              <Col span={6}>
                <Space>
                  <Form.Item
                    name="checkboxAs"
                    valuePropName="checked"
                    noStyle={true}
                  >
                    <Checkbox onChange={(v) => { console.log(v) }} />
                  </Form.Item>
                  <span className={styles.elementspan}>As(%)</span>
                  <Form.Item
                    name="As"
                    noStyle={true}
                  >
                    <InputNumber />
                  </Form.Item>
                  <Form.Item
                    name="priorityAs"
                    noStyle={true}
                  >
                    <InputNumber placeholder="优先级" />
                  </Form.Item>
                </Space>
              </Col>
              <Col span={6}>
                <Space>
                  <Form.Item
                    name="checkboxMgO"
                    valuePropName="checked"
                    noStyle={true}
                  >
                    <Checkbox onChange={(v) => { console.log(v) }} />
                  </Form.Item>
                  <span className={styles.elementspan}>MgO(%)</span>
                  <Form.Item
                    name="MgO"
                    noStyle={true}
                  >
                    <InputNumber />
                  </Form.Item>
                  <Form.Item
                    name="priorityMgO"
                    noStyle={true}
                  >
                    <InputNumber placeholder="优先级"/>
                  </Form.Item>
                </Space>

              </Col>

            </Row>
            <Button htmlType="submit">
              查看
        </Button>
          </Form>
        </div>
      </div>
      <div>
        <Button onClick={() => {
          const newData = [...data]
          const newColumns = [...columns]
          newData[0].name = '水星轮2'
          newColumns[newColumns.length - 2].editable = true
          setData(newData)
          setColumns(newColumns);
        }}>
          改变data
        </Button>
      </div>
    </div>
  );
}