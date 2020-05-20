import React, {userState, useEffect, useContext} from 'react';
import {Table} from 'antd';

export const TableContext = React.createContext({
  columns: object[],
  data: []
});

function EditTable(props: any){

  let {columns, data} = useContext(TableContext)

  useEffect(() => {
    console.log(props)
  })
  return(
    <Table
    columns={columns}
    dataSource={data}
    pagination={false}
  />
  )
}

export default EditTable