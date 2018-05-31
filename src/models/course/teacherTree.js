// import { message } from 'antd'
import pathToRegexp from 'path-to-regexp'
import { routerRedux } from 'dva/router'
import { getDetail as queryList } from '../../services/course/teacher'
import { addEdit } from '../../services/course/teacherTree'
import { getCurPowers } from '../../utils'

export default {
  namespace: 'courseTeacherTree',
  state: {
    root_id: 0,
    list: [],
    loading: false,
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(location => {
        const pathname = location.pathname
        const match = pathToRegexp('/course/teacher/:id').exec(pathname)
        if (match) {
          const curPowers = getCurPowers('/course/teacher-tree')
          if(curPowers) {
            dispatch({ type: 'app/changeCurPowers', payload: { curPowers } })
            dispatch({ type: 'queryList', payload: { root_id: match[1] } })
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
      const { root_id } = payload
      const pathQuery = yield select(({ routing }) => routing.locationBeforeTransitions.query)
      const data = yield call(queryList, root_id, pathQuery)
      if (data.success) {
        yield put({
          type: 'queryListSuccess',
          payload: {
            root_id,
            list: data.course.lessons
          }
        })
      }
      yield put({ type: 'hideLoading' })
    },
    *showModal({payload }, {call, put}) {
      const { type, curItem } = payload
      yield put({ type: 'modal/showModal', payload: { type, curItem } })
    },
    *createUpdate({payload }, {call, put}) {
      const { curItem } = payload
      const data = yield call(addEdit, curItem)
      if (data && data.success) {
        yield put({ type: 'modal/hideModal' })
        yield put({ type: 'queryList', payload: { root_id: curItem.root_id } })
      }
    },
    *sheltOnOff({payload}, {select, call ,put}) {
      const { root_id } = yield select(state => state.courseTeacherTree)
      const { curItem } = payload
      const item = {
        title: curItem.title,
        duration: curItem.duration,
        full_scores: curItem.full_scores && curItem.full_scores.map(cur => cur.id).join(','),
        resource: curItem.resource && curItem.resource.id,
        is_free: curItem.isFree ? 1 : 0,
        descriptionImages: curItem.descriptionImages && curItem.descriptionImages.map(cur => cur.id).join(','),
        root_id,
        lesson_id: curItem.id,
        status: curItem.status
      }
      const data = yield call(addEdit, item)
      if (data && data.success) {
        yield put({ type: 'queryList', payload: { root_id } })
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
