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

function P(props) {
  const [form] = Form.useForm();
  const [initialData, setInitialData] = useState(null);
  const [resizeData, setResizeData] = useState(null);
  function customRequest(e) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const data = e.target.result;
      const xlsxData = XLSX.read(data, { type: 'binary' });
      const value = XLSX.utils.sheet_to_json(xlsxData.Sheets[xlsxData.SheetNames[0]]);
      console.log(value);
      setInitialData(value);
    }
    reader.readAsBinaryString(e.file);
  }
  
  function outputExcel() {
    const sheet1 = XLSX.utils.json_to_sheet(initialData);

    /* create a new blank workbook */
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, sheet1, "导出");
    const wopts = {
      // 要生成的文件类型
      bookType: "xlsx",
      // // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
      bookSST: false,
      type: "binary"
    };
    XLSX.writeFile(wb, '导出.xlsx',wopts);
    //const workbookBlob = workbook2blob(wb);
    //openDownloadDialog(workbookBlob, `导出.xlsx`);
  }
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
          <Button
              type="primary"
              onClick={outputExcel}
            >
              数据导出
            </Button>

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