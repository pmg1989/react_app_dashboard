import React, {PropTypes} from 'react'
import {connect} from 'dva'
import {routerRedux} from 'dva/router'
import Search from './Search'
import List from './List'
import Modal from './ModalForm'
import {checkPower} from '../../../utils'
import {ADD, UPDATE, DELETE} from '../../../constants/options'

const CarouselList = ({location, curPowers, dispatch, carouselList, modal}) => {

  const { os, status, page, period } = location.query

  const addPower = checkPower(ADD, curPowers)
  const updatePower = checkPower(UPDATE, curPowers)
  const deletePower = checkPower(DELETE, curPowers)

  const searchProps = {
    os,
    status,
    page,
    addPower,
    spining: carouselList.spining,
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
    },
    onRefresh() {
      dispatch({type: 'carouselList/refresh'})
    }
  }

  const listProps = {
    carouselList,
    updatePower,
    deletePower,
    location,
    onDeleteItem(data) {
      dispatch({
        type: 'carouselList/save',
        payload: {
          curItem: data
        }
      })
    },
    onEditItem(item) {
      dispatch({
        type: 'modal/showModal',
        payload: {
          type: 'update',
          curItem: item
        }
      })
    }
  }

  const modalProps = {
    modal,
    page,
    onOk(data) {
      dispatch({
        type: 'carouselList/save',
        payload: {
          curItem: data
        }
      })
    },
    onCancel() {
      dispatch({type: 'modal/hideModal'})
    },
    onQueryCourse(key) {
      dispatch({type: 'carouselList/queryCourse', payload: { key }})
    },
    onResetCourse() {
      dispatch({type: 'carouselList/resetCourse'})
    }
  }

  return (
    <div className='content-inner'>
      <Search {...searchProps}/>
      <List {...listProps}/>
      {modal.visible && <Modal {...modalProps}/>}
    </div>
  )
}

CarouselList.propTypes = {
  carouselList: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func
}

function mapStateToProps({ carouselList, modal }) {
  return { carouselList, modal }
}
export default connect(mapStateToProps)(CarouselList)
