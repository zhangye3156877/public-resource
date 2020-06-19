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
import {list2_1, columns1_1} from '@/utils/data';
import styles from './index.less';

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
  let prevCountRef = useRef([...data]);
  useEffect(() => {
    prevCountRef.current = [...data];
  }, [data])

  return(
    <div style={{ padding: '0 10px 10px 10px' }}>
      <div>
      <TableContext.Provider value={{
          columns,
          dataSource: data,
          setData
        }}>
          <EditTable />
        </TableContext.Provider >
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