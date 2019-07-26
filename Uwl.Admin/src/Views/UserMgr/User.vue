<!--用户管理组件-->
<template>
    <div>
        <div>
            <Row style="margin:10px 0px">
                <span>
                    <span>姓名：</span>
                    <Input v-model="Search.name"  style="width:180px;" placeholder="请输入菜单名称"/>
                </span>
                <span>
                    <span>账号：</span><Input v-model="Search.accont"  style="width:180px;" placeholder="请输入前端路由地址"/>
                </span>
                <span>
                    <span>账号状态：</span><Input v-model="Search.AccontState"  style="width:180px;" placeholder="请输入Api路由地址"/>
                </span>
                <Button type="info" icon="ios-search" @click="search">查询</Button>
                <Button type="success"  @click="AddModal" icon="md-add">添加</Button>
            </Row>
            <div>
                 <Table width="100%" border :loading="loading"
                show-header
                highlight-row
                @on-current-change="CurrentRow"
                :columns="columns2" :data="UserList"></Table>
                <!--<Spin size="large"> 加载中</Spin> -->
            </div>
            <div style="padding:5px;">
                <PageView v-on:pageref="GetUser" ref="PageArr"/>
            </div>
        </div>
        <div>
            <!-- 添加菜单弹出框 -->
            <Modal v-model="FormVisible" :title="title" width="60%" height="99%" :mask-closable="false" @on-ok="handleSubmit('formValidate')">
                <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
                        <FormItem label="姓名" prop="name">
                            <Input v-model="formValidate.name" placeholder="请输入姓名"/>
                        </FormItem>
                        <FormItem label="登录账号" prop="account">
                            <Input v-model="formValidate.account" placeholder="请输入登录账号"/>
                        </FormItem>
                         <FormItem label="邮箱" prop="email">
                            <Input v-model="formValidate.email" placeholder="请输入邮箱地址"/>
                        </FormItem>
                        <FormItem label="手机号" prop="mobile">
                            <Input  v-model="formValidate.mobile" placeholder="请输入手机号"/>
                        </FormItem>
                        <FormItem label="角色" prop="jobName">
                            <Select v-model="model10" multiple style="width:260px" @on-change="GetIds">
                                <Option v-for="item in roleArr" :value="item.id" :key="item.id">{{ item.name }}</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="微信" prop="weChat">
                            <Input v-model="formValidate.weChat" placeholder="请输入微信号"/>
                        </FormItem>
                        <FormItem label="员工类型" prop="empliyeeType">
                            <Input  v-model="formValidate.empliyeeType" placeholder="请选择员工类型"/>
                        </FormItem>
                        <FormItem label="性别" prop="sexflag">
                            <RadioGroup v-model="sexflag">
                                <Radio label="man">男</Radio>
                                <Radio label="woman">女</Radio>
                            </RadioGroup>
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
import {RequestUserByPage,ResponseUserByAdd,ResponseUserByEdit,RequestGetAllRole,ResponseUserByDelete} from '../../APIServer/Api.js';
export default {
    name:'User',
    components:{PageView},
    data(){
        return {
            info:JSON.parse(window.sessionStorage.userInfo),
            loading:true,
            Search:{
                name:'',
                accont:'',
                AccontState:'',
            },
            IsEdit:false,
            sexflag:'',
             //添加字段
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
            roleArr:[],
            model10: [],
            id:'',//修改用户的Id
            //添加是字段校验
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
            title:'',
            FormVisible:false,
            currentRow:'',//存放当前选中行的数据
            columns2: [
            {type:'selection',minWidth: 60,align:'center',fixed: 'left',},
            {title: '姓名',key: 'name',minWidth:100},
            {title: '登录账号',key: 'account',minWidth:120},
            {title: '邮箱',key: 'email',minWidth:120},
            {title: '手机号',key: 'mobile',minWidth:120},
            {title: '微信',key: 'weChat',minWidth:120},
            {title: '性别',key: 'sex',minWidth:80,align:'center',render:(h,params)=>
                {
                    if(params.row.sex)
                    {
                        return h('Tag',{props:{color:'primary'}},'男');
                    }
                    else
                    {
                        return h('Tag',{props:{color:'primary',}},'女');
                    }
                }
            },
            {title: '账号状态',key: 'accountState',minWidth:100,align:'center',
            render:(h,params)=>{
                var text="";
                if(params.row.accountState==0)
                {
                    text="正常"
                    return h('Tag',{props:{color:'green'}},text);
                }
                if(params.row.accountState==1)
                {
                    text="冻结中"
                    return h('Tag',{props:{color:'orange'}},text);
                }
                
            }},
            {title: '创建时间',key: 'createAts',minWidth:100},
            {title: '创建人',key: 'createdName',minWidth:80},
            {title: '操作',key: 'action',minWidth: 140,fixed: 'right',
            render: (h, params) => 
            {
                return h('div', [
                    h('Button', {
                        props: {
                            type: 'warning',
                            size: 'small'
                        },
                        style:{
                            margin:'5px'
                        },
                        on:{
                            click:()=>{
                                var _this=this;
                                this.formValidate=
                                {
                                    name: params.row.name,//菜单名称
                                    account: params.row.account,//前端配置的路由
                                    email: params.row.email,//API接口
                                    weChat: params.row.weChat,//父级菜单
                                    mobile: params.row.mobile,//排序字段
                                    empliyeeType: params.row.empliyeeType,//菜单图标
                                    password:'',
                                    qq: params.row.qq,//备注
                                    jobName:params.row.jobName,
                                    createdId:params.row.createdId,
                                    createdName:params.row.createdName,
                                    isDrop:params.row.isDrop,
                                    accountState:params.row.accountState,
                                };
                                this.id=params.row.id;
                                if(params.row.true)
                                {
                                    this.sexflag='man';
                                }
                                else
                                {
                                    this.sexflag='woman';
                                }
                                this.id=params.row.id;
                                this.title='编辑';
                                this.FormVisible=true;
                                this.IsEdit=true;
                                this.roleArr=[];
                                this.model10=[];
                                this.GetAllRole();
                            }
                        }
                    }, '修改'),
                    h('Button', {
                        props: {
                            type: 'error',
                            size: 'small'
                            },
                            style:{
                                margin:'5px'
                            },
                            on:{
                                click:()=>{
                                    var _this=this;
                                    var arr=[params.row.id]
                                    //var arr={Ids:params.row.id};
                                    //var arr=['2893214a-bebc-4766-ba54-3820bed1e88d','2893214a-bebc-4766-ba54-3820bed1e88d'];
                                    var str=JSON.stringify(arr)
                                    console.log(str)
                                    debugger
                                    ResponseUserByDelete({Ids:str}).then(res=>{
                                        if(res.status==200)
                                        {
                                            if(res.data.success)
                                            {
                                                _this.$Message.success(res.data.msg);
                                                _this.GetUser();
                                            }
                                            else
                                            {
                                                _this.$Message.error({content:res.data.msg,duration:3});
                                            }
                                        }
                                        else
                                        {
                                            _this.$Message.error({content:'参数有误，请重试!',duration:3});
                                        }
                                    })
                                }
                            }
                    }, '删除')]);}
            }],//列表表头
        UserList:[],//列表存放后台返回的数据
        }
    },
    mounted:function()
    {
        this.search();
    },  
    methods:{
        search:function()
        {
            this.GetUser();
        },
        //单击表格选中的数据时
        CurrentRow:function(val)
        {
            //   this.currentRow=val;
            //   console.log(this.currentRow);
        },
        //提交按钮事件
        handleSubmit(name)
        {
            this.$refs.formValidate.validate((valid)=>{
                if(valid)
                {
                    var _this=this;
                    debugger
                    var sexflag=true;//默认性别是男
                    if(_this.sexflag=='woman')
                    {
                        var sexflag=false;
                    }
                    this.formValidate.sex=sexflag;
                    let params=Object.assign({},this.formValidate);
                    if(this.IsEdit)
                    {
                        console.log("点击了修改保存")
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
                        console.log(params);
                        ResponseUserByAdd(params).then((res)=>
                        {
                            _this.FormVisible=false;
                            _this.GetUser();
                        })
                    }
                }
                else
                {
                    this.$Message.error({content:'参数有误，请重新填写',duration:3});
                }
            })
        },
        GetUser:function()
        {
            var pageIndex=this.$refs.PageArr.pageIndex;//获取子组件中的属性
            var pageSize=this.$refs.PageArr.pagesize;//获取子组件中的属性
            var _this=this;
            this.loading=true;
            RequestUserByPage({PageIndex:pageIndex,PageSize:pageSize}).then(res=>
            {
                _this.loading=false;
                _this.UserList=res.data.response.data;
                _this.$refs.PageArr.Total=res.data.response.totalCount;
                console.log(_this.UserList)
            });
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
            this.roleArr=[];
            this.GetAllRole();
            this.FormVisible=true;
        },
        GetAllRole:function()
        {
            var _this=this;
            RequestGetAllRole({}).then(res=>{
               _this.roleArr=res.data.response.data;
            })
        },
        GetIds:function(item)
        {
            console.log(this.model10)
        }
    }
}
</script>
