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
                  actor,
                  mobile,
                  order='',
                  scope,
                  onSearch,
                  form: {
                    getFieldDecorator,
                    validateFields,
                    getFieldsValue

                  }
                }) {
  searchGroupProps = {
    field: 'actor',
    keyword: actor,
    size: 'large',
    select: true,
    selectOptions: [{ value : 'actor' ,name : "用户名"},{ value : 'mobile', name: '手机号'}, { value: 'title', name: '歌曲名' }],
    selectProps: {
      defaultValue: 'actor'
    },
    onSearch: (value) => {
      validateFields((errors, values) => {
        if (errors) {
          console.log("accompany search error!")
          return
        }
        searchValues = value
        let data = {}

        // if(!!values.title) {
        //   alert(3);
        //   data.title = value
        // }

        if(!!values.scope) {
          data.scope=values.scope
        }
        if(!!values.order){
          data.order = values.order
        }
        if(!!values.actor){
          data.actor = values.actor
        }
        if(!!values.mobile){
          data.mobile = values.mobile
        }
        if(!!values.title){
          data.title = values.title
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

        <FormItem label="状态" style={{marginBottom: 20, marginRight: 40}}>
          {getFieldDecorator('scope', {
            initialValue: scope,
          })
          (<Select style={{width: 90}}>
            <Option value="all">全部</Option>
            <Option value="valid">已上架</Option>
            <Option value="invalid">已下架</Option>
          </Select>)
          }
        </FormItem>

        <FormItem label="榜单" style={{marginBottom: 20, marginRight: 40}}>
          {getFieldDecorator('order', {
            initialValue: order,
          })
          (<Select style={{width: 90}}>
            <Option value="">最新</Option>
            <Option value="hot">热门</Option>
          </Select>)
          }
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
