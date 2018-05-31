import { message } from 'antd'
import { routerRedux } from 'dva/router'
import { query, save, queryCourse } from '../../services/festival/competition'
import { query as queryPcList } from '../../services/festival/practice'
import { getCurPowers } from '../../utils'

export default {
  namespace: 'festivalCompetition',
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
        if (pathname === '/festival/competition') {
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
    *showModal({ payload }, { call, put }) {
      const { type, curItem } = payload

      if(type === "create") {
        yield put({ type: 'modal/showModal', payload: { type, loading: true } })
      } else {
        yield put({ type: 'modal/showModal', payload: { type, curItem, loading: true } })
      }

      const data = yield call(queryPcList, { page: 1, size: 0 })
      if(data && data.success) {
        yield put({ type: 'modal/setOtherItem', payload: { key: 'practiceList', value: data.practice_songs } })
      }
      const data2 = yield call(queryCourse, { type: 'competition', pageSize: 1000 })
      if(data2 && data2.success) {
        yield put({ type: 'modal/setOtherItem', payload: { key: 'courseList', value: data2.list, loading: false } })
      }
    },
    *save ({ payload }, { call, put }) {
      yield put({ type: 'modal/showLoading' })
      const data = yield call(save, payload.curItem)
      yield put({ type: 'modal/hideLoading' })
      if (data && data.success) {
        yield put({ type: 'modal/hideModal' })
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
