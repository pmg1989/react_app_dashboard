import React, {PropTypes} from 'react'
import {Icon, Checkbox} from 'antd'
import styles from './List.less'
import {DataTable} from '../../../components/'

function List ({
  bbsSend: {
    loading,
    list,
    pagination
  },
  sendStatus
}) {

  const handleChangeHot = (e, record) => {
    sendStatus({ sendid: record.bbs_sendid, type: 'h', flg: e.target.checked ? 1 : 0 })
  }

  const handleChangeEss = (e, record) => {
    sendStatus({ sendid: record.bbs_sendid, type: 'j', flg: e.target.checked ? 1 : 0 })
  }

  const handleChangeCheck = (e, record) => {
    sendStatus({ sendid: record.bbs_sendid, type: 'p', flg: e.target.checked ? 1 : 0 })
  }

  const handleChangeDel = (e, record) => {
    sendStatus({ sendid: record.bbs_sendid, type: 's', flg: e.target.checked ? 1 : 0 })
  }

  const columns = [
    {
      title: '帖子ID',
      dataIndex: 'bbs_sendid',
      key: 'bbs_sendid'
    }, {
      title: '帖子标题',
      dataIndex: 'title',
      key: 'title'
    }, {
      title: '分类图',
      dataIndex: 'bbs_cimg',
      key: 'bbs_cimg',
      render: (value) => (
        <img src={value} style={{height: 50}}/>
      )
    }, {
      title: '分类',
      dataIndex: 'bbs_cname',
      key: 'bbs_cname',
    }, {
      title: '发表者',
      dataIndex: 'user_name',
      key: 'user_name'
    }, {
      title: '发表时间',
      dataIndex: 'create_date',
      key: 'create_date',
      render: (value) => new Date(+value * 1000).format("yyyy-MM-dd HH:mm:ss")
    }, {
      title: '点赞数',
      dataIndex: 'heart_times',
      key: 'heart_times'
    }, {
      title: '回复数',
      dataIndex: 'fellow_times',
      key: 'fellow_times'
    }, {
      title: '热门',
      dataIndex: 'hotFlg',
      key: 'hotFlg',
      render: (value, record) => (
         <Checkbox defaultChecked={value} onChange={(e) => handleChangeHot(e, record)}>热门</Checkbox>
      )
    }, {
      title: '精华',
      dataIndex: 'essFlg',
      key: 'essFlg',
      render: (value, record) => (
         <Checkbox defaultChecked={value} onChange={(e) => handleChangeEss(e, record)}>精华</Checkbox>
      )
    }, {
      title: '屏蔽',
      dataIndex: 'checkFlg',
      key: 'checkFlg',
      render: (value, record) => (
         <Checkbox defaultChecked={value} onChange={(e) => handleChangeCheck(e, record)}>屏蔽</Checkbox>
      )
    }, {
      title: '删除',
      dataIndex: 'delFlg',
      key: 'delFlg',
      render: (value, record) => (
         <Checkbox defaultChecked={value} onChange={(e) => handleChangeDel(e, record)}>删除</Checkbox>
      )
    },
  ]

  return (
    <DataTable
      className={styles.table}
      columns={columns}
      dataSource={list}
      loading={loading}
      pagination={pagination}
      rowKey={record => record.bbs_sendid}
    />
  )
}

List.propTypes = {
  bbsSend: PropTypes.object.isRequired
}

export default List
