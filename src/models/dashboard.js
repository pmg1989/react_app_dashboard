import { routerRedux } from 'dva/router'
import { getCurPowers } from '../utils'

export default {
  namespace: 'dashboard',
  state: {
    reportList: [
      { icon: 'shopping-cart', color: 'rgb(246, 152, 153)', title: '订单数量', number: 998 },
      { icon: 'pay-circle-o', color: 'rgb(100, 234, 145)', title: '交易金额', number: 100000 },
      { icon: 'user', color: 'rgb(143, 201, 251)', title: '新增用户', number: 999 },
      { icon: 'message', color: 'rgb(216, 151, 235)', title: '最新消息', number: 100 }
    ]
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(location => {
        const pathname = location.pathname
        if (pathname === '/' || pathname === '/dashboard') {
          const curPowers = getCurPowers('/dashboard')
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

  },
  reducers: {

  }
}
