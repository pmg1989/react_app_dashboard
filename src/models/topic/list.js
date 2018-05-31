import { message } from 'antd'
import { routerRedux } from 'dva/router'
import { query, setTop } from '../../services/topic/list'
import { create } from '../../services/topic/add'
import { getCurPowers } from '../../utils'

export default {
  namespace: 'topicList',
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
        if (pathname === '/topic/list') {
          const curPowers = getCurPowers(pathname)
          if(curPowers) {
            dispatch({ type: 'app/changeCurPowers', payload: { curPowers } })
            dispatch({ type: 'query' })
          } else {
            dispatch(routerRedux.push({ pathname: '/no-power' }))
          }
        }
      })
    }
  },

  effects: {
    *query ({ payload }, { select, call, put }) {
      yield put({ type: 'showLoading' })
      const pathQuery = yield select(({ routing }) => routing.locationBeforeTransitions.query)
      const data = yield call(query, pathQuery)
      if (data && data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.list,
            pagination: data.page
          }
        })
      }
      yield put({ type: 'hideLoading' })
    },
    *setTop ({ payload }, { call, put }) {
      yield put({ type: 'showLoading' })
      const data = yield call(setTop, { id: payload.curItem.id })
      yield put({ type: 'hideLoading' })
      if (data && data.success) {
        yield put({ type: 'query' })
      }
    },
    *shelt ({ payload }, { call, put }) {
      yield put({ type: 'showLoading' })
      payload.curItem.status = 1
      const data = yield call(create, payload.curItem)
      yield put({ type: 'hideLoading' })
      if (data && data.success) {
        yield put({ type: 'query' })
      }
    },
    *sheltOff ({ payload }, { call, put }) {
      yield put({ type: 'showLoading' })
      payload.curItem.status = 3
      const data = yield call(create, payload.curItem)
      yield put({ type: 'hideLoading' })
      if (data && data.success) {
        yield put({ type: 'query' })
      }
    },
    *remove ({ payload }, { call, put }) {
      yield put({ type: 'showLoading' })
      payload.curItem.status = 0
      const data = yield call(create, payload.curItem)
      yield put({ type: 'hideLoading' })
      if (data && data.success) {
        yield put({ type: 'query' })
      }
    },
  },

  reducers: {
    querySuccess (state, action) {
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
