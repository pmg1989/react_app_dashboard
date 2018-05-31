import React, { PropTypes } from 'react'
import { Form, Row, Icon, DatePicker, Select, Button } from 'antd'
import { Link } from 'dva/router'
import moment from 'moment'
import SearchGroup from '../../../components/Search'

const FormItem = Form.Item
const RangePicker = DatePicker.RangePicker
const Option = Select.Option
let searchGroupProps = {}, searchValues = {}

function Search({
  phone, start_date, end_date, os = '', status = '1',
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
    selectOptions: [{ value: 'title', name: '标题' }],
    selectProps: {
      defaultValue: 'title'
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
        if(!!values.status) {
          data.status = values.status
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
        <FormItem label="状态" style={{marginBottom: 20, marginRight: 50}}>
          {getFieldDecorator('status', {
            initialValue: status,
            })
            (<Select style={{width: 100}}>
              <Option value="1">已上架</Option>
              <Option value="2">草稿中</Option>
              <Option value="3">已下架</Option>
            </Select>)
          }
        </FormItem>
        <FormItem style={{marginBottom: 20, float: 'right', marginRight: 0}}>
          {/* <Link to="/topic/add">
            <Button size='large' type='ghost'><Icon type="plus-circle-o" />添加</Button>
          </Link> */}
          <a href="/topic/add">
            <Button size='large' type='ghost'><Icon type="plus-circle-o" />添加</Button>
          </a>
        </FormItem>
        <FormItem style={{marginBottom: 20, float: 'right', marginRight: 50}}>
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
