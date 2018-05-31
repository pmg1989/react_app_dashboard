import React, {PropTypes} from 'react'
import {routerRedux} from 'dva/router'
import {connect} from 'dva'
import FlowList from './List'
import FlowSearch from './Search'
import {checkPower} from '../../../utils'
import {ADD, DETAIL} from '../../../constants/options'

function Flow({ location, curPowers, dispatch, orderFlow }) {

  const { phone, start_date, end_date, os, type, status } = location.query

  const searchProps = {
    phone,
    start_date,
    end_date,
    os,
    type,
    status,
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
    orderFlow
  }

  return (
    <div className='content-inner'>
      <FlowSearch {...searchProps} />
      <FlowList {...listProps} />
    </div>
  )
}

function mapStateToProps({ orderFlow }) {
  return { orderFlow }
}

export default connect(mapStateToProps)(Flow)
