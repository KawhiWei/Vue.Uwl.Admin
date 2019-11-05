import axios from 'axios' //在APi访问接口引入Vuex
import Vue from 'vue';
import router from '../router/index'
import { Message } from 'iview'
import store from '../Vuex/store'
var baseurl1='';//"http://139.199.219.154:8561";//
const ApiControllerUrl={
    //登录Url存放位置
    LoginUrl:{
        GetTokenByUserAndPass:'/api/Login/TokenThree',//'/api/Login/TokenThree',//根据用户名和密码获取Token
        GetUserByToken:'',//根据Token获取用户个人信息
    },
    //菜单管理Url存放位置
    MenumanagerUrl:{
      GetTreeMenu:'/api/GetTree/TreeList',//根据角色获取菜单
      GetMenuByPage:'/api/Menus/PageMenu',//菜单列表分页
      GetAllMenu:'/api/Menus/MenuList',//获取所有菜单非分页
      AddMenu:'/api/Menus/AddMenu',//添加菜单
      UpdateMenu:'/api/Menus/MenuUpdate',//修改菜单
      Delete:'/api/Menus/MenuDelete',//删除菜单
    },
    //用户管理API接口
    UsermanagerUrl:{
      GetUserInfo:'/api/User/UserInfo',//根据ID获取用户信息
      GetUserByPage:'/api/User/PageUser',//用户列表分页
      AddUser:'/api/User/AddUser',//添加用户
      UpdateUser:'/api/User/UpdateUser',//修改用户
      DeleteUser:'/api/User/DeleteUser',//删除用户
      UpLoadExcel:'/api/User/UpLoad',//删除用户
      DownLoadExcel:'/api/User/DownLoad',//删除用户
    },
    //用户角色API接口
    UserRolemanagerUrl:{
      GetUserRoleId:'/api/UserRoles/UserRoleByUserId',//根据ID获取用户信息
      SaveUserRole:'/api/UserRoles/SaveUserRole',//保存用户角色
    },
    //角色管理API接口
    RolemanagerUrl:{
      GetRoleByPage:'/api/Roles/PageByRole',//角色列表分页
      AddRole:'/api/Roles/AddRole',//添加角色
      UpdateRole:'/api/Roles/UpdateRole',//修改角色
      DeleteRole:'/api/Roles/DeleteRole',//删除角色
    },
    //按钮管理API接口
    ButtonmanagerUrl:{
      GetButtonByPage:'/api/Button/PageButton',//按钮分页
      AddButton:'/api/Button/AddButton',//添加按钮
      UpdateButton:'/api/Button/UpdateButton',//修改按钮
      DeleteButton:'/api/Button/DeleteButton',//删除按钮
    },
    //权限分配API接口
    RoleAssigMenuUrl:{ //角色分配权限接口定义
      GetRoleAssig:'/api/RoleAssig/GetRoleAssigTree',//根据角色ID获取菜单和按钮列表
      GetAllRole:'/api/Roles/GetAllRole',//获取所有的角色列表
      SaveRoleAssig:'/api/RoleAssig/SaveRoleAssig',//保存权限
    },
    //组织机构API接口
    OrganizeUrl:{ //组织机构API接口定义
      GetOrganizeByPage:'/api/Organize/OrganizeTree',//获取组织机构
      AddOrganize:'/api/Organize/AddOrganize',//添加组织机构
      UpdateOrganize:'/api/Organize/UpdateOrganize',//修改组织机构
    },
    //计划任务API接口
    ScheduleUrl:{ //计划任务API接口定义
      GetScheduleByPage:'/api/Schedule/PageJob',//分页获取计划任务列表
      StartScheduleJob:'/api/Schedule/StartJob',//启动一个任务
      StopScheduleJob:'/api/Schedule/StopJob',//暂停一个任务
      ReCoveryScheduleJob:'/api/Schedule/ReCovery',
    }
}
//http request 拦截器
// axios.defaults.baseUrl='http://127.0.0.1:5001'
axios.interceptors.request.use(
    config=>{
        //判断本地缓存是否存在Token,如果存在获取Token
        if(window.sessionStorage.getItem('Token')){//获取缓存中的Token
            config.headers.Authorization="Bearer "+window.sessionStorage.getItem('Token');
        }
        return config;
    },
    error=>{
        return Promises.reject(error);
    })
