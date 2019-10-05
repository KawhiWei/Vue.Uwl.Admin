import Vue from 'vue'
import Router from 'vue-router'
import login from '@/Views/login.vue'
import PlatformHome from '@/Views/PlatformHome.vue'
import customLayout from '@/components/customLayout.vue'
import store from '../Vuex/store'
const _import =require('@/router/_import_'+process.env.NODE_ENV)//获取组件的方法


Vue.use(Router)
let addRouFlag = false

//定义并 New 一个Vue路由对象
const createRouters=()=>new Router(
  {
    // mode:'history',
    base:process.env.BASE_URL,
    routes:[
      //登录
      {
        path: '/login',
        name: 'login',
        component: login,
        meta:{
          title:'login',
          requireAuth:false,//表示此页面打开是否需要登录
          NoNeedHome:false,//添加此字段表示不需要Home模板
        },
        hidden:true,
      },
      {
        //除了错误页面和登录页面routes的第一层需要放组件布局，routes[0].children存放具体功能的组件信息
        path: '/',
        name: 'Layout',
        component: customLayout,
        redirect:'/PlatformHome',
        children:[
          {
            path: '/PlatformHome',
            name: 'PlatformHome',
            component: PlatformHome,
            meta:{
                title:'HelloWorld',
                requireAuth:true,//表示此页面打开是否需要登录
                NoNeedHome:false,//添加此字段表示不需要Home模板
              },
          },
        ]
      }
    ],
  }
)
const router = createRouters()
router.beforeEach((to,from,next)=>{
  if(window.localStorage.router)
  {
    var arr=JSON.parse(window.localStorage.router?window.localStorage.router:'');//获取缓存中的路由
    if(arr.length<=0)
    {
      next({path:'/login',query:{ReturnUrl:to.fullPath}})
    }
    else
    {
      arr=filterAsyncRouterMap(arr)//动态添加组件
      router.addRoutes(arr)//添加动态路由
      if(!addRouFlag)//动态加载路由时需要添加一个变量避免陷入死循环
      {
        addRouFlag=true;
        //跳转动态路由时不可直接next(),  需要用此写法next({ ...to, replace: true })
        next({ ...to, replace: true });
      }
    }
  }
  if(to.meta.requireAuth)
  {
    if(store.state.token==null)
    {
      var token=window.sessionStorage.getItem("Token");
      store.state.token=token;
    }
    if(store.state.token==null)
    {
      next({path:'/login',query:{ReturnUrl:to.fullPath}})
    }
    else{   next();      }
  }
  else{      next();    }
}

)
export function filterAsyncRouterMap(asyncRouter)
{
    //循环路由
    const accessroutes=asyncRouter.filter(route=>{
        if(route.path)
        {
            if(route.path==='/' || route.path==='-')//判断是否是父级路由
            {
                route.component=customLayout;
            }
            else
            {
                try
                {
                    route.component=_import(route.path);
                }
                catch(e)
                {
                    console.info('%c 当前路由 '+route.path+'.vue 不存在，因此如法导入组件，请检查接口数据和组件是否匹配，并重新登录，清空缓存!', "color:red")
                }
            }
        }
        //判断是否有子级
        if(route.children && route.children.length)
        {
           route.children=filterAsyncRouterMap(route.children);
        }
        return true;
    })
    return accessroutes;
}



export default router;
