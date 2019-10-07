<!--用户管理组件-->
<template>
  <div>
    <Row style="margin:10px 0px">
      <Col span="8" style="border:1px solid red;">
        <Tree :data="data4" ref="tree" 
        @on-select-change="getjiedian"
         show-checkbox multiple></Tree>
      </Col>
    </Row>
  </div>
</template>

<script>
import { RequestOrganizeByPage } from "../../APIServer/Api.js";
import download from "../../APIServer/DownLoad.js";
import axios from "axios";
export default {
  name: "Organization",
  components: {},
  data() {
    return {
      info: JSON.parse(window.sessionStorage.userInfo),
      searCh: {
        name: "",
        accont: "",
        AccontState: -1,
        mobile: ""
      },
      data4: [
        {
          title: "parent 1",
          expand: true,
          selected: true,
          children: [
            {
              title: "parent 1-1",
              expand: true,
              children: [
                {
                  title: "leaf 1-1-1",
                  disabled: true
                },
                {
                  title: "leaf 1-1-2"
                }
              ]
            },
            {
              title: "parent 1-2",
              expand: true,
              children: [
                {
                  title: "leaf 1-2-1",
                  checked: true
                },
                {
                  title: "leaf 1-2-1"
                }
              ]
            }
          ]
        }
      ],
      Tokens: {
        Authorization: "Bearer " + window.sessionStorage.getItem("Token")
      },
      IsEdit: false,
      //添加字段
      formValidate: {
        name: "", //姓名
        account: "", //登录账号
        email: "", //邮箱
        weChat: "", //微信
        mobile: "", //手机号
        empliyeeType: 0, //菜单图标
        password: "", //登录密码
        qq: "", //qq账号
        sex: true, //性别
        jobName: "", //职位名称
        createdId: "", //创建人ID
        createdName: "", //创建人
        isDrop: false, //是否删除
        accountState: 0,
        roleIds: ""
      },
      id: "", //修改用户的Id
      //添加是字段校验
      ruleValidate: {
        name: [{ required: true, message: "请填写姓名", trigger: "blur" }],
        account: [
          { required: true, message: "请填写登录账号", trigger: "blur" }
        ],
        email: [
          { required: true, message: "请填写邮箱地址", trigger: "blur" },
          { type: "email", message: "Incorrect email format", trigger: "blur" }
        ]
      },
      title: "",
      FormVisible: false,
      currentRow: "", //存放当前选中行的数据
      columns2: [], //列表表头
      stateList: [
        { value: -1, label: "全部" },
        { value: 0, label: "正常" },
        { value: 1, label: "冻结" }
      ],
      file: null,
      loadingStatus: false,
      isshow: false
    };
  },
  mounted: function() {
    RequestOrganizeByPage({}).then(res => {
      console.log(res);
    });
  },
  methods: {
    //单击表格选中的数据时
    CurrentRow: function(val) {},
    //提交按钮事件
    handleSubmit(name) {
      this.$refs.formValidate.validate(valid => {
        if (valid) {
          var _this = this;
          var sexflag = true; //默认性别是男
          if (_this.sexflag == "woman") {
            var sexflag = false;
          }
          this.formValidate.sex = sexflag;
          let params = Object.assign({}, this.formValidate);
          if (this.IsEdit) {
            console.log("点击了修改保存");
            params.id = this.id;
            params.updateName = this.info.name;
            params.updateId = this.info.id;
            params.roleIds = JSON.stringify(this.roleArrIds);
            ResponseUserByEdit(params).then(res => {
              _this.FormVisible = false;
              _this.$Message.success(res.data.msg);
              _this.GetUser();
            });
          } else {
            params.createdId = this.info.id;
            params.createdName = this.info.name;
            params.roleIds = JSON.stringify(this.roleArrIds);
            console.log(params);
            ResponseUserByAdd(params).then(res => {
              _this.FormVisible = false;
              _this.GetUser();
            });
          }
        } else {
          this.$Message.error({ content: "参数有误，请重新填写", duration: 3 });
        }
      });
    },
    getjiedian()
    {
        console.log(this.$refs.tree.data);
    }
  }
};
</script>
