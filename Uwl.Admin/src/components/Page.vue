<template>
    <Page :total="Total" show-sizer show-total :page-size="pagesize" :page-size-opts="pagesizeArr" @on-change="ClickPage" />
</template>
<script>
export default {
  name: 'PageView',
  data () {
    return {
      pagesize:30,
      pagesizeArr:[15, 30, 60,90,120],
      Total:610,
    }
  },
  methods:{
      //点击翻页时调用主组件方法
      ClickPage:function(index)
      {
          console.log(index)
      },
  },
}
</script>