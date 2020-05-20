import React, { useState, useEffect, useContext, useRef } from 'react';
import { Table, Form, Input } from 'antd';

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
    
    if (dataIndex === 'calculatePercentage' && record.required === false) {
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
          <Input
            style={{ width: '80px' }}
            ref={inputRef}
            onPressEnter={save}
            onBlur={save}
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
        handleSave: row => {

          const newData = [...dataSource];
          newData[row.index] = { ...row }
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