import React, { PropTypes } from 'react'
import { Form, Button, Row, Col, Icon, Select } from 'antd'
import SearchGroup from '../../../components/Search'

const FormItem = Form.Item
const Option = Select.Option
let searchGroupProps = {}, searchValues = {}

const Search = ({
  field,
  keyword,
  status,
  addPower,
  onSearch,
  onAdd,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue
  }
}) => {

  searchGroupProps = {
    field,
    keyword,
    size: 'large',
    select: true,
    selectOptions: [{ value: 'title', name: '直播名称' }, { value: 'teacherName', name: '老师姓名' }],
    selectProps: {
      defaultValue: field || 'title'
    },
    onSearch: (value) => {
      validateFields((errors, values) => {
        if (errors) {
          return
        }

        searchValues = value

        let data = {}
        if(!!values.status) {
          data.status = values.status
        }
        if(!!value.keyword) {
          data.field = value.field
          data.keyword =value.keyword
          // data[value.field] = value.keyword
        }
        onSearch(data)
      })
    }
  }

  return (
    <Row gutter={24}>
      <Col>
        <Form layout='inline'>
          <FormItem label="直播状态" style={{marginBottom: 20, marginRight: 40}}>
            {getFieldDecorator('status', {
              initialValue: status,
              })
              (<Select style={{width: 90}}>
                <Option value="">全部</Option>
                <Option value="1">待开播</Option>
                <Option value="2">直播中</Option>
                <Option value="3">已结束</Option>
              </Select>)
            }
          </FormItem>
          {/*<FormItem style={{marginBottom: 20, marginRight: 0}}>
            <SearchGroup {...searchGroupProps} />
          </FormItem>*/}
          <FormItem style={{marginBottom: 20, float: 'right', marginRight: 0}}>
            {addPower && <Button size='large' type='ghost' onClick={onAdd}><Icon type="plus-circle-o" />添加</Button>}
          </FormItem>
        </Form>
      </Col>
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
      searchGroupProps.onSearch(searchValues)
    }, 0)
  }
})(Search)
