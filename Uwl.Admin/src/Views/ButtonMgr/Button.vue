<!--按钮管理组件-->
<template>
<div>
    <div>
        <Row style="margin:10px 0px">
                <span>
                    <span>姓名：</span>
                    <Input  style="width:180px;" placeholder="请输入按钮名称"/>
                </span>
                <span>
                    <span>账号：</span><Input   style="width:180px;" placeholder="请输入按钮事件"/>
                </span>
                <span>
                    <span>账号状态：</span><Input  style="width:180px;" placeholder="请输入Api路由地址"/>
                </span>
                <Button type="info" icon="ios-search" @click="Search" >查询</Button>
                <!-- <Button  type="info" @click="Search" >添加</Button> -->

                <Button v-for="item in btnlist" :key="item.id" :type="item.buttonStyle" @click="Search" >{{item.name }}</Button>
                <Button type="success"  @click="AddModal" icon="md-add">添加</Button>
        </Row>
    </div>
    <div>
        <Table width="100%" border :loading="loading"
                show-header
                highlight-row
                @on-current-change="CurrentRow"
                :columns="columns2" :data="list"></Table>
    </div>
    <div style="padding:5px;">
        <PageView v-on:pageref="Search" ref="PageArr"/>
    </div>
    <div>
            <!-- 添加菜单弹出框 -->
            <Modal v-model="FormVisible" :title="title" width="80%" height="80%" :mask-closable="false" @on-ok="handleSubmit('formValidate')">
                <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
                        <FormItem label="按钮名称" prop="name">
                            <Input v-model="formValidate.name" placeholder="请填写按钮名称"/>
                        </FormItem>
                        <FormItem label="API地址" prop="apiAddress">
                            <!-- <Poptip trigger="hover" title="Title" content="content"> -->
                            <Input v-model="formValidate.apiAddress" placeholder="请填写调用API接口地址"/>
                            <!-- </Poptip> -->
                        </FormItem>
                        <FormItem label="所属菜单" prop="menuId">
                            <Select v-model="formValidate.menuId" clearable placeholder="请选择所属菜单">
                                <Option v-for="item in MenuList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="JS事件" prop="keyCode">
                            <Input v-model="formValidate.keyCode" placeholder="请填写按钮事件"/>
                        </FormItem>
                        <FormItem label="是否显示" prop="isShow">
                            <i-switch v-model="formValidate.isShow" size="large" style="width:50px;">
                                <span slot="open">On</span>
                                <span slot="close">Off</span>
                            </i-switch>
                        </FormItem>
                        <FormItem label="按钮样式" prop="buttonStyle">
                            <Input  v-model="formValidate.buttonStyle" placeholder="请填写按钮样式或类型"/>
                        </FormItem>
                        <FormItem label="按钮备注" prop="memo">
                            <Input v-model="formValidate.memo" placeholder="请输入备注"/>
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
import PageView from '@/components/Page.vue'
import {RequestButtonByPage,ResponsebuttonByAdd,RequestButtonByMenuId,RequestAllMenu} from '../../APIServer/Api.js';
export default {
  components:{PageView},
  name: 'Buttons',
  data () {
    return {
            info:JSON.parse(window.sessionStorage.userInfo),
            //添加字段
            FormVisible:false,
            loading:true,
            formValidate: 
            {
                name: '',//按钮名称
                memo: '',//备注
                keyCode: '',//事件
                apiAddress: '',//API接口地址
                buttonStyle: '',//按钮颜色/样式
                createdId:'',//创建人ID
                createdName:'',//创建人
                isDrop:false,//是否删除
                isShow:false,
                menuId:'',
            },
            currentRow:'',
            IsEdit:false,
            title:'',
            ruleValidate: 
            {
                name: 
                [
                    { required: true, message: '请填写按钮名称', trigger: 'blur' }
                ],
                keyCode: 
                [
                    { required: true, message: '请填写按钮事件', trigger: 'blur' },
                ],
                apiAddress: 
                [
                    { required: true, message: '请填写调用API接口地址', trigger: 'blur' },
                ],
                menuId: 
                [
                    { required: true, message: '请选择所属菜单', trigger: 'blur' },
                ],
            },
            columns2: [
            {type:'selection',minWidth: 60,maxWidth: 60,align:'center',fixed: 'left',},
            {title: '按钮名称',key: 'name',minWidth:100},
            {title: 'Api路由地址',key: 'apiAddress',minWidth:120},
            {title: '按钮JS事件',key: 'keyCode',minWidth:120},
            {title: '按钮样式',key: 'buttonStyle',minWidth:120},
            {title: '备注',key: 'memo',minWidth:120},
            {title: '创建人',key: 'createdName',minWidth:80,align:'center'},
            {title: '创建事件',key: 'createAts',minWidth:80,align:'center'}
            ],
            list:[],
            btnlist:[],
            MenuList:[],
    }
  },
  created:function()
  {
      var menuId=this.$getArrs.getBtnArr(this.$route).id;
      var _this=this;
      RequestButtonByMenuId({menuId:menuId}).then((res)=>{
            if(res.status!=200)
            {
                var err=JSON.parse(res.response.data)
                _this.$Message.error({content:err.Message,duration:3});
            }
            else
            { 
                _this.btnlist=res.data.response;
            }
      })
  },
  mounted:function()
  {
      this.Search();
  },
  methods:{
      Search()
      {
          this.Get();
      },
      handleSubmit()
      {
          this.$refs.formValidate.validate((valid)=>{
                if(valid)
                {
                    var _this=this;
                    let params=Object.assign({},this.formValidate);
                    if(this.IsEdit)
                    {
                        params.id=this.id;
                        params.updateName=this.info.name;
                        params.updateId=this.info.id;
                        ResponseUserByEdit(params).then((res)=>
                        {
                            _this.FormVisible=false;
                            _this.$Message.success(res.data.msg);
                            //debugger
                            _this.GetUser();
                        })
                    }
                    else
                    {
                        params.createdId=this.info.id;
                        params.createdName=this.info.name;
                        ResponsebuttonByAdd(params).then((res)=>
                        {
                            if(res.data.success)
                            {
                                _this.FormVisible=false;
                                _this.$Message.success(res.data.msg);
                                _this.Get();
                            }
                            
                        })
                    }
                }
                else
                {
                    this.$Message.error({content:'参数有误，请重新填写',duration:3});
                }
            })
      },
      Get()
      {
          var pageIndex=this.$refs.PageArr.pageIndex;//获取子组件中的属性
          var pageSize=this.$refs.PageArr.pagesize;//获取子组件中的属性
          var _this=this;
        //   this.loading=true;
          RequestButtonByPage({PageIndex:pageIndex,PageSize:pageSize}).then(res=>
          {
              if(res.status!=200)
              {
                   var err=JSON.parse(res.response.data)
                   this.$Message.error({content:err.Message,duration:3});
                   _this.loading=false;
              }
              else
              { 
                   _this.loading=false;
                   _this.list=res.data.response.data;
                   _this.$refs.PageArr.Total=res.data.response.totalCount;
              }
          })
      },
      GetMenuList()
      {
          var _this=this;
          RequestAllMenu({}).then(res=>{
            if(res.status!=200)
            {
                var err=JSON.parse(res.response.data)
                _this.$Message.error({content:err.Message,duration:3});
            }
            else
            {   if(res.data.success)
                {
                    _this.MenuList=res.data.response;    
                }
                else
                {
                    _this.$Message.error({content:res.data.msg,duration:3});
                }
            }
          })
      },
      AddModal:function() {
            this.title="添加用户";
            this.sexflag='';
            this.formValidate=
            {
                name: '',//姓名
                memo: '',//登录账号
                keyCode: '',//邮箱
                apiAddress: '',//微信
                buttonStyle: '',//手机号
                createdId: '',//菜单图标
                createdName: '',//登录密码
                isDrop:false,//是否删除
                menuId:'',
            },
            this.GetMenuList();
            this.FormVisible=true;
      },
      //单击表格选中的数据时
        CurrentRow:function(val)
        {
            //   this.currentRow=val;
            //   console.log(this.currentRow);
        },
  }
}
</script>

