import React from 'react'
import { Row, Col, Cascader, Modal, Icon, Tag, Form, Button, Input } from 'antd'
import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc'
import styles from './Recommend.less'

const confirm = Modal.confirm
const FormItem = Form.Item

const SortableItem = SortableElement(({item, onRemove, deletePower}) => (
  <div className={styles.main_item}>
    <p>{item.title}</p>
    {deletePower &&
      <Icon className={styles.opt_remove} type="close-circle" onClick={() => onRemove(item.id)}/>
    }
  </div>
))

const SortableList = SortableContainer(({list, onRemove, updatePower, deletePower}) => {
  return (
    <div className={styles.main_list}>
      {list.map((item, index) => (
        <SortableItem key={`item-${index}`} index={index} item={item} onRemove={onRemove} deletePower={deletePower} disabled={!updatePower} />
      ))}
    </div>
  );
})

const MainSearch = ({
  addPower,
  updatePower,
  deletePower,
  list,
  onSort,
  onRemoveItem,
  onAddItem,
  form: { getFieldDecorator, validateFields, setFieldsValue }
}) => {

  const inputProps = {
    placeholder: "请输入新增的关键字",
    size: "large",
    style: { width: '100%' },
    addonAfter: (
      <Button type="primary" htmlType="submit" size="small">确认</Button>
    )
  }

  const handleAdd = (e) => {
    e.preventDefault()

    validateFields((errors, values) => {
      if (!errors) {
        const { title } = values
        // const MaxId = Math.max.apply(Math, list.map(o => o.id))
        let MaxId = 0
        if(!!list.length) {
          MaxId = Math.max(...list.map(o => o.id))
        }
        onAddItem({ id: MaxId + 1, title })
        setFieldsValue({ title: '' })
      }
    })
  }

  const handleRemove = (id) => {
    confirm({
      title:'确定要删除此关键词吗？',
      onOk () {
        const newList = list.filter(item => item.id !== id)
        onRemoveItem(newList)
      }
    })
  }

  function handleSortEnd({ oldIndex, newIndex }) {
    oldIndex !== newIndex && onSort(arrayMove(list, oldIndex, newIndex))
  }

  return (
    <Row>
      <Col span={10} offset={7}>
        {addPower &&
          <div className={styles.add_box}>
            <Form onSubmit={handleAdd}>
              <FormItem>
                {getFieldDecorator('title', {
                  initialValue: '',
                  rules: [
                    {
                      required: true,
                      message: '请输入新增的关键字'
                    }
                  ]
                })(<Input {...inputProps} />)}
              </FormItem>
            </Form>
          </div>
        }
      </Col>
      <Col span={10} offset={7}>
        <Tag color="orange" style={{ marginBottom: 30 }}>温馨提示：长按可排序，为防止误操作，鼠标长按250ms后才可以拖动排序</Tag>
        <SortableList
          updatePower={updatePower}
          deletePower={deletePower}
          list={list}
          pressDelay={250}
          axis={'xy'}
          onSortEnd={handleSortEnd}
          onRemove={handleRemove} />
      </Col>
    </Row>
  )
}

export default Form.create()(MainSearch)
