import { message } from 'antd'
import { routerRedux } from 'dva/router'
import { query,update,create , remove,order} from '../../services/course/category'
// import { update } from '../../services/course/tree'
import { getCurPowers, renderPageQuery } from '../../utils'

export default {
  namespace: 'courseCategory',
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
        if (pathname === '/course/category') {
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
      // yield put({ type: 'showLoading' })
      const pathQuery = yield select(({ routing }) => routing.locationBeforeTransitions.query)
      const data = yield call(query, pathQuery)
      if (data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.list,
          }
        })
      }
      yield put({ type: 'hideLoading' })
    },
    *orderSet({ payload }, { call, put }) {
      const data = yield call(order, payload.curItem)
      if (data && data.success) {
        yield put({ type: 'query' })
      }
    },
    *create({payload }, {call, put}) {
      yield put({type:'modal/showLoading'})
      const data = yield call(create,payload.curItem)
      yield put({type: 'modal/hideLoading'})
      if(data&&data.success){
        yield put({type: 'modal/hideModal'})
        yield put({type: 'query'})
      }
    },
    *update({payload}, {call ,put}) {
      yield put({type:'modal/showLoading'})
      const data = yield call(update,payload.id,payload.curItem)
      yield put({type: 'modal/hideLoading'})
      if(data&&data.success){
        yield put({type: 'modal/hideModal'})
        yield put({type: 'query'})
      }
    },
    *remove({payload }, {call, put}) {
      const data=yield call(remove,payload.id)
      if(data&&data.success){
        yield put({type: 'query'})
      }
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
