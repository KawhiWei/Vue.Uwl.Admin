// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Store from '@/Vuex/Store'//在全局Main.js中引入Store仓库
import iview from 'iview' //引入Iview前端UI框架

Vue.config.productionTip = false

Vue.use(iview) //挂载iview框架
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  Store,//将仓库挂载
  components: { App },
  template: '<App/>'
})
