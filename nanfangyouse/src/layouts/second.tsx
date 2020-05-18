import React from 'react';
import styles from './index.css';

const ASD: React.FC = props => {
  return (
    <div className={styles.normal}>
      <h1 className={styles.title}>这是第二个layout</h1>
      {props.children}
    </div>
  );
};

export default ASD;
