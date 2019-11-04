<template>
<div>
<div>
      <Row style="margin:10px 0px">
        <span>
          <span>菜单名称：</span>
          <Input v-model="searCh.name" style="width:180px;" clearable placeholder="请输入菜单名称" />
        </span>
        <span>
          <span>前端路由地址：</span>
          <Input
            v-model="searCh.frontRouter"
            style="width:180px;"
            clearable
            placeholder="请输入前端路由地址"
          />
        </span>
        <span>
          <span>Api接口：</span>
          <Input v-model="searCh.apiUrl" style="width:180px;" clearable placeholder="请输入Api路由地址" />
        </span>
        <Button type="info" icon="ios-search" @click="search">查询</Button>
      </Row>
      <Scroll :height="Maxheight">
      <div>
        <Table
          width="100%"
          border
          :loading="loading"
          show-header
          highlight-row
          @on-current-change="CurrentRow"
          @on-select="getRow"
          :columns="columns2"
          :data="List"
        ></Table>
        <!-- <Spin size="large"> 加载中</Spin> -->
      </div>
      </Scroll>
      <div style="padding:5px;">
        <PageView v-on:pageref="Get" ref="PageArr" />
      </div>
    </div>
</div>
</template>
<script>
import PageView from "@/components/Page.vue";
export default {
  name: "job",
  components: { PageView },
  data(){
    return {
      Maxheight:500,
      searCh: {
        ///搜索对象存放
        name: "",
        frontRouter: "",
        apiUrl: ""
      },
      loading: true,
      columns2: [
        { type: "selection", minWidth: 60, align: "center" },
        { title: "菜单名称", key: "name", minWidth: 100 },
        { title: "父级菜单", key: "parentName", minWidth: 120 },
        { title: "路由地址", key: "urlAddress", minWidth: 120 },
        { title: "API接口", key: "apiAddress", minWidth: 120 },
        { title: "排序", key: "sort", minWidth: 20 },
        { title: "创建时间", key: "createAts", minWidth: 80 },
        { title: "备注", key: "memo", minWidth: 60 }
      ], //列表表头
      List:[],
      currentRow: null, //存放当前选中行的数据
    }
  },
  mounted()
  {
    var h=window.innerHeight-240;
    this.Maxheight=h;
    this.Get();
  },
  methods:{
    search: function() {

    },
    //单击表格选中的数据时
    CurrentRow: function(val) {
      this.currentRow = val;
    },
    //多选删除
    getRow(selection, row) {
      this.delrow = selection;
    },
    //获取分页数据
    Get()
    {
      this.loading=false;
    }
  }
}
</script>
