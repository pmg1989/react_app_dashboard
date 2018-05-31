import React from 'react'
import { Icon, Col, Card } from 'antd'
import CountUp from 'react-countup'
import styles from './ReportCard.less'

function CardItem (props) {
  const { icon, color, title, number } = props
  return (
    <Card className={styles.ReportCard} bordered={false} bodyStyle={{padding: 0}}>
      <Icon className={styles.iconWarp} style={{ color }} type={icon} />
      <div className={styles.content}>
        <p className={styles.title}>{title}</p>
        <p className={styles.number}>
          <CountUp
            start={0}
            end={number}
            duration={3}
            useEasing
            useGrouping
            separator=','
            {...props.countUp || {}}
          />
        </p>
      </div>
    </Card>
  )
}

function ReportCard ({ list }) {
  return (
    <div>
      {list.map((item, key) => (
      <Col key={key} lg={6} md={12}>
        <CardItem {...item} />
      </Col>))
      }
    </div>
  )
}

export default ReportCard
