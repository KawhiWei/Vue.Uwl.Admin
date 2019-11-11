<template>
  <div>
    <div>
        <Row style="margin:10px 0px">
          <span>
            <span>任务名称：</span>
            <Input v-model="searCh.name" style="width:180px;" clearable placeholder="请输入任务名称" />
          </span>
          <span>
            <span>程序集名称：</span>
            <Input
              v-model="searCh.assemblyName"
              style="width:180px;"
              clearable
              placeholder="请输入程序集名称"
            />
          </span>
          <span>
            <span>触发器类型：</span>
              <Select v-model="searCh.triggerType" style="width:200px">
                <Option
                  v-for="item in triggerTypeList"
                  :value="item.value"
                  :key="item.value"
                >{{ item.label }}</Option>
              </Select>
            </span>
          <Button type="info" icon="ios-search" @click="search">查询</Button>
          <Button type="info" icon="ios-search" @click="addJob">添加任务</Button>
          <Buttonbar v-on:keyFun="callFn" />
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
            :data="list"
          ></Table>
          <!-- <Spin size="large"> 加载中</Spin> -->
        </div>
        </Scroll>
        <div style="padding:5px;">
          <PageView v-on:pageref="Get" ref="PageArr" />
        </div>
    </div>

    <!-- 添加计划任务  -->
    <div>
      <Modal v-model="modaldate" :title="title" width="50%" height="80%" :mask-closable="false">
        <span> 我打开了</span>
      </Modal>
    </div>

  </div>

</template>
<script>
import {RequestSchedulePage,ResponseStartJob,ResponseStopJob,ResponseReCoveryJob} from '../../APIServer/Api.js';

import PageView from "@/components/Page.vue";
import Buttonbar from "@/components/ButtonBar/ButtonBar.vue";
export default {
  name: "job",
  components: { PageView ,Buttonbar},
  data(){
    return {
      Maxheight:500,
      searCh: {
        ///搜索对象存放
        name: '',
        assemblyName: '',
        apiUrl: '',
        isStart:'',
        triggerType:-1,
      },
      triggerTypeList: [
        { value: -1, label: "全部" },
        { value: 0, label: "simple" },
        { value: 1, label: "cron" }
      ],
      loading: true,
      columns2: [
        { type: "selection", minWidth: 60, align: "center" },
        { title: "任务名称", key: "name", minWidth: 100 },
        { title: "任务分组", key: "jobGroup", minWidth: 120 },
        { title: "所属程序集", key: "assemblyName", minWidth: 150 },
        { title: "执行Class", key: "className", minWidth: 120 },
        { title: "执行间隔(秒)", key: "intervalSecond", minWidth: 60 },
        { title: "执行次数", key: "runTimes", minWidth: 80 },
        { title: "执行类型", key: "triggerType", minWidth: 60 }
      ], //列表表头
      title:'添加任务',//Modal弹出框标题
      modaldate:false,//Modal弹出框是否显示
      list:[],
      currentRow: null, //存放当前选中行的数据
    }
  },
  mounted()
  {
    var h=window.innerHeight-280;
    this.Maxheight=h;
    this.Get();
  },
  methods:{
    callFn(item) {
      this[item].apply(this);
    },
    search: function() {
      this.Get();
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
      var pageIndex = this.$refs.PageArr.pageIndex; //获取子组件中的属性
      var pageSize = this.$refs.PageArr.pagesize; //获取子组件中的属性
      var _this = this;
      var param = {
        PageIndex: pageIndex,
        PageSize: pageSize,
        Name: _this.searCh.name,
      };
      RequestSchedulePage(param).then(res => {
        if (res.data.success) {
          _this.loading = false;
          _this.list = res.data.response.data;
          _this.$refs.PageArr.Total = res.data.response.totalCount;
        } else {
          this.$Message.error({ content: res.data.msg, duration: 3 });
          _this.loading = false;
        }
      });
      this.loading=false;
    },
    startJob()
    {
      var _this = this;
      if(this.currentRow==null)
      {
        this.$Message.warning({ content: "请选择要启动的任务", duration: 5 });
        return;
      }
      var param={
        jobId:this.currentRow.id,
      }
      ResponseStartJob({JobId:this.currentRow.id}).then(res=>{
        if (res.data.success) {
          _this.$Message.success(res.data.msg);
          // _this.Get();
        } else {
          _this.$Message.error({
            content: res.data.msg,
            duration: 5
          });
        }
      });
    },
    stopJob()
    {
      var _this = this;
      if(this.currentRow==null)
      {
        this.$Message.warning({ content: "请选择要暂停的任务", duration: 5 });
        return;
      }
      var param={
        jobId:this.currentRow.id,
      }
      ResponseStopJob({JobId:this.currentRow.id}).then(res=>{
        if (res.data.success) {
          _this.$Message.success(res.data.msg);
          _this.Get();
        } else {
          _this.$Message.warning({
            content: res.data.msg,
            duration: 5
          });
        }
      });
    },
    ReCovery()
    {
      var _this = this;
      if(this.currentRow==null)
      {
        this.$Message.warning({ content: "请选择要重新启动的任务", duration: 5 });
        return;
      }
      var param={
        jobId:this.currentRow.id,
      }
      ResponseReCoveryJob({JobId:this.currentRow.id}).then(res=>{
        if (res.data.success) {
          _this.$Message.success(res.data.msg);
          _this.Get();
        } else {
          _this.$Message.warning({
            content: res.data.msg,
            duration: 5
          });
        }
      });
    },
    addJob()
    {
      this.modaldate=true;
    }
  }
}
</script>
