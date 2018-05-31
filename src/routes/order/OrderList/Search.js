import React, {PropTypes} from 'react'
import {Form, Row, Icon, DatePicker, Select} from 'antd'
import moment from 'moment'
import SearchGroup from '../../../components/Search'

const FormItem = Form.Item
const RangePicker = DatePicker.RangePicker
const Option = Select.Option
let searchGroupProps = {}, searchValues = {}

function Search({
  phone, start_date, end_date, os = '', pay_type = '', status = '', course_type = '',
  onSearch,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue
  }
}) {
  searchGroupProps = {
    field: 'phone',
    keyword: phone,
    size: 'large',
    select: true,
    selectOptions: [{ value: 'phone', name: '手机号' }],
    selectProps: {
      defaultValue: 'phone'
    },
    onSearch: (value) => {
      validateFields((errors, values) => {
        if (errors) {
          return
        }

        searchValues = value
        const rangeValue = values['date']

        let data = {}
        if(!!rangeValue.length) {
          data.start_date = rangeValue[0].format('YYYY-MM-DD')
          data.end_date = rangeValue[1].format('YYYY-MM-DD')
        }
        if(!!values.os) {
          data.os = values.os
        }
        if(!!values.pay_type) {
          data.pay_type = values.pay_type
        }
        if(!!values.status) {
          data.status = values.status
        }
        if(!!values.course_type) {
          data.course_type = values.course_type
        }
        if(!!value.keyword) {
          // data.field = value.field
          // data.keyword = value.keyword
          data[value.field] = value.keyword
        }
        onSearch(data)
      })
    }
  }

  return (
    <Row>
      <Form layout='inline'>
        <FormItem label="创建日期" style={{marginBottom: 20, marginRight: 40}}>
          {getFieldDecorator('date', {
            initialValue: start_date && end_date ? [moment(start_date), moment(end_date)] : ''
          })(<RangePicker style={{width: 200}}/>)}
        </FormItem>
        <FormItem label="操作系统" style={{marginBottom: 20, marginRight: 40}}>
          {getFieldDecorator('os', {
            initialValue: os,
            })
            (<Select style={{width: 90}}>
              <Option value="">全部</Option>
              <Option value="1"><Icon type="apple-o" style={{ color: 'rgb(160, 160, 160)' }}/> IOS</Option>
              <Option value="2"><Icon type="android" style={{ color: 'rgb(171, 205, 5)' }}/> Android</Option>
            </Select>)
          }
        </FormItem>
        <FormItem label="支付方式" style={{marginBottom: 20, marginRight: 40}}>
          {getFieldDecorator('pay_type', {
            initialValue: pay_type,
            })
            (<Select style={{width: 90}}>
              <Option value="">全部</Option>
              <Option value="nb">nb</Option>
              <Option value="wx">wx</Option>
              <Option value="alipay">alipay</Option>
              <Option value="iap">iap</Option>
              <Option value="ios_in_app">ios_in_app</Option>
            </Select>)
          }
        </FormItem>
        <FormItem label="订单状态" style={{marginBottom: 20, marginRight: 40}}>
          {getFieldDecorator('status', {
            initialValue: status,
            })
            (<Select style={{width: 90}}>
              <Option value="">全部</Option>
              <Option value="1">未支付</Option>
              <Option value="2">已完成</Option>
              <Option value="3">已取消</Option>
              <Option value="4">已超时</Option>
            </Select>)
          }
        </FormItem>
        <FormItem label="订单分类" style={{marginBottom: 20, marginRight: 40}}>
          {getFieldDecorator('course_type', {
            initialValue: course_type,
            })
            (<Select style={{width: 90}}>
              <Option value="">全部</Option>
              <Option value="basic_course">综合课程</Option>
              <Option value="course">明星课程</Option>
              <Option value="famous_course">名师课程</Option>
              <Option value="competition">大赛示例</Option>
              <Option value="work">大赛投票</Option>
            </Select>)
          }
        </FormItem>
        <FormItem style={{marginBottom: 20, float: 'right', marginRight: 0}}>
          <SearchGroup {...searchGroupProps} />
        </FormItem>
      </Form>
    </Row>
  )
}

Search.propTypes = {
  form: PropTypes.object.isRequired,
  onSearch: PropTypes.func,
  field: PropTypes.string,
  keyword: PropTypes.string
}

export default Form.create({
  onValuesChange(props, values) {
    setTimeout(() => {
      searchGroupProps.onSearch(searchValues)
    }, 0)
  }
})(Search)
