import { message } from 'antd'
import { queryList, queryDetail } from '../../services/coupon/send-list'
import { getCurPowers } from '../../utils'

export default {
  namespace: 'couponSendList',
  state: {
    list: [],
    loading: false,
    pagination: {
      current: 1,
      pageSize: 10,
      total: null
    }
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(location => {
        const pathname = location.pathname
        if (pathname === '/coupon/send-list') {
          const curPowers = getCurPowers(pathname)
          if(curPowers) {
            dispatch({ type: 'app/changeCurPowers', payload: { curPowers } })
            dispatch({ type: 'queryList' })
          } else {
            dispatch(routerRedux.push({ pathname: '/no-power' }))
          }
        }
      })
    }
  },

  effects: {
    *queryList ({ payload }, { select, call, put }) {
      yield put({ type: 'showLoading' })
      const pathQuery = yield select(({ routing }) => routing.locationBeforeTransitions.query)
      const data = yield call(queryList, pathQuery)
      if (data && data.success) {
        yield put({
          type: 'queryListSuccess',
          payload: {
            list: data.list,
            pagination: data.page
          }
        })
      }
      yield put({ type: 'hideLoading' })
    },
    *showModal ({ payload }, { call, put }) {
      const { id } = payload

      yield put({ type: 'modal/showModal', payload: { loading: true } })

      const data = yield call(queryDetail, { batch_id: id })
      if(data && data.success) {
        yield put({ type: 'modal/hideLoading', payload: { curItem: { list: data.list } } })
      }
    },
  },

  reducers: {
    queryListSuccess (state, action) {
      return { ...state, ...action.payload }
    },
    showLoading (state) {
      return { ...state, loading: true }
    },
    hideLoading (state) {
      return { ...state, loading: false }
    }
  }
}