axios.interceptors.response.use(response=>{//没有错误数据原封返回
    return response;
    },
    //如果有返回错误
    error=>{
      // 超时请求处理
      var originalRequest = error.config;
      if(error.code == 'ECONNABORTED' && error.message.indexOf('timeout')!=-1 && !originalRequest._retry){

          Vue.prototype.$message({
              message: '请求超时！',
              type: 'error'
          });
          originalRequest._retry = true
          return null;
      }
        if(error.response)
        {
          if(error.response.status===401)
          {
            Message.error('很抱歉，登录超时!请重新登录');
            // Message.info({
            //   message: '很抱歉，登录超时!请重新登录',
            //   type: 'error',duration:5

            // });
            ToLogin();
          }
          if(error.response.status===403)
          {
            Message.error('失败！该操作无权限');
            //console.log(Vue)
            // Vue.prototype.$Message({
            //   message: '失败！该操作无权限',
            //   type: 'error',duration:5
            // });
            return null;
          }
        }
        return "" // 返回接口返回的错误信息
    },
)
const ToLogin=params=>{
  store.commit("SaveToken","");
  window.sessionStorage.setItem('Token',"");
  window.localStorage.setItem('router',"");
  router.replace({
    path:'/login',
    query:{ReturnUrl:router.currentRoute.fullPath}
  });
}
//登录获取Token和用户信息
export const RequestLogin=params=>{
    return axios.post(`${baseurl1}`+ApiControllerUrl.LoginUrl.GetTokenByUserAndPass,params);
}




export const RequestUserInfo=params=>{
  return axios.get(`${baseurl1}`+ApiControllerUrl.UsermanagerUrl.GetUserInfo,{params:params});
}
export const RequestMenuTree=params=>{
  return axios.get(`${baseurl1}`+ApiControllerUrl.MenumanagerUrl.GetTreeMenu,{params:params});
}
export const RequestAllMenu=params=>{
  return axios.get(`${baseurl1}`+ApiControllerUrl.MenumanagerUrl.GetAllMenu,{params:params});
}


//菜单管理异步访问API接口
//分页显示菜单列表
export const RequestMenuByPage=params=>{
  return axios.get(`${baseurl1}`+ApiControllerUrl.MenumanagerUrl.GetMenuByPage,{params:params});
}
//添加菜单
export const ResponseMenuByAdd=params=>{
  return axios.post(`${baseurl1}`+ApiControllerUrl.MenumanagerUrl.AddMenu,params);
}
//修改菜单
export const ResponseMenuByEdit=params=>{
  return axios.put(`${baseurl1}`+ApiControllerUrl.MenumanagerUrl.UpdateMenu,params);
}
//删除菜单
export const ResponseMenuByDelete=params=>{
  return axios.delete(`${baseurl1}`+ApiControllerUrl.MenumanagerUrl.Delete,{params:params});
}



//用户管理异步访问API接口
//分页显示用户信息列表
export const RequestUserByPage=params=>{
  return axios.get(`${baseurl1}`+ApiControllerUrl.UsermanagerUrl.GetUserByPage,{params:params});
}
//添加用户信息
export const ResponseUserByAdd=params=>{
  return axios.post(`${baseurl1}`+ApiControllerUrl.UsermanagerUrl.AddUser,params);
}
//修改用户信息
export const ResponseUserByEdit=params=>{
  return axios.put(`${baseurl1}`+ApiControllerUrl.UsermanagerUrl.UpdateUser,params);
}
//删除用户
export const ResponseUserByDelete=params=>{
  return axios.delete(`${baseurl1}`+ApiControllerUrl.UsermanagerUrl.DeleteUser,{params:params});
}
//用户信息批量导入
export const ResponseUserExcel=params=>{
  return axios.post(`${baseurl1}`+ApiControllerUrl.UsermanagerUrl.UpLoadExcel,params);
}



