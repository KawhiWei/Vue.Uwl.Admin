import axios from 'axios' //在APi访问接口引入Vuex
import router from '../router/index'
import Vue from 'vue';
import store from '../Vuex/store'
var baseurl1="https://localhost:5001";//"http://139.199.219.154:8561";//
// var baseurl2="http://139.199.219.154:9600";


const ApiControllerUrl={
    //登录Url存放位置
    LoginUrl:{
        GetTokenByUserAndPass:'/Login/TokenAssig',//根据用户名和密码获取Token
        GetUserByToken:'',//根据Token获取用户个人信息
    },
    //菜单管理Url存放位置
    MenumanagerUrl:{
      GetTreeMenu:'/GetTree/TreeList',//根据角色获取菜单
      GetMenuByPage:'/Menus/PageMenu',//菜单列表分页
      GetAllMenu:'/Menus/MenuList',//获取所有菜单非分页
      AddMenu:'/Menus/AddMenu',//添加菜单
      UpdateMenu:'/Menus/MenuUpdate',//修改菜单
      Delete:'/Menus/MenuDelete',//删除菜单
    },
    //用户管理API接口
    UsermanagerUrl:{
      GetUserInfo:'/User/UserInfo',//根据ID获取用户信息
      GetUserByPage:'/User/PageUser',//用户列表分页
      AddUser:'/User/AddUser',//添加用户
      UpdateUser:'/User/UpdateUser',//修改用户
      DeleteUser:'/User/DeleteUser',//删除用户
    },
    //用户角色API接口
    UserRolemanagerUrl:{
      GetUserRoleId:'/UserRoles/UserRoleByUserId',//根据ID获取用户信息
    },
    //角色管理API接口
    RolemanagerUrl:{
      GetRoleByPage:'/Roles/PageByRole',//角色列表分页
      AddRole:'/Roles/AddRole',//添加角色
      UpdateRole:'/Roles/UpdateRole',//修改角色
      DeleteRole:'/Roles/DeleteRole',//删除角色
    },
    //按钮管理API接口
    ButtonmanagerUrl:{
      GetButtonByPage:'/Button/PageButton',//按钮分页
      AddButton:'/Button/AddButton',//添加按钮
      UpdateButton:'/Button/UpdateButton',//修改按钮
      DeleteButton:'/Button/DeleteButton',//删除按钮
      GetButtonByMenuId:'/Button/GetBtnByMenuId',//根据菜单ID获取按钮
    },
    //按钮管理API接口
    MenuButtonUrl:{
      
    },
    //权限分配API接口
    RoleAssigMenuUrl:{ //角色分配权限接口定义
      GetRoleAssig:'/RoleAssig/GetRoleAssigTree',//根据角色ID获取菜单和按钮列表
      GetAllRole:'/Roles/GetAllRole',//获取所有的角色列表
      SaveRoleAssig:'/RoleAssig/SaveRoleAssig',//保存权限
    }
}
//http request 拦截器
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
    }
)
axios.interceptors.response.use(response=>{//没有错误数据原封返回
    return response;
    },
    //如果有返回错误
    error=>{
      debugger
        if(error.response)
        {
            switch (error.response.status) //判断返回错误类型
            {
                case 400:
                  error.message = '请求错误'
                  break
                case 401:
                  ToLogin();
                  debugger
                  error.message = '未授权，请登录'
                  break
                case 403:
                  error.status=error.response.status
                  error.message = error.response.data.Message;
                  break
                case 404:
                  error.message = `请求地址出错: ${error.response.config.url}`
                  break
                case 408:
                  error.message = '请求超时'
                  break
                case 500:
                  error.message = '服务器内部错误'
                  break
                case 501:
                  error.message = '服务未实现'
                  break
                case 502:
                  error.message = '网关错误'
                  break
                case 503:
                  error.message = '服务不可用'
                  break
                case 504:
                  error.message = '网关超时'
                  break
                case 505:
                  error.message = 'HTTP版本不受支持'
                  break
                default:
            }
        }
        return error // 返回接口返回的错误信息
    },
)
/**
 * 接口处理函数基方法
 * method,接口请求类型
 * url,//接口地址
 * params,参数
 * success,//成功返回数据
 * failure
 */
// function AxiosGet(url,params,success)
// {
//   console.log(url);
//   axios.get(`${baseurl1}`+url,{params:params}).then(function(res){success(res.data)}).catch(function(error){let res=error.response});
// }

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
//根据用户Id获取已选的角色
export const RequestRoleByUserId=params=>{
  return axios.get(`${baseurl1}`+ApiControllerUrl.UserRolemanagerUrl.GetUserRoleId,{params:params});
}




//分页显示按钮信息列表
export const RequestButtonByPage=params=>{
  return axios.get(`${baseurl1}`+ApiControllerUrl.ButtonmanagerUrl.GetButtonByPage,{params:params});
}
//添加按钮方法
export const ResponsebuttonByAdd=params=>{
  return axios.post(`${baseurl1}`+ApiControllerUrl.ButtonmanagerUrl.AddButton,params);
}

//根据菜单ID获取改菜单下的按钮
export const RequestButtonByMenuId=params=>{
  return axios.get(`${baseurl1}`+ApiControllerUrl.ButtonmanagerUrl.GetButtonByMenuId,{params:params});
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
