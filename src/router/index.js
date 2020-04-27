import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  {
    path: '/login', component: () => import('@/views/login/index'),
    hidden: true,
    name: 'login',
    meta: { title: '登录' }
  },
  {
    path: '/wechatLogin', component: () => import('@/views/login/index'),
    hidden: true,
    name: 'wechatLogin',
    meta: { title: '企业微信登录跳转' }
  },
  { path: '*', redirect: '/404', hidden: true, meta: { title: '404' }},
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true,
    name: '404',
    meta: { title: '404' }
  },
  {
    path: '/401',
    component: () => import('@/views/401'),
    hidden: true,
    name: '401',
    meta: { title: '401' }
  },
  {
    component: Layout,
    redirect: '/dashboard',
    path: '',
    hidden: true,
    children: [{
      path: '/dashboard',
      name: 'dashboard',
      meta: { affix: true, title: '首页', icon: 'home' },
      component: () => import('@/views/dashboard/index')
    }]
  },
  {
    path: '/Platform',
    component: Layout,
    name: 'Platform',
    meta: { title: '用户', icon: 'icon_bangzhuwendang' },
    redirect: 'noredirect',
    children: [
      {
        path: '/Merchant',
        name: 'Merchant',
        component: () => import('@/views/Merchant/Index'),
        meta: { title: '商家列表', icon: 'icon_baocun' }
      },
      {
        path: '/Doctors',
        name: 'Doctors',
        component: () => import('@/views/Doctors/Index'),
        meta: { title: '医生列表', icon: 'tree' }
      },
      {
        path: '/HealthManager',
        name: 'HealthManager',
        component: () => import('@/views/HealthManager/Index'),
        meta: { title: '健康管理师', icon: 'icon_baocun' }
      },
      {
        path: '/Member/MemberList',
        name: 'MemberList',
        component: () => import('@/views/Member/MemberList/List'),
        meta: { title: '会员列表', icon: 'icon_baocun' }
      },
      {
        path: '/Doctors/Integral',
        name: 'Integral',
        component: () => import('@/views/Doctors/Integral'),
        meta: { title: '医生积分', icon: 'icon_baocun' }
      }, {
        path: '/Doctors/pdf',
        name: 'pdfdoctors',
        component: () => import('@/views/Doctors/hahah'),
        meta: { title: '导出医生pdf', icon: 'icon_bangzhuwendang' }
      }
    ]
  },
  {
    path: '/Review',
    component: Layout,
    name: 'Review',
    meta: { title: '审核', icon: 'icon_bangzhuwendang' },
    redirect: 'noredirect',
    children: [
      {
        path: '/Review/Merchant',
        name: 'ReviewMerchant',
        component: () => import('@/views/Review/Merchant'),
        meta: { title: '商家', icon: 'icon_bangzhuwendang' }
      },
      {
        path: '/Review/Doctors',
        name: 'ReviewDoctors',
        component: () => import('@/views/Review/Doctors'),
        meta: { title: '医生', icon: 'icon_bangzhuwendang' }
      }
    ]
  },
  {
    path: '/Hospital',
    component: Layout,
    meta: { title: '医院管理', icon: 'hospital' },
    name: 'Hospital',
    redirect: 'noredirect',
    children: [
      {
        path: '/Hospital/List',
        name: 'HospitalList',
        component: () => import('@/views/Hospital/Index'),
        meta: { title: '医院', icon: 'icon_bangzhuwendang' }
      },
      {
        path: '/Hospital/Office',
        name: 'HospitalOffice',
        component: () => import('@/views/Hospital/Office'),
        meta: { title: '科室', icon: 'icon_bangzhuwendang' }
      }
    ]
  },
  {
    path: '/data',
    meta: { title: '数据', icon: 'hospital' },
    name: 'data',
    redirect: 'noredirect',
    component: Layout,
    children: [
      {
        path: '/data/hospital',
        name: 'datahospital',
        component: () => import('@/views/Hospital/Dashboard/Index'),
        meta: { title: '数据看板', icon: 'icon_bangzhuwendang' }
      }
    ]
  },
  {
    path: '/Home',
    component: Layout,
    meta: { title: '首页管理', icon: 'hospital' },
    name: 'Home',
    redirect: 'noredirect',
    children: [
      {
        path: '/Home/Recommend',
        name: 'Recommend',
        component: () => import('@/views/Recommend/Index'),
        meta: { title: '为您推荐', icon: 'hospital' }
      },
      {
        path: '/Home/Health',
        name: 'Health',
        component: () => import('@/views/Health/Index'),
        meta: { title: '健康管理', icon: 'icon_bangzhuwendang' }
      },
      {
        path: '/Home/Headline',
        name: 'Headline',
        component: () => import('@/views/Headline/Index'),
        meta: { title: '健康管理', icon: 'icon_bangzhuwendang' }
      }
    ]
  },
  {
    path: '/Article',
    component: Layout,
    redirect: 'noredirect',
    children: [
      {
        path: '/Article/List',
        name: 'ArticleList',
        component: () => import('@/views/Article/Index'),
        meta: { title: '文章管理', icon: 'hospital' }
      }
    ]
  },
  {
    path: '/Dictionary',
    component: Layout,
    redirect: 'noredirect',
    meta: { title: '字典', icon: 'hospital' },
    name: 'Dictionary',
    children: [
      {
        path: '/Dictionary/Index',
        name: 'DictionaryIndex',
        component: () => import('@/views/Dictionary/Index'),
        meta: { title: '字典管理', icon: 'hospital' }
      },
      {
        path: '/Dictionary/BusinessScope',
        name: 'DictionaryBusinessScope',
        component: () => import('@/views/Dictionary/BusinessScope'),
        meta: { title: ' 经营范围', icon: 'hospital' }
      }
    ]
  },
  {
    path: '/Handf',
    component: Layout,
    redirect: 'noredirect',
    meta: { title: '帮助&反馈', icon: 'hospital' },
    name: 'Handf',
    children: [
      {
        path: '/Handf/Help',
        name: 'Help',
        component: () => import('@/views/Help/Index'),
        meta: { title: '常见问题', icon: 'icon_bangzhuwendang' }
      },
      {
        path: '/Handf/Feedback',
        name: 'Feedback',
        component: () => import('@/views/Feedback/Index'),
        meta: { title: '反馈', icon: 'icon_bangzhuwendang' }
      }
    ]
  },
  // {
  //   path: '/OperationLog',
  //   component: Layout,
  //   children: [
  //     {
  //       path: '/OperationLog',
  //       name: 'OperationLog',
  //       component: () => import('@/views/OperationLog'),
  //       meta: { title: '操作日志', icon: 'icon_bangzhuwendang' },
  //     }
  //   ]
  // },

  {
    path: '/System',
    component: Layout,
    redirect: 'noredirect',
    name: 'System',
    meta: { title: '系统管理', icon: '系统' },
    children: [
      {
        path: '/System/Account',
        name: 'AccountList',
        component: () => import('@/views/Account/List'),
        meta: { title: '账号管理', icon: 'icon_bangzhuwendang' }
      },
      {
        path: '/System/Organization',
        name: 'Organization',
        component: () => import('@/views/Account/Organization'),
        meta: { title: '组织架构', icon: 'icon_bangzhuwendang' }
      },
      {
        path: '/System/Menu',
        name: 'Menu',
        component: () => import('@/views/Purview/Menu'),
        meta: { title: '菜单管理', icon: 'tree' }
      },
      {
        path: '/System/Role',
        name: 'Role',
        component: () => import('@/views/Purview/Role'),
        meta: { title: '角色管理', icon: 'tree' }
      },
      {
        path: '/System/Assign',
        name: 'Assign',
        component: () => import('@/views/Purview/Assign'),
        meta: { title: '分配权限', icon: 'tree' }
      },
      {
        path: '/System/Assign',
        name: 'Assign',
        component: () => import('@/views/Purview/Assign'),
        meta: { title: '分配权限', icon: 'tree' }
      },
      {
        path: '/PageConfiguration/Index',
        name: 'PageConfiguration',
        component: () => import('@/views/PageConfiguration/Index'),
        meta: { title: '页面配置', icon: 'tree' }
      },
      {
        path: '/WeChatImpartialityTemplate/Index',
        name: 'WeChatImpartialityTemplate',
        component: () => import('@/views/WeChatImpartialityTemplate/Index'),
        meta: { title: '公正号模板', icon: 'tree' }
      }
    ]
  },
  {
    path: '/test',
    component: Layout,
    children: [
      {
        path: '/test',
        name: 'test',
        component: () => import('@/views/test'),
        meta: { title: '测试', icon: 'icon_bangzhuwendang' }
      }
    ]
  },
  {
    path: '/ExecuteSql',
    component: Layout,
    children: [
      {
        path: '/ExecuteSql',
        name: 'ExecuteSql',
        component: () => import('@/views/ExecuteSql/Index.vue'),
        meta: { title: '执行sql', icon: 'icon_bangzhuwendang' }
      }
    ]
  }, {
    path: '/faqs',
    component: Layout,
    children: [
      {
        path: '/faqs',
        name: 'faqs',
        component: () => import('@/views/Faqs/Index'),
        meta: { title: '问答列表', icon: 'icon_bangzhuwendang' }
      }
    ]
  },
  {
    component: Layout,
    path: '/pdf',
    children: [

    ]
  }, {
    path: '/Report',
    component: Layout,
    children: [
      {
        path: '/Report/current',
        name: 'Report_current',
        component: () => import('@/views/Report/Index'),
        meta: { title: '通用报表', icon: 'icon_bangzhuwendang' }
      }, {
        path: '/Report/:id',
        name: 'Report_index',
        component: () => import('@/views/Report/report'),
        meta: { title: '通用报表', icon: 'icon_bangzhuwendang' }
      }
    ]
  }, {
    path: '/Mall',
    hidden: true,
    component: Layout,
    name: 'Mall',
    meta: { title: '商城管理', icon: '营销' },
    children: [
      {
        path: '/Mall/Decoration',
        name: 'DecorationIndex',
        component: () => import('@/views/Mall/Decoration/Index'),
        meta: { title: '装修管理', icon: '营销' }
      },
      {
        path: '/Mall/Banner',
        name: 'BannerIndex',
        component: () => import('@/views/Mall/Banner/Index'),
        meta: { title: '广告位', icon: '营销' }
      },
      {
        path: '/Mall/Product',
        name: 'ProductIndex',
        component: () => import('@/views/Mall/Product/Index'),
        meta: { title: '商品中心', icon: '营销' }
      },
      {
        path: '/Mall/Order',
        name: 'OrderIndex',
        component: () => import('@/views/Mall/Orders/Index'),
        meta: { title: '订单中心', icon: '营销' }
      }
    ]
  }, {
    path: '/HealthDocumentation',
    hidden: true,
    component: Layout,
    name: 'HealthDocumentation',
    meta: { title: '健康档案', icon: '营销' },
    children: [
      {
        path: '/HealthDocumentation/BasicSettings',
        name: 'BasicSettingsIndex',
        component: () => import('@/views/HealthDocumentation/BasicSettings/Index'),
        meta: { title: '基础信息设置', icon: '营销' }
      },
      {
        path: '/HealthDocumentation/DailyIndicatorSettings',
        name: 'DailyIndicatorSettingsIndex',
        component: () => import('@/views/HealthDocumentation/DailyIndicatorSettings/Index'),
        meta: { title: '日常指标设置', icon: '营销' }
      },
      {
        path: '/HealthDocumentation/Member',
        name: 'HealthDocumentationMemberIndex',
        component: () => import('@/views/HealthDocumentation/Member/Index'),
        meta: { title: '会员列表', icon: '营销' }
      },
      {
        path: '/HealthDocumentation/Questionnaire',
        name: 'HealthDocumentationQuestionnaireIndex',
        component: () => import('@/views/HealthDocumentation/Questionnaire/Index'),
        meta: { title: '健康问卷', icon: '营销' }
      }
    ]
  }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
