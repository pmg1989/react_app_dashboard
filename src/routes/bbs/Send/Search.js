import React, {PropTypes} from 'react'
import {Form, Row, Icon, DatePicker, Select} from 'antd'
import moment from 'moment'
import SearchGroup from '../../../components/Search'

const FormItem = Form.Item
const RangePicker = DatePicker.RangePicker
const Option = Select.Option
let searchGroupProps = {}, searchValues = {}

function Search({
  categorys, timestart, timeend, category = '', hot = '', ess = '', check = '', del = '',word, username, label,
  onSearch,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue
  }
}) {
  searchGroupProps = {
    field: 'word',
    keyword: word,
    size: 'large',
    select: true,
    selectOptions: [{ value: 'word', name: '关键字' }, { value: 'username', name: '发帖人' }, { value: 'label', name: '标签' }],
    selectProps: {
      defaultValue: 'word'
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
          data.timestart = rangeValue[0].format('YYYY-MM-DD')
          data.timeend = rangeValue[1].format('YYYY-MM-DD')
        }
        if(!!values.category) {
          data.category = values.category
        }
        if(!!values.hot) {
          data.hot = values.hot
        }
        if(!!values.ess) {
          data.ess = values.ess
        }
        if(!!values.check) {
          data.check = values.check
        }
        if(!!values.del) {
          data.del = values.del
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
        <FormItem label="发帖日期" style={{marginBottom: 20, marginRight: 40}}>
          {getFieldDecorator('date', {
            initialValue: timestart && timeend ? [moment(timestart), moment(timeend)] : ''
          })(<RangePicker style={{width: 200}}/>)}
        </FormItem>
        <FormItem label="类别" style={{marginBottom: 20, marginRight: 40}}>
          {getFieldDecorator('category', {
            initialValue: category,
            })
            (<Select style={{width: 90}}>
              <Option value="">全部</Option>
              {categorys.map((item, key) => (
                <Option key={key} value={`${item.cid}`}>{item.name}</Option>
              ))}
            </Select>)
          }
        </FormItem>
        <FormItem label="热门" style={{marginBottom: 20, marginRight: 40}}>
          {getFieldDecorator('hot', {
            initialValue: hot,
            })
            (<Select style={{width: 90}}>
              <Option value="">全部</Option>
              <Option value="1">热门</Option>
              <Option value="0">非热门</Option>
            </Select>)
          }
        </FormItem>
        <FormItem label="精华" style={{marginBottom: 20, marginRight: 40}}>
          {getFieldDecorator('ess', {
            initialValue: ess,
            })
            (<Select style={{width: 90}}>
              <Option value="">全部</Option>
              <Option value="1">精华</Option>
              <Option value="0">非精华</Option>
            </Select>)
          }
        </FormItem>
        <FormItem label="屏蔽" style={{marginBottom: 20, marginRight: 40}}>
          {getFieldDecorator('check', {
            initialValue: check,
            })
            (<Select style={{width: 90}}>
              <Option value="">全部</Option>
              <Option value="1">已屏蔽</Option>
              <Option value="0">未屏蔽</Option>
            </Select>)
          }
        </FormItem>
        <FormItem label="删除" style={{marginBottom: 20, marginRight: 40}}>
          {getFieldDecorator('del', {
            initialValue: del,
            })
            (<Select style={{width: 90}}>
              <Option value="">全部</Option>
              <Option value="1">已删除</Option>
              <Option value="0">未删除</Option>
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
