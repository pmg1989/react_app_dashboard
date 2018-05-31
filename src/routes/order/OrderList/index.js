import React, {PropTypes} from 'react'
import {routerRedux} from 'dva/router'
import {connect} from 'dva'
import List from './List'
import OrderSearch from './Search'
import {checkPower} from '../../../utils'
import {ADD, DETAIL} from '../../../constants/options'

function OrderList({ location, curPowers, dispatch, orderList }) {

  const { phone, start_date, end_date, os, pay_type, status } = location.query

  const searchProps = {
    phone,
    start_date,
    end_date,
    os,
    pay_type,
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
    orderList
  }

  return (
    <div className='content-inner'>
      <OrderSearch {...searchProps} />
      <List {...listProps} />
    </div>
  )
}

OrderList.propTypes = {
  orderList: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func
}

function mapStateToProps({ orderList }) {
  return { orderList }
}

export default connect(mapStateToProps)(OrderList)
