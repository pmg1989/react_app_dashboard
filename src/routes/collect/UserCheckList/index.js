import React, {PropTypes} from 'react'
import {connect} from 'dva'
import {routerRedux} from 'dva/router'
import List from './List'
import Modal from './ModalForm'
import {checkPower} from '../../../utils'
import {UPDATE} from '../../../constants/options'

const Teacher = ({ location, curPowers, dispatch, collectUserCheckList, modal}) => {
  const {field, keyword } = location.query

  const updatePower = checkPower(UPDATE, curPowers)

  const listProps = {
    collectUserCheckList,
    updatePower,
    location,
    onforbid(item ,status) {
      dispatch({
        type: 'collectUserCheckList/forbid',
        payload: {
          curItem:item,
          status
        }
      })
    },
    onrecover(item, status) {
      dispatch({
        type: 'collectUserCheckList/forbid',
        payload: {
          curItem:item,
          status
        }
      })
    },
    onShowModal (item) {
      dispatch({
        type: 'modal/showModal',
        payload: {
          type: 'detail',
          curItem: item,
        }
      })
    }
  }

  const modalProps = {
    modal,
    onCancel() {
      dispatch({ type: 'modal/hideModal' })
    },
  }

  return (
    <div className='content-inner'>
      <List {...listProps}/>
      {modal.visible && <Modal {...modalProps} />}
    </div>
  )
}

Teacher.propTypes = {
  collectUserCheckList: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func
}

function mapStateToProps({ collectUserCheckList, modal }) {
  return { collectUserCheckList, modal }
}
export default connect(mapStateToProps)(Teacher)
