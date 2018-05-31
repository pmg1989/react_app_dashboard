import React from 'react'
import { Router, Route, IndexRoute } from 'dva/router'
import { isLogin } from './utils'

export default function ({history, app}) {

  function redirectToLogin(nextState, replace) {
    if (!isLogin()) {
      replace({
        pathname: '/login',
        state: { nextPathname: nextState.location.pathname, nextSearch: location.search }
      })
    }
  }

  function redirectToDashboard(nextState, replace) {
    if (isLogin()) {
      replace('/dashboard')
    }
  }

  return  (
    <Router history={history}>
      <Route path="/" component={require("./routes/App")} onEnter={redirectToLogin}>
        <IndexRoute component={require("./routes/Dashboard")}/>
        <Route path="dashboard" component={require("./routes/Dashboard")}/>
        <Route path="account">
          <Route path="admin" component={require("./routes/account/Admin")}/>
          <Route path="user" component={require("./routes/account/User")}/>
          <Route path="role" component={require("./routes/account/Role")}/>
          <Route path="teacher" component={require("./routes/account/Teacher")}/>
        </Route>
        <Route path="system">
          <Route path="modify-password" component={require("./routes/system/ModifyPassword")}></Route>
        </Route>
        <Route path="order">
          <Route path="list" component={require("./routes/order/OrderList")}></Route>
          <Route path="flow" component={require("./routes/order/Flow")}></Route>
        </Route>
        <Route path="live">
          <Route path="list" component={require("./routes/live/LiveList")}></Route>
        </Route>
        <Route path="bbs">
          <Route path="send" component={require("./routes/bbs/Send")}></Route>
          <Route path="category" component={require("./routes/bbs/Category")}></Route>
        </Route>
        <Route path="course">
          <Route path="list" component={require("./routes/course/List")}></Route>
          <Route path="tree" component={require("./routes/course/Tree")}/>
          <Route path="category" component={require('./routes/course/Category')}/>
          <Route path="teacher" component={require('./routes/course/Teacher')}/>
          <Route path="star" component={require('./routes/course/Teacher')}/>
          <Route path="teacher/:id" component={require('./routes/course/TeacherTree')}/>
        </Route>
        <Route path="carousel">
          <Route path="list" component={require("./routes/carousel/CarouselList")}></Route>
        </Route>
        <Route path="coupon">
          <Route path="send" component={require("./routes/coupon/Send")}></Route>
          <Route path="send-list" component={require("./routes/coupon/SendList")}></Route>
        </Route>
        <Route path="topic">
          <Route path="list" component={require("./routes/topic/List")}></Route>
          <Route path="add" component={require("./routes/topic/Add")}></Route>
        </Route>
        <Route path="festival">
          <Route path="competition" component={require("./routes/festival/Competition")}></Route>
          <Route path="practice" component={require("./routes/festival/Practice")}></Route>
          <Route path="contest" component={require("./routes/festival/Contest")}></Route>
          <Route path="practice-works" component={require("./routes/festival/PracticeWorks")}></Route>
        </Route>
        <Route path="collect">
          <Route path="recommend" component={require("./routes/collect/Recommend")}></Route>
          <Route path="upgrade" component={require("./routes/collect/Upgrade")}></Route>
          <Route path="filter-keys" component={require("./routes/collect/FilterKeys")}></Route>
          <Route path="user-check-list" component={require("./routes/collect/UserCheckList")}></Route>
        </Route>
        <Route path="no-power" component={require("./routes/NoPower")}/>
      </Route>
      <Route path="login" component={require("./routes/Login")} onEnter={redirectToDashboard}/>
      <Route path="demo" component={require("./routes/Demo")}/>
      <Route path="*" component={require("./routes/Error")}/>
    </Router>
  )
}
