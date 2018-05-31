import React, {PropTypes} from 'react'
import {Modal, Menu, Carousel, Tabs, Icon, Row, Col, InputNumber, Tag} from 'antd'
import {DataTable, DropMenu} from '../../../components/'
import {UPDATE, DELETE} from '../../../constants/options'
import styles from './List.less'

const confirm = Modal.confirm
const TabPane = Tabs.TabPane

function List({
  carouselList: {
    list,
    loading
  },
  updatePower,
  deletePower,
  onDeleteItem,
  onEditItem
}) {

  const handleDeleteItem = (record) => {
    const isStatus = +record.status === 1
    confirm({
      title: isStatus ? '您确定要下架这条Banner吗?' : '您确定要重新上架这条Banner吗',
      onOk() {
        record.status = isStatus ? 0 : 1
        if(record.type === 'course_list') {
          record.course_ids = record.course_ids.map(item => item.key).join(',')
        }
        onDeleteItem(record)
      }
    })
  }

  const handleMenuClick = (key, record) => {
    return {
      [UPDATE]: onEditItem,
      [DELETE]: handleDeleteItem,
    } [key](record)
  }

  const handleOrderSet = (value, record) => {
    const item = {
      node_id: record.id,
      detail_id: record.detail_id,
      detail: {
        course_order: value
      }
    }
    onOrderItem(item)
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
        <img src={text} style={{height: '150px'}}/>
      )
    }, {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type) => (
        <span>{{
          no_jump: '仅展示',
          url: '页面跳转',
          course_list: '课程列表',
          inside: 'APP内跳转',
        }[type] || '未知'}</span>
      )
    }, {
      title: '投放系统',
      dataIndex: 'os',
      key: 'os'
    }, {
      title: '投放状态',
      dataIndex: 'status',
      key: 'status',
      render: (text) => (
        <span>{+text === 1 ? '正常' : <Tag color="#f50">已下架</Tag>}</span>
      )
    }, {
      title: '过期状态',
      dataIndex: 'is_expired',
      key: 'is_expired',
      render: (text) => (
        <span>{+text === 0 ? '正常' : <Tag color="#f50">已过期</Tag>}</span>
      )
    }, {
      title: '排序',
      dataIndex: 'position',
      key: 'position',
      // render: (text, record) => (
      //   <InputNumber defaultValue={text} min={1} onChange={(value) => handleOrderSet(value, record)} />
      // )
    }, {
      title: '操作',
      key: 'operation',
      // width: 100,
      render: (text, record) => (
        <DropMenu>
          <Menu onClick={({key}) => handleMenuClick(key, record)}>
            {updatePower && <Menu.Item key={UPDATE}>编辑</Menu.Item>}
            {deletePower && <Menu.Item key={DELETE}>{+record.status === 1 ? '下架' : '重新上架'}</Menu.Item>}
          </Menu>
        </DropMenu>
      ),
      // fixed: 'right'
    }
  ]

  const tableProps = {
    animate: false,
    dataSource: list,
    columns,
    loading,
    pagination: false,
    rowKey: (record) => record.id
  }

  return (
    <Tabs defaultActiveKey="1">
      <TabPane tab={<span><Icon type="bars" />列表模式</span>} key="1">
        <DataTable  {...tableProps}/>
      </TabPane>
      <TabPane tab={<span><Icon type="picture" />预览模式</span>} key="2">
        <Row>
          <Col span={16} offset={4}>
            {!!list.length &&
              <Carousel className={styles.carouselBox}>
                {list.map((record, key) => {
                  if(+record.status === 1 && +record.is_expired === 0) {
                    return (
                      <div key={key}>
                        <img src={record.image}/>
                        <div className="carousel-opt-box">
                          <DropMenu>
                            <Menu onClick={({key}) => handleMenuClick(key, record)}>
                              {updatePower && <Menu.Item key={UPDATE}>编辑</Menu.Item>}
                              {deletePower && <Menu.Item key={DELETE}>{+record.status === 1 ? '下架' : '重新上架'}</Menu.Item>}
                            </Menu>
                          </DropMenu>
                        </div>
                      </div>
                    )
                  }
                })}
              </Carousel>
            }
          </Col>
        </Row>
      </TabPane>
    </Tabs>
  )
}

List.propTypes = {
  carouselList: PropTypes.object.isRequired,
  onDeleteItem: PropTypes.func.isRequired,
  onEditItem: PropTypes.func.isRequired
}

export default List
