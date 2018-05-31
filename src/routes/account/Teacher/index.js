import React, {PropTypes} from 'react'
import {connect} from 'dva'
import {routerRedux} from 'dva/router'
import Search from './Search'
import List from './List'
import Modal from './ModalForm'
import {checkPower} from '../../../utils'
import {ADD, DETAIL,UPDATE} from '../../../constants/options'

const Teacher = ({location, curPowers, dispatch, accountTeacher, modal}) => {


  const {field, keyword } = location.query


  const addPower = checkPower(ADD, curPowers)

  const updatePower = checkPower(UPDATE, curPowers)

  const searchProps = {

    addPower,
    field,
    keyword,
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
    accountTeacher,
    updatePower,
    location,
    onEditItem(item) {
      dispatch({
        type: 'modal/showModal',
        payload: {
          type: 'update',
          curItem:item,

        }
      })
    },
    onforbid(item,id,status) {
      dispatch({
        type: 'accountTeacher/forbid',
        payload: {
          curItem:item,
          id,
          status
        }
      })
    },
    onrecover(item,id,status) {
      dispatch({
        type: 'accountTeacher/forbid',
        payload: {
          curItem:item,
          id,
          status
        }
      })
    },
  }

  const modalProps = {
    modal,
    onOk(data, id) {
      if(!!id) {
        dispatch({
          type: 'accountTeacher/update',
          payload: {
            curItem: data,
          }
        })
      } else {
        dispatch({
          type: 'accountTeacher/create',
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

Teacher.propTypes = {
  accountTeacher: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func
}

function mapStateToProps({ accountTeacher, modal }) {
  return { accountTeacher, modal }
}
export default connect(mapStateToProps)(Teacher)
