/**
 * Created by NEWBAND on 2017/6/23.
 */
import { message } from 'antd'
import { routerRedux } from 'dva/router'
import { query, save,update ,getContestList,updateIntern} from '../../services/festival/contest'
import { query as queryCategory } from '../../services/festival/competition'
import { getCurPowers,renderPageQuery } from '../../utils'

export default {
  namespace: 'festivalContest',
  state: {
    categorys: [],
    list:[],
    loading:false,
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
        if (pathname === '/festival/contest') {
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
      const data = yield call(queryCategory, { status: 1 })
      if (data && data.success) {
        yield put({
          type: 'queryCategorySuccess',
          payload: {
            categorys: data.list
          }
        })
      }
      if(!!data.list.length) {
        yield put({ type: 'queryList',payload:{ cid: data.list[0].cid }})
      }
    },
    *queryList ({ payload }, { select, call, put }) {
      yield put({ type: 'showLoading' })
      const { pageSize } = yield select(({ festivalContest }) => festivalContest.pagination)
      const pathQuery = yield select(({ routing }) => routing.locationBeforeTransitions.query)

      const params = {
        cid: pathQuery.cid ? pathQuery.cid : payload.cid,
        ...pathQuery
      }

      const data = yield call(getContestList, renderPageQuery(params, pageSize))
      if (data && data.success) {
        yield put({
          type: 'queryListSuccess',
          payload: {
            list: data.works,
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
    queryCategorySuccess(state, action) {
      return { ...state, ...action.payload }
    },
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
