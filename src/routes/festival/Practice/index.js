import React, {PropTypes} from 'react'
import {connect} from 'dva'
import {routerRedux} from 'dva/router'
import Search from './Search'
import List from './List'
import Modal from './ModalForm'
import {checkPower} from '../../../utils'
import {ADD, UPDATE, DELETE, SHELT, SHELTOFF} from '../../../constants/options'

const Practice = ({location, curPowers, dispatch, festivalPractice, modal}) => {

  const addPower = checkPower(ADD, curPowers)
  const updatePower = checkPower(UPDATE, curPowers)
  const deletePower = checkPower(DELETE, curPowers)
  const sheltPower = checkPower(SHELT, curPowers)
  const sheltoffPower = checkPower(SHELTOFF, curPowers)

  const searchProps = {
    ...location.query,
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
    },
    onRefresh() {
      dispatch({type: 'festivalPractice/refresh'})
    }
  }

  const listProps = {
    festivalPractice,
    updatePower,
    deletePower,
    sheltPower,
    sheltoffPower,
    location,
    onDeleteItem(id) {
      dispatch({
        type: 'festivalPractice/remove',
        payload: {
          id
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
    },
    onSheltItem({ id, status }){
      dispatch({
        type: 'festivalPractice/shelt',
        payload: {
          id, status
        }
      })
    },
    onOrderSet({ id, orderNo }) {
      dispatch({
        type: 'festivalPractice/orderSet',
        payload: {
          id, orderNo
        }
      })
    }
  }

  const modalProps = {
    modal,
    onOk(data, id) {
      if(!!id) {
        dispatch({
          type: 'festivalPractice/update',
          payload: {
            curItem: data,
            id
          }
        })
      } else {
        dispatch({
          type: 'festivalPractice/create',
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
    <div className='content-inner'>
      <Search {...searchProps}/>
      <List {...listProps}/>
      {modal.visible && <Modal {...modalProps}/>}
    </div>
  )
}

Practice.propTypes = {
  festivalPractice: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func
}

function mapStateToProps({ festivalPractice, modal }) {
  return { festivalPractice, modal }
}
export default connect(mapStateToProps)(Practice)
