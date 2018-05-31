import React from 'react'
import { Row, Col, Cascader, Modal, Icon, Tag } from 'antd'
import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc'
import styles from './Recommend.less'

const confirm = Modal.confirm

const dic = {
  basic_course: '基础课程',
  competition: '大赛课程',
  course: '大师课程',
}

const SortableItem = SortableElement(({item, onRemove, deletePower}) => (
  <div className={styles.course_item}>
    <img className={styles.course_image} src={item.image} alt={item.title} />
    <span className={styles.mask}>
      {dic[item.type] || '未知分类'} - {item.title} / {item.teacher_name}
    </span>
    {deletePower &&
      <Icon className={styles.opt_remove} type="close-circle" onClick={() => onRemove(item.id)}/>
    }
  </div>
))

const SortableList = SortableContainer(({list, onRemove, updatePower, deletePower}) => {
  return (
    <div className={styles.course_list}>
      {list.map((item, index) => (
        <SortableItem deletePower={deletePower} disabled={!updatePower} key={`item-${index}`} index={index} item={item} onRemove={onRemove} />
      ))}
    </div>
  );
})

const CourseSearch = ({
    addPower,
    updatePower,
    deletePower,
    list,
    sourceList,
    onSort,
    onRemoveItem,
    onAddItem,
  }) => {

  const handleRemove = (id) => {
    confirm({
      title:'确定要删除此关键词吗？',
      onOk () {
        const newList = list.filter(item => item.id !== id)
        onRemoveItem(newList, id)
      }
    })
  }

  // Just show the latest item.
  function displayRender(label) {
    return label[label.length - 1]
  }

  function onChange(values) {
    values.length === 2 && onAddItem(values[values.length - 1])
  }

  function handleSortEnd({ oldIndex, newIndex }) {
    oldIndex !== newIndex && onSort(arrayMove(list, oldIndex, newIndex))
  }

  return (
    <Row>
      {addPower && <Col span={10} offset={7} style={{ marginBottom: 30 }}>
        <Cascader
          placeholder="请选择课程"
          options={sourceList}
          expandTrigger="click"
          size="large"
          displayRender={displayRender}
          onChange={onChange}
          style={{display: 'block'}}
        />
        </Col>
      }
      <Col span={16} offset={4}>
        <Tag color="orange" style={{ marginBottom: 30 }}>温馨提示：长按图片可排序，为防止误操作，鼠标长按250ms后才可以拖动排序</Tag>
        <SortableList
          updatePower={updatePower}
          deletePower={deletePower}
          lockToContainerEdges={true}
          list={list}
          pressDelay={250}
          axis={'xy'}
          onSortEnd={handleSortEnd}
          onRemove={handleRemove} />
      </Col>
    </Row>
  )
}

export default CourseSearch
