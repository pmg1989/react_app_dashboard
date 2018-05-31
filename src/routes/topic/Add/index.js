import React, {PropTypes} from 'react'
import {connect} from 'dva'
import {checkPower} from '../../../utils'
import {ADD, UPDATE} from '../../../constants/options'
import TopicForm from './TopicForm'

const TopicAdd = ({ location, curPowers, dispatch, topicAdd }) => {

  const { id } = location.query

  const addPower = checkPower(ADD, curPowers)
  const updatePower = checkPower(UPDATE, curPowers)

  const topicFormProps = {
    id,
    topicAdd,
    addPower,
    updatePower,
    onOk(data, preview = false) {
      dispatch({
        type: !!data.id
          ? 'topicAdd/update'
          : 'topicAdd/create',
        payload: {
          curItem: data,
          preview
        }
      })
    }
  }

  return (
    <div className='content-inner'>
      <TopicForm {...topicFormProps}/>
    </div>
  )
}

TopicAdd.propTypes = {
  topicAdd: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired
}

function mapStateToProps({ topicAdd }) {
  return { topicAdd }
}

export default connect(mapStateToProps)(TopicAdd)
