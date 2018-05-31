import React, {PropTypes} from 'react'
import {connect} from 'dva'
import {routerRedux} from 'dva/router'
import Search from './Search'
import List from './List'
import Modal from './ModalList'
import {checkPower} from '../../../utils'
import {ADD, UPDATE} from '../../../constants/options'

const SendList = ({location, curPowers, dispatch, couponSendList, modal}) => {

  const addPower = checkPower(ADD, curPowers)
  const updatePower = checkPower(UPDATE, curPowers)

  const searchProps = {
    ...location.query,
    onSearch(fieldsValue) {
      dispatch(routerRedux.push({
        pathname: location.pathname,
        query: {
          ...fieldsValue
        }
      }))
    }
  }

  const listProps = {
    couponSendList,
    updatePower,
    onUpdateItem(item) {
      dispatch({
        type: 'couponSendList/showModal',
        payload: {
          id: item.id
        }
      })
    }
  }

  const modalProps = {
    modal,
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

SendList.propTypes = {
  couponSendList: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func
}

function mapStateToProps({ couponSendList, modal }) {
  return { couponSendList, modal }
}
export default connect(mapStateToProps)(SendList)
