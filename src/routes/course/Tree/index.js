import React, {PropTypes} from 'react'
import {routerRedux} from 'dva/router'
import {connect} from 'dva'
import Tree from './Tree'
import Modal from './ModalForm'
import {checkPower} from '../../../utils'
import {UPDATE, DELETE} from '../../../constants/options'

function CourseTree({location, curPowers, dispatch, courseTree, modal}) {

  const updatePower = checkPower(UPDATE, curPowers)
  const deletePower = checkPower(DELETE, curPowers)

  const {field, keyword} = location.query

  const listProps = {
    courseTree,
    updatePower,
    deletePower,
    onDeleteItem(id) {
      dispatch({type: 'courseTree/delete', payload: {id}})
    },
    onEditItem(item) {
      dispatch({
        type: 'courseTree/showModal',
        payload: {
          type: 'update',
          curItem: item
        }
      })
    },
    onGoBack() {
      dispatch(routerRedux.goBack())
    }
  }

  const modalProps = {
    modal,
    onOk(data) {
      dispatch({
        type: !!data.detail_id
          ? 'courseTree/update'
          : 'courseTree/create',
        payload: {
          curItem: data
        }
      })
    },
    onCancel() {
      dispatch({type: 'modal/hideModal'})
    }
  }

  const TreeGen = () => <Tree {...listProps}/>

  return (
    <div className='content-inner'>
      <TreeGen />
      <Modal {...modalProps}/>
    </div>
  )
}

function mapStateToProps({ courseTree, modal }) {
  return { courseTree, modal }
}

export default connect(mapStateToProps)(CourseTree)
