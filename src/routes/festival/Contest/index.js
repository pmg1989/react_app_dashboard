import React, {PropTypes} from 'react'
import {connect} from 'dva'
import {routerRedux} from 'dva/router'
import Search from './Search'
import List from './List'
import Modal from './ModalForm'
import {checkPower} from '../../../utils'
import {ADD, DETAIL,SHELT,SHELTOFF} from '../../../constants/options'

const Contest = ({location, curPowers, dispatch, festivalContest, modal}) => {


  const { title ,cid, actor ,mobile , order, scope } = location.query

  const {categorys} = festivalContest

  const addPower = checkPower(ADD, curPowers)
  const detailPower = checkPower(DETAIL, curPowers)
  const sheltPower = checkPower(SHELT, curPowers)
  const sheltoffPower = checkPower(SHELTOFF, curPowers)

  const searchProps = {
    categorys,
    title ,cid, actor ,mobile , order, scope ,
    addPower,
    onSearch(fieldsValue) {
      dispatch(routerRedux.push({
        pathname: location.pathname,
        query: {
          ...fieldsValue
        }
      }))
    },
    // onAdd() {
    //   dispatch({
    //     type: 'modal/showModal',
    //     payload: {
    //       type: 'create'
    //     }
    //   })
    // }
  }

  const listProps = {
    festivalContest,
    detailPower,
    sheltPower,
    sheltoffPower,
    location,
    onSheltItem(item,id,status){
      dispatch({
        type: 'festivalContest/update',
        payload: {
          curItem:item,
          id,
          status,
        }
      })
    },
    onEditItem(item) {
      dispatch({
        type: 'modal/showModal',
        payload: {
          curItem:item,
        }
      })
    },
    onUpdateIntern(path) {
      dispatch({
        type: 'festivalContest/updateIntern',
        payload: { path }
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

Contest.propTypes = {
  festivalContest: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func
}

function mapStateToProps({ festivalContest, modal }) {
  return { festivalContest, modal }
}
export default connect(mapStateToProps)(Contest)
