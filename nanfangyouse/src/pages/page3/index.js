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
//import {workbook2blob, openDownloadDialog} from '@/utils/fn';
import { columns3_1 } from '@/utils/data';
import request from '@/utils/request';
import styles from '../index.less';
import selfStyle from './index.less';

function P(props) {
  const { config, dispatch } = props;
  const [form] = Form.useForm();
  const [initialData, setInitialData] = useState(null);
  const [resizeData, setResizeData] = useState(null);
  const [materialOptions,setMaterialOptions] = useState(null);

  function setInitialDataParameter(key, value){
    const newArr = [...initialData];
    newArr[0][key] = value;
    setInitialData(newArr);
  }
  function setResizeDataParameter(key, value){
    const newObj = {...resizeData};
    newObj.parameter[key] = value;
    setResizeData(newObj);
  }
  function setResizeData_(data) {
    const list = [...data];
    setResizeData({
      ...resizeData,
      list
    })
  }
  // 导入excel
  function customRequest(e) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const data = e.target.result;
      const xlsxData = XLSX.read(data, { type: 'binary' });
      const value = XLSX.utils.sheet_to_json(xlsxData.Sheets[xlsxData.SheetNames[0]]);
      const optionsList = Array(value.length);
      value.forEach((item, index) => {
        optionsList[index] = item.material;
      })
      setInitialData(value);
      setMaterialOptions(Array.from(new Set(optionsList)));
      console.log(materialOptions, value)
    }
    reader.readAsBinaryString(e.file);
  }
  // 导出excel
  function outputExcel() {
    const result = [...resizeData.list];
    result[0].recoveryAu = resizeData.parameter.recoveryAu;
    result[0].recoveryAg = resizeData.parameter.recoveryAg;
    result[0].recoveryCu = resizeData.parameter.recoveryCu;
    const sheet1 = XLSX.utils.json_to_sheet(result);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, sheet1, "导出");
    const wopts = {
      bookType: "xlsx",
      bookSST: false,
      type: "binary"
    };
    XLSX.writeFile(wb, '导出.xlsx', wopts);
  }
  // 数据矫正
  function correctData() {
    const payload = {
      list: initialData,
      parameter: {
        recoveryAu: Number(initialData[0].recoveryAu),
        recoveryAg: Number(initialData[0].recoveryAg),
        recoveryCu: Number(initialData[0].recoveryCu)
      }
    }
    console.log(payload)
    request({
      method: 'POST',
      host: config.host,
      port: config.port,
      url: 'correct_data',
      payload,
      cb: (res) => {
        setResizeData(res)
      }
    })
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
            onClick={correctData}
          >
            数据矫正
            </Button>
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
          materialOptions: materialOptions,
          setData: setInitialData
        }}>
          <EditTable />
        </TableContext.Provider >
        <Row className={styles.row} style={{marginTop: '20px'}}>
          <Col span={6}>
            <Input
              style={{ width: '250px' }}
              addonBefore="金回收率(%)"
              value={initialData && initialData[0].recoveryAu}
              onChange={(e) => {
                setInitialDataParameter('recoveryAu', e.target.value)
              }}
            />
          </Col>
          <Col span={6}>
            <Input
              style={{ width: '250px' }}
              addonBefore="银回收率(%)"
              value={initialData && initialData[0].recoveryAg}
              onChange={(e) => {
                setInitialDataParameter('recoveryAg', e.target.value)
              }}
            />
          </Col>
          <Col span={6}>
            <Input
              style={{ width: '250px' }}
              addonBefore="铜回收率(%)"
              value={initialData && initialData[0].recoveryCu}
              onChange={(e) => {
                setInitialDataParameter('recoveryCu', e.target.value)
              }}
            />
          </Col>
        </Row>
      </div>
      <div
        className={`${styles.row} ${selfStyle.tableWrapper}`}>
        <TableContext.Provider value={{
          columns: columns3_1,
          dataSource: resizeData && resizeData.list,
          materialOptions: materialOptions,
          setData: setResizeData_
        }}>
          <EditTable />
        </TableContext.Provider >
        <Row className={styles.row} style={{marginTop: '20px'}}>
          <Col span={6}>
            <Input
              style={{ width: '250px' }}
              addonBefore="金回收率(%)"
              value={resizeData && resizeData.parameter.recoveryAu}
              onChange={(e) => {
                setResizeDataParameter('recoveryAu', e.target.value)
              }}
            />
          </Col>
          <Col span={6}>
            <Input
              style={{ width: '250px' }}
              addonBefore="银回收率(%)"
              value={resizeData && resizeData.parameter.recoveryAg}
              onChange={(e) => {
                setResizeDataParameter('recoveryAg', e.target.value)
              }}
            />
          </Col>
          <Col span={6}>
            <Input
              style={{ width: '250px' }}
              addonBefore="铜回收率(%)"
              value={resizeData && resizeData.parameter.recoveryCu}
              onChange={(e) => {
                setResizeDataParameter('recoveryCu', e.target.value)
              }}
            />
          </Col>
        </Row>
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