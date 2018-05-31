import React, {PropTypes} from 'react'
import {Modal, Menu, Tag, Table, Input, Icon, Button,} from 'antd'
import { config } from '../../../utils'
import styles from './List.less'
import {DataTable, DropMenu} from '../../../components/'
import {UPDATE,FORBID,RECOVER} from '../../../constants/options'

const confirm = Modal.confirm

function List ({
                 accountTeacher:{
                   list,
                   loading,
                   pagination
                 },
                 updatePower,
                 onEditItem,
                 onforbid,
                 onrecover,
               }){


  const handleMenuClick = (key, record) => {
    return {
      [UPDATE]: onEditItem,
      [FORBID]: handledisabled,
      [RECOVER]: handleabled,
    } [key](record)
  }

  const handledisabled = (record) =>{
    confirm({
      title: '你确定要禁用吗',
      onOk () {
        record.status=0
        onforbid(record,record.id,record.status)
      }
    })
  }

  const handleabled = (record) => {
    confirm({
      title: '你确定要启用吗',
      onOk () {
        record.status=10
        onrecover(record,record.id,record.status)
      }
    })
  }

  const columns = [
    {
      title: '序号',
      dataIndex: 'id',
      key: 'id'
    }, {
      title: '头像',
      dataIndex: 'image',
      key: 'image',
      className: styles.avatar,
      render: (image) => <img height={70} src={image || config.defaultImage} />
    }, {
      title: '昵称',
      dataIndex: 'name',
      key: 'name'
    },{
      title: '手机号',
      dataIndex: 'mobile',
      key: 'mobile',
      render: (mobile) => (
        <p>{mobile}</p>
      )
    },
    {
      title: '积分',
      dataIndex: 'balance',
      key: 'balance',
      render:(balance)=>(
        <p>{balance || 0}</p>
      )
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (created_at) => (
        <p>{new Date(created_at * 1000).format("yyyy-MM-dd HH:mm:ss")}</p>
      )
    },
    {
      title: '课程数',
      dataIndex: 'classes',
      key: 'classes',
      render: (classes) => (
        <p>{classes}</p>
      )
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      render: (email)=> (
        <p>{email}</p>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) =>{
        if(status==10){
          return <Tag color="#87d068">正常</Tag>
        }else{
          return <Tag color="#ED5349">已禁用</Tag>
        }

      }
    }, {
      title: '操作',
      key: 'operation',
      // width: 80,
      render: (text, record) => (
        <DropMenu>
          <Menu onClick={({key}) => handleMenuClick(key, record)}>

            {updatePower && <Menu.Item key={UPDATE}>编辑</Menu.Item>}
            {record.status==10 &&updatePower && <Menu.Item key={FORBID}>禁用</Menu.Item>}
            {record.status!=10 &&updatePower && <Menu.Item key={RECOVER}>启用</Menu.Item>}

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
      rowKey={record => record.id}
    />
  )
}
List.propTypes = {
  accountTeacher: PropTypes.object.isRequired,
  onforbid: PropTypes.func.isRequired,
  onrecover: PropTypes.func.isRequired,
  onEditItem: PropTypes.func.isRequired
}

export default List
