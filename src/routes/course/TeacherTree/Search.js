import React from 'react'
import { Row, Col, Icon, Button, Select } from 'antd'
import { Link } from 'dva/router'

const Option = Select.Option

function Search({
  addPower,
  query: { lesson_status = '10' },
  onAdd,
  onSearch
}) {

  function handleChangeStatus(lesson_status) {
    onSearch(!!lesson_status ? { lesson_status } : {})
  }

  return (
    <Row>
      <Col xs={4} lg={2} style={{marginBottom: 16}}>
        <Link to={'/course/teacher?type=famous_course&status=10'}><Icon type="rollback" />返回列表</Link>
      </Col>
      <Col xs={12} lg={14} style={{marginBottom: 16}}>
        <Select defaultValue={lesson_status} onChange={handleChangeStatus} style={{width: 100}}>
          <Option value="10">已上架</Option>
          <Option value="0">已下架</Option>
        </Select>
      </Col>
      <Col span={8} style={{marginBottom: 16, textAlign: 'right'}}>
        {addPower && <Button size='large' type='ghost' onClick={onAdd}><Icon type="plus-circle-o" />添加</Button>}
      </Col>
    </Row>
  )
}

export default Search
