import React, {PropTypes, Component} from 'react'
import {connect} from 'dva'
import {checkPower} from '../../../utils'
import {ADD, UPDATE, DELETE} from '../../../constants/options'
import SendForm from './SendForm'

const Send = ({dispatch, location, curPowers, couponSend}) => {

  const addPower = checkPower(ADD, curPowers)
  const updatePower = checkPower(UPDATE, curPowers)

  const sendFormProps = {
    addPower,
    updatePower,
    couponSend,
    onQueryPhoneList(key) {
      dispatch({type: 'couponSend/queryPhoneList', payload: { key }})
    },
    onResetPhoneList() {
      dispatch({type: 'couponSend/resetPhoneList'})
    },
    onOk(data) {
      dispatch({type: 'couponSend/send', payload: data})
    },
    onCheckSuccess (data) {
      dispatch({type: 'couponSend/check', payload: data})
    }
  }

  return (
    <div className='content-inner'>
      <SendForm {...sendFormProps}/>
    </div>
  )
}

function mapStateToProps({ couponSend }) {
  return { couponSend }
}
export default connect(mapStateToProps)(Send)
