<!--用户管理组件-->
<template>
  <div>
    <Row :gutter="16">
      <Col span="4">
        <Tree :data="treearr" @on-select-change="getNodeCurrent"></Tree>
      </Col>
      <Col span="20">
        <Form v-if="formIsShow" ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120">
          <FormItem label="名称" prop="name">
            <Input v-model="formValidate.name" placeholder="请输入名称"></Input>
          </FormItem>
          <FormItem label="状态" prop="organizeState" >
            <Select v-model="formValidate.organizeState" placeholder="请选择部门状态">
                <Option v-for="item in stateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="组织机构类型" prop="organizeType">
             <Select v-model="formValidate.organizeType" placeholder="请选择组织机构类型">
                <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
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
            <Button type="primary" v-if="isshow" @click="AddchildLevel" >添加子级</Button>
          </FormItem>
        </Form>
      </Col>
    </Row>
  </div>
</template>

<script>
import { RequestOrganizeByPage,ResponseOrganizeByAdd,
         ResponseOrganizeByEdit
} from "../../APIServer/Api.js";
import download from "../../APIServer/DownLoad.js";
import axios from "axios";
export default {
  name: "Organization",
  components: {},
  data() {
    return {
      info: JSON.parse(window.localStorage.userInfo),
      treearr: [],
      Tokens: {
        Authorization: "Bearer " + window.localStorage.getItem("Token")
      },
      formValidate: {
        name: '',
        organizeType: 0,
        parentArr: '',
        parentId: '',
        depth: 0,
        sort:0,
        organizeState:0,
      },
      oldformValidate:{},//点击添加子项时保存老的数据清空formValidate中的数据
      IsEdit: false,
      id: "", //修改用户的Id
      oldid:'',
      //添加是字段校验
      ruleValidate: {
        name: [
          {
            required: true,
            message: "请输入名称",
            trigger: "blur"
          }
        ],
        // organizeType: [
        //     { required: true, message: '请选择组织机构类型', trigger: 'change' }
        // ],
      },
      stateList: [
        { value: 0, label: "正常" },
        { value: 1, label: "冻结" }
      ],
      typeList:[
        { value: 1, label: "单位" },
        { value: 2, label: "部门" }
      ],
      file: null,
      loadingStatus: false,
      isshow: false,
      formIsShow:false,
    };
  },
  mounted: function() {
    this.GetOrgtree();
  },
  methods: {
    //提交按钮事件
    handleSubmit(name) {
      var _this = this;
      this.$refs.formValidate.validate(valid => {
        if (valid) {
          let params = Object.assign({}, this.formValidate);
          if (this.IsEdit) {
            params.id = this.id;
            params.updateName = this.info.name;
            params.updateId = this.info.id;
            ResponseOrganizeByEdit(params).then(res => {
              _this.$Message.success(res.data.msg);
              _this.GetOrgtree();
            });
          } else
          {
            params.createdId = this.info.id;
            params.createdName = this.info.name;
            console.log(params);
            ResponseOrganizeByAdd(params).then(res => {
              _this.GetOrgtree();
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
        if (res.data.success) {
          console.log(res.data.response)
          _that.treearr=res.data.response.children;
        }
        else
        {
          _that.$Message.error({ content: res.data.msg, duration: 3 });
        }
      });
    },
    getNodeCurrent(arr, current) {
      this.IsEdit=false;
      this.isshow=false;
      this.oldformValidate={};
      this.id=current.id;
      this.oldid=current.id;
      this.formValidate.name=current.title;
      this.formValidate.organizeType=current.organizeType;
      this.formValidate.parentArr=current.parentArr;
      this.formValidate.parentId=current.parentId;
      this.formValidate.depth=current.depth;
      this.formValidate.sort=current.sort;
      this.formValidate.organizeState=current.organizeState;
      this.IsEdit=true;
      this.isshow=true;
      this.formIsShow=true;
    },
    ///添加子级事件
    AddchildLevel()
    {
      this.oldformValidate=this.formValidate;//将选中的老数据放到新数组里面添加保存的时候用
      console.log(this.oldformValidate)
      var arr=JSON.parse(this.oldformValidate.parentArr)
      arr.push(this.oldid);
      this.formValidate.name='';
      this.formValidate.organizeType='';
      this.formValidate.parentArr=JSON.stringify(arr);
      this.formValidate.parentId=this.oldid;
      this.formValidate.depth=arr.length;
      this.formValidate.sort=0;
      this.formValidate.organizeState='';
      this.IsEdit=false;
      this.isshow=false;
      this.id='';
    }
  }
};
</script>
