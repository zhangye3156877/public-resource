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
  message,
  Space,
  Upload
} from 'antd';
import XLSX from 'xlsx';
//import { UploadOutlined } from '@ant-design/icons';
import { connect } from 'dva';
import {workbook2blob, openDownloadDialog} from '@/utils/fn';
import { columns3_1 } from '@/utils/data';
import request from '@/utils/request';
import styles from '../index.less';
import selfStyle from './index.less';

function customRequest(e) {
  const reader = new FileReader();
  reader.onload = function (e) {
    const data = e.target.result;
    const xlsxData = XLSX.read(data, { type: 'binary' });
    const value = XLSX.utils.sheet_to_json(xlsxData.Sheets[xlsxData.SheetNames[0]]);
    XLSX.writeFile(data, 'aaf');
    console.log(value)

    let sheet1data = [{ department: "行政部", count: 2 }, { department: "前端部", count: 2 }];
    var sheet1 = XLSX.utils.json_to_sheet(sheet1data);

    /* create a new blank workbook */
    //var wb = XLSX.utils.book_new();
    //XLSX.utils.book_append_sheet(wb, sheet1, "部门统计");
    //const workbookBlob = workbook2blob(wb);
    //openDownloadDialog(workbookBlob, `部门统计.xlsx`);

  }
  reader.readAsBinaryString(e.file);
}

function P(props) {
  const [form] = Form.useForm();
  const [initialData, setInitialData] = useState(null);
  const [resizeData, setResizeData] = useState(null);

  return (
    <div>
      <div className={styles.row}>
        <Space>
          <Upload
            showUploadList={false}
            customRequest={customRequest}
          >
            <Button
              type="primary"
            >
              数据录入
            </Button>

          </Upload>

        </Space>
      </div>
      <div
        className={`${styles.row} ${selfStyle.tableWrapper}`}>
        <TableContext.Provider value={{
          columns: columns3_1,
          dataSource: initialData,
          setData: setInitialData
        }}>
          <EditTable />
        </TableContext.Provider >
      </div>
      <div
        className={`${styles.row} ${selfStyle.tableWrapper}`}>
        <TableContext.Provider value={{
          columns: columns3_1,
          dataSource: initialData,
          setData: setInitialData
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