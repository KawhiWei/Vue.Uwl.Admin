<!--角色管理组件-->
<template>
    <div>
        <div>
            <Row style="margin:10px 0px">
                <span>
                    <span>角色名称：</span>
                    <Input v-model="Search.name"  style="width:180px;" placeholder="请输入角色名称"/>
                </span>
                <Button type="info" icon="ios-search" @click="search">查询</Button>
                <Button type="success"  @click="AddModal" icon="md-add">添加</Button>
            </Row>
            <div>
                 <Table width="100%" border :loading="loading"
                show-header
                highlight-row
                @on-current-change="CurrentRow"
                :columns="columns2" :data="List"></Table>
                <!--<Spin size="large"> 加载中</Spin> -->
            </div>
            <div style="padding:5px;">
                <PageView v-on:pageref="GetRole" ref="PageArr"/>
            </div>
        </div>
        <div>
            <!-- 添加菜单弹出框 -->
            <Modal v-model="FormVisible" :title="title" width="50%" height="80%" :mask-closable="false" @on-ok="handleSubmit('formValidate')">
                <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
                        <FormItem label="角色名称" prop="name">
                            <Input v-model="formValidate.name" placeholder="请输入角色名称"/>
                        </FormItem>
                        <FormItem label="角色说明" prop="memo">
                            <!-- <Poptip trigger="hover" title="Title" content="content"> -->
                            <Input v-model="formValidate.memo" placeholder="请输入角色说明"/>
                            <!-- </Poptip> -->
                        </FormItem>
                         <FormItem label="角色状态" prop="roletState">
                             <Select v-model="formValidate.roletState" style="width:200px">
                                <Option v-for="item in stateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
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
import PageView from '@/components/Page.vue'
import {RequestRoleByPage,ResponseRoleByAdd,ResponseRoleByEdit,ResponseRoleByDelete} from '../../APIServer/Api.js';
export default {
    name:'Role',
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
             //添加字段
            formValidate: 
            {
                name: '',//角色名称
                memo: '',//说明
                roletState: '',//角色状态
                createdId:'',//创建人ID
                createdName:'',//创建人
                isDrop:false,//是否删除
            },
            id:'',//修改用户的Id
            //添加是字段校验
            ruleValidate: 
            {
                name: 
                [
                    { required: true, message: '请填写角色名称', trigger: 'blur' }
                ],
                roletState: 
                [
                    { required: true, message: '请选择角色状态', trigger: 'change' }
                ],
            },
            title:'',
            FormVisible:false,
            currentRow:'',//存放当前选中行的数据
            columns2: [
            {type:'selection',minWidth: 40, maxWidth:60,align:'center'},
            {title: '角色名称',key: 'name',minWidth:100},
            {title: '角色说明',key: 'memo',minWidth:120},
            {title: '角色状态',key: 'accountState',minWidth:100,align:'center',
            render:(h,params)=>{
                var text="";
                if(params.row.roletState==0)
                {
                    text="正常"
                    return h('Tag',{props:{color:'green'}},text);
                }
                if(params.row.roletState==1)
                {
                    text="冻结中"
                    return h('Tag',{props:{color:'orange'}},text);
                }
                
            }},
            {title: '创建时间',key: 'createAts',minWidth:100},
            {title: '创建人',key: 'createdName',minWidth:80},
            {title: '操作',key: 'action',minWidth: 140,
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
                                console.log(params);
                                this.formValidate=
                                {
                                    name: params.row.name,//角色名称
                                    memo: params.row.memo,//说明
                                    roletState: params.row.roletState+'',//角色状态
                                    createdId:params.row.createdId,
                                    createdName:params.row.createdName,
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
                                console.log(this.IsEdit)
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
                                    ResponseRoleByDelete({Ids:str}).then(res=>{
                                        if(res.status==200)
                                        {
                                            if(res.data.success)
                                            {
                                                _this.$Message.success(res.data.msg);
                                                _this.GetRole();
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
            List:[],//列表存放后台返回的数据
            stateList:[
                {label:'激活',value:'0'},
                {label:'禁用',value:'1'},
            ],//列表存放后台返回的数据
        }
    },
    mounted:function()
    {
        this.search();
    },  
    methods:{
        search:function()
        {
            this.GetRole();
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
                    let params=Object.assign({},this.formValidate);
                    if(this.IsEdit)
                    {
                        params.id=this.id;
                        params.updateName=this.info.name;
                        params.updateId=this.info.id;
                        console.log(params);
                        debugger
                        ResponseRoleByEdit(params).then((res)=>
                        {
                            _this.FormVisible=false;
                            _this.GetRole();
                        })
                    }
                    else
                    {
                        params.createdId=this.info.id;
                        params.createdName=this.info.name;
                        ResponseRoleByAdd(params).then((res)=>
                        {
                            _this.FormVisible=false;
                            _this.GetRole();
                        })
                    }
                }
                else
                {
                    this.$Message.error({content:'有必填项未填写，请确认',duration:3});
                }
            })
        },
        GetRole:function()
        {
            var pageIndex=this.$refs.PageArr.pageIndex;//获取子组件中的属性
            var pageSize=this.$refs.PageArr.pagesize;//获取子组件中的属性
            var _this=this;
            this.loading=true;
            RequestRoleByPage({PageIndex:pageIndex,PageSize:pageSize}).then(res=>
            {
                if(res.status!=200)
                {
                    var err=JSON.parse(res.response.data)
                    this.$Message.error({content:err.Message,duration:3});
                    _this.loading=false;
                }
                else{
                    _this.loading=false;
                    _this.List=res.data.response.data;
                    _this.$refs.PageArr.Total=res.data.response.totalCount;
                }
                
            });
        },
        AddModal:function() {
            this.title="添加角色";
            this.sexflag='';
            this.formValidate=
            {
                name: '',//角色名称
                memo: '',//说明
                roletState: '',//角色状态
                createdId:'',//创建人ID
                createdName:'',//创建人
                isDrop:false,//是否删除
            },
            this.FormVisible=true;
        }
    }
}
</script>
