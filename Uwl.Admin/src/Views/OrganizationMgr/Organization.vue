<!--用户管理组件-->
<template>
  <div>
    <Row :gutter="16">
      <Col span="4" style="border:1px solid red;">
        <Tree :data="treearr" @on-select-change="getjiedian"></Tree>
      </Col>
      <Col span="20">
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
          <FormItem label="名称" prop="name">
            <Input v-model="formValidate.name" placeholder="请输入名称"></Input>
          </FormItem>
           <FormItem label="状态" prop="city" >
            <Select v-model="formValidate.organizeState" placeholder="请选择状态">
                <Option v-for="item in stateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
        </FormItem>
          <FormItem label="类型" prop="gender">
            <RadioGroup v-model="formValidate.gender">
              <Radio label="Company">单位</Radio>
              <Radio label="DepartMent">部门</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="排序" prop="sort">
            <Input
              v-model="formValidate.sort"
              type="number"
              placeholder="Enter something...">
              </Input>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="handleSubmit('formValidate')">保存</Button>
            <Button @click="handleReset('formValidate')" style="margin-left: 8px">Reset</Button>
          </FormItem>
        </Form>
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
      treearr: [],
      Tokens: {
        Authorization: "Bearer " + window.sessionStorage.getItem("Token")
      },
      formValidate: {
        name: "",
        organizeType: 0,
        gender: "",
        parentArr: [],
        parentId: '',
        Depth: 0,
        sort:0,
        organizeState:0,
      },
      IsEdit: false,
      id: "", //修改用户的Id
      //添加是字段校验
      ruleValidate: {
        name: [
          {
            required: true,
            message: "The name cannot be empty",
            trigger: "blur"
          }
        ],
        gender: [
          { required: true, message: "Please select gender", trigger: "change" }
        ],
        interest: [
          {
            required: true,
            type: "array",
            min: 1,
            message: "Choose at least one hobby",
            trigger: "change"
          },
          {
            type: "array",
            max: 2,
            message: "Choose two hobbies at best",
            trigger: "change"
          }
        ],
        date: [
          {
            required: true,
            type: "date",
            message: "Please select the date",
            trigger: "change"
          }
        ],
        time: [
          {
            required: true,
            type: "string",
            message: "Please select time",
            trigger: "change"
          }
        ],
        desc: [
          {
            required: true,
            message: "Please enter a personal introduction",
            trigger: "blur"
          },
          {
            type: "string",
            message: "Introduce no less than 20 words",
            trigger: "blur"
          }
        ]
      },
      stateList: [
        { value: 0, label: "正常" },
        { value: 1, label: "冻结" }
      ],
      file: null,
      loadingStatus: false,
      isshow: false
    };
  },
  mounted: function() {
    this.GetOrgtree();
  },
  methods: {
    //提交按钮事件
    handleSubmit(name) {
      this.$refs.formValidate.validate(valid => {
        if (valid) {
          console.log(this.formValidate)
          this.formValidate.sex = sexflag;
          let params = Object.assign({}, this.formValidate);
          if (this.IsEdit) {
            console.log("点击了修改保存");
            params.id = this.id;
            params.updateName = this.info.name;
            params.updateId = this.info.id;
            params.roleIds = JSON.stringify(this.roleArrIds);
            ResponseUserByEdit(params).then(res => {
              _this.$Message.success(res.data.msg);
              _this.GetUser();
            });
          } else {
            params.createdId = this.info.id;
            params.createdName = this.info.name;
            params.roleIds = JSON.stringify(this.roleArrIds);
            console.log(params);
            ResponseUserByAdd(params).then(res => {
              _this.GetUser();
            });
          }
        } else {
          this.$Message.error({ content: "参数有误，请重新填写", duration: 3 });
        }
      });
    },
    //
    GetOrgtree() {
      var _that = this;
      _that.treearr = [];
      RequestOrganizeByPage({}).then(res => {
        console.log(res.data.response)
        if (res.data.success) {
          _that.treearr.push(res.data.response);
          console.log(_that.treearr);
        }
      });
    },
    getjiedian(arr, current) {
      console.log(arr, current);
    }
  }
};
</script>
