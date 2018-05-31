import { message } from 'antd'
import { routerRedux } from 'dva/router'
import { query, get, update } from '../../services/live/list'
import { getCurPowers } from '../../utils'

export default {
  namespace: 'liveList',
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
        if (pathname === '/live/list') {
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
      if (data.success) {
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
    *update ({ payload }, { call, put }) {
      yield put({ type: 'modal/showLoading' })
      const data = yield call(update, payload.curItem)
      yield put({ type: 'modal/hideLoading' })
      if (data && data.success) {
        yield put({ type: 'modal/hideModal' })
        yield put({ type: 'query' })
      }
    },
    *showModal ({ payload }, { call, put }) {
      const { type, curItem } = payload
      let newData = { curItem: {} }

      yield put({ type: 'modal/showModal', payload: { loading: true, type: type } })

      const dataGet = yield call(get, { root_id: curItem.id })

      if(dataGet && dataGet.success) {
        newData.curItem = dataGet
      }

      yield put({ type: 'modal/hideLoading', payload: newData })
    },
  },

  reducers: {
    showLoading (state) {
      return { ...state, loading: true }
    },
    hideLoading (state) {
      return { ...state, loading: false }
    },
    querySuccess (state, action) {
      return { ...state, ...action.payload }
    }
  }

}
