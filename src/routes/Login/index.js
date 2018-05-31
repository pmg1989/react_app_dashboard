import React, { Component, PropTypes } from 'react'
import { connect } from 'dva'
import LoginForm from './LoginForm'
import styles from './LoginForm.less'
import { Spin } from 'antd'

function Login ({ dispatch, loading }) {
  const loginProps = {
    loading,
    onOk (data) {
      dispatch({type: 'app/login', payload: data})
    }
  }
  return (
    <div className={styles.spin}><Spin tip='加载用户信息...' spinning={loading} size='large'><LoginForm {...loginProps} /></Spin></div>
  )
}

Login.propTypes = {
  dispatch: PropTypes.func,
  loading: PropTypes.bool
}

function mapStateToProps({ app }) {
  return { loading: app.loading }
}

export default connect(mapStateToProps)(Login)
