import React, {PropTypes} from 'react'
import {routerRedux} from 'dva/router'
import {connect} from 'dva'
import List from './List'
import Search from './Search'
import {checkPower} from '../../../utils'
import {ADD, DETAIL} from '../../../constants/options'

function Send({ location, curPowers, dispatch, bbsSend }) {

  const { timestart, timeend, category, hot, ess, check, del, word, username, label } = location.query

  const { categorys } = bbsSend

  const searchProps = {
    categorys,
    timestart, timeend, category, hot, ess, check, del, word, username, label,
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
    bbsSend,
    sendStatus({ sendid, type, flg }) {
      dispatch({ type: 'bbsSend/sendStatus', payload: { sendid, type, flg } })
    }
  }

  return (
    <div className='content-inner'>
      <Search {...searchProps} />
      <List {...listProps} />
    </div>
  )
}

Send.propTypes = {
  bbsSend: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func
}

function mapStateToProps({ bbsSend }) {
  return { bbsSend }
}

export default connect(mapStateToProps)(Send)
