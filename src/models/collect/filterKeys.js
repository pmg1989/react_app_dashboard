import { message } from 'antd'
import { routerRedux } from 'dva/router'
import { query, update } from '../../services/collect/filter-keys'
import { getCurPowers } from '../../utils'

export default {
  namespace: 'collectFilterKeys',
  state: {
    content: '',
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(location => {
        const pathname = location.pathname
        if (pathname === '/collect/filter-keys') {
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
    *query ({ payload }, { call, put }) {
      yield put({ type: 'showLoading' })
      const data = yield call(query)
      if(data.success) {
        yield put({ type: 'querySuccess', payload: { content: data.list } })
      }
      yield put({ type: 'hideLoading' })
    },
    *update ({ payload }, { call, put }) {
      const { item } = payload
      yield put({ type: 'showLoading' })
      const data = yield call(update, { ...item })
      if(data.success) {
        message.success("修改成功！")
      } else {
        message.error("修改失败！")
      }
      yield put({ type: 'hideLoading' })
    },
  },

  reducers: {
    querySuccess (state, action) {
      return { ...state, ...action.payload }
    },
    updateSuccess (state, action) {
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
