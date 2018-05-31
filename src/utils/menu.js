//power = { 1: "显示菜单", 2: "查看页面", 3: "新增", 4: "修改", 5: "删除", 6: "详情" , 7: "审核", 8: "上传" }
//options = { MENU: "显示菜单", CONTENT: "查看页面", ADD: "新增", UPDATE: "修改", DELETE: "删除", DETAIL: "详情", CHECK: "审核", UPLOAD: "上传" }
// import _ from 'lodash'

const menu = [
  //dashboard
  {
    id: 1,
    key: 'dashboard',
    name: '管理平台',
    icon: 'laptop',
    power: [1, 2]
  },
  //account
  {
    id: 2,
    key: 'account',
    name: '用户管理',
    icon: 'user',
    clickable: false,
    power: [1],
    children: [
      {
        id: 21,
        key: 'admin',
        name: '管理员',
        power: [1, 2, 3, 4, 5]
      },
      {
        id: 22,
        key: 'role',
        name: '管理员角色',
        power: [1, 2, 3, 4, 5]
      },
      {
        id: 23,
        key: 'user',
        name: '用户',
        power: [1, 2, 3, 4, 5, 12]
      },
      {
        id: 24,
        key: 'teacher',
        name: '老师',
        power: [1, 2, 3, 4, 5, 6]
      }
    ]
  },
  //system
  {
    id: 3,
    key: 'system',
    name: '系统管理',
    icon: 'appstore',
    clickable: false,
    power: [1],
    children: [
      {
        id: 31,
        key: 'modify-password',
        name: '修改密码',
        power: [1, 2, 4]
      }
    ]
  },
  //order
  {
    id: 4,
    key: 'order',
    name: '订单管理',
    icon: 'bars',
    clickable: false,
    power: [1],
    children: [
      {
        id: 41,
        key: 'list',
        name: '订单列表',
        power: [1, 2]
      },
      {
        id: 42,
        key: 'flow',
        name: '账户流水',
        power: [1, 2]
      }
    ]
  },
  //live
  {
    id: 5,
    key: 'live',
    name: '直播管理',
    icon: 'play-circle-o',
    clickable: false,
    power: [1],
    children: [
      {
        id: 51,
        key: 'list',
        name: '直播列表',
        power: [1, 2, 3, 4, 5, 6]
      }
    ]
  },
  //bbs
  {
    id: 6,
    key: 'bbs',
    name: '论坛管理',
    icon: 'message',
    clickable: false,
    power: [1],
    children: [
      {
        id: 61,
        key: 'send',
        name: '帖子列表',
        power: [1, 2, 3, 4, 5]
      },
      // {
      //   id: 64,
      //   key: 'category',
      //   name: '分类管理',
      //   power: [1, 2, 3, 4, 5]
      // },
    ]
  },
  //course
  {
    id: 7,
    key: 'course',
    name: '课程管理',
    icon: 'book',
    clickable: false,
    power: [1],
    children: [
      {
        id: 71,
        key: 'list',
        name: '课程列表',
        power: [1, 2, 4, 6]
      },
      {
        id: 72,
        key: 'tree',
        name: '课程详情',
        power: [2, 4]
      },
      {
        id:73,
        key:'category',
        name: '课程分类',
        power: [1, 2, 3, 4, 5]
      },
      {
        id:74,
        key:'star',
        name: '明星课程',
        power: [1, 2, 3, 4, 5, 9, 10],
        query: { type: 'course', status: 10 }
      },
      {
        id:75,
        key:'teacher',
        name: '名师课程',
        power: [1, 2, 3, 4, 5, 9, 10],
        query: { type: 'famous_course', status: 10 }
      },
      {
        id: 76,
        key: 'teacher-tree',
        name: '课时列表(名师/明星)',
        power: [2, 3, 4, 5, 9, 10]
      },
    ]
  },
  //carousel
  {
    id: 8,
    key: 'carousel',
    name: '轮播管理',
    icon: 'camera-o',
    clickable: false,
    power: [1],
    children: [
      {
        id: 81,
        key: 'list',
        query: {
          os: 'ios',
          status: 1,
          page: 'home',
          period: 2,
        },
        name: '轮播图列表',
        power: [1, 2, 3, 4, 5]
      },
      {
        id: 82,
        key: 'list',
        query: {
          os: 'ios',
          status: 1,
          page: 'startup',
          period: 2,
        },
        name: 'APP启动页',
        power: [1, 2, 3, 4, 5]
      }
    ]
  },
  //coupon
  {
    id: 9,
    key: 'coupon',
    name: '优惠券管理',
    icon: 'credit-card',
    clickable: false,
    power: [1],
    children: [
      {
        id: 91,
        key: 'send',
        name: '发放优惠券',
        power: [1, 2, 3]
      }, {
        id: 92,
        key: 'send-list',
        name: '发放记录',
        power: [1, 2, 3, 4]
      }
    ]
  },
  //topic
  {
    id: 10,
    key: 'topic',
    name: '专题管理',
    icon: 'bars',
    clickable: false,
    power: [1],
    children: [
      {
        id: 101,
        key: 'list',
        query: {
          status: 1
        },
        name: '专题列表',
        power: [1, 2, 3, 4, 5, 9, 10, 11]
      },
      {
        id: 102,
        key: 'add',
        name: '新增专题',
        power: [2, 3, 4]
      }
    ]
  },
  //festival
  {
    id: 11,
    key: 'festival',
    name: '赛事管理',
    icon: 'trophy',
    clickable: false,
    power: [1],
    children: [
      {
        id: 111,
        key: 'competition',
        name: '大赛列表',
        query: {
          status: 1
        },
        power: [1, 2, 3, 4, 5, 9, 10]
      },
      {
        id: 112,
        key: 'practice',
        name: '练习曲目列表',
        query: {
          scope: 'valid'
        },
        power: [1, 2, 3, 4, 5, 9, 10]
      },
      {
        id:115,
        key: 'contest',
        name: '大赛榜单管理',
        query: {
          scope: 'all'
        },
        power: [1, 2, 3, 4, 6, 9, 10]
      },
      {
        id:116,
        key: 'practice-works',
        name: '练习榜单管理',
        query: {
          scope: 'all'
        },
        power: [1, 2, 3, 4, 6, 9, 10]
      }
    ]
  },
  //system
  {
    id: 12,
    key: 'collect',
    name: 'App综合管理',
    icon: 'appstore',
    clickable: false,
    power: [1],
    children: [
      {
        id: 121,
        key: 'recommend',
        name: '推荐管理',
        power: [1, 2, 3, 4, 5]
      },
      {
        id: 122,
        key: 'upgrade',
        name: '强制更新',
        power: [1, 2, 4]
      },
      {
        id: 123,
        key: 'filter-keys',
        name: '关键字过滤管理',
        power: [1, 2, 4]
      },
      {
        id: 124,
        key: 'user-check-list',
        name: '待审核列表',
        power: [1, 2, 4]
      }
    ]
  },
]

export default menu