//角色管理异步访问API接口
//分页显示角色信息列表
export const RequestRoleByPage=params=>{
  return axios.get(`${baseurl1}`+ApiControllerUrl.RolemanagerUrl.GetRoleByPage,{params:params});
}
//添加角色信息
export const ResponseRoleByAdd=params=>{
  return axios.post(`${baseurl1}`+ApiControllerUrl.RolemanagerUrl.AddRole,params);
}
//修改角色信息
export const ResponseRoleByEdit=params=>{
  return axios.put(`${baseurl1}`+ApiControllerUrl.RolemanagerUrl.UpdateRole,params);
}
//删除角色
export const ResponseRoleByDelete=params=>{
  return axios.delete(`${baseurl1}`+ApiControllerUrl.RolemanagerUrl.DeleteRole,{params:params});
}
//根据用户Id获取已分配的角色
export const RequestRoleByUserId=params=>{
  return axios.get(`${baseurl1}`+ApiControllerUrl.UserRolemanagerUrl.GetUserRoleId,{params:params});
}
//保存用户分配的角色
export const ResponseUserRole=params=>{
  return axios.post(`${baseurl1}`+ApiControllerUrl.UserRolemanagerUrl.SaveUserRole,params);
}




//分页显示按钮信息列表
export const RequestButtonByPage=params=>{
  return axios.get(`${baseurl1}`+ApiControllerUrl.ButtonmanagerUrl.GetButtonByPage,{params:params});
}
//添加按钮方法
export const ResponsebuttonByAdd=params=>{
  return axios.post(`${baseurl1}`+ApiControllerUrl.ButtonmanagerUrl.AddButton,params);
}
//修改按钮信息
export const ResponseButtonByEdit=params=>{
  return axios.put(`${baseurl1}`+ApiControllerUrl.ButtonmanagerUrl.UpdateButton,params);
}
//删除按钮
export const ResponseButtonByDelete=params=>{
  return axios.delete(`${baseurl1}`+ApiControllerUrl.ButtonmanagerUrl.DeleteButton,{params:params});
}

///////////////////角色权限分配接口
//获取所有的角色列表
export const RequestGetAllRole=params=>{
  return axios.get(`${baseurl1}`+ApiControllerUrl.RoleAssigMenuUrl.GetAllRole);
}
//根据角色ID获取所有的菜单和按钮
export const RoleAssigGetAllRole=params=>{
  return axios.get(`${baseurl1}`+ApiControllerUrl.RoleAssigMenuUrl.GetRoleAssig,{params:params});
}
//角色保存权限
export const ResponseRoleAssigBySave=params=>{
  return axios.post(`${baseurl1}`+ApiControllerUrl.RoleAssigMenuUrl.SaveRoleAssig,params);
}

/////////////////////组织机构接口
export const RequestOrganizeByPage=params=>{
  return axios.get(`${baseurl1}`+ApiControllerUrl.OrganizeUrl.GetOrganizeByPage);
}
//添加组织机构方法
export const ResponseOrganizeByAdd=params=>{
  return axios.post(`${baseurl1}`+ApiControllerUrl.OrganizeUrl.AddOrganize,params);
}

//修改组织机构方法
export const ResponseOrganizeByEdit=params=>{
  return axios.put(`${baseurl1}`+ApiControllerUrl.OrganizeUrl.UpdateOrganize,params);
}





//获取计划任务列表
export const RequestSchedulePage=params=>{
  return axios.get(`${baseurl1}`+ApiControllerUrl.ScheduleUrl.GetScheduleByPage,{params:params});
}
//启动一个任务
export const ResponseStartJob=params=>{
  return axios.get(`${baseurl1}`+ApiControllerUrl.ScheduleUrl.StartScheduleJob,{params:params});
}
//暂停一个任务
export const ResponseStopJob=params=>{
  return axios.get(`${baseurl1}`+ApiControllerUrl.ScheduleUrl.StopScheduleJob,{params:params});
}
//恢复运行一个任务
export const ResponseReCoveryJob=params=>{
  return axios.get(`${baseurl1}`+ApiControllerUrl.ScheduleUrl.ReCoveryScheduleJob,{params:params});
}

