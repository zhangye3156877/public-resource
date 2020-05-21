import React, { useState, useEffect, useCallback } from 'react';
import Child from './child';

export default function() {
  const [child, setChild] = useState(0)
  const [father, setFather] = useState(0)

  function fatherHandle(){
    console.log('执行fatherHandle')
    return father + 1
  }
  const fatherHandle_ = useCallback(() => fatherHandle(), [father])
  
  return(
    <div>
      <button onClick={() => {
        setChild(child + 1)
      }}>
        child+1
      </button>
      <button onClick={() => {
        setFather(father + 1)
      }}>
        father+1
      </button>
      <div>
        父组件:{father}
      </div>
      <div>
        父组件处理:{fatherHandle_()}
      </div>
      <Child 
        value={child}
      />
    </div>
    
  )
}