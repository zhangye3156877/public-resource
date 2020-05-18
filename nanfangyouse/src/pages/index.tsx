import React from 'react';
import {Button} from 'antd';
import router from 'umi/router';
import styles from './index.css';

export default function(props:any) {
  return (
    <div className={styles.normal}>
      <div className={styles.welcome} />
      <ul className={styles.list}>
        <li>To get started, edit <code>src/pages/index.js</code> and save to reload.</li>
        <li>
          <Button type="danger" onClick={() => {router.push('/home')}}>
            start
          </Button>
        </li>
      {props.children}
      </ul>
    </div>
  );
}
