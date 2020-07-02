import React, { useState, useEffect, useContext, useRef } from 'react';
import { Table, Form, Input, InputNumber } from 'antd';

export const TableContext = React.createContext({
  columns: [],
  dataSource: [],
  setData: () => {}
})

const EditableContext = React.createContext();

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  step,
  ...restProps
}) => {
  
  const [editing, setEditing] = useState(false);
  const inputRef = useRef();
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    if (record.required === false) {
      return
    }
    
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };

  const save = async e => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;
  
  if (editable) {
    
      childNode = editing ? (
        <Form.Item
          style={{
            margin: 0,
          }}
          name={dataIndex}
          rules={[
            {
              required: true
            },
          ]}
        >
          <InputNumber
            ref={inputRef}
            onPressEnter={save}
            onBlur={save}
            step={step || 1}
          />
        </Form.Item>
      ) : (
          <div
            onClick={toggleEdit}
            style={{minHeight:'20px'}}
          >
            {children}
          </div>
        );
    
  }

  return <td {...restProps}>{childNode}</td>;
};

function EditTable(props) {
  const { columns, dataSource, setData } = useContext(TableContext)

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  }
  const columns_ = columns.map(col => {
    
    if (!col.editable) {
      return col
    }

    return {
      ...col,
      onCell: record => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        step: col.step,
        handleSave: row => {
          const newData = [...dataSource];
          const index = newData.findIndex(item => row.number === item.number);
          newData[index] = {...row};
          //row.index !== undefined && (newData[row.index] = { ...row })
          setData(newData)
        },
      }),
    }
  })



  return (
    <div>
      <Table
        rowKey={'number'}
        components={components}
        columns={columns_}
        dataSource={dataSource}
        pagination={false}
        bordered
      />

    </div>
  )
}

export default EditTable