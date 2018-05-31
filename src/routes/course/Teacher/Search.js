import React, { PropTypes } from 'react'
import { Form, Row, Icon, Select, Button } from 'antd'
import moment from 'moment'
import SearchGroup from '../../../components/Search'

const FormItem = Form.Item
const Option = Select.Option
let searchGroupProps = {}, searchValues = {}

function Search({
  field,
  keyword,
  type ='famous_course',
  status = '10',
  onSearch,
  onAdd,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue
  }
}) {
  searchGroupProps = {
    field,
    keyword,
    size: 'large',
    select: true,
    selectOptions: [{ value: 'key', name: '课程标题' }],
    selectProps: {
      defaultValue: field || 'key'
    },
    onSearch: (value) => {
      validateFields((errors, values) => {
        if (errors) {
          return
        }

        searchValues = value

        let data = {}
        if(!!values.type) {
          data.type = values.type
        }
        if(!!values.status) {
          data.status = values.status
        }
        if(!!value.keyword) {
          data[value.field] = value.keyword
        }
        onSearch(data)
      })
    }
  }

  return (
    <Row>
      <Form layout='inline'>
        <FormItem label="状态" style={{marginBottom: 20, marginRight: 50}}>
          {getFieldDecorator('status', {
            initialValue: status,
            })
            (<Select style={{width: 100}}>
              <Option value="10">已上架</Option>
              <Option value="0">已下架</Option>
            </Select>)
          }
        </FormItem>
        <FormItem label="课程类型" style={{marginBottom: 20, marginRight: 50}}>
          {getFieldDecorator('type', {
            initialValue: type,
            })
            (<Select style={{width: 100}}>
              <Option value="">全部</Option>
              <Option value="famous_course">名师课程</Option>
              <Option value="course">名星课程</Option>
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
