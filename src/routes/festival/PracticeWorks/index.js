import React, {PropTypes} from 'react'
import {connect} from 'dva'
import {routerRedux} from 'dva/router'
import Search from './Search'
import List from './List'
import Modal from './ModalForm'
import {checkPower} from '../../../utils'
import {ADD, DETAIL,SHELT,SHELTOFF} from '../../../constants/options'

const PracticeWorks = ({location, curPowers, dispatch, festivalPracticeWorks, modal}) => {


  const { title , actor ,mobile , order, scope } = location.query


  const addPower = checkPower(ADD, curPowers)
  const detailPower = checkPower(DETAIL, curPowers)
  const sheltPower = checkPower(SHELT, curPowers)
  const sheltoffPower = checkPower(SHELTOFF, curPowers)

  const searchProps = {

    title, actor ,mobile , order, scope ,
    addPower,
    onSearch(fieldsValue) {
      dispatch(routerRedux.push({
        pathname: location.pathname,
        query: {
          ...fieldsValue
        }
      }))
    },
  }

  const listProps = {
    festivalPracticeWorks,
    detailPower,
    sheltPower,
    sheltoffPower,
    location,
    onSheltItem(item,id,status){
      dispatch({
        type: 'festivalPracticeWorks/update',
        payload: {
          curItem:item,
          id,
          status
        }
      })
    },
    onEditItem(item) {
      dispatch({
        type: 'modal/showModal',
        payload: {
          curItem:item
        }
      })
    },
    onUpdateIntern(path) {
      dispatch({
        type: 'festivalPracticeWorks/updateIntern',
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

PracticeWorks.propTypes = {
  festivalPracticeWorks: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func
}

function mapStateToProps({ festivalPracticeWorks, modal }) {
  return { festivalPracticeWorks, modal }
}
export default connect(mapStateToProps)(PracticeWorks)
