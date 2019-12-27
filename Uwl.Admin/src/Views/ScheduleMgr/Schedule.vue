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
          <!-- <Button type="info" icon="ios-search" @click="addJob">添加任务</Button> -->
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
            ref="multipleTable"
            @on-row-dblclick="CurrentRow"
            @on-select="getRow"
            @on-row-click="clickbox"
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
        <Form ref="formCustomdata" :model="formCustomdata" :rules="ruleValidate" :label-width="120">
          <FormItem label="任务名称" prop="name">
            <Input type="text" v-model="formCustomdata.name"></Input>
          </FormItem>
          <FormItem label="手机号：" prop="jobGroup">
            <Input type="text" v-model="formCustomdata.jobGroup"></Input>
          </FormItem>
          <FormItem label="DLL程序集" prop="assemblyName">
            <Input type="text" v-model="formCustomdata.assemblyName"></Input>
          </FormItem>
          <FormItem label="任务所在类" prop="className">
            <Input type="text" v-model="formCustomdata.className"></Input>
          </FormItem>
          <FormItem label="触发类型" prop="triggerType">
            <Select v-model="formCustomdata.triggerType" style="width:200px">
                <Option
                  v-for="item in AddtriggerTypeList"
                  :value="item.value"
                  :key="item.value"
                >{{ item.label }}</Option>
              </Select>
          </FormItem>
          <FormItem label="cron表达式" v-if="formCustomdata.triggerType==1" prop="cron" @change="clear">
            <Input type="text" v-model="formCustomdata.cron"></Input>
          </FormItem>
          <FormItem label="请输入执行间隔(秒)" v-if="formCustomdata.triggerType==0" prop="cron">
            <InputNumber  :min="0" v-model="formCustomdata.intervalSecond"></InputNumber>
          </FormItem>
           <FormItem label="请输入执行次数" v-if="formCustomdata.triggerType==0" prop="cron">
            <InputNumber type="text" v-model="formCustomdata.runTimes"></InputNumber>
          </FormItem>
          <FormItem label="执行时间">
            <DatePicker type="datetime" v-model="formCustomdata.beginTime" format="yyyy-MM-dd HH:mm:ss" placeholder="请选择开始时间" style="width: 200px"></DatePicker>——
            <DatePicker type="datetime" v-model="formCustomdata.endTime" format="yyyy-MM-dd HH:mm:ss"  placeholder="请选择结束时间" style="width: 200px"></DatePicker>
          </FormItem>
        </Form>
        <div slot="footer">
          <Button type="primary" @click="AddScheduleJobSubmit('formCustomdata')">提交</Button>
          <Button @click="modaldate = false" style="margin-left: 8px">取消</Button>
        </div>
      </Modal>
    </div>

  </div>

