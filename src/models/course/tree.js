import { message } from 'antd'
import { routerRedux } from 'dva/router'
import pathToRegexp from 'path-to-regexp'
import { update, query, get } from '../../services/course/tree'
import { getCurPowers } from '../../utils'

export default {
  namespace: 'courseTree',
  state: {
    list: [],
    loading: false
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(location => {
        const pathname = location.pathname
        const match = pathToRegexp('/course/tree').exec(pathname)
        if (match) {
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
            list: data.list
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
    *showModal ({ payload }, { select, call, put }) {
      const { type, curItem } = payload
      let newData = {}

      yield put({ type: 'modal/showModal', payload: { loading: true, type: type } })

      const data = yield call(get, { node_id: curItem.id })
      if(data && data.success) {
        newData.curItem = { base: data.base, detail: data.detail, node_id: curItem.id }
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
