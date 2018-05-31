import React, { Component } from 'react'
import {connect} from 'dva'
import { Tabs } from 'antd'
import {checkPower} from '../../../utils'
import {ADD, UPDATE, DELETE} from '../../../constants/options'
import MainSearch from './MainSearch'
import CourseSearch from './CourseSearch'

const TabPane = Tabs.TabPane

const Recommend = ({location, curPowers, dispatch, collectMainSearch, collectCourseSearch, collectCourseDetailSearch}) => {

  const addPower = checkPower(ADD, curPowers)
  const updatePower = checkPower(UPDATE, curPowers)
  const deletePower = checkPower(DELETE, curPowers)

  const mainSearchProps = {
    addPower,
    updatePower,
    deletePower,
    list: collectMainSearch.list,
    onSort(list) {
      dispatch({ type: 'collectMainSearch/sortList', payload: { list } })
    },
    onRemoveItem(list) {
      dispatch({ type: 'collectMainSearch/removeItem', payload: { list } })
    },
    onAddItem(item) {
      dispatch({ type: 'collectMainSearch/addItem', payload: { item } })
    }
  }

  const courseSearchProps = {
    addPower,
    updatePower,
    deletePower,
    list: collectCourseSearch.list,
    sourceList: collectCourseSearch.sourceList,
    onSort(list) {
      dispatch({ type: 'collectCourseSearch/sortList', payload: { list } })
    },
    onRemoveItem(list, id) {
      dispatch({ type: 'collectCourseSearch/removeItem', payload: { list, id } })
    },
    onAddItem(id) {
      dispatch({ type: 'collectCourseSearch/addItem', payload: { id } })
    }
  }

  const courseDetailSearchProps = {
    addPower,
    updatePower,
    deletePower,
    list: collectCourseDetailSearch.list,
    sourceList: collectCourseDetailSearch.sourceList,
    onSort(list) {
      dispatch({ type: 'collectCourseDetailSearch/sortList', payload: { list } })
    },
    onRemoveItem(list, id) {
      dispatch({ type: 'collectCourseDetailSearch/removeItem', payload: { list, id } })
    },
    onAddItem(id) {
      dispatch({ type: 'collectCourseDetailSearch/addItem', payload: { id } })
    }
  }

  return (
    <div className='content-inner'>
      <Tabs defaultActiveKey="1">
        <TabPane tab={<span>搜索栏关键词推荐</span>} key="1">
          <MainSearch {...mainSearchProps} />
        </TabPane>
        <TabPane tab={<span>课程搜索结果推荐</span>} key="2">
          <CourseSearch {...courseSearchProps} />
        </TabPane>
        <TabPane tab={<span>课程详情页推荐</span>} key="3">
          <CourseSearch {...courseDetailSearchProps} />
        </TabPane>
      </Tabs>
    </div>
  )
}

export default connect(({ collectMainSearch, collectCourseSearch, collectCourseDetailSearch }) => ({ collectMainSearch, collectCourseSearch, collectCourseDetailSearch }))(Recommend)
