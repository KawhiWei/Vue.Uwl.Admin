import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'


Vue.use(Router)

export default new Router({
  mode:'history',
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld,
      meta:{
        title:'HelloWorld',
        requireAuth:false,//表示此页面打开是否需要登录
        NoNeedHome:true,//添加此字段表示不需要Home模板
      },
      hidden:true,
    },
    
  ]
})
