import React, { PropTypes } from 'react'
import { Form, Button, Row, Col, Icon, Select } from 'antd'
import SearchGroup from '../../../components/Search'

const FormItem = Form.Item
const Option = Select.Option
let searchGroupProps = {}

const Search = ({
  os = 'ios',
  status = '1',
  page = 'home',
  period = '2',
  spining,
  addPower,
  onAdd,
  onSearch,
  onRefresh,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue
  }
}) => {

  searchGroupProps = {
    onSearch: () => {
      validateFields((errors, values) => {
        if (errors) {
          return
        }

        let data = {}
        if(!!values.os) {
          data.os = values.os
        }
        if(!!values.status) {
          data.status = values.status
        }
        if(!!values.page) {
          data.page = values.page
        }
        if(!!values.period) {
          data.period = values.period
        }
        onSearch(data)
      })
    }
  }

  return (
    <Row gutter={24}>
      <Col lg={20} md={18} sm={20} xs={24} style={{marginBottom: 16}}>
        <Form layout='inline'>
          <FormItem label="投放系统" style={{marginBottom: 20, marginRight: 50}}>
            {getFieldDecorator('os', {
              initialValue: os,
              })
              (<Select style={{width: 100}}>
                <Option value="ios"><Icon type="apple-o" style={{ color: 'rgb(160, 160, 160)' }}/> IOS</Option>
                <Option value="android"><Icon type="android" style={{ color: 'rgb(171, 205, 5)' }}/> Android</Option>
              </Select>)
            }
          </FormItem>
          <FormItem label="投放状态" style={{marginBottom: 20, marginRight: 50}}>
            {getFieldDecorator('status', {
              initialValue: status,
              })
              (<Select style={{width: 100}}>
                <Option value="1">正常</Option>
                <Option value="0">已下架</Option>
              </Select>)
            }
          </FormItem>
          <FormItem label="页面位置" style={{marginBottom: 20, marginRight: 50}}>
            {getFieldDecorator('page', {
              initialValue: page,
              })
              (<Select style={{width: 100}}>
                <Option value="home">首页</Option>
                <Option value="main">首页广告位</Option>
                <Option value="startup">启动页</Option>
                <Option value="festival">练习页</Option>
              </Select>)
            }
          </FormItem>
          <FormItem label="过期状态" style={{marginBottom: 20, marginRight: 50}}>
            {getFieldDecorator('period', {
              initialValue: period,
              })
              (<Select style={{width: 100}}>
                <Option value="1">未开始</Option>
                <Option value="2">展示中</Option>
                <Option value="3">已过期</Option>
              </Select>)
            }
          </FormItem>
          <FormItem>
            <Button type="primary" onClick={onRefresh} loading={spining}>刷新缓存</Button>
          </FormItem>
        </Form>
      </Col>
      {addPower &&
      <Col lg={4} md={6} sm={4} xs={24} style={{marginBottom: 16, textAlign: 'right'}}>
        <Button size='large' type='ghost' onClick={onAdd}><Icon type="plus-circle-o" />添加</Button>
      </Col>}
    </Row>
  )
}

Search.propTypes = {
  form: PropTypes.object.isRequired,
  onSearch: PropTypes.func,
  onAdd: PropTypes.func,
  field: PropTypes.string,
  keyword: PropTypes.string
}

export default Form.create({
  onValuesChange(props, values) {
    setTimeout(() => {
      searchGroupProps.onSearch()
    }, 0)
  }
})(Search)
