import React, {PropTypes} from 'react'
import {connect} from 'dva'
import {routerRedux} from 'dva/router'
import Search from './Search'
import List from './List'
import {checkPower} from '../../../utils'
import {ADD, UPDATE, DELETE, TOP, SHELT, SHELTOFF} from '../../../constants/options'

const TopicList = ({location, curPowers, dispatch, topicList}) => {

  const { status, start_date, end_date } = location.query

  const addPower = checkPower(ADD, curPowers)
  const updatePower = checkPower(UPDATE, curPowers)
  const deletePower = checkPower(DELETE, curPowers)
  const topPower = checkPower(TOP, curPowers)
  const sheltPower = checkPower(SHELT, curPowers)
  const sheltOffPower = checkPower(SHELTOFF, curPowers)

  const searchProps = {
    start_date,
    end_date,
    status,
    addPower,
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
    topicList,
    updatePower,
    deletePower,
    topPower,
    sheltPower,
    sheltOffPower,
    location,
    onTop(item) {
      dispatch({
        type: 'topicList/setTop',
        payload: {
          curItem: item
        }
      })
    },
    onShelt(item) {
      dispatch({
        type: 'topicList/shelt',
        payload: {
          curItem: item
        }
      })
    },
    onSheltOff(item) {
      dispatch({
        type: 'topicList/sheltOff',
        payload: {
          curItem: item
        }
      })
    },
    onDeleteItem(data) {
      dispatch({
        type: 'topicList/remove',
        payload: {
          curItem: data
        }
      })
    }
  }

  return (
    <div className='content-inner'>
      <Search {...searchProps}/>
      <List {...listProps}/>
    </div>
  )
}

TopicList.propTypes = {
  topicList: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func
}

function mapStateToProps({ topicList }) {
  return { topicList }
}
export default connect(mapStateToProps)(TopicList)
