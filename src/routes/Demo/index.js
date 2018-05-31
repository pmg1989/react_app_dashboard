import React, {Component} from 'react'
import {connect} from 'dva'
import styles from './index.less'

const Demo = () => {

  return (
    <div className={styles.container} style={{margin: 50, backgroundColor: '#000'}}>
      <svg width="240" height="240" xmlns="http://www.w3.org/2000/svg">
        <circle id="backdrop" r="90" cy="120" cx="120" strokeWidth="6" stroke="#333" fill="none"/>
        <circle id="progress" className={styles.progress} r="90" cy="120" cx="120" strokeWidth="6" stroke="red" fill="none"/>
      </svg>
    </div>
  )
}

export default connect()(Demo)
