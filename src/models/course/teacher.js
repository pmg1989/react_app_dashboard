// import { message } from 'antd'
import { routerRedux } from 'dva/router'
import { queryList, addEdit, queryCourseParameter, getDetail, shelt, order } from '../../services/course/teacher'
import { getCurPowers } from '../../utils'

export default {
  namespace: 'courseTeacher',
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
        if (['/course/teacher', '/course/star'].some(path => path === pathname)) {
          console.log(pathname);
          const curPowers = getCurPowers(pathname)
          if(curPowers) {
            dispatch({ type: 'app/changeCurPowers', payload: { curPowers } })
            dispatch({ type: 'queryList' })
          } else {
            dispatch(routerRedux.push({ pathname: '/no-power' }))
          }
        }
      })
    }
  },

  effects: {
    *queryList ({ payload }, { select, call, put }) {
      yield put({ type: 'showLoading' })
      const pathQuery = yield select(({ routing }) => routing.locationBeforeTransitions.query)
      const data = yield call(queryList, pathQuery)
      if (data.success) {
        yield put({
          type: 'queryListSuccess',
          payload: {
            list: data.list,
            pagination: data.page
          }
        })
      }
      yield put({ type: 'hideLoading' })
    },
    *showModal({payload }, {call, put}) {

      const { type, curItem } = payload
      if(type === 'update') {
        const data = yield call(getDetail, curItem.root)
        if(data.success) {
          yield put({ type: 'modal/showModal', payload: { loading: true, type, curItem: data.course } })
        }
      } else {
        yield put({ type: 'modal/showModal', payload: { loading: true, type, curItem: {} } })
      }
      //获取课程分类
      const data1 = yield call(queryCourseParameter, { type: 'interest' })
      //获取课程难度
      const data2 = yield call(queryCourseParameter, { type: 'interest_level' })
      //获取教师列表
      const data3 = yield call(queryCourseParameter, { type: 'teacher' })

      yield put({ type: 'modal/setSubItem', payload: {
        interests: data1.list,
        levels: data2.list,
        teachers: data3.list
      } })
    },
    *createUpdate({payload }, {call, put}) {
      const { curItem } = payload
      const data = yield call(addEdit, curItem)
      if (data && data.success) {
        yield put({ type: 'modal/hideModal' })
        yield put({ type: 'queryList' })
      }
    },
    *shelt({payload}, {call, put}) {
      const { root_id, status } = payload
      const data = yield call(shelt, { root_id, status })
      if(data.success) {
        yield put({ type: 'queryList' })
      }
    },
    *orderSet({ payload }, { call, put }) {
      const data = yield call(order, payload.curItem)
      if (data && data.success) {
          yield put({ type: 'queryList' })
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
    queryListSuccess (state, action) {
      return { ...state, ...action.payload }
    },
  }

}
