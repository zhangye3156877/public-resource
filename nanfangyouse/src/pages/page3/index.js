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
  Switch,
  Table,
  Spin,
  Divider,
  Tabs,
  message
} from 'antd';
import { connect } from 'dva';
import { columns1_3 } from '@/utils/data';
import request from '@/utils/request';

function P(props) {
  return (
    <div>
      <div className={styles.row}>
      {/* <TableContext.Provider value={{
          columns:,
          dataSource: data,
          setData: setData_
        }}>
          <EditTable />
        </TableContext.Provider > */}
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