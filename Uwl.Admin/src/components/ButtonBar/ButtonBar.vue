<template>
    <div>
        <Button :type="item.btnStyle.split(',')[0]" style="margin:3px !important;" v-for="item in  btnlist" @click="callFn(item)" :key="item.name"  >
            <Icon :type="item.btnStyle.split(',')[1]" style="font-size:18px;" />{{item.name}}
        </Button>
    </div>
</template>
<script>
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
      var _this=this;
      _this.btnlist=this.$getArrs.getBtnArr(this.$route).btnIsDisplayViews;
  },
  methods:{
      //点击翻页时调用主组件方法
      callFn(item)
      {
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
