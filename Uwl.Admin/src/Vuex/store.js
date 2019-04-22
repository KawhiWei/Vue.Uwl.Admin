import Vue from 'vue'//在Vuex状态管理工具内引入Vue.js

import Vuex from 'vuex' //在Store仓库中，引入Vuex状态管理工具 ，Vuex是数据存储组件
//声明一个Vuex仓库对象，用户存放信息
const state={

}

//添加一个写入数据的方法
const Mutations={

}

//将仓库和方法对象挂载
export default new Vuex.Store({
    state,Mutations,
})