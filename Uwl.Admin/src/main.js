// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Store from '@/Vuex/Store'//在全局Main.js中引入Store仓库

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  Store,//将仓库挂载
  components: { App },
  template: '<App/>'
})
