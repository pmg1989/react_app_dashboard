import React from 'react'
import { routerRedux } from 'dva/router'
import { message, Tag } from 'antd'
import { query, save, queryCourseSourse, queryCourse } from '../../../services/collect/recommend'
import { getCurPowers } from '../../../utils'

const KEY = 'course_search'

export default {
  namespace: 'collectCourseSearch',
  state: {
    sourceList: [],
    idList: '',
    list: [],
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(location => {
        const pathname = location.pathname
        if (pathname === '/collect/recommend') {
          const curPowers = getCurPowers(pathname)
          if(curPowers) {
            dispatch({ type: 'app/changeCurPowers', payload: { curPowers } })
            dispatch({ type: 'querySourse' })
            dispatch({ type: 'queryList' })
          } else {
            dispatch(routerRedux.push({ pathname: '/no-power' }))
          }
        }
      })
    }
  },

  effects: {
    *querySourse ({ payload }, { call, put }) {
      const dataIds = yield call(query, { type: KEY })
      if(dataIds.success) {
        const sourceIds = dataIds.data && dataIds.data.ids

        yield put({ type: 'queryIdListSuccess', payload: { idList: sourceIds || '' } })

        const data = yield call(queryCourseSourse)
        if(data.success) {
          if(sourceIds) {
            const idList = dataIds.data.ids.split(',')
            data.list = data.list.map(item => {
              return {
                ...item,
                children: item.children.map(cur => idList.indexOf(cur.value) > -1 ? { value: cur.value, label: <Tag color="orange">{cur.label}</Tag> } : cur) }
            })
          }
          yield put({ type: 'querySourseSuccess', payload: { sourceList: data.list } })
        }
      }
    },
    *queryList ({ payload }, { call, put }) {
      const data = yield call(queryCourse, { type: KEY })
      if (data.success) {
        yield put({ type: 'queryListSuccess', payload: { list: data.list } })
      }
    },
    *sortList ({ payload }, { call, put }) {
      const { list } = payload
      const idList = list.map(item => item.id).join(',')
      yield put({ type: 'sortListSuccess', payload: { idList, list } })
      yield call(save, { type: KEY, data: JSON.stringify({ids: idList}) })
    },
    *removeItem ({ payload }, { call, put }) {
      const { list, id } = payload
      yield put({ type: 'sortList', payload: { list } })
      yield put({ type: 'removeSelectedSource', payload: { id } })
    },
    *addItem ({ payload }, { select, call, put }) {
      const { id } = payload
      const { idList } = yield select(state => state.collectCourseSearch)
      if(idList.split(',').indexOf(id) > -1) {
        message.error('您已经推荐过这堂课程了，不可重复推荐！')
        return
      }
      const newIdList = idList === '' ? `${id}` : `${id},${idList}`
      yield put({ type: 'queryIdListSuccess', payload: { idList: newIdList } })
      const data = yield call(save, { type: KEY, data: JSON.stringify({ids: newIdList}) })
      if(data.success) {
        yield put({ type: 'queryList' })
        yield put({ type: 'addSelectedSource' })
      }
    },
  },

  reducers: {
    querySourseSuccess(state, action) {
      return { ...state, ...action.payload }
    },
    queryIdListSuccess(state, action) {
      return { ...state, ...action.payload }
    },
    sortListSuccess(state, action) {
      return { ...state, ...action.payload }
    },
    queryListSuccess (state, action) {
      return { ...state, ...action.payload }
    },
    removeItemSucces (state, action) {
      return { ...state, ...action.payload }
    },
    addItemSucces (state, action) {
      const { item } = action.payload
      const { list } = state
      return { ...state, list: [...list, ...item] }
    },
    addSelectedSource (state, action) {
      const idList = state.idList.split(',')
      const sourceList = state.sourceList.map(item => {
        return {
          ...item,
          children: item.children.map(cur => idList.indexOf(cur.value) > -1 ? { value: cur.value, label: <Tag color="orange">{cur.label}</Tag> } : cur) }
      })
      return { ...state, sourceList }
    },
    removeSelectedSource (state, action) {
      const { id } = action.payload
      const sourceList = state.sourceList.map(item => {
        return {
          ...item,
          children: item.children.map(cur => cur.value === id ? { value: cur.value, label: cur.label.props.children } : cur) }
      })
      return { ...state, sourceList }
    }
  }

}
