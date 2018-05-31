import { message } from 'antd'
import { routerRedux } from 'dva/router'
import { create, remove, update, query, get, getScoreInfo, changeScore } from '../../services/account/user'
import { getCurPowers } from '../../utils'

export default {
  namespace: 'accountUser',
  state: {
    list: [],
    loading: false,
    pagination: {
      current: 1,
      pageSize: 10,
      total: null
    },
    scoreModal: {
      visible: false,
      curItem: {}
    }
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(location => {
        const pathname = location.pathname
        if (pathname === '/account/user') {
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
      if (data.success) {
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
    *delete ({ payload }, { call, put }) {
      yield put({ type: 'showLoading' })
      const data = yield call(remove, { id: payload.id })
      yield put({ type: 'hideLoading' })
      if (data && data.success) {
        yield put({ type: 'query' })
      }
    },
    *create ({ payload }, { select, call, put }) {
      yield put({ type: 'modal/showLoading' })
      const data = yield call(create, payload.curItem)
      yield put({ type: 'modal/hideLoading' })
      if (data && data.success) {
        yield put({ type: 'modal/hideModal' })
        const pathQuery = yield select(({ routing }) => routing.locationBeforeTransitions.query)
        const { page } = pathQuery
        yield put(routerRedux.push({
          pathname: location.pathname,
          query: !!page ? { ...pathQuery, page: 1 } : pathQuery
        }))
      }
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
    *updateStatus ({ payload }, { select, call, put }) {
      yield put({ type: 'showLoading' })
      const { curItem } = payload
      const data = yield call(update, { ...curItem, status: !curItem.status })
      yield put({ type: 'hideLoading' })
      if (data && data.success) {
        yield put({ type: 'query' })
      }
    },
    *showModal ({ payload }, { select, call, put }) {
      const { type, curItem } = payload
      let newData = {}

      yield put({ type: 'modal/showModal', payload: { loading: true, type: type } })

      const data = yield call(get, { id: curItem.id })
      if(data && data.success) {
        newData.curItem = data.data
      }

      yield put({ type: 'modal/hideLoading', payload: newData })
    },
    *showScoreModal ({ payload }, { call, put }) {
      const { curItem } = payload
      const data = yield call(getScoreInfo, { searchMobile: curItem.mobile, name: '', email: '', mobile: '13918909224', password: '123456' })
      if(data.success) {
        yield put({ type: 'changeScoreModalSuccess', payload: {
          scoreModal: { curItem: {...data[0], action: '1'}, visible: true },
        } })
      }
    },
    *changeScore ({ payload }, { select, call, put }) {
      const { id } = yield select((state) => state.app.user)
      const { curItem } = payload
      const data = yield call(changeScore, {
        action: curItem.action,
        amount: curItem.amount,
        description: curItem.description,
        number: 99, //积分处理规则代号
        uid: id,
        mobile: '13918909224', password: '123456'
      })
    }
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
    },
    changeScoreModalSuccess(state, action) {
      return { ...state, ...action.payload }
    }
  }

}
