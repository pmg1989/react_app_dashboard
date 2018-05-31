import React, { PropTypes } from 'react'
import { Form, Row, Icon, Button, Select } from 'antd'
import { Link } from 'dva/router'
import SearchGroup from '../../../components/Search'

const FormItem = Form.Item
const Option = Select.Option
let searchGroupProps = {}, searchValues = {}

function Search({
  title,
  actor,
  scope = 'valid',
  type = '',
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
    selectOptions: [{ value: 'title', name: '曲目标题' }, { value: 'actor', name: '作者' }],
    selectProps: {
      defaultValue: 'title'
    },
    onSearch: (value) => {
      validateFields((errors, values) => {
        if (errors) {
          return
        }

        searchValues = value
        const data = {}
        if(!!values.scope) {
          data.scope = values.scope
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
        <FormItem label="状态" style={{marginBottom: 20, marginRight: 50}}>
          {getFieldDecorator('scope', {
            initialValue: scope,
            })
            (<Select style={{width: 100}}>
              <Option value="all">全部</Option>
              <Option value="valid">已上架</Option>
              <Option value="draft">草稿中</Option>
              <Option value="invalid">已下架</Option>
            </Select>)
          }
        </FormItem>
        <FormItem label="曲目类型" style={{marginBottom: 20, marginRight: 50}}>
          {getFieldDecorator('type', {
            initialValue: type,
            })
            (<Select style={{width: 100}}>
              <Option value="">全部</Option>
              <Option value="0">练习曲目</Option>
              <Option value="1">比赛曲目</Option>
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
