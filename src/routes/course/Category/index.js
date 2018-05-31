import React, {PropTypes} from 'react'
import {routerRedux} from 'dva/router'
import {connect} from 'dva'
import List from './List'
import Search from './Search'
import Modal from './ModalForm'

import {checkPower} from '../../../utils'
import {ADD, DETAIL, UPDATE, DELETE} from '../../../constants/options'

function CourseCategory({location, curPowers, dispatch ,courseCategory,modal}) {

  const addPower = checkPower(ADD, curPowers)
  const detailPower = checkPower(DETAIL, curPowers)
  const updatePower = checkPower(UPDATE, curPowers)
  const deletePower = checkPower(DELETE, curPowers)

  const {field ,keyword} =location.query

  const searchProps={
    addPower,
    onAdd() {
      dispatch({
        type: 'modal/showModal',
        payload: {
          type: 'create'
        }
      })
    }

  }

  const listProps = {
    courseCategory,
    deletePower,
    detailPower,
    updatePower,
    onOrderItem(item) {
      dispatch({
        type: 'courseCategory/orderSet',
        payload: {
          curItem: item
        }
      })
    },
    oneditItem(item){
      dispatch({
        type: 'modal/showModal',
        payload: {
          type:'update',
          curItem: item
        }
      })
    },
    onDeleteItem(id){
      dispatch({
        type:'courseCategory/remove',
        payload: {
          id
        }
      })
    }
  }

  const modalProps = {
    modal,
    onOk(data, id) {
      if(!!id) {
        dispatch({
          type: 'courseCategory/update',
          payload: {
            curItem: data,
            id
          }
        })
      } else {
        dispatch({
          type: 'courseCategory/create',
          payload: {
            curItem: data
          }
        })
      }
    },
    onCancel() {
      dispatch({type: 'modal/hideModal'})
    },
  }

  return (
    <div className="content-inner">
      <Search {...searchProps}/>
      <List {...listProps}/>
      {modal.visible && <Modal {...modalProps}/>}

    </div>
  )
}


function mapStateToProps({ courseCategory, modal }) {
  return { courseCategory, modal }
}

export default connect(mapStateToProps)(CourseCategory)