</template>
<script>
import {RequestSchedulePage,ResponseStartJob,ResponseStopJob,ResponseReCoveryJob,
        ResponseScheduleJobByAdd
} from '../../APIServer/Api.js';

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
      info: JSON.parse(window.sessionStorage.userInfo),
      triggerTypeList: [
        { value: -1, label: "全部" },
        { value: 0, label: "simple" },
        { value: 1, label: "cron" }
      ],
      AddtriggerTypeList: [
        { value: 0, label: "simple" },
        { value: 1, label: "cron" }
      ],
      formCustomdata: {
        name: '',//任务名称
        jobGroup: '',//任务分组
        cron: '',//任务运行时间表达式
        assemblyName: '',//任务所在DLL对应的程序集名称
        className: '',//任务所在类
        remark: '',//任务描述
        runTimes: 0,//执行次数
        beginTime: '',//开始时间
        endTime: '',//结束时间
        triggerType: 0,//触发器类型
        intervalSecond: 0,//执行间隔时间, 秒为单位
        isStart: false,//是否启动
      },
      ruleValidate: {
        name: [
          { required: true, message: "邮箱不可为空", trigger: "blur" },
        ],
        jobGroup: [
          { required: true, message: "邮箱不可为空", trigger: "blur" },
        ],
        assemblyName: [
          { required: true, message: "任务所在DLL对应的程序集名称不可为空", trigger: "blur" },
        ],
        className: [
          { required: true, message: "任务所在类不可为空", trigger: "blur" },
        ],
      },
      loading: true,
      columns2: [
        { type: "selection", minWidth: 60, align: "center" },
        { title: "任务名称", key: "name", minWidth: 100 },
        { title: "任务分组", key: "jobGroup", minWidth: 120 },
        { title: "所属程序集", key: "assemblyName", minWidth: 150 },
        { title: "执行Class", key: "className", minWidth: 120 },
        { title: "执行间隔(秒)", key: "intervalSecond", minWidth: 60 },
        { title: "执行次数", key: "runTimes", minWidth: 80 },
        { title: "", key: "triggerType", minWidth: 60 },
        {
          title: "运行类型",
          key: "triggerType",
          minWidth: 100,
          align: "center",
          render: (h, params) => {
            var text = "";
            if (params.row.triggerType == 0) {
              text = "simple";
              return h("Tag", { props: { color: "green" } }, text);
            }
            if (params.row.triggerType == 1) {
              text = "cron";
              return h("Tag", { props: { color: "orange" } }, text);
            }
          }
        },
        {
          title: "运行状态",
          key: "isStart",
          minWidth: 100,
          align: "center",
          render: (h, params) => {
            var text = "";
            if (params.row.isStart) {
              text = "已运行";
              return h("Tag", { props: { color: "blue" } }, text);
            }
            if (!params.row.isStart) {
              text = "未运行";
              return h("Tag", { props: { color: "volcano" } }, text);
            }
          }
        }
      ], //列表表头
      title:'添加任务',//Modal弹出框标题
      modaldate:false,//Modal弹出框是否显示
      list:[],
      currentRow: null, //存放当前选中行的数据
    }
  },
  mounted()
  {
    var h=window.innerHeight-290;
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
    //双击表格选择要编辑的数据
    CurrentRow: function(val) {
      this.currentRow = val;
    },
    //多选删除
    getRow(selection, row) {
      this.delrow = selection;
    },
    //单击选中删除
    clickbox(row,index)
    {
      this.$set(this.list[index],'_checked',true);
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
        this.formCustomdata. name= '',//任务名称
        this.formCustomdata.jobGroup= '',//任务分组
        this.formCustomdata.cron= '',//任务运行时间表达式
        this.formCustomdata.assemblyName= '',//任务所在DLL对应的程序集名称
        this.formCustomdata.className= '',//任务所在类
        this.formCustomdata.remark= '',//任务描述
        this.formCustomdata.runTimes= 0,//执行次数
        this.formCustomdata.beginTime= '',//开始时间
        this.formCustomdata.endTime= '',//结束时间
        this.formCustomdata.triggerType= 0,//触发器类型
        this.formCustomdata.intervalSecond= 0,//执行间隔时间, 秒为单位
        this.formCustomdata.isStart= false,//是否启动
        this.modaldate=true;
    },
    clear()
    {
      if(this.formCustomdata.triggerType==0)
      {
        this.formCustomdata.cron='';
      }
      if(this.formCustomdata.triggerType==1)
      {
        this.formCustomdata.runTimes=0;
        this.formCustomdata.intervalSecond=0;
      }
    },
    AddScheduleJobSubmit(name)
    {
      debugger
      this.$refs.formCustomdata.validate(valid => {
        if (valid) {
          debugger
          var _this = this;
          let params = Object.assign({}, this.formCustomdata);
          if (this.IsEdit) {
            params.id = this.id;
            params.updateName = this.info.name;
            params.updateId = this.info.id;
            ResponseRoleByEdit(params).then(res => {
              if (res != "") {
                _this.FormVisible = false;
                _this.GetRole();
              }
            });
          }
          else {
            debugger
            params.createdId = this.info.id;
            params.createdName = this.info.name;
            ResponseScheduleJobByAdd(params).then(res => {
              if (res.data.success) {
              _this.$Message.success(res.data.msg);
              _this.modaldate = false;
              _this.Get();
              }
              else {
              _this.$Message.error({
                content: res.data.msg,
                duration: 3});
              }
            });
          }
        }
        else {
          this.$Message.error({
            content: "有必填项未填写，请确认",
            duration: 3
          });
        }
      });
    }

  }
}
</script>
