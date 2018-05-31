import React, {PropTypes} from 'react'
import {routerRedux} from 'dva/router'
import {connect} from 'dva'
import UserList from './List'
import UserSearch from './Search'
import UserModal from './ModalForm'
import UserScoreModal from './ChangeScoreForm'
import {checkPower} from '../../../utils'
import {ADD, UPDATE, DELETE, CHANGESCORE} from '../../../constants/options'

function User({location, curPowers, dispatch, accountUser, modal}) {

  const addPower = checkPower(ADD, curPowers)
  const updatePower = checkPower(UPDATE, curPowers)
  const deletePower = checkPower(DELETE, curPowers)
  const changeScorePower = checkPower(CHANGESCORE, curPowers)

  const {field, keyword} = location.query

  const searchProps = {
    field,
    keyword,
    addPower,
    onSearch(fieldsValue) {
      const {pathname} = location
      !!fieldsValue.keyword.length
        ? dispatch(routerRedux.push({
          pathname: pathname,
          query: {
            ...fieldsValue
          }
        }))
        : dispatch(routerRedux.push({pathname: pathname}))
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
    accountUser,
    updatePower,
    deletePower,
    changeScorePower,
    onDeleteItem(id) {
      dispatch({type: 'accountUser/delete', payload: {id}})
    },
    onEditItem(item) {
      dispatch({
        type: 'accountUser/showModal',
        payload: {
          type: 'update',
          curItem: item
        }
      })
    },
    onStatusItem(item) {
      dispatch({
        type: 'accountUser/updateStatus',
        payload: {
          curItem: item
        }
      })
    },
    onChangeScore(item) {
      dispatch({ type: 'accountUser/showScoreModal', payload: { curItem: item } })
    }
  }

  const modalProps = {
    modal,
    onOk(data) {
      dispatch({
        type: !!data.id
          ? 'accountUser/update'
          : 'accountUser/create',
        payload: {
          curItem: data
        }
      })
    },
    onCancel() {
      dispatch({type: 'modal/hideModal'})
    }
  }

  const scoreModalProps = {
    modal: accountUser.scoreModal,
    onOk(data) {
      dispatch({
        type: 'accountUser/changeScore',
        payload: {
          curItem: data
        }
      })
    },
    onCancel() {
      dispatch({type: 'accountUser/changeScoreModalSuccess', payload: { scoreModal: { visible: false, curItem: {} } }})
    }
  }

  return (
    <div className='content-inner'>
      <UserSearch {...searchProps}/>
      <UserList {...listProps}/>
      <UserModal {...modalProps}/>
      <UserScoreModal {...scoreModalProps}/>
    </div>
  )
}

User.propTypes = {
  accountUser: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func
}

function mapStateToProps({ accountUser, modal }) {
  return { accountUser, modal }
}

export default connect(mapStateToProps)(User)
