import React, {PropTypes} from 'react'
import {connect} from 'dva'
import {Row, Col, Card} from 'antd'
import styles from './index.less'
import ReportCard from './components/ReportCard'

function Dashboard ({ location, dispatch, dashboard }) {
  const { reportList } = dashboard
  return (
    <Row gutter={24}>
      {/*<ReportCard list={reportList}/>*/}
    </Row>
  )
}
Dashboard.propTypes = {
  dashboard: PropTypes.object.isRequired
}
export default connect(({ dashboard }) => ({ dashboard }))(Dashboard)
