<template>
    <Page :total="Total" show-sizer show-total :page-size="pagesize" :page-size-opts="pagesizeArr" @on-change="ClickPage" />
</template>
<script>
export default {
  name: 'PageView',
  data () {
    return {
      pageIndex:1,
      pagesize:5,
      pagesizeArr:[5, 30, 60,90,120],
      Total:610,
    }
  },
  methods:{
      //点击翻页时调用主组件方法
      ClickPage:function(index)
      {
        this.pageIndex=index;
        this.$emit('pageref');
      },
  },
}
</script>