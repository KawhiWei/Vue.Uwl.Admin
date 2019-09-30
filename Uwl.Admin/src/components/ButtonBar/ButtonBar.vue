<template>
    <div>
        <Button :type="item.btnStyle.split(',')[0]" style="margin:3px !important;" v-for="item in  btnlist" @click="callFn(item)" :key="item.name"  >
            <Icon :type="item.btnStyle.split(',')[1]" style="font-size:18px;" />{{item.name}}
        </Button>
    </div>
</template>
<script>
import {RequestButtonByMenuId} from '../../APIServer/Api.js';
export default {
  name: 'buttonbar',
  props:{
  },
  data () {
    return {
      btnlist:[],
    }
  },
  created:function()
  {
      var menuId=this.$getArrs.getBtnArr(this.$route).id;
      var _this=this;
      RequestButtonByMenuId({menuId:menuId}).then((res)=>{
            if(res.data.success)
            {
                _this.btnlist=res.data.response;
                console.log(_this.btnlist)
            }
            else
            {    
                var err=JSON.parse(res.response.data)
                console.log(res.data.msg);
            }
      })
  },
  methods:{
      //点击翻页时调用主组件方法
      callFn(item)
      {
          debugger
        this.$emit('keyFun',item.keyCode);
      },
  },
}
</script>
<style scoped>
.assBtn{
    padding: 5px !important;
    margin: 10px !important;
}
</style>