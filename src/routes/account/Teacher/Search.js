import React, { PropTypes } from 'react'
import { Form, Row, Icon, Button, Select } from 'antd'
import { Link } from 'dva/router'
import SearchGroup from '../../../components/Search'

const FormItem = Form.Item
const Option = Select.Option
let searchGroupProps = {}, searchValues = {}

function Search({
                  field,
                  keyword,
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
    selectOptions: [{ value: 'id', name: '序号' }, { value: 'name', name: '昵称' },{ value: 'mobile', name: '手机号'},{ value: 'email', name: '邮箱'}],
    selectProps: {
      defaultValue:field || 'id'
    },
    onSearch: (value) => {
      onSearch(value)
    }
  }

  return (
    <Row>
      <Form layout='inline'>

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
