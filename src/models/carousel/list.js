import { message } from 'antd'
import { routerRedux } from 'dva/router'
import { query, queryCourse, save, refresh } from '../../services/carousel/list'
import { getCurPowers } from '../../utils'

export default {
  namespace: 'carouselList',
  state: {
    list: [],
    loading: false,
    spining: false
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(location => {
        const pathname = location.pathname
        if (pathname === '/carousel/list') {
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
      data.list.map(item => {
        if(item.type === "course_list") {
          return item.course_ids = item.course_ids.map(cur => ({ label: cur.title, key: cur.id }))
        }
      })
      if (data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.list
          }
        })
      }
      yield put({ type: 'hideLoading' })
    },
    *queryCourse({ payload }, { call, put }) {
      let { key } = payload

      const data = yield call(queryCourse, key)
      if(data && data.success) {
        const courseList = data.list
        yield put({ type: 'modal/setOtherItem', payload: { key: 'courseList', value: courseList } })
      }
    },
    *resetCourse({ payload }, { call, put }) {
      yield put({ type: 'modal/setOtherItem', payload: { key: 'courseList', value: [] } })
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
    *refresh ({ payload }, { call, put }) {
      yield put({ type: 'showSpining' })
      const data = yield call(refresh)
      yield put({ type: 'hideSpining' })
      if(data && data.success) {
        message.success("缓存刷新成功！")
      } else {
        message.success("缓存刷新失败！")
      }
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
      return { ...state, list: action.payload.list }
    },
    showSpining (state) {
      return { ...state, spining: true }
    },
    hideSpining (state) {
      return { ...state, spining: false }
    },
  }

}
