import React, {PropTypes} from 'react'
import {routerRedux} from 'dva/router'
import {connect} from 'dva'
import List from './List'
import Search from './Search'
import Modal from './ModalForm'
import {checkPower} from '../../../utils'
import {ADD, DETAIL, UPDATE, DELETE, SHELT, SHELTOFF} from '../../../constants/options'

function CourseTeacher({location, curPowers, dispatch, courseTeacher, modal}) {

  const addPower = checkPower(ADD, curPowers)
  const detailPower = checkPower(DETAIL, curPowers)
  const updatePower = checkPower(UPDATE, curPowers)
  const deletePower = checkPower(DELETE, curPowers)
  const sheltPower = checkPower(SHELT, curPowers)
  const sheltOffPower = checkPower(SHELTOFF, curPowers)

  const {field, keyword, type} = location.query

  const searchProps = {
    field,
    keyword,
    type,
    addPower,
    onSearch(fieldsValue) {
      dispatch(routerRedux.push({
        pathname: location.pathname,
        query: {
          ...fieldsValue
        }
      }))
    },
    onAdd() {
      dispatch({
        type: 'courseTeacher/showModal',
        payload: {
          type: 'create',
          curItem: {}
        }
      })
    }
  }

  const listProps = {
    courseTeacher,
    detailPower,
    updatePower,
    sheltPower,
    sheltOffPower,
    deletePower,
    onEditItem(item) {
      dispatch({
        type: 'courseTeacher/showModal',
        payload: {
          type: 'update',
          curItem: item
        }
      })
    },
    onSheltItem({ root_id, status }){
      dispatch({
        type: 'courseTeacher/shelt',
        payload: {
          root_id, status
        }
      })
    },
    onOrderItem(item) {
      dispatch({
        type: 'courseTeacher/orderSet',
        payload: {
          curItem: item
        }
      })
    }
  }

  const modalProps = {
    modal,
    onOk(data) {
      dispatch({
        type: 'courseTeacher/createUpdate',
        payload: {
          curItem: data
        }
      })
    },
    onCancel() {
      dispatch({type: 'modal/hideModal'})
    },
  }

  return (
    <div className='content-inner'>
      <Search {...searchProps}/>
      <List {...listProps}/>
      {modal.visible && <Modal {...modalProps}/>}
    </div>
  )
}

function mapStateToProps({ courseTeacher, modal }) {
  return { courseTeacher, modal }
}

export default connect(mapStateToProps)(CourseTeacher)
