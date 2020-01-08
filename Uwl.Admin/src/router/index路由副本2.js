import Vue from 'vue'
import Router from 'vue-router'
import login from '@/Views/login.vue'
import Menu from '@/Views/MenuMgr/Menu.vue'
import User from '@/Views/UserMgr/User.vue'
import Role from '@/Views/RoleMgr/Role.vue'
import Assignment from '@/Views/Assignment/RoleAssigMenu.vue' //角色分配菜单组件注入
import Button from '@/Views/ButtonMgr/Button.vue' //角色分配菜单组件注入
import test2 from '@/Views/test2.vue'
// import Layout from '@/Views/Layout.vue'
import PlatformHome from '@/Views/PlatformHome.vue'
import customLayout from '@/components/customLayout.vue'
import store from '../Vuex/store'
const _import =require('@/router/_import_'+process.env.NODE_ENV)//获取组件的方法


Vue.use(Router)


//定义并 New 一个Vue路由对象
const createRouters=()=>new Router(
  {
    mode:'history',
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
      },
      {
        path: '/meuns',
        name: 'Layout',
        component: customLayout,
        children:[
          {
            path: '/menu/menumgr',
            name: 'menumgr',
            component: Menu,
            meta:{
              title:'菜单管理',
              requireAuth:true,//表示此页面打开是否需要登录
              NoNeedHome:false,//添加此字段表示不需要Home模板
            },
          }
        ]

      },
      {
        path: '/users',
        name: 'Layout',
        component: customLayout,
        children:[
          {
            path: '/user/usermgr',
            name: 'uermgr',
            component: User,
            meta:{
              title:'用户管理',
              requireAuth:true,//表示此页面打开是否需要登录
              NoNeedHome:false,//添加此字段表示不需要Home模板
            },
          }
        ]

      },
      {
        path: '/test2',
        name: 'customLayout',
        component: customLayout,
        hidden:true,
        children:[
          {
            path: '/test2',
            name: 'test2',
            component: test2,
            meta:{
              title:'test2',
              requireAuth:true,//表示此页面打开是否需要登录
              NoNeedHome:false,//添加此字段表示不需要Home模板
            },
          }
        ]


      },
      {
        path: '/roles',
        name: 'Layout',
        component: customLayout,
        children:[
          {
            path: '/role/rolemgr',
            name: 'uermgr',
            component: Role,
            meta:{
              title:'角色管理',
              requireAuth:true,//表示此页面打开是否需要登录
              NoNeedHome:false,//添加此字段表示不需要Home模板
            },
          }
        ]

      },
      {
        path: '/roleAssig',
        name: 'Layout',
        component: customLayout,
        children:[
          {
            path: '/role/RoleAssig',
            name: 'uermgr',
            component: Assignment,
            meta:{
              title:'角色分配菜单',
              requireAuth:true,//表示此页面打开是否需要登录
              NoNeedHome:false,//添加此字段表示不需要Home模板
            },
          }
        ]
      },
      {
        path: '/button',
        name: 'Layout',
        component: customLayout,
        children:[
          {
            path: '/button/buttonmgr',
            name: 'buttonmgr',
            component: Button,
            meta:{
              title:'按钮管理',
              requireAuth:true,//表示此页面打开是否需要登录
              NoNeedHome:false,//添加此字段表示不需要Home模板
            },
          }
        ]
      }
    ],
  }
)


const router = createRouters()
export function filterAsyncRouter(asyncRouter)
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
           route.children=filterAsyncRouter(route.children);
        }
        return true;
    })
    return accessroutes;

}




router.beforeEach((to,from,next)=>{
    if(to.meta.requireAuth)
    {
      if(store.state.token==null)
      {
        var token=window.localStorage.getItem("Token");
        store.state.token=token;
      }
      if(store.state.token==null)
      {
        next({path:'/login',query:{ReturnUrl:to.fullPath}})
      }
      else
      {
        next();
      }
    }
    else
    {
      next();
    }
  }

)
export default router;
