import React, {Component} from 'react'
import {Icon, Row, Col} from 'antd'
import {DataTable} from '../../../components/'
import styles from './Tree.less'

const DetailTree = ({
  courseTree: { list, loading },
  updatePower,
  deletePower,
  onDeleteItem,
  onEditItem,
  onGoBack
}) => {

  const columns = [
    {
      title: 'id',
      dataIndex: 'id',
      key: 'id',
      width: '25%',
    },
    {
      title: 'title',
      dataIndex: 'title',
      key: 'title',
      className: styles["text-left"],
      render: (text, record) => {
        return <span className={styles[`indent-${record.lvl}`]}>{text}</span>
      }
    },
    {
      title: '操作',
      key: 'operation',
      render: (text, record) => (
        <p>
          {updatePower && record.lvl !== '1' &&
            <a onClick={() => onEditItem(record)} style={{
              marginRight: 10
            }}><Icon type="edit" /> 编辑</a>}
        </p>
      )
    }
  ]

  //节点成树
  let map = {}
  const data = list.reduce((treeNode, node, i) => {
    map[node.id] = i
    if(node.is_branch == "1") {
      node.children = []
    }
    if (node.parent_id !== null) {
      list[map[node.parent_id]].children.push(node)
    } else {
      treeNode.push(node)
    }
    return treeNode
  }, [])

  return (
    <div>
      <Row gutter={24}>
        <Col lg={8} md={12} sm={16} xs={24} style={{marginBottom: 16}}>
        </Col>
        <Col lg={{offset: 8, span: 8}} md={12} sm={8} xs={24} style={{marginBottom: 16, textAlign: 'right'}}>
          <a onClick={onGoBack}><Icon type="rollback" />返回列表</a>
        </Col>
      </Row>
      <DataTable
        animate={false}
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={false}
        defaultExpandAllRows={true}
        size="small"
        rowKey={record => record.id}
      />
    </div>
  )
}

export default DetailTree
