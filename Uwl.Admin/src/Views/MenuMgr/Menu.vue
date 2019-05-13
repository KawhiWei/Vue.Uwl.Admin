<template>
    <div>
        <div>
            <Row style="margin:10px 0px">
                <span>
                    <span>菜单名称：</span><Input v-model="Search.Name"  style="width:180px;" placeholder="请输入菜单名称"/>
                </span>
                <span>
                    <span>前端路由地址：</span><Input v-model="Search.frontRouter"  style="width:180px;" placeholder="请输入前端路由地址"/>
                </span>
                <span>
                    <span>Api接口：</span><Input v-model="Search.apiUrl"  style="width:180px;" placeholder="请输入Api路由地址"/>
                </span>
                <Button type="info" icon="ios-search">查询</Button>
                <Button type="success"  @click="AddModal" icon="md-add">添加</Button>
            </Row>
            <!-- <Row style="margin:10px 0px">
                <span>
                <span>操作：</span>
                
                <<Button type="warning">修改</Button>
                <Button type="error">删除</Button>
                </span>
            </Row> -->
            <div>
                <Table width="100%" border 
                show-header
                highlight-row
                @on-current-change="CurrentRow"
                :columns="columns2" :data="MenuList"></Table>
            </div>
            <div style="padding:5px;">
                <PageView v-on:pageref="GetMenu" ref="PageArr"/>
            </div>
        </div>
        <div>
            <!-- 添加菜单弹出框 -->
            <Modal v-model="FormVisible" :title="title" width="80%" height="80%" :mask-closable="false" @on-ok="handleSubmit('formValidate')">
                <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
                        <FormItem label="菜单名称" prop="name">
                            <Input v-model="formValidate.name" placeholder="请输入菜单名称"/>
                        </FormItem>
                        <FormItem label="路由地址" prop="urlAddress">
                            <Input v-model="formValidate.urlAddress" placeholder="请输入前端路由地址"/>
                        </FormItem>
                         <FormItem label="API接口地址" prop="aPIAddress">
                            <Input v-model="formValidate.aPIAddress" placeholder="请输入API接口地址"/>
                        </FormItem>
                        <FormItem label="父级菜单" prop="parentIdarr">
                            <Cascader v-bind:data="TreeArr"  @on-change="SelectParent" change-on-select
                                v-model="parentIdarr" placeholder="请选择父级菜单">
                            </Cascader>
                            <!-- <Input v-model="formValidate.ParentId" placeholder="请输入"/> -->
                        </FormItem>
                         <FormItem label="排序" prop="sort">
                            <InputNumber  v-model="formValidate.sort" placeholder="请输入排序"/>
                        </FormItem>
                        <FormItem label="备注" prop="memo">
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
import {RequestMenuByPage,ResponseMenuByAdd,RequestMenuTree} from '../../APIServer/Api.js';

