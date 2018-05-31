import React, { PropTypes } from 'react'
import { Form, Row, Icon, DatePicker, Select } from 'antd'
import moment from 'moment'
import SearchGroup from '../../../components/Search'

const FormItem = Form.Item
const RangePicker = DatePicker.RangePicker
const Option = Select.Option
let searchGroupProps = {}, searchValues = {}

function Search({
  phone, start_date, end_date, os = '', type = '', status = '',
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
        if(!!values.type) {
          data.type = values.type
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
        <FormItem label="日期查询" style={{marginBottom: 20, marginRight: 50}}>
          {getFieldDecorator('date', {
            initialValue: start_date && end_date ? [moment(start_date), moment(end_date)] : ''
          })(<RangePicker style={{width: 200}}/>)}
        </FormItem>
        <FormItem label="操作系统" style={{marginBottom: 20, marginRight: 50}}>
          {getFieldDecorator('os', {
            initialValue: os,
            })
            (<Select style={{width: 100}}>
              <Option value="">全部</Option>
              <Option value="1"><Icon type="apple-o" style={{ color: 'rgb(160, 160, 160)' }}/> IOS</Option>
              <Option value="2"><Icon type="android" style={{ color: 'rgb(171, 205, 5)' }}/> Android</Option>
            </Select>)
          }
        </FormItem>
        <FormItem label="订单类型" style={{marginBottom: 20, marginRight: 50}}>
          {getFieldDecorator('type', {
            initialValue: type,
            })
            (<Select style={{width: 100}}>
              <Option value="">全部</Option>
              <Option value="1">充值</Option>
              <Option value="2">消费</Option>
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
