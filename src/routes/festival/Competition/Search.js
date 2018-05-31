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
  title,
  status = '1',
  dateStatus = '',
  onSearch,
  onAdd,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue
  }
}) {
  searchGroupProps = {
    field: 'title',
    keyword: title,
    size: 'large',
    select: true,
    selectOptions: [{ value: 'title', name: '大赛标题' }],
    selectProps: {
      defaultValue: 'title'
    },
    onSearch: (value) => {
      validateFields((errors, values) => {
        if (errors) {
          return
        }

        searchValues = value

        let data = {}
        if(!!values.dateStatus) {
          data.dateStatus = values.dateStatus
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
        <FormItem label="进行状态" style={{marginBottom: 20, marginRight: 50}}>
          {getFieldDecorator('dateStatus', {
            initialValue: dateStatus,
            })
            (<Select style={{width: 100}}>
              <Option value="">全部</Option>
              <Option value="1">未开始</Option>
              <Option value="2">进行中</Option>
              <Option value="3">已结束</Option>
            </Select>)
          }
        </FormItem>
        <FormItem label="大赛状态" style={{marginBottom: 20, marginRight: 50}}>
          {getFieldDecorator('status', {
            initialValue: status,
            })
            (<Select style={{width: 100}}>
              <Option value="">全部</Option>
              <Option value="1">已上架</Option>
              <Option value="2">已下架</Option>
              <Option value="3">草稿中</Option>
            </Select>)
          }
        </FormItem>
        <FormItem style={{marginBottom: 20, float: 'right', marginRight: 0}}>
          <Button size='large' type='ghost' onClick={onAdd}><Icon type="plus-circle-o" />添加</Button>
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
