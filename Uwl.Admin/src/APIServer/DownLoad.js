import store from '../Vuex/store'
import axios from 'axios' //在APi访问接口引入Vuex
export  default{
    DownLoadToExcel:function(method, url, params){
        axios({
            method:method,
            url:url,
            responseType:'blob',
            params:params,
            headers:{
                Authorization:`Bearer ${store.state.token}`
            }
        }).then(res=>{
            let fileName = res.headers['content-disposition'].split('=')[1].split(';')[0]
            console.log(fileName)
            const blob=new Blob([res.data],{type:'application/vnd.ms-excel'});
            const a=document.createElement('a');
            document.body.appendChild(a);
            const url=window.URL.createObjectURL(blob);
            a.href=url;
            a.download=fileName;
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        }).catch(err=>{
            console.log(err)
        })
    }
}

