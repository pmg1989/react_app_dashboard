import React, { Component } from 'react'
import {connect} from 'dva'
import {checkPower} from '../../../utils'
import {UPDATE} from '../../../constants/options'
import Content from './Content'

const Recommend = ({ location, curPowers, dispatch, collectFilterKeys}) => {

  const updatePower = checkPower(UPDATE, curPowers)

  const contentProps = {
    updatePower,
    collectFilterKeys,
    onOk(item) {
      dispatch({ type: 'collectFilterKeys/update', payload: { item } })
    }
  }

  return (
    <div className='content-inner'>
      <Content {...contentProps}/>
    </div>
  )
}

export default connect(({ collectFilterKeys }) => ({ collectFilterKeys }))(Recommend)
