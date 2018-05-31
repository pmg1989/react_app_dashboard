import { routerRedux } from 'dva/router'
import { query, save } from '../../../services/collect/recommend'
import { getCurPowers } from '../../../utils'

const KEY = 'main_search'

export default {
  namespace: 'collectMainSearch',
  state: {
    list: [],
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(location => {
        const pathname = location.pathname
        if (pathname === '/collect/recommend') {
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
    *queryList ({ payload }, { call, put }) {
      const data = yield call(query, { type: KEY })
      if(data.success) {
        yield put({ type: 'queryListSuccess', payload: { list: data.data } })
      }
    },
    *sortList ({ payload }, { call, put }) {
      const { list } = payload
      yield put({ type: 'sortListSuccess', payload: { list } })
      yield call(save, { type: KEY, data: JSON.stringify(list) })
    },
    *removeItem ({ payload }, { call, put }) {
      const { list } = payload
      yield put({ type: 'sortList', payload: { list } })
    },
    *addItem ({ payload }, { select, call, put }) {
      const { item } = payload
      yield put({ type: 'addItemSucces', payload: { item } })

      const { list } = yield select(state => state.collectMainSearch)
      list.unshift(item)
      yield put({ type: 'sortList', payload: { list } })
    },
  },

  reducers: {
    queryListSuccess (state, action) {
      return { ...state, ...action.payload }
    },
    sortListSuccess (state, action) {
      return { ...state, ...action.payload }
    },
    removeItemSucces (state, action) {
      return { ...state, ...action.payload }
    },
    addItemSucces (state, action) {
      const { item } = action.payload
      const { list } = state
      return { ...state, list: [...list, ...item] }
    },
  }

}
