<!--按钮管理组件-->
<template>
    <div>
      <Row style="margin:10px 0px">
        <div style="float:left;">
          <span>
            <span>按钮名称：</span>
            <Input v-model="searCh.name" clearable style="width:180px;" placeholder="请输入按钮名称" />
          </span>
          <span>
            <span>JS事件：</span>
            <Input v-model="searCh.jsKeyCode" clearable style="width:180px;" placeholder="请输入按钮名称" />
          </span>
          <span>
            <span>所属菜单</span>
            <Input v-model="searCh.menuName" clearable style="width:180px;" placeholder="请输入所属菜单" />
          </span>
          <span>
            <span>Api接口：</span>
            <Input
              v-model="searCh.apiAddress"
              clearable
              style="width:180px;"
              placeholder="请输入Api接口地址"
            />
          </span>
          <Button type="info" icon="ios-search" @click="Search">查询</Button>
        </div>
        <Buttonbar v-on:keyFun="callFn" />
      </Row>
    <div>
      <Scroll :height="Maxheight">
      <Table
        width="100%"
        border
        :loading="loading"
        show-header
        highlight-row
        @on-row-dblclick="CurrentRow"
        @on-row-click="clickbox"
        :columns="columns2"
        :data="list"
      ></Table>
      </Scroll>
    </div>
    <div style="padding:5px;">
      <PageView v-on:pageref="Search" ref="PageArr" />
    </div>
    <div>
      <!-- 添加菜单弹出框 -->
      <Modal
        v-model="FormVisible"
        :title="title"
        width="80%"
        height="80%"
        :mask-closable="false"
        @on-ok="handleSubmit('formValidate')"
      >
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
          <FormItem label="按钮名称" prop="name">
            <Input v-model="formValidate.name" placeholder="请填写按钮名称" />
          </FormItem>
          <FormItem label="API地址" prop="apiAddress">
            <!-- <Poptip trigger="hover" title="Title" content="content"> -->
            <Input v-model="formValidate.apiAddress" placeholder="请填写调用API接口地址" />
            <!-- </Poptip> -->
          </FormItem>
          <FormItem label="所属菜单" prop="menuId">
            <Select v-model="formValidate.menuId" clearable placeholder="请选择所属菜单">
              <Option v-for="item in MenuList" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
          </FormItem>
          <FormItem label="JS事件" prop="keyCode">
            <Input v-model="formValidate.keyCode" placeholder="请填写按钮事件" />
          </FormItem>
          <FormItem label="是否显示" prop="isShow">
            <i-switch v-model="formValidate.isShow" size="large" style="width:50px;">
              <span slot="open">On</span>
              <span slot="close">Off</span>
            </i-switch>
          </FormItem>
          <FormItem label="按钮样式" prop="buttonStyle">
            <Input v-model="formValidate.buttonStyle" placeholder="请填写按钮样式或类型" />
          </FormItem>
          <FormItem label="按钮备注" prop="memo">
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
import {
  RequestButtonByPage,
  ResponsebuttonByAdd,
  ResponseButtonByEdit,
  RequestAllMenu,
  ResponseButtonByDelete
} from "../../APIServer/Api.js";
import Buttonbar from "@/components/ButtonBar/ButtonBar.vue";
export default {
  components: { PageView, Buttonbar },
  name: "Buttons",
  data() {
    return {
      Maxheight:500,
      info: JSON.parse(window.sessionStorage.userInfo),
      //添加字段
      FormVisible: false,
      loading: true,
      searCh: {
        name: "",
        State: -1,
        jsKeyCode: "",
        apiAddress: "",
        menuName:''
      },
      id:'',
      formValidate: {
        name: "", //按钮名称
        memo: "", //备注
        keyCode: "", //事件
        apiAddress: "", //API接口地址
        buttonStyle: "", //按钮颜色/样式
        createdId: "", //创建人ID
        createdName: "", //创建人
        isDrop: false, //是否删除
        isShow: false,
        menuId: ""
      },
      currentRow: null,
      IsEdit: false,
      title: "",
      ruleValidate: {
        name: [{ required: true, message: "请填写按钮名称", trigger: "blur" }],
        keyCode: [
          { required: true, message: "请填写按钮事件", trigger: "blur" }
        ],
        apiAddress: [
          { required: true, message: "请填写调用API接口地址", trigger: "blur" }
        ],
        menuId: [{ required: true, message: "请选择所属菜单", trigger: "blur" }]
      },
      columns2: [
        {
          type: "selection",
          minWidth: 60,
          maxWidth: 60,
          align: "center",
          fixed: "left"
        },
        { title: "按钮名称", key: "name", minWidth: 100 },
        { title: "所属菜单", key: "menuName", minWidth: 100, maxWidth: 150 },
        { title: "Api接口地址", key: "apiAddress", minWidth: 120 },
        { title: "JS事件", key: "keyCode", minWidth: 120 },
        { title: "按钮样式", key: "buttonStyle", minWidth: 120 },
        { title: "备注", key: "memo", minWidth: 120 },
        { title: "创建人", key: "createdName", minWidth: 80, align: "center" },
        { title: "创建日期", key: "createAts", minWidth: 80, align: "center" }
      ],
      list: [],
      btnlist: [
        { name: "李寻欢", kungFu: "小李飞刀", method: "foo('林诗音')" },
        { name: "楚留香", kungFu: "踏雪无痕", method: "foo1('夜姬')" },
        { name: "陆小凤", kungFu: "灵犀一指", method: "foo2('花满楼')" }
      ],
      MenuList: []
    };
  },
  created: function() {},
  mounted: function() {
    this.Search();
    var h=window.innerHeight-300;
    this.Maxheight=h;
  },
  methods: {
    callFn(item) {
      this[item].apply(this);
    },
    Search() {
      this.Get();
    },
    handleSubmit() {
      this.$refs.formValidate.validate(valid => {
        if (valid) {
          var _this = this;
          let params = Object.assign({}, this.formValidate);
          if (this.IsEdit) {
            params.id = this.id;
            params.updateName = this.info.name;
            params.updateId = this.info.id;
            ResponseButtonByEdit(params).then(res => {
              _this.FormVisible = false;
              _this.$Message.success(res.data.msg);
              _this.Get();
            });
          } else {
            params.createdId = this.info.id;
            params.createdName = this.info.name;
            ResponsebuttonByAdd(params).then(res => {
              if (res.data.success) {
                _this.FormVisible = false;
                _this.$Message.success(res.data.msg);
                _this.Get();
              }
            });
          }
        } else {
          this.$Message.error({ content: "参数有误，请重新填写", duration: 3 });
        }
      });
    },
    Get() {
      var pageIndex = this.$refs.PageArr.pageIndex; //获取子组件中的属性
      var pageSize = this.$refs.PageArr.pagesize; //获取子组件中的属性
      var _this = this;
      var param = {
        PageIndex: pageIndex,
        PageSize: pageSize,
        Name: _this.searCh.name,
        JSKeyCode: _this.searCh.jsKeyCode,
        APIAddress: _this.searCh.apiAddress,
        MenuName:_this.searCh.menuName,
      };
      RequestButtonByPage(param).then(res => {
        if (res.data.success) {
          _this.loading = false;
          _this.list = res.data.response.data;
          _this.$refs.PageArr.Total = res.data.response.totalCount;
        } else {
          this.$Message.error({ content: res.data.msg, duration: 3 });
          _this.loading = false;
        }
      });
    },
    GetMenuList() {
      var _this = this;
      RequestAllMenu({}).then(res => {
        if (res.data.success) {
          _this.MenuList = res.data.response;
        } else {
          _this.$Message.error({ content: res.data.msg, duration: 3 });
        }
      });
    },
    addModal: function() {
      this.title = "添加用户";
      (this.formValidate = {
        name: "", //姓名
        memo: "", //登录账号
        keyCode: "", //邮箱
        apiAddress: "", //微信
        buttonStyle: "", //手机号
        createdId: "", //菜单图标
        createdName: "", //登录密码
        isDrop: false, //是否删除
        menuId: ""
      }),
        this.GetMenuList();
      this.FormVisible = true;
    },
    //单击表格选中的数据时
    CurrentRow: function(val) {
      this.currentRow = val;
    },
    //单击选中删除
    clickbox(row,index)
    {
      if(this.list[index]._checked)
      {
        this.$set(this.list[index],'_checked',false);
      }
      else
      {
        this.$set(this.list[index],'_checked',true);
      }

    },
    del() {
      var _this=this;
       if (this.currentRow == null) {
        this.$Message.warning({ content: "请选择要删除的按钮", duration: 3 });
        return;
      }
      var arr = [this.currentRow.id];
      var str = JSON.stringify(arr);
      ResponseButtonByDelete({ Ids: str }).then(res => {
                          if (res.data.success) {
                            _this.$Message.success(res.data.msg);
                            _this.Get();
                          } else {
                            _this.$Message.error({
                              content: res.data.msg,
                              duration: 3
                            });
                          }

                      });
    },
    edit() {
      if (this.currentRow == null) {
        this.$Message.warning({ content: "请选择要修改的按钮", duration: 3 });
        return;
      }
      this.IsEdit=true;
      this.title = "修改按钮";
      (this.formValidate = {
        name: this.currentRow.name, //姓名
        memo: this.currentRow.name, //登录账号
        keyCode: this.currentRow.keyCode, //邮箱
        apiAddress: this.currentRow.apiAddress, //微信
        buttonStyle: this.currentRow.buttonStyle, //手机号
        createdId: this.info.id, //菜单图标
        createdName: this.info.name, //登录密码
        isDrop: false, //是否删除
        isShow:this.currentRow.isShow,
        menuId: this.currentRow.menuId
      }),
      this.id = this.currentRow.id;
      this.GetMenuList();
      this.FormVisible = true;
    }
  }
};
</script>

