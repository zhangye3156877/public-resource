import React, {usesState, useContext} from 'react';
import {Table} from 'antd';

export const TableContext = React.createContext({
  columns: [],
  data: []
});

function EditTable(props){
  const {columns, data} = useContext(TableContext)
  return(
    <div>
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
      />
    </div>
  )
}

export default EditTable;