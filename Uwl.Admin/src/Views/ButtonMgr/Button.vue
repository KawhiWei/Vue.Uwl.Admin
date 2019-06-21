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
                <Button type="info" icon="ios-search" >查询</Button>
                <Button type="success"  @click="AddModal" icon="md-add">添加</Button>
        </Row>
    </div>
    <div style="padding:5px;">
        <PageView v-on:pageref="Search" ref="PageArr"/>
    </div>
    <div>
            <!-- 添加菜单弹出框 -->
            <Modal v-model="FormVisible" :title="title" width="80%" height="80%" :mask-closable="false" @on-ok="handleSubmit('formValidate')">
                <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
                        <FormItem label="姓名" prop="name">
                            <Input v-model="formValidate.name" placeholder="请输入姓名"/>
                        </FormItem>
                        <FormItem label="登录账号" prop="account">
                            <!-- <Poptip trigger="hover" title="Title" content="content"> -->
                            <Input v-model="formValidate.account" placeholder="请输入登录账号"/>
                            <!-- </Poptip> -->
                        </FormItem>
                        <!-- <FormItem label="登录密码" prop="password">
                            <Input v-model="formValidate.password" placeholder="请输入登录密码"/>
                        </FormItem> -->
                         <FormItem label="邮箱" prop="email">
                            <Input v-model="formValidate.email" placeholder="请输入邮箱地址"/>
                        </FormItem>
                        <FormItem label="手机号" prop="mobile">
                            <Input  v-model="formValidate.mobile" placeholder="请输入手机号"/>
                        </FormItem>
                        <FormItem label="微信" prop="weChat">
                            <Input v-model="formValidate.weChat" placeholder="请输入微信号"/>
                        </FormItem>
                        <FormItem label="员工类型" prop="empliyeeType">
                            <Input  v-model="formValidate.empliyeeType" placeholder="请选择员工类型"/>
                        </FormItem>
                        <FormItem label="职位" prop="jobName">
                            <Input v-model="formValidate.jobName" placeholder="请输入职位名称"/>
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
// import {RequestMenuByPage,ResponseMenuByAdd,RequestMenuTree,ResponseMenuByEdit,ResponseMenuByDelete} from '../../APIServer/Api.js';
export default {
  components:{PageView},
  name: 'Buttons',
  data () {
    return {
            //添加字段
            FormVisible:false,
            formValidate: 
            {
                name: '',//姓名
                account: '',//登录账号
                email: '',//邮箱
                weChat: '',//微信
                mobile: '',//手机号
                empliyeeType: 0,//菜单图标
                password: '',//登录密码
                qq:'',//qq账号
                sex: true,//性别
                jobName:'',//职位名称
                createdId:'',//创建人ID
                createdName:'',//创建人
                isDrop:false,//是否删除
                accountState:0,
            },
            title:'',
            ruleValidate: 
            {
                name: 
                [
                    { required: true, message: '请填写姓名', trigger: 'blur' }
                ],
                account: 
                [
                    { required: true, message: '请填写登录账号', trigger: 'blur' },
                ],
                email: 
                [
                    { required: true, message: '请填写邮箱地址', trigger: 'blur' },
                    { type: 'email', message: 'Incorrect email format', trigger: 'blur' }
                ],
            },
    }
  },
  mounted:function()
  {
      
  },
  methods:{
      Search()
      {

      },
      AddModal:function() {
            this.title="添加用户";
            this.sexflag='';
            this.formValidate=
            {
                name: '',//姓名
                account: '',//登录账号
                email: '',//邮箱
                weChat: '',//微信
                mobile: '',//手机号
                empliyeeType: 0,//菜单图标
                password: '',//登录密码
                qq:'',//qq账号
                jobName:'',//职位名称
                createdId:'',//创建人ID
                createdName:'',//创建人
                isDrop:false,//是否删除
            },
            this.FormVisible=true;
        }
  }
}
</script>

