import { message } from 'antd'
import { query, update } from '../../services/collect/upgrade'
import { getCurPowers } from '../../utils'

const KEY = 'force_upgrade'

export default {
  namespace: 'collectUpgrade',
  state: {
    ios: {
      version: '',
      updateType: 0,
    },
    android: {
      version: '',
      updateType: 0,
    },
    loading: false
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(location => {
        const pathname = location.pathname
        if (pathname === '/collect/upgrade') {
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
      const data = yield call(query, { type: KEY })
      if(data.success) {
        if(data.data.ios) {
          yield put({ type: 'querySuccess', payload: { ...data.data } })
        }
      }
    },
    *update ({ payload }, { call, put }) {
      const { item } = payload
      yield put({ type: 'showLoading' })
      const data = yield call(update, { type: KEY, data: JSON.stringify(item) })
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
