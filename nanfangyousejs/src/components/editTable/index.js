import React, {usesState} from 'react';
import {Table} from 'antd';

export const TableContext = React.createContext();

function EditTable(props){
  return(
    <div>
      <Table
        // columns={columns}
        // dataSource={data}
        // pagination={false}
      />
    </div>
  )
}

export default EditTable;