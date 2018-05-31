import React, {PropTypes} from 'react'
import {routerRedux} from 'dva/router'
import {connect} from 'dva'
import List from './List'
import Search from './Search'
import Modal from './ModalForm'
import {checkPower} from '../../../utils'
import {ADD, DETAIL, UPDATE, DELETE} from '../../../constants/options'

function LiveList({location, curPowers, dispatch, liveList, modal}) {

  const addPower = checkPower(ADD, curPowers)
  const detailPower = checkPower(DETAIL, curPowers)
  const updatePower = checkPower(UPDATE, curPowers)
  const deletePower = checkPower(DELETE, curPowers)

  const {field, keyword} = location.query

  const searchProps = {
    field,
    keyword,
    status,
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
        type: 'modal/showModal',
        payload: {
          type: 'create'
        }
      })
    }
  }

  const listProps = {
    liveList,
    detailPower,
    updatePower,
    deletePower,
    onDeleteItem(id) {
      dispatch({type: 'liveList/delete', payload: {id}})
    },
    onEditItem(item) {
      dispatch({
        type: 'liveList/showModal',
        payload: {
          type: 'update',
          curItem: item
        }
      })
    },
    onDetailItem(item) {
      dispatch({
        type: 'liveList/showModal',
        payload: {
          type: 'detail',
          curItem: item
        }
      })
    }
  }

  const modalProps = {
    modal,
    onOk(data) {
      dispatch({
        type: !!data.base.id
          ? 'liveList/update'
          : 'liveList/create',
        payload: {
          curItem: data
        }
      })
    },
    onCancel() {
      dispatch({type: 'modal/hideModal'})
    }
  }

  return (
    <div className='content-inner'>
      <Search {...searchProps}/>
      <List {...listProps}/>
      <Modal {...modalProps}/>
    </div>
  )
}

function mapStateToProps({ liveList, modal }) {
  return { liveList, modal }
}

export default connect(mapStateToProps)(LiveList)
