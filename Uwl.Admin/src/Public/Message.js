import Vue from 'vue'
import iview from 'iview' //引入Iview前端js框架
import 'iview/dist/styles/iview.css' //引入Iview的CSS文件
Vue.config.productionTip = false
Vue.use(iview) //挂载iview框架


export default{
    SuMsg:function (msg,time) {
        debugger
        console.log(Vue)
    }
}