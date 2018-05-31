import React, {PropTypes} from 'react'
import {routerRedux} from 'dva/router'
import {connect} from 'dva'
import List from './List'
// import Search from './Search'
import {checkPower} from '../../../utils'
import {ADD, DETAIL, UPDATE, DELETE} from '../../../constants/options'

function CourseList({location, curPowers, dispatch, courseList, modal}) {

  const addPower = checkPower(ADD, curPowers)
  const detailPower = checkPower(DETAIL, curPowers)
  const updatePower = checkPower(UPDATE, curPowers)
  const deletePower = checkPower(DELETE, curPowers)

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
        type: 'courseList/showModal',
        payload: {
          type: 'create'
        }
      })
    }
  }

  const listProps = {
    courseList,
    detailPower,
    updatePower,
    deletePower,
    onOrderItem(item) {
      dispatch({
        type: 'courseList/orderSet',
        payload: {
          curItem: item
        }
      })
    }
  }

  return (
    <div className='content-inner'>
      {/*<Search {...searchProps}/>*/}
      <List {...listProps}/>
    </div>
  )
}

function mapStateToProps({ courseList, modal }) {
  return { courseList, modal }
}

export default connect(mapStateToProps)(CourseList)
