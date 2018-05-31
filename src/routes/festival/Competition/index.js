import React, {PropTypes} from 'react'
import {connect} from 'dva'
import {routerRedux} from 'dva/router'
import Search from './Search'
import List from './List'
import Modal from './ModalForm'
import {checkPower} from '../../../utils'
import {ADD, UPDATE, DELETE, SHELT, SHELTOFF} from '../../../constants/options'

const Competition = ({location, curPowers, dispatch, festivalCompetition, modal}) => {

  const { status, dateStatus, title } = location.query

  const addPower = checkPower(ADD, curPowers)
  const updatePower = checkPower(UPDATE, curPowers)
  const deletePower = checkPower(DELETE, curPowers)
  const sheltPower = checkPower(SHELT, curPowers)
  const sheltoffPower = checkPower(SHELTOFF, curPowers)

  const searchProps = {
    status,
    dateStatus,
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
        type: 'festivalCompetition/showModal',
        payload: {
          type: 'create'
        }
      })
    }
  }

  const listProps = {
    festivalCompetition,
    updatePower,
    sheltPower,
    sheltoffPower,
    deletePower,
    location,
    onDeleteItem(data) {
      dispatch({
        type: 'festivalCompetition/save',
        payload: {
          curItem: data
        }
      })
    },
    onEditItem(item) {
      dispatch({
        type: 'festivalCompetition/showModal',
        payload: {
          type: 'update',
          curItem: item
        }
      })
    },
    onSheltItem(item){
      dispatch({
        type: 'festivalCompetition/save',
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
        type: 'festivalCompetition/save',
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

Competition.propTypes = {
  festivalCompetition: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func
}

function mapStateToProps({ festivalCompetition, modal }) {
  return { festivalCompetition, modal }
}
export default connect(mapStateToProps)(Competition)
