<!--用户管理组件-->
<template>
    <div>
        <div>
            <Row style="margin:10px 0px">
                <Col span="24">
                <span>
                    <span>组织：</span>
                    <Input v-model="searCh.name" clearable   style="width:180px;" placeholder="请输入姓名"/>
                </span>
                <span>
                    <span>账号：</span><Input v-model="searCh.accont" clearable   style="width:180px;" placeholder="请输入登录账号"/>
                </span>
                <span>
                    <span>手机号：</span><Input v-model="searCh.mobile" clearable   style="width:180px;" placeholder="请输入手机号"/>
                </span>
                <span>
                    <span>账号状态：</span>
                    <Select v-model="searCh.AccontState" style="width:200px">
                        <Option v-for="item in stateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </span>
                    <Button type="info"  icon="ios-search" @click="search">查询</Button>
                    <Button type="success" ghost @click="AddModal" icon="md-add">添加</Button>
                    <Upload style="display: inline-block;width:80px;height:15px;" ghost :headers="Tokens" :before-upload="handleUpload" action="/api/User/UpLoad"
                         :format ="['xlsx','xls']" :on-format-error="handleFormatError">
                            <span style="padding: 20px 0">
                            <Icon type="ios-cloud-upload" size="20" style="color: #3399ff"></Icon>
                            <span>选择文件</span>
                            </span>
                        </Upload>
                    <Button v-if="isshow"  type="success" ghost @click="UpLoad"  :loading="loadingStatus">{{ loadingStatus ? 'Uploading' : '确认上传' }}</Button>
                    <Button  type="info" ghost @click="DownLoad" ><Icon size="20" style="color: #3399ff" type="ios-download" />导出列表</Button>
                </Col>
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
            
        </div>
    </div>
</template>

<script>
import PageView from '@/components/Page.vue'
import {} from '../../APIServer/Api.js';
import download from '../../APIServer/DownLoad.js'
import axios from 'axios'
export default {
    name:'Organization',
    components:{PageView},
    data(){
        return {
            info:JSON.parse(window.sessionStorage.userInfo),
            searCh:{
                name:'',
                accont:'',
                AccontState:-1,
                mobile:'',
            },
            Tokens:{Authorization:"Bearer "+window.sessionStorage.getItem('Token')},
            IsEdit:false,
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
                roleIds:'',
            },
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
            columns2: [],//列表表头
            stateList:[
            {value:-1,label:'全部'},
            {value:0,label:'正常'},
            {value:1,label:'冻结'},
        ],
        file: null,
        loadingStatus: false,
        isshow:false,
        }
    },
    mounted:function()
    {
        this.search();
    },  
    methods:{
        //单击表格选中的数据时
        CurrentRow:function(val)
        {
        },
        //提交按钮事件
        handleSubmit(name)
        {
            this.$refs.formValidate.validate((valid)=>{
                if(valid)
                {
                    var _this=this;
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
                        params.roleIds=JSON.stringify(this.roleArrIds);
                        ResponseUserByEdit(params).then((res)=>
                        {
                            _this.FormVisible=false;
                            _this.$Message.success(res.data.msg);
                            _this.GetUser();
                        })
                    }
                    else
                    {
                        params.createdId=this.info.id;
                        params.createdName=this.info.name;
                        params.roleIds=JSON.stringify(this.roleArrIds);
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
    }
}
</script>
