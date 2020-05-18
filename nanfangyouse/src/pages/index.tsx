import React, { useState } from 'react';
import { Button } from 'antd';
import router from 'umi/router';
import styles from './index.css';


export default function (props: any) {

  const [points, setPoints] = useState<number>(10)

  return (
    <div className={styles.normal}>
      <div className={styles.welcome} />
      <ul className={styles.list}>
        <li>{points}</li>
        <li>
          <Button type="primary" onClick={() => { setPoints(points + 1) }}>
            ++
          </Button>
          <Button type="primary" onClick={() => { setPoints(points - 1) }}>
            --
          </Button>
        </li>
        <li style={{marginTop: '20px'}}>
          <Button type="danger" onClick={() => { router.push('/p1') }}>
            go p1
          </Button>
          <Button type="danger" onClick={() => { router.push('/p2') }}>
            go p2
          </Button>
        </li>
        {props.children}
      </ul>
    </div>
  );
}
