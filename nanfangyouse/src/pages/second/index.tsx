import React from 'react';
import {Button} from 'antd';
import router from 'umi/router';

export default function(){
  return(
    <div>
      <p>p2页面</p>
       <Button type="danger" onClick={() => {router.push('/')}}>
            回首页
        </Button>
    </div>
  )
}