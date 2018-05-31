import { message } from 'antd'
import { routerRedux } from 'dva/router'
import { queryPhone, send, check } from '../../services/coupon/send'
import { getCurPowers } from '../../utils'

export default {
  namespace: 'couponSend',
  state: {
    phoneList: [],
    loading: false,
    phoneFailedList:[]
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(location => {
        const pathname = location.pathname
        if (pathname === '/coupon/send') {
          const curPowers = getCurPowers(pathname)
          if(curPowers) {
            dispatch({ type: 'app/changeCurPowers', payload: { curPowers } })
          } else {
            dispatch(routerRedux.push({ pathname: '/no-power' }))
          }
        }
      })
    }
  },

  effects: {
    *queryPhoneList({ payload }, { call, put }) {
      let { key } = payload

      const data = yield call(queryPhone, key)
      if(data && data.success) {
        yield put({ type: 'querySuccess', payload: { phoneList: data.list } })
      }
    },
    *resetPhoneList({ payload }, { call, put }) {
      yield put({ type: 'querySuccess', payload: { phoneList: [] } })
    },
    *send({ payload }, { call, put }) {
      yield put({ type: 'showLoading' })
      const data = yield call(send, payload)
      yield put({ type: 'hideLoading' })
      if(data && data.success) {
        message.success('优惠券发放成功,可至发放列表对发放状态进行查询！')
      }
    },
    *check({ payload }, { call, put }) {
      yield put({ type: 'showLoading' })
      const data = yield call(check, payload)
      yield put({ type: 'hideLoading' })
      if(data && data.success) {
        if(data.status === 1) {
          message.success('优惠券全部发放成功')
          yield put({type: 'setFailedPhone', payload: []})
        } else if(data.list && data.list.length > 0) {
          yield put({type: 'setFailedPhone', payload: data.list})
        } else {
          message.error('此批次号不存在')
          yield put({type: 'setFailedPhone', payload: []})
        }
      } else {
        message.error('验证优惠券验证失败')
      }
    },
  },

  reducers: {
    showLoading (state) {
      return { ...state, loading: true}
    },
    hideLoading (state) {
      return { ...state, loading: false }
    },
    querySuccess (state, action) {
      return { ...state, phoneList: action.payload.phoneList }
    },
    setFailedPhone (state, action) {
      return {...state, phoneFailedList: action.payload}
    }
  }

}
