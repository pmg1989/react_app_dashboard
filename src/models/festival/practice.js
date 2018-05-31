import { message } from 'antd'
import { routerRedux } from 'dva/router'
import { query, create, update, shelt, remove } from '../../services/festival/practice'
import { getCurPowers, renderPageQuery } from '../../utils'

export default {
  namespace: 'festivalPractice',
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
        if (pathname === '/festival/practice') {
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
      const { pageSize } = yield select(({ festivalPractice }) => festivalPractice.pagination)
      const pathQuery = yield select(({ routing }) => routing.locationBeforeTransitions.query)
      const data = yield call(query, renderPageQuery(pathQuery, pageSize))
      if (data && data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.practice_songs,
            pagination: {
              current: +pathQuery.page || 1,
              pageSize,
              total: data.total
            }
          }
        })
      }
      yield put({ type: 'hideLoading' })
    },
    *create ({ payload }, { call, put }) {
      yield put({ type: 'modal/showLoading' })
      const data = yield call(create, payload.curItem)
      yield put({ type: 'modal/hideLoading' })
      if (data && data.success) {
        yield put({ type: 'modal/hideModal' })
        yield put({ type: 'query' })
      }
    },
    *update ({ payload }, { call, put }) {
      yield put({ type: 'modal/showLoading' })
      const data = yield call(update, payload.id, payload.curItem)
      yield put({ type: 'modal/hideLoading' })
      if (data && data.success) {
        yield put({ type: 'modal/hideModal' })
        yield put({ type: 'query' })
      }
    },
    *remove ({ payload }, { call, put }) {
      const data = yield call(remove, payload.id)
      if (data && data.success) {
        yield put({ type: 'query' })
      }
    },
    *shelt ({ payload }, { call, put }) {
      const { id, status } = payload
      const data = yield call(shelt, id, status)
      if (data && data.success) {
        yield put({ type: 'modal/hideModal' })
        yield put({ type: 'query' })
      }
    },
    *orderSet ({ payload }, { call, put }) {
      const { id, orderNo } = payload
      const data = yield call(update, id, { orderNo })
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
    },
    deleteSuccess (state, action){
      const { id } = action.payload
      return {...state, list:state.list.filter(item => item.cid !== id)}
    }
  }
}