export default {
  components:{PageView},
  name: 'HelloWorld',
  data () {
    return {
        info:JSON.parse(window.sessionStorage.userInfo),
        FormVisible:false,//Modal弹出框
        title:'添加菜单',
        IsEdit:false,//是编辑还是新增菜单
        columns2: 
        [
            {title: '菜单名称',key: 'name'},
            {title: '父节点',key: 'parentId',minWidth:80},
            {title: '路由地址',key: 'urlAddress'},
            {title: 'API接口',key: 'apiAddress'},
            {title: '排序',key: 'sort',},
            {title: '创建时间',key: 'createAts'},
            {title: '创建人',key: 'createdName'},
            {title: '操作',key: 'action',width: 140,
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
                            }
                    }, '删除')]);}
            }
        ],//列表表头
        MenuList:[],//列表存放后台返回的数据
        currentRow:'',//存放当前选中行的数据
        TreeArr: [],//级联选择器数组
        parentIdarr: [],//父级菜单已选中数组
        Search:{///搜索对象存放
            Name:'',
            frontRouter:'',
            apiUrl:'',
        },
        //添加字段
        formValidate: 
        {
            name: '',//菜单名称
            urlAddress: '',//前端配置的路由
            aPIAddress: '',//API接口
            parentId: '',//父级菜单
            sort: 0,//排序字段
            icon: '',//菜单图标
            memo: '',//备注
            createdId:'',
            createdName:'',
            isDrop:false,
        },
        //添加是字段校验
        ruleValidate: 
        {
            name: 
            [
                { required: true, message: '请填写菜单名称', trigger: 'blur' }
            ],
            urlAddress: 
            [
                { required: true, message: '请填写路由', trigger: 'blur' },
            ],
            aPIAddress: 
            [
                { required: true, message: '请填写API接口地址', trigger: 'blur' },
            ],
            // parentIdarr: 
            // [
            //     { required: true, message: '请选择父级菜单', trigger: 'blur' },
            // ],
        }
    }
  },
  mounted:function()
  {
      this.GetMenu();
      //this.tree(JSON.parse(window.sessionStorage.menus));//调用递归方法添加级联组件需要的属性
  },
  methods:{
      GetMenu:function()
      {
          var pageIndex=this.$refs.PageArr.pageIndex;//获取子组件中的属性
          var pageSize=this.$refs.PageArr.pagesize;//获取子组件中的属性
          var _this=this;
          RequestMenuByPage({PageIndex:pageIndex,PageSize:pageSize}).then(res=>
          {
            //   console.log(res.data.response.totalCount);
            //   console.log(res.data.response.data);
              _this.MenuList=res.data.response.data;
              _this.$refs.PageArr.Total=res.data.response.totalCount;
          })
      },
      //选择级联时获取value
      SelectParent(value,selectedData)
      {
          this.parentIdarr=selectedData;
          this.formValidate.parentId=value.pop();
          console.log(this.formValidate.parentId)
      },
      //单击表格选中的数据时
      CurrentRow:function(val)
      {
        //   this.currentRow=val;
        //   console.log(this.currentRow);
      },
      //点击添加按钮弹出对话框
      AddModal()
      {
            var _this=this;
            this.parentIdarr=[];
            this.TreeArr=[];
            this.formValidate=
            {
                name: '',//菜单名称
                urlAddress: '',//前端配置的路由
                aPIAddress: '',//API接口
                parentId: '',//父级菜单
                sort: 0,//排序字段
                icon: '',//菜单图标
                memo: '',//备注
                createdId:'',
                createdName:'',
                isDrop:false,
            },
            RequestMenuTree({userid:''}).then(
                res=>{
                _this.tree(res.data.response);
            })
            this.FormVisible=true;
      },

      handleSubmit (name) 
      {

        this.$refs.formValidate.validate((valid) => {
            if (valid)
            {
                var _this=this;
                let params=Object.assign({},this.formValidate);
                params.createdId=this.info.id;
                params.createdName=this.info.name;
                if(this.IsEdit)//true代表是编辑进来
                {
                    console.log('调用了编辑方法')
                }
                else //如果是编辑新增
                {   
                    ResponseMenuByAdd(params).then((res)=>
                    {
                        if(res.status==200)
                        {
                            _this.FormVisible=false;
                            if(res.data.result==200)
                            {
                                _this.$Message.success(res.data.message);
                                _this.GetMenu();
                            }
                            else
                            {
                                _this.$Message.success(res.data.message);
                            }
                            
                        }
                        else
                        {
                            _this.$Message.error('Fail!');
                        }
                    })
                }
            }
            else
            {
                this.$Message.error('参数有误，请重新填写');
            }
        })
      },
      //递归添加级联组件需要的属性
      tree(obj)
      {
          obj.label=obj.name;
          obj.value=obj.id;
          var crr = obj.children;
          //递归添加属性
          function test(crr){
                for(var i=0;i<crr.length;i++)
                {
                    crr[i].label=crr[i].name;
                    crr[i].value=crr[i].id;
                    var arr = crr[i].children
                    if(arr.length>0)
                    {
                        test(arr)
                    }
                }
          }
          if(crr.length>0){
            test(crr)
          }
        this.TreeArr.push(obj);
      },
  }
}
</script>

