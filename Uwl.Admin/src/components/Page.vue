<template>
    <Page :total="Total" show-sizer show-total :page-size="pagesize" :page-size-opts="pagesizeArr" @on-change="ClickPage" @on-page-size-change="Updatepagesize" />
</template>
<script>
export default {
  name: 'PageView',
  data () {
    return {
      pageIndex:1,
      pagesize:5,
      pagesizeArr:[5, 30, 60,90,120],
      Total:0,
    }
  },
  methods:{
      //点击翻页时调用主组件方法
      ClickPage:function(index)
      {
        this.pageIndex=index;
        this.$emit('pageref');
      },
      //切换每页条数回调
      Updatepagesize:function(size) {
        this.pagesize=size;
        this.$emit('pageref');
      }
  },
}
</script>