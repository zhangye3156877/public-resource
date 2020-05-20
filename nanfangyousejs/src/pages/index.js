import React, { useState } from 'react';
import EditTable, { TableContext } from '@/components/editTable';
import { Checkbox } from 'antd';
import styles from './index.css';

const columns = [
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
    dataIndex: 'Cu'
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
    key: '1',
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
    calculatePercentage: 11,
    inventoryBalance: 100
  },
]

console.log(EditTable)
console.log(TableContext)

export default function () {
  return (
    <div>
      <TableContext.Provider  value={{
        columns,
        data: fkdata
      }}>
        <EditTable />
      </TableContext.Provider >
    </div>
  );
}
