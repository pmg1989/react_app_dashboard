import React, {PropTypes} from 'react'
import {connect} from 'dva'
import {routerRedux} from 'dva/router'
import Search from './Search'
import List from './List'
import Modal from './ModalForm'
import {checkPower} from '../../../utils'
import {ADD, UPDATE,SHELT,SHELTOFF} from '../../../constants/options'

const Accompany = ({location, curPowers, dispatch, festivalAccompany, modal}) => {

  const { title } = location.query

  const addPower = checkPower(ADD, curPowers)
  const updatePower = checkPower(UPDATE, curPowers)
  const sheltPower = checkPower(SHELT, curPowers)
  const sheltoffPower = checkPower(SHELTOFF, curPowers)

  const searchProps = {
    title,
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
    festivalAccompany,
    updatePower,
    sheltPower,
    sheltoffPower,
    location,
    onDeleteItem(data) {
      dispatch({
        type: 'festivalAccompany/save',
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
    },
    onSheltItem(item){
      dispatch({
        type: 'festivalAccompany/update',
        payload: {
          curItem:item
        }
      })
    }
  }

  const modalProps = {
    modal,
    onOk(data) {
      dispatch({
        type: 'festivalAccompany/save',
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

Accompany.propTypes = {
  festivalAccompany: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func
}

function mapStateToProps({ festivalAccompany, modal }) {
  return { festivalAccompany, modal }
}
export default connect(mapStateToProps)(Accompany)
