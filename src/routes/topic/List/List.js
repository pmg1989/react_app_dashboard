import React, {PropTypes} from 'react'
import {Modal, Menu, Carousel, Tabs, Icon, Row, Col, InputNumber, Tag} from 'antd'
import {Link} from 'dva/router'
import {DataTable, DropMenu} from '../../../components/'
import {UPDATE, DELETE, TOP, SHELT, SHELTOFF} from '../../../constants/options'
import styles from './List.less'

const confirm = Modal.confirm

function List({
  topicList: {
    loading,
    list,
    pagination
  },
  updatePower,
  deletePower,
  topPower,
  sheltPower,
  sheltOffPower,
  onDeleteItem,
  onTop,
  onShelt,
  onSheltOff
}) {

  const handleDeleteItem = (record) => {
    confirm({
      title: '您确定要删除这条专题吗?',
      onOk() {
        onDeleteItem(record)
      }
    })
  }

  const handleMenuClick = (key, record) => {

    return {
      [TOP]: onTop,
      [SHELT]: onShelt,
      [SHELTOFF]: onSheltOff,
      [UPDATE]: () => {},
      [DELETE]: handleDeleteItem,
    } [key](record)
  }

  const columns = [
    {
      title: '编号',
      dataIndex: 'id',
      key: 'id'
    }, {
      title: '图片',
      dataIndex: 'image',
      key: 'image',
      render: (text) => (
        <img src={text} style={{height: '80px'}}/>
      )
    }, {
      title: '标题',
      dataIndex: 'title',
      key: 'title'
    }, {
      title: '作者',
      dataIndex: 'author',
      key: 'author'
    }, {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime'
    }, {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (cur, record) => {
        const dic = {1: '已上架', 2: '草稿中', 3: '已下架'}
        const dicColor = {1: '#2db7f5', 2: '#87d068', 3: '#f50'}
        return (
          <span>{record.recommend === '1' && <Tag color="#87d068"><Icon type="arrow-up" /></Tag> }<Tag color={dicColor[cur]}>{dic[cur]}</Tag></span>
        )
      }
    }, {
      title: '操作',
      key: 'operation',
      // width: 100,
      render: (text, record) => (
        <DropMenu>
          <Menu onClick={({key}) => handleMenuClick(key, record)}>
            {+record.status === 1 && topPower && <Menu.Item key={TOP}>置顶</Menu.Item>}
            {+record.status === 1 && sheltOffPower && <Menu.Item key={SHELTOFF}>下架</Menu.Item>}

            {+record.status >= 1 && updatePower && <Menu.Item key={UPDATE}>
                                                     <Link to={`/topic/add?id=${record.id}`}>编辑</Link>
                                                   </Menu.Item>}
            {+record.status >= 2 && sheltPower && <Menu.Item key={SHELT}>上架</Menu.Item>}

            {deletePower && <Menu.Item key={DELETE}>删除</Menu.Item>}
          </Menu>
        </DropMenu>
      ),
      // fixed: 'right'
    }
  ]

  return (
    <DataTable
      className={styles.table}
      columns={columns}
      dataSource={list}
      loading={loading}
      pagination={pagination}
      rowKey={record => record.id}
    />
  )
}

List.propTypes = {
  topicList: PropTypes.object.isRequired
}

export default List
