import { routerRedux } from 'dva/router'
import { queryCategory } from '../../services/bbs/category'
import { getSendList, sendStatus } from '../../services/bbs/send'
import { getCurPowers } from '../../utils'

export default {
  namespace: 'bbsSend',
  state: {
    categorys: [],
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
        if (pathname === '/bbs/send') {
          const curPowers = getCurPowers(pathname)
          if(curPowers) {
            dispatch({ type: 'app/changeCurPowers', payload: { curPowers } })
            dispatch({ type: 'queryCategory' })
          } else {
            dispatch(routerRedux.push({ pathname: '/no-power' }))
          }
        }
      })
    }
  },
  effects: {
    *queryCategory ({ payload }, { select, call, put }) {
      yield put({ type: 'showLoading' })
      const data = yield call(queryCategory)
      if (data && data.success) {
        yield put({
          type: 'queryCategorySuccess',
          payload: {
            categorys: data.categorys
          }
        })
      }
      yield put({ type: 'queryList' })
      yield put({ type: 'hideLoading' })
    },
    *queryList ({ payload }, { select, call, put }) {
      yield put({ type: 'showLoading' })
      const pathQuery = yield select(({ routing }) => routing.locationBeforeTransitions.query)
      const data = yield call(getSendList, { para: pathQuery })
      if (data && data.success) {
        yield put({
          type: 'queryListSuccess',
          payload: {
            list: data.bbssend,
            pagination: {
              current: 1,
              pageSize: 10,
              total: data.count
            }
          }
        })
      }
      yield put({ type: 'hideLoading' })
    },
    *sendStatus ({ payload }, { select, call, put }) {
      const { sendid, type, flg } = payload

      yield put({ type: 'showLoading' })
      const data = yield call(sendStatus, { para: {
        sendid, type, flg
      } })
      if (data && data.success) {

      }
      yield put({ type: 'hideLoading' })
    }
  },
  reducers: {
    queryCategorySuccess(state, action) {
      return { ...state, ...action.payload }
    },
    queryListSuccess(state, action) {
      return { ...state, ...action.payload }
    }
  }
}
