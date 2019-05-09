import axios from 'axios' //在APi访问接口引入Vuex
import router from '../router/index'
var baseurl1="https://localhost:5001";
var baseurl2="http://139.199.219.154:9600";


const ApiControllerUrl={
    //登录Url存放位置
    LoginUrl:{
        GetTokenByUserAndPass:'/Login/Token',//根据用户名和密码获取Token
        GetUserByToken:'',//根据Token获取用户个人信息
    },
    //菜单管理Url存放位置
    MenumanagerUrl:{
      GetTreeMenu:'/GetTree/TreeList',
      GetMenuByPage:'/Menus/PageMenu',
    },
    UsermanagerUrl:{
      GetUserInfo:'/GetUser/UserInfo'
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
    err=>{
        return Promises.reject(err);
    }
)
axios.interceptors.request.use(response=>{//没有错误数据原封返回
    return response;
    },
    //如果有返回错误
    error=>{
        if(error.response)
        {
            console.log(error.response.status)
            switch (err.response.status) //判断返回错误类型
            {
                case 400:
                  err.message = '请求错误'
                  break
                case 401:
                  if(window.sessionStorage.getItem('Token'))//获取缓存中的Token
                  {
                    //config.headers.Authorization="Bearer "+window.sessionStorage.getItem('Token');
                  }
                  else
                  {
                    ToLogin();
                  }
                  err.message = '未授权，请登录'
                  break
                case 403:
                  err.message = '拒绝访问'
                  break
                case 404:
                  err.message = `请求地址出错: ${err.response.config.url}`
                  break
                case 408:
                  err.message = '请求超时'
                  break
                case 500:
                  err.message = '服务器内部错误'
                  break
                case 501:
                  err.message = '服务未实现'
                  break
                case 502:
                  err.message = '网关错误'
                  break
                case 503:
                  err.message = '服务不可用'
                  break
                case 504:
                  err.message = '网关超时'
                  break
                case 505:
                  err.message = 'HTTP版本不受支持'
                  break
                default:
            }
        }
        console.error(error)
        return Promise.reject(error) // 返回接口返回的错误信息
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
//   axios.get(`${baseurl1}`+url,{params:params}).then(function(res){success(res.data)}).catch(function(err){let res=err.response});
// }

const ToLogin=params=>{
  router.replace({
    path:'/login',
    query:{ReturnUrl:router.currentRoute.fullPath}
  });
}


//登录获取Token和用户信息
export const RequestLogin=params=>{
    return axios.post(`${baseurl2}`+ApiControllerUrl.LoginUrl.GetTokenByUserAndPass,params);
}

export const RequestUserInfo=params=>{
  return axios.get(`${baseurl2}`+ApiControllerUrl.UsermanagerUrl.GetUserInfo,{params:params});
}
export const RequestMenuTree=params=>{
  return axios.get(`${baseurl2}`+ApiControllerUrl.MenumanagerUrl.GetTreeMenu,{params:params});
}

export const RequestMenuByPage=params=>{
  return axios.get(`${baseurl2}`+ApiControllerUrl.MenumanagerUrl.GetMenuByPage,{params:params});
}


//菜单管理异步访问API接口


//用户管理异步访问API接口
