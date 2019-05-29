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
    </div>
</template>

<script>
import PageView from '@/components/Page.vue'
import {RequestUserByPage} from '../../APIServer/Api.js';
export default {
    name:'User',
    components:{PageView},
    data(){
        return {
            loading:true,
            Search:{
                name:'',
                accont:'',
                AccontState:'',
            },
            currentRow:'',//存放当前选中行的数据
            columns2: [
            {type:'selection',minWidth: 60,align:'center'},
            {title: '菜单名称',key: 'name',minWidth:100},
            {title: '父节点',key: 'parentId',minWidth:120},
            {title: '路由地址',key: 'urlAddress',minWidth:120},
            {title: 'API接口',key: 'apiAddress',minWidth:120},
            {title: '排序',key: 'sort',minWidth:20},
            {title: '创建时间',key: 'createAts',minWidth:80},
            {title: '创建人',key: 'createdName',minWidth:60},
            {title: '操作',key: 'action',minWidth: 110,
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
                                    urlAddress: params.row.urlAddress,//前端配置的路由
                                    aPIAddress: params.row.apiAddress,//API接口
                                    parentId: params.row.parentId,//父级菜单
                                    sort: 0,//排序字段
                                    icon: params.row.icon,//菜单图标
                                    memo: params.row.memo,//备注
                                    createdId:params.row.createdId,
                                    createdName:params.row.createdName,
                                    isDrop:params.row.isDrop,
                                }
                                this.id=params.row.id;
                                this.title='编辑';
                                this.FormVisible=true;
                                this.IsEdit=true;
                                RequestMenuTree({userid:''}).then(   //编辑时调用后台请求数据方法
                                    res=>{
                                    _this.tree(res.data.response);
                                })
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
                                    ResponseMenuByDelete({Ids:str}).then(res=>{
                                        if(res.status==200)
                                        {
                                            if(res.data.success)
                                            {
                                                _this.$Message.success(res.data.msg);
                                                _this.GetMenu();
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
            }
            ],//列表表头
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
            });
        },
        AddModal:function() {
            
        }
    }
}
</script>
