import React, { PropTypes } from 'react'
import { Form, Button, Row, Col, Icon } from 'antd'
import SearchGroup from '../../../components/Search'

const Search = ({
                  addPower,
                  onAdd,
                }) => {

  return (
    <Row gutter={24}>

      {addPower &&
      <Col lg={{offset:12, span: 11}} md={12} sm={8} xs={24} style={{marginBottom: 16, textAlign: 'right'}}>
        <Button size='large' type='ghost' onClick={onAdd}><Icon type="plus-circle-o" />添加</Button>
      </Col>}
    </Row>
  )
}

Search.propTypes = {
  onAdd: PropTypes.func,
}

export default Form.create()(Search)