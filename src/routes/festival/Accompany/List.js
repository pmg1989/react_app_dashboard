import React, {PropTypes} from 'react'
import {Modal, Menu, Tag} from 'antd'
import styles from './List.less'
import {DataTable, DropMenu} from '../../../components/'
import {UPDATE,SHELT,SHELTOFF} from '../../../constants/options'

const confirm = Modal.confirm

function List ({
                 festivalAccompany:{
                   list,
                   loading,
                   pagination
                 },
                 updatePower,
                 onEditItem,
                 onSheltItem,
                 onSheltOffItem,
                 sheltPower,
                 sheltoffPower
               }){

  const handleSheltItem =(record) => {
    confirm({
      title:'你确定要上架吗',
      onOk () {
        record.status=1
        onSheltItem(record)
      }
    })
  }

  const handleSheltOffItem =(record) =>{
    confirm({
      title:'你确定要下架吗',
      onOk () {
        record.status=2
        onSheltItem(record)
      }
    })
  }

  const handleMenuClick = (key, record) => {
    return {
      [UPDATE]: onEditItem,
      [SHELT]:handleSheltItem,
      [SHELTOFF]:handleSheltOffItem,
    } [key](record)
  }

  const columns = [
    {
      title: '歌曲编号',
      dataIndex: 'id',
      key: 'id'
    }, {
      title: '歌曲封面',
      dataIndex: 'cover_file_detail',
      key: 'cover_file_detail',
      className: styles.avatar,
      render: (cover_file_detail) => <img height={70} src={cover_file_detail.full_url} />
    }, {
      title: '歌名',
      dataIndex: 'title',
      key: 'title'
    }, {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        if(status==1){
          return <Tag color="#87d068">上架</Tag>
        }else if(status==2){
          return <Tag color="#87d068">下架</Tag>
        }else{
          return <Tag color="#87d068">草稿</Tag>
        }

      }
    }, {
      title: '上传时间',
      dataIndex: 'create_date',
      key: 'create_date',
      render: (create_date) => (
        <div>
          <p>{new Date(+create_date * 1000).format("yyyy-MM-dd HH:mm:ss")}</p>
        </div>
      )
    },{
      title: '操作',
      key: 'operation',
      // width: 80,
      render: (text, record) => (
        <DropMenu>
          <Menu onClick={({key}) => handleMenuClick(key, record)}>
            {updatePower && <Menu.Item key={UPDATE}>编辑</Menu.Item>}
            {record.status==3 && sheltPower && <Menu.Item key={SHELT}>上架</Menu.Item>}
            {record.status==3 && sheltoffPower && <Menu.Item key={SHELTOFF}>下架</Menu.Item>}
            {record.status==2 && sheltPower && <Menu.Item key={SHELT}>上架</Menu.Item>}
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
      rowKey={record => record.id}
    />
  )
}
List.propTypes = {
  festivalAccompany: PropTypes.object.isRequired,
  onDeleteItem: PropTypes.func.isRequired,
  onEditItem: PropTypes.func.isRequired
}

export default List