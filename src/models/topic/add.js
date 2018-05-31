import { routerRedux } from 'dva/router'
import { get, create, update } from '../../services/topic/add'
import { getCurPowers } from '../../utils'

export default {
  namespace: 'topicAdd',
  state: {
    model: {},
    loading: false
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(location => {
        const pathname = location.pathname
        if (pathname === '/topic/add') {
          const curPowers = getCurPowers(pathname)
          if(curPowers) {
            const { id } = location.query
            !!id && dispatch({ type: 'query', payload: { id } })
            dispatch({ type: 'app/changeCurPowers', payload: { curPowers } })
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
      const data = yield call(get, { id: payload.id })
      yield put({ type: 'hideLoading' })
      if (!!data.id) {
        yield put({
          type: 'querySuccess',
          payload: {
            model: data
          }
        })
      }
    },
    *create ({ payload }, { select, call, put }) {
      yield put({ type: 'showLoading' })
      const data = yield call(create, payload.curItem)
      yield put({ type: 'hideLoading' })
      if (data && data.success) {
        yield put(routerRedux.push({
          pathname: '/topic/list',
          query: { status: 1 }
        }))
      }
    },
    *update ({ payload }, { select, call, put }) {
      yield put({ type: 'showLoading' })
      const data = yield call(create, payload.curItem)
      yield put({ type: 'hideLoading' })
      if (data && data.success) {
        if(+payload.curItem.status == 1 && !payload.preview) {
          yield put(routerRedux.goBack())
        }
      }
    }
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
