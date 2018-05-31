// 因为影响编译效率，此动态路由暂废弃

import React from 'react'
import {Router, Route, IndexRoute} from 'dva/router'
import App from './routes/App'
import {isLogin} from './utils'

function redirectToLogin(nextState, replace) {
  if (!isLogin()) {
    replace({
      pathname: '/login',
      state: {
        nextPathname: nextState.location.pathname,
        nextSearch: location.search
      }
    })
  }
}

function redirectToDashboard(nextState, replace) {
  if (isLogin()) {
    replace('/dashboard')
  }
}

const cached = {};
function registerModel(app, model) {
  if (!cached[model.namespace]) {
    app.model(model)
    cached[model.namespace] = 1
  }
}

export default function({history, app}) {
  const routes = [
    {
      path: '/',
      component: App,
      onEnter: redirectToLogin,
      getIndexRoute(nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/dashboard'))
          cb(null, {component: require('./routes/Dashboard')})
        }, 'dashboard')
      },
      childRoutes: [
        //dashboard
        {
          path: 'dashboard',
          name: 'dashboard',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/dashboard'))
              cb(null, require('./routes/Dashboard'))
            }, 'dashboard')
          }
        },
        //account
        {
          path: 'account',
          name: 'account',
          childRoutes: [
            {
              path: 'admin',
              name: 'admin',
              getComponent(nextState, cb) {
                require.ensure([], require => {
                  registerModel(app, require('./models/account/admin'))
                  cb(null, require('./routes/account/Admin'))
                }, 'account-admin')
              }
            }, {
              path: 'user',
              name: 'user',
              getComponent(nextState, cb) {
                require.ensure([], require => {
                  registerModel(app, require('./models/account/user'))
                  cb(null, require('./routes/account/User'))
                }, 'account-user')
              }
            }, {
              path: 'role',
              name: 'role',
              getComponent(nextState, cb) {
                require.ensure([], require => {
                  registerModel(app, require('./models/account/role'))
                  cb(null, require('./routes/account/Role'))
                }, 'account-role')
              }
            }, {
              path: 'teacher',
              name: 'teacher',
              getComponent(nextState, cb) {
                require.ensure([], require => {
                  registerModel(app, require('./models/account/teacher'))
                  cb(null, require('./routes/account/Teacher'))
                }, 'account-teacher')
              }
            }
          ]
        },
        //system
        {
          path: 'system',
          name: 'system',
          childRoutes: [
            {
              path: 'modify-password',
              name: 'modify-password',
              getComponent(nextState, cb) {
                require.ensure([], require => {
                  registerModel(app, require('./models/system/modifyPassword'))
                  cb(null, require('./routes/system/ModifyPassword'))
                }, 'modify-password')
              }
            }
          ]
        },
        //order
        {
          path: 'order',
          name: 'order',
          childRoutes: [
            {
              path: 'list',
              name: 'list',
              getComponent(nextState, cb) {
                require.ensure([], require => {
                  registerModel(app, require('./models/order/list'))
                  cb(null, require('./routes/order/OrderList'))
                }, 'order-list')
              }
            }, {
              path: 'flow',
              name: 'flow',
              getComponent(nextState, cb) {
                require.ensure([], require => {
                  registerModel(app, require('./models/order/flow'))
                  cb(null, require('./routes/order/Flow'))
                }, 'order-flow')
              }
            }
          ]
        },
        //live
        {
          path: 'live',
          name: 'live',
          childRoutes: [
            {
              path: 'list',
              name: 'list',
              getComponent(nextState, cb) {
                require.ensure([], require => {
                  registerModel(app, require('./models/live/list'))
                  cb(null, require('./routes/live/LiveList'))
                }, 'live-list')
              }
            }
          ]
        },
        //bbs
        {
          path: 'bbs',
          name: 'bbs',
          childRoutes: [
            {
              path: 'send',
              name: 'send',
              getComponent(nextState, cb) {
                require.ensure([], require => {
                  registerModel(app, require('./models/bbs/send'))
                  cb(null, require('./routes/bbs/Send'))
                }, 'bbs-send')
              }
            },
            {
              path: 'category',
              name: 'category',
              getComponent(nextState, cb) {
                require.ensure([], require => {
                  registerModel(app, require('./models/bbs/category'))
                  cb(null, require('./routes/bbs/Category'))
                }, 'category')
              }
            },
          ]
        },
        //course
        {
          path: 'course',
          name: 'course',
          childRoutes: [
            {
              path: 'list',
              name: 'list',
              getComponent(nextState, cb) {
                require.ensure([], require => {
                  registerModel(app, require('./models/course/list'))
                  cb(null, require('./routes/course/List'))
                }, 'course-list')
              }
            },
            {
              path: 'tree',
              name: 'tree',
              getComponent(nextState, cb) {
                require.ensure([], require => {
                  registerModel(app, require('./models/course/tree'))
                  cb(null, require('./routes/course/Tree'))
                }, 'course-tree')
              }
            },
            {
              path: 'category',
              name: 'category',
              getComponent(nextState, cb) {
                require.ensure([], require => {
                  registerModel(app, require('./models/course/category'))
                  cb(null, require('./routes/course/Category'))
                }, 'course-category')
              }
            }
          ]
        },
        //carousel
        {
          path: 'carousel',
          name: 'carousel',
          childRoutes: [
            {
              path: 'list',
              name: 'list',
              getComponent(nextState, cb) {
                require.ensure([], require => {
                  registerModel(app, require('./models/carousel/list'))
                  cb(null, require('./routes/carousel/CarouselList'))
                }, 'carousel-list')
              }
            }
          ]
        },
        //coupon
        {
          path: 'coupon',
          name: 'coupon',
          childRoutes: [
            {
              path: 'send',
              name: 'send',
              getComponent(nextState, cb) {
                require.ensure([], require => {
                  registerModel(app, require('./models/coupon/send'))
                  cb(null, require('./routes/coupon/Send'))
                }, 'coupon-send')
              }
            }
          ]
        },
        //topic
        {
          path: 'topic',
          name: 'topic',
          childRoutes: [
            {
              path: 'list',
              name: 'list',
              getComponent(nextState, cb) {
                require.ensure([], require => {
                  registerModel(app, require('./models/topic/list'))
                  cb(null, require('./routes/topic/List'))
                }, 'topic-list')
              }
            },
            {
              path: 'add',
              name: 'add',
              getComponent(nextState, cb) {
                require.ensure([], require => {
                  registerModel(app, require('./models/topic/add'))
                  cb(null, require('./routes/topic/Add'))
                }, 'topic-add')
              }
            }
          ]
        },
        //festival
        {
          path: 'festival',
          name: 'festival',
          childRoutes: [
            {
              path: 'competition',
              name: 'competition',
              getComponent(nextState, cb) {
                require.ensure([], require => {
                  registerModel(app, require('./models/festival/competition'))
                  cb(null, require('./routes/festival/Competition'))
                }, 'festival-competition')
              }
            },
            {
              path: 'practice',
              name: 'practice',
              getComponent(nextState, cb) {
                require.ensure([], require => {
                  registerModel(app, require('./models/festival/practice'))
                  cb(null, require('./routes/festival/Practice'))
                }, 'festival-practice')
              }
            },
            {
              path: 'contest',
              name: 'contest',
              getComponent(nextState, cb) {
                require.ensure([], require => {
                  registerModel(app, require('./models/festival/contest'))
                  cb(null, require('./routes/festival/Contest'))
                }, 'festival-contest')
              }
            },
            {
              path: 'practice-works',
              name: 'practice-works',
              getComponent(nextState, cb) {
                require.ensure([], require => {
                  registerModel(app, require('./models/festival/practiceWorks'))
                  cb(null, require('./routes/festival/PracticeWorks'))
                }, 'festival-practiceWorks')
              }
            },
          ]
        },
        //no-power
        {
          path: 'no-power',
          name: 'no-power',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              cb(null, require('./routes/NoPower'))
            }, 'no-power')
          }
        }
      ]
    },
    //login
    {
      path: 'login',
      name: 'login',
      onEnter: redirectToDashboard,
      getComponent(nextState, cb) {
        require.ensure([], require => {
          cb(null, require('./routes/Login'))
        }, 'login')
      }
    },
    //demo
    {
      path: 'demo',
      name: 'demo',
      getComponent(nextState, cb) {
        require.ensure([], require => {
          cb(null, require('./routes/Demo'))
        }, 'demo')
      }
    },
    //*
    {
      path: '*',
      name: 'error',
      getComponent(nextState, cb) {
        require.ensure([], require => {
          cb(null, require('./routes/Error'))
        }, 'error')
      }
    }
  ]

  return <Router history={history} routes={routes}/>
}
