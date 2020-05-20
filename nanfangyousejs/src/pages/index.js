import React, { useState } from 'react';
import EditTable, { TableContext } from '@/components/editTable';
import { Checkbox, Button } from 'antd';
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
  return (
    <div style={{padding:'20px'}}>
      <TableContext.Provider  value={{
        columns,
        data
      }}>
        <EditTable 
          setData={setData}
        />
      </TableContext.Provider >
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
        <Button onClick={() => {
          console.log(data);
        }}>
          查看
        </Button>
      </div>
    </div>
  );
}
