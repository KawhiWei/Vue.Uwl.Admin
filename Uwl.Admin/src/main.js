// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from '@/Vuex/store'//在全局Main.js中引入Store仓库

import 'iview/dist/styles/iview.css' //引入Iview的CSS文件
import Echarts from 'echarts'
import getArr from './Public/getArr.js'
import Axios from 'axios'
import 'babel-polyfill'
import iview from 'iview' //引入Iview前端js框架
//import {$Message} from "iview" //引入Iview前端js框架

//Vue.prototype.$Message=$Message;

//Vue.prototype.$Message=Message;
Vue.use(iview) //挂载iview框架



Vue.prototype.echarts=Echarts
Vue.use(Echarts)

Vue.prototype.$http=Axios;



/*挂载公共js*/
Vue.prototype.$getArrs=getArr;


Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,//将仓库挂载
  components: { App },
  template: '<App/>'
})
