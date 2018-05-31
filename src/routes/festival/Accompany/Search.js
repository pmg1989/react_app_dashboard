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
                  onSearch,
                  onAdd,
                  form: {
                    validateFields,

                  }
                }) {
  searchGroupProps = {
    field: 'title',
    keyword: title,
    size: 'large',
    select: true,
    selectOptions: [{ value: 'title', name: '歌曲名' }],
    selectProps: {
      defaultValue: 'title'
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
