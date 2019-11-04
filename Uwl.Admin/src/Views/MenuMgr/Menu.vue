<!--菜单管理组件-->
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
          :data="MenuList"
        ></Table>
        <!-- <Spin size="large"> 加载中</Spin> -->
      </div>
      </Scroll>
      <div style="padding:5px;">
        <PageView v-on:pageref="GetMenu" ref="PageArr" />
      </div>
    </div>
    <div>
      <!-- 添加菜单弹出框 -->
      <Modal
        v-model="FormVisible"
        :title="title"
        width="60%"
        height="80%"
        :mask-closable="false"
        @on-ok="handleSubmit('formValidate')"
      >
        <!---菜单基本信息--->
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
          <FormItem label="菜单名称" prop="name">
            <Input v-model="formValidate.name" placeholder="请输入菜单名称" />
          </FormItem>
          <FormItem label="路由地址" prop="urlAddress">
            <Input v-model="formValidate.urlAddress" placeholder="请输入前端路由地址" />
          </FormItem>
          <FormItem label="API接口地址" prop="aPIAddress">
            <Input v-model="formValidate.aPIAddress" placeholder="请输入API接口地址" />
          </FormItem>
          <FormItem label="父级菜单" prop="parentIdarr">
            <Cascader
              v-bind:data="TreeArr"
              @on-change="SelectParent"
              change-on-select
              v-model="formValidate.parentIdarr"
              placeholder="请选择父级菜单"
            ></Cascader>
          </FormItem>
          <FormItem label="排序" prop="sort">
            <InputNumber v-model="formValidate.sort" placeholder="请输入排序" />
          </FormItem>
          <FormItem label="备注" prop="memo">
            <Input v-model="formValidate.memo" placeholder="请输入备注" />
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
  RequestMenuByPage,
  ResponseMenuByAdd,
  RequestMenuTree,
  ResponseMenuByEdit,
  ResponseMenuByDelete
} from "../../APIServer/Api.js";
export default {
  components: { PageView, Buttonbar },
  name: "HelloWorld",
  data() {
    return {
      Maxheight:500,
      info: JSON.parse(window.sessionStorage.userInfo),
      FormVisible: false, //Modal弹出框
      title: "添加菜单",
      loading: true,
      IsEdit: false, //是编辑还是新增菜单
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
      MenuList: [], //列表存放后台返回的数据
      buttonList: [], //列表存放后台返回的数据
      currentRow: null, //存放当前选中行的数据
      TreeArr: [], //级联选择器数组
      searCh: {
        ///搜索对象存放
        name: "",
        frontRouter: "",
        apiUrl: ""
      },
      id: "", //修改菜单的Id
      //添加字段
      formValidate: {
        name: "", //菜单名称
        urlAddress: "", //前端配置的路由
        aPIAddress: "", //API接口
        parentId: "", //父级菜单
        sort: 0, //排序字段
        icon: "", //菜单图标
        memo: "", //备注
        createdId: "",
        createdName: "",
        isDrop: false,
        parentIdarr: []
      },
      delrow: [],
      buttonIdarrChecked: [],
      //添加是字段校验
      ruleValidate: {
        name: [{ required: true, message: "请填写菜单名称", trigger: "blur" }],
        urlAddress: [
          { required: true, message: "请填写路由", trigger: "blur" }
        ],
        aPIAddress: [
          { required: true, message: "请填写API接口地址", trigger: "blur" }
        ]
      }
    };
  },
  mounted: function() {
    this.GetMenu();
    var h=window.innerHeight-280;
    this.Maxheight=h;
  },
  methods: {
    callFn(item) {
      this[item].apply(this);
    },
    GetMenu: function() {
      var pageIndex = this.$refs.PageArr.pageIndex; //获取子组件中的属性
      var pageSize = this.$refs.PageArr.pagesize; //获取子组件中的属性
      var _this = this;
      this.loading = true;
      var param = {
        PageIndex: pageIndex,
        PageSize: pageSize,
        Name: _this.searCh.name,
        UrlAddress: _this.searCh.frontRouter,
        APIAddress: _this.searCh.apiUrl
      };
      RequestMenuByPage(param).then(res => {
        if (res.data.success) {
          _this.MenuList = res.data.response.data;
          _this.$refs.PageArr.Total = res.data.response.totalCount;
          _this.loading = false;
        } else {
          this.$Message.error({ content: res.data.msg, duration: 3 });
          _this.loading = false;
        }
      });
    },
    //选择级联时获取value
    SelectParent(value, selectedData) {
      this.formValidate.parentIdarr = JSON.stringify(value);
      this.formValidate.parentId = value.pop();
    },
    //单击表格选中的数据时
    CurrentRow: function(val) {
      this.currentRow = val;
    },
    //多选删除
    getRow(selection, row) {
      this.delrow = selection;
    },
    search: function() {
      this.GetMenu();
    },
    //点击添加按钮弹出对话框
    AddModal() {
      var _this = this;
      this.parentIdarr = [];
      this.TreeArr = [];
      (this.formValidate = {
        name: "", //菜单名称
        urlAddress: "", //前端配置的路由
        aPIAddress: "", //API接口
        parentId: "", //父级菜单
        sort: 0, //排序字段
        icon: "", //菜单图标
        memo: "", //备注
        createdId: "",
        createdName: "",
        isDrop: false,
        buttonIdarrChecked: []
      }),
        (this.IsEdit = false);
      RequestMenuTree({
        userid: "ad73d0f6-33c9-40e3-8c56-f0ec8e35315f"
      }).then(res => {
        _this.tree(res.data.response);
      });
      _this.buttonList = [];
      this.FormVisible = true;
    },
    handleSubmit(name) {
      this.$refs.formValidate.validate(valid => {
        if (valid) {
          var _this = this;
          this.formValidate.parentIdarr = JSON.stringify(
            this.formValidate.parentIdarr
          );
          let params = Object.assign({}, this.formValidate);
          if (this.IsEdit) {
            //true代表是编辑进来
            params.id = this.id;
            params.updateName = this.info.name;
            params.updateId = this.info.id;
            ResponseMenuByEdit(params).then(res => {
              _this.Message(res);
            });
          } //否则是新增
          else {
            params.createdId = this.info.id;
            params.createdName = this.info.name;
            ResponseMenuByAdd(params).then(res => {
              _this.FormVisible = false;
              _this.Message(res);
              _this.GetMenu();
            });
          }
        } else {
          this.$Message.error({ content: "参数有误，请重新填写", duration: 3 });
        }
      });
    },
    Message: function(res) {
      var _this = this;
      if (res.status == 200) {
        if (res.data.success) {
          _this.$Message.success(res.data.msg);
          _this.buttonIds = [];
          _this.FormVisible = false;
          _this.GetMenu();
        } else {
          _this.$Message.error(res.data.msg);
        }
      } else {
        this.$Message.error("Fail!");
      }
    },
    //递归添加级联组件需要的属性
    tree(obj) {
      obj.label = obj.name;
      obj.value = obj.id;
      var crr = obj.children;
      //递归添加属性
      function test(crr) {
        for (var i = 0; i < crr.length; i++) {
          crr[i].label = crr[i].name;
          crr[i].value = crr[i].id;
          var arr = crr[i].children;
          if (arr.length > 0) {
            test(arr);
          }
        }
      }
      if (crr.length > 0) {
        test(crr);
      }
      this.TreeArr.push(obj);
    },
    edit() {
      var _this = this;
      if (this.currentRow == null) {
        this.$Message.warning({ content: "请选择要修改的菜单", duration: 3 });
        return;
      }
      this.formValidate.parentIdarr = "";
      this.formValidate = {
        name: this.currentRow.name, //菜单名称
        urlAddress: this.currentRow.urlAddress, //前端配置的路由
        aPIAddress: this.currentRow.apiAddress, //API接口
        parentId: this.currentRow.parentId, //父级菜单
        sort: 0, //排序字段
        icon: this.currentRow.icon, //菜单图标
        memo: this.currentRow.memo, //备注
        createdId: this.info.id,
        createdName: this.info.name,
        isDrop: this.currentRow.isDrop,
        parentIdarr: JSON.parse(this.currentRow.parentIdArr)
      };
      this.id = this.currentRow.id;
      this.title = "编辑";
      this.IsEdit = true;
      this.TreeArr = [];
      RequestMenuTree({ userid: _this.info.id }).then(
        //编辑时调用后台请求数据方法
        res => {
          _this.tree(res.data.response);
        }
      );
      this.FormVisible = true;
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
      ResponseMenuByDelete({ Ids: str }).then(res => {
        if (res.data.success) {
          _this.$Message.success(res.data.msg);
          _this.GetMenu();
        } else {
          _this.$Message.error({
            content: res.data.msg,
            duration: 3
          });
        }
      });
    }
  }
};
</script>

