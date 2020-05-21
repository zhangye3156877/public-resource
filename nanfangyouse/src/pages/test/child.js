import React, { useState, useEffect, useMemo } from 'react';

export default function(props) {
  function render_(value){
    console.log(1)
    return value + 1
  }
  const seconde = useMemo(() => {
    return render_(props.value)
  },[props.value]);
 
  return(
    <div>
      <div>子组件:{props.value}</div>
      <div>子组件处理:{seconde}</div>
    </div>
  )
}