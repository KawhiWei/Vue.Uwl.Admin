<!--角色管理组件-->
<template>
  <div>
    <div>
      <Row style="margin:10px 0px">
        <span>
          <span>角色名称：</span>
          <Input v-model="searCh.name" clearable style="width:180px;" placeholder="请输入角色名称" />
        </span>
        <span>
          <span>角色状态：</span>
          <Select v-model="searCh.State" style="width:200px">
            <Option v-for="item in stateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </span>
        <Button type="info" icon="ios-search" @click="search">查询</Button>
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
            :data="List"
          ></Table>
          <!--<Spin size="large"> 加载中</Spin> -->
        </div>
      </Scroll>
      <div style="padding:5px;">
        <PageView v-on:pageref="GetRole" ref="PageArr" />
      </div>
    </div>
    <div>
      <!-- 添加菜单弹出框 -->
      <Modal
        v-model="FormVisible"
        :title="title"
        width="50%"
        height="80%"
        :mask-closable="false"
      >
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
          <FormItem label="角色名称" prop="name">
            <Input v-model="formValidate.name" placeholder="请输入角色名称" />
          </FormItem>
          <FormItem label="角色说明" prop="memo">
            <!-- <Poptip trigger="hover" title="Title" content="content"> -->
            <Input v-model="formValidate.memo" placeholder="请输入角色说明" />
            <!-- </Poptip> -->
          </FormItem>
          <FormItem label="角色状态" prop="roletState">
            <Select v-model="formValidate.roletState" style="width:200px">
              <Option
                v-for="item in stateList"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </FormItem>
        </Form>
        <div slot="footer">
          <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
          <Button @click="FormVisible = false" style="margin-left: 8px">取消</Button>
        </div>
      </Modal>
    </div>
  </div>
</template>

<script>
import PageView from "@/components/Page.vue";
import Buttonbar from "@/components/ButtonBar/ButtonBar.vue";
import {
  RequestRoleByPage,
  ResponseRoleByAdd,
  ResponseRoleByEdit,
  ResponseRoleByDelete
} from "../../APIServer/Api.js";
export default {
  name: "Role",
  components: { PageView ,Buttonbar},
  data() {
    return {
      Maxheight:500,
      info: JSON.parse(window.sessionStorage.userInfo),
      loading: true,
      searCh: {
        name: "",
        State: -1
      },
      IsEdit: false,
      //添加字段
      formValidate: {
        name: "", //角色名称
        memo: "", //说明
        roletState: "", //角色状态
        createdId: "", //创建人ID
        createdName: "", //创建人
        isDrop: false //是否删除
      },
      id: "", //修改用户的Id
      //添加是字段校验
      ruleValidate: {
        name: [{ required: true, message: "请填写角色名称", trigger: "blur" }]
      },
      stateList: [
        { value: -1, label: "全部" },
        { value: 0, label: "正常" },
        { value: 1, label: "冻结" }
      ],
      title: "",
      FormVisible: false,
      currentRow: null, //存放当前选中行的数据
      columns2: [
        { type: "selection", minWidth: 40, maxWidth: 60, align: "center" },
        { title: "角色名称", key: "name", minWidth: 100 },
        { title: "角色说明", key: "memo", minWidth: 120 },
        {
          title: "角色状态",
          key: "accountState",
          minWidth: 100,
          align: "center",
          render: (h, params) => {
            var text = "";
            if (params.row.roletState == 0) {
              text = "正常";
              return h("Tag", { props: { color: "green" } }, text);
            }
            if (params.row.roletState == 1) {
              text = "冻结中";
              return h("Tag", { props: { color: "orange" } }, text);
            }
          }
        },
        { title: "创建时间", key: "createAts", minWidth: 100 },
        { title: "创建人", key: "createdName", minWidth: 80 },
      ], //列表表头
      List: [] ,//列表存放后台返回的数据
      delrow:[]
    };
  },
  mounted: function() {
    this.search();
    var h=window.innerHeight-280;
    this.Maxheight=h;
  },
  methods: {
    search: function() {
      this.GetRole();
    },
    callFn(item) {
      this[item].apply(this);
    },
    //单击表格选中的数据时
    CurrentRow: function(val) {
      this.currentRow = val;
    },
    //提交按钮事件
    handleSubmit(name) {
      this.$refs.formValidate.validate(valid => {
        if (valid) {
          var _this = this;
          let params = Object.assign({}, this.formValidate);
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
          } else {
            params.createdId = this.info.id;
            params.createdName = this.info.name;
            ResponseRoleByAdd(params).then(res => {
              _this.FormVisible = false;
              _this.GetRole();
            });
          }
        } else {
          this.$Message.error({
            content: "有必填项未填写，请确认",
            duration: 3
          });
        }
      });
    },
    //多选删除
    getRow(selection, row) {
      this.delrow = selection;
    },
    GetRole: function() {
      var pageIndex = this.$refs.PageArr.pageIndex; //获取子组件中的属性
      var pageSize = this.$refs.PageArr.pagesize; //获取子组件中的属性
      var _this = this;
      var param = {
        PageIndex: pageIndex,
        PageSize: pageSize,
        Name: _this.searCh.name,
        stateEnum: _this.searCh.State
      };
      this.loading = true;
      RequestRoleByPage(param).then(res => {
        if (res.data.success) {
          _this.loading = false;
          _this.List = res.data.response.data;
          _this.$refs.PageArr.Total = res.data.response.totalCount;
        } else {
          _this.loading = false;
          this.$Message.error({ content: res.data.msg, duration: 3 });
        }
      });
    },
    edit: function() {
      var _this = this;
      if (this.currentRow == null) {
        this.$Message.warning({ content: "请选择要修改的角色", duration: 3 });
        return;
      }
      this.formValidate = {
        name: this.currentRow.name, //角色名称
        memo: this.currentRow.memo, //说明
        roletState: this.currentRow.roletState, //角色状态
        createdId: this.currentRow.createdId,
        createdName: this.currentRow.createdName
      };
      this.id = this.currentRow.id;
      this.title = "编辑";
      this.FormVisible = true;
      this.IsEdit = true;
    },
    del() {
      var _this = this;
      if (this.delrow.length <= 0) {
        this.$Message.warning({ content: "请选择要删除的菜单", duration: 3 });
        return;
      }
      var arr = [];
      this.delrow.forEach(x => {
        arr.push(x.id);
      });
      var str = JSON.stringify(arr);
      console.log(str);
      ResponseRoleByDelete({ Ids: str }).then(res => {
        if (res.data.success) {
          _this.$Message.success(res.data.msg);
          _this.GetRole();
        } else {
          _this.$Message.error({
            content: res.data.msg,
            duration: 3
          });
        }
      });
    },
    AddModal: function() {
      this.title = "添加角色";
      this.sexflag = "";
      this.IsEdit = false;
      (this.formValidate = {
        name: "", //角色名称
        memo: "", //说明
        roletState: "", //角色状态
        createdId: "", //创建人ID
        createdName: "", //创建人
        isDrop: false //是否删除
      }),
        (this.FormVisible = true);
    }
  }
};
</script>
