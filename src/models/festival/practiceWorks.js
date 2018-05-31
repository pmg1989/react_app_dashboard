/**
 * Created by NEWBAND on 2017/6/27.
 */
import { message } from 'antd'
import { routerRedux } from 'dva/router'
import { query, update, updateIntern } from '../../services/festival/practiceWorks'
import { getCurPowers, renderPageQuery } from '../../utils'

export default {
  namespace: 'festivalPracticeWorks',
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
        if (pathname === '/festival/practice-works') {
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
      const { pageSize } = yield select(({ festivalPracticeWorks }) => festivalPracticeWorks.pagination)
      const pathQuery = yield select(({ routing }) => routing.locationBeforeTransitions.query)
      const data = yield call(query, renderPageQuery(pathQuery, pageSize))
      if (data && data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.songs,
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

    *update ({payload}, {call, put}) {
      yield put({ type: 'showLoading' })
      const data = yield call(update, payload.curItem,payload.id,payload.status)
      yield put({ type: 'hideLoading' })
      if (data && data.success) {
        yield put({ type: 'modal/hideModal' })
        yield put({ type: 'query' })

      }
    },
    *updateIntern ({ payload }, { call, put }) {
      yield put({ type: 'showLoading' })
      const { path } = payload
      const data = yield call(updateIntern, path)
      yield put({ type: 'hideLoading' })
      if (data && data.success) {
        //yield put({ type: 'query' })
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
