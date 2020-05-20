import React, { useState, useEffect, useContext, useRef } from 'react';
import { Table, Form, Input} from 'antd';

export const TableContext = React.createContext({
  columns: [],
  data: []
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
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input 
          style={{width: '80px'}}
          ref={inputRef} 
          onPressEnter={save} 
          onBlur={save} 
          />
      </Form.Item>
    ) : (
        <div
          onClick={toggleEdit}
        >
          {children}
        </div>
      );
  }

  return <td {...restProps}>{childNode}</td>;
};

function EditTable(props) {
  const { columns, data } = useContext(TableContext)
  console.log(props.setData)
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
        handleSave:  row => {
          const newData = [...data];
          newData[0].name = '水星轮3'
          props.setData(newData)
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
        dataSource={data}
        pagination={false}
        bordered
      />

    </div>
  )
}

export default EditTable