import "babel-polyfill" // 如果需要支持ie 9+，请解注此行即可。
import './index.html'
import dva from 'dva'
import { browserHistory } from 'dva/router'

// 1. Initialize
const app = dva({
  history: browserHistory,
  onError(error) {
    console.error("app onError -- ", error)
  }
})

// 2. Model
app.model(require('./models/app'))
app.model(require('./models/modal'))

if(newband.app.admin.IS_DYNAMIC_LOAD) {
  // 3. Router for browserHistory dynamic load
  app.router(require('./router-dynamic'))
} else {
  app.model(require('./models/dashboard'))

  app.model(require('./models/account/admin'))
  app.model(require('./models/account/user'))
  app.model(require('./models/account/role'))
  app.model(require('./models/account/teacher'))

  app.model(require('./models/system/modifyPassword'))

  app.model(require('./models/order/list'))
  app.model(require('./models/order/flow'))

  app.model(require('./models/live/list'))

  app.model(require('./models/bbs/send'))
  app.model(require('./models/bbs/category'))

  app.model(require('./models/course/list'))
  app.model(require('./models/course/tree'))
  app.model(require('./models/course/category'))
  app.model(require('./models/course/teacher'))
  app.model(require('./models/course/teacherTree'))

  app.model(require('./models/carousel/list'))

  app.model(require('./models/coupon/send'))
  app.model(require('./models/coupon/sendList'))

  app.model(require('./models/topic/list'))
  app.model(require('./models/topic/add'))

  app.model(require('./models/festival/competition'))
  app.model(require('./models/festival/practice'))
  app.model(require('./models/festival/contest'))
  app.model(require('./models/festival/practiceWorks'))

  app.model(require('./models/collect/recommend/mainSearch'))
  app.model(require('./models/collect/recommend/courseSearch'))
  app.model(require('./models/collect/recommend/courseDetailSearch'))
  app.model(require('./models/collect/upgrade'))
  app.model(require('./models/collect/filterKeys'))
  app.model(require('./models/collect/userCheckList'))

  // 3. Router for browserHistory
  app.router(require('./router'))
}

// 4. Start
app.start('#root')
