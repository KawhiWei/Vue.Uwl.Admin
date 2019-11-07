import Vue from 'vue'//在Vuex状态管理工具内引入Vue.js

import Vuex from 'vuex' //在Store仓库中，引入Vuex状态管理工具 ，Vuex是数据存储组件

Vue.use(Vuex)// 将Vuex挂在到Vue中

//声明一个Vuex仓库对象，用户存放信息
const state={
    token:null,//存放后台获取到的Token，
    User:[],//存放后台返回的用户信息
    TagList:[
        {id:'1',lable:'个人主页',path:'/PlatformHome',IsColse:false},
    ],
    SignalRconnection:"",
}

//添加一个写入数据的方法
const mutations={
    //state是仓库中的对象，
    //data是传入的参数
    SaveToken(state,data)
    {
        state.token=data;//将传入的Token放到仓库对象的属性中
        //将传入的Token放到浏览器本地缓存中，
        //window.sessionStorage浏览器或者标签页关闭自动清空，
        //localStorage默认数据永久存在，不会自动清空
        window.sessionStorage.setItem('Token',data);
    },
    //用户退出登录，清除Token
    DeleteToken(state)
    {
        state.token=null,
        //清空本地浏览器缓存中的Token
        window.sessionStorage.setItem('Token','')
    },
    SaveTags(state,data)
    {
        if(data!='')
        {
            state.TagList.push(data);
        }
        else
        {
            state.TagList=[];
        }

    },
    //存储用户信息
    SaveUser(state,data)
    {
        state.User=data;
    },
    //存储SignalRconnection链接对象
    SaveSignalRconnection(state,data)
    {
        state.SignalRconnection=data;
    }
}

//将仓库和方法对象挂载
export default new Vuex.Store({
    state,mutations,
})
