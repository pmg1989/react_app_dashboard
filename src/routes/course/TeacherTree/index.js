import React, {PropTypes} from 'react'
import {routerRedux} from 'dva/router'
import {connect} from 'dva'
import List from './List'
import Search from './Search'
import Modal from './ModalForm'
import {checkPower} from '../../../utils'
import {ADD, DETAIL, UPDATE, DELETE, SHELT, SHELTOFF} from '../../../constants/options'

function CourseTeacherTree({location, curPowers, dispatch, courseTeacherTree, modal}) {

  const addPower = checkPower(ADD, curPowers)
  const detailPower = checkPower(DETAIL, curPowers)
  const updatePower = checkPower(UPDATE, curPowers)
  const deletePower = checkPower(DELETE, curPowers)
  const sheltPower = checkPower(SHELT, curPowers)
  const sheltoffPower = checkPower(SHELTOFF, curPowers)

  const searchProps = {
    addPower,
    query: location.query,
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
        type: 'courseTeacherTree/showModal',
        payload: {
          type: 'create',
          curItem: {}
        }
      })
    }
  }

  const listProps = {
    courseTeacherTree,
    detailPower,
    updatePower,
    deletePower,
    sheltPower,
    sheltoffPower,
    onShelt(item) {
      dispatch({
        type: 'courseTeacherTree/sheltOnOff',
        payload: {
          curItem: { ...item, status: 10 }
        }
      })
    },
    onSheltOff(item) {
      dispatch({
        type: 'courseTeacherTree/sheltOnOff',
        payload: {
          curItem: { ...item, status: 0 }
        }
      })
    },
    onEditItem(item) {
      dispatch({
        type: 'courseTeacherTree/showModal',
        payload: {
          type: 'update',
          curItem: item
        }
      })
    }
  }

  const modalProps = {
    root_id: courseTeacherTree.root_id,
    modal,
    onOk(data) {
      dispatch({
        type: 'courseTeacherTree/createUpdate',
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

function mapStateToProps({ courseTeacherTree, modal }) {
  return { courseTeacherTree, modal }
}

export default connect(mapStateToProps)(CourseTeacherTree)
