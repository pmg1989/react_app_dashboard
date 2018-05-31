import React, {PropTypes} from 'react'
import {Modal, Menu, Tag, Table, Input, Icon, Button,} from 'antd'
import { config } from '../../../utils'
import styles from './List.less'
import {DataTable, DropMenu,EditableCell} from '../../../components/'
import {DETAIL,SHELT,SHELTOFF} from '../../../constants/options'

const confirm = Modal.confirm

function List ({
                 festivalContest:{
                   list,
                   loading,
                   pagination
                 },
                 updatePower,
                 onEditItem,
                 onSheltItem,
                 onUpdateIntern,
                 sheltPower,
                 sheltoffPower
               }){

  const handleSheltItem =(record) => {
    confirm({
      title:'你确定要上架吗',
      onOk () {
        record.status=1
        onSheltItem(record,record.id,record.status)
      }
    })
  }

  const handleSheltOffItem =(record) =>{
    confirm({
      title:'你确定要下架吗',
      onOk () {
        record.status=0
        onSheltItem(record,record.id,record.status)
      }
    })
  }
  const onEditableCell = (path) => {
    onUpdateIntern(path)
  }

  const handleMenuClick = (key, record) => {
    return {
      [DETAIL]: onEditItem,
      [SHELT]:handleSheltItem,
      [SHELTOFF]:handleSheltOffItem,
    } [key](record)
  }

  const columns = [
    {
      title: '大赛编号',
      dataIndex: 'id',
      key: 'id'
    }, {
      title: '歌曲封面',
      dataIndex: 'cover',
      key: 'cover',
      className: styles.avatar,
      render: (cover, record) => (
        <div className={styles.thumb_box}>
          {record.type=='video' && <Tag className={styles.tag} color="#2db7f5">MV</Tag>}
          <img height={100} src={cover && cover.full_url || config.defaultImage} />
        </div>
      )
    }, {
      title: '歌名',
      dataIndex: 'title',
      key: 'title'
    },{
      title: '用户信息',
      dataIndex: 'user',
      key: 'actor',
      render: (user, record) => (
        <span className={styles.cell_box}>
          用户名：{user.profile.name}<br />手机号：{record.user.mobile}
        </span>
      )
    },{
      title: '点赞数',
      dataIndex: 'votes',
      key: 'votes',
      render: (votes, record) => (
        <div className={styles.cell_box}>
          真实数：{votes} <br />
          虚拟数：<EditableCell value={record.votes_intern} onChange={(value) => onEditableCell(`${record.id}/votes_intern/${value}`)} />
        </div>
      )
    }, {
      title: '阅读数',
      dataIndex: 'views',
      key: 'views',
      render: (views, record) => (
        <div className={styles.cell_box}>
          阅读人数：000 <br />
          真实数：{views} <br />
          虚拟数：<EditableCell value={record.views_intern} onChange={(value) => onEditableCell(`${record.id}/viewed_intern/${value}`)} />
        </div>
      )
    },
    {
      title: '上传时间',
      dataIndex: 'ctime',
      key: 'ctime',
      render: (ctime) => (
        <p>{new Date(ctime * 1000).format("yyyy-MM-dd HH:mm:ss")}</p>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        if(status==1){
          return <Tag color="#87d068">上架</Tag>
        }else if(status==0){
          return <Tag color="#87d068">被下架</Tag>
        }

      }
    }, {
      title: '操作',
      key: 'operation',
      // width: 80,
      render: (text, record) => (
        <DropMenu>
          <Menu onClick={({key}) => handleMenuClick(key, record)}>

            {<Menu.Item key={DETAIL}>预览</Menu.Item>}
            {record.status==0 && sheltPower && <Menu.Item key={SHELT}>重新上架</Menu.Item> }
            {record.status==1 && sheltoffPower && <Menu.Item key={SHELTOFF}>下架</Menu.Item>}

            {/*{sheltPower && <Menu.Item key={SHELT}>上架</Menu.Item>}&&{record.status!==1}*/}
            {/*{sheltoffPower && <Menu.Item key={SHELTOFF}>下架</Menu.Item>}&&{record.status!==2}*/}
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
      paginationType={1}
      rowKey={record => record.id}
    />
  )
}
List.propTypes = {
  festivalContest: PropTypes.object.isRequired,
  onSheltItem: PropTypes.func.isRequired,
  onEditItem: PropTypes.func.isRequired
}

export default List
