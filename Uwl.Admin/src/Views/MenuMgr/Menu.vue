<template>
    <div>
        <div>
            <Row>
                <Button type="info"  @click="AddModal">添加</Button>
                <Button type="success">查看</Button>
                <Button type="warning">修改</Button>
                <Button type="error">删除</Button>
            </Row>
            <hr style="margin-top:5px;"/>
            <div>
                <Table width="100%" 
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
        columns2: 
        [
            {title: '菜单名称',key: 'name'},
            {title: '父节点',key: 'parentId'},
            {title: '路由地址',key: 'urlAddress'},
            {title: 'API接口',key: 'apiAddress'},
            {title: '排序',key: 'sort',},
            {title: '创建时间',key: 'createAts'},
            {title: '创建人',key: 'createdName'},
            {title: '操作',key: 'action',width: 180,
            render: (h, params) => {
                                return h('div', [
                                    h('Button', {
                                        props: {
                                            type: 'text',
                                            size: 'small'
                                        }
                                    }, 'View'),
                                    h('Button', {
                                        props: {
                                            type: 'text',
                                            size: 'small'
                                        }
                                    }, 'Edit')]);}
                        }
        ],//列表表头
        MenuList:[],//列表存放后台返回的数据
        currentRow:'',//存放当前选中行的数据
        TreeArr: [],//级联选择器数组
        parentIdarr: [],//父级菜单已选中数组
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
            Name: 
            [
                { required: true, message: '请填写菜单名称', trigger: 'blur' }
            ],
            UrlAddress: 
            [
                { required: true, message: '请填写路由', trigger: 'blur' },
            ],
            APIAddress: 
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
          this.currentRow=val;
          console.log(this.currentRow);
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
                ResponseMenuByAdd(params).then((res)=>
                {
                    if(res.status==200)
                    {
                        _this.FormVisible=false;
                        _this.$Message.success(res);
                    }
                    else
                    {
                        _this.$Message.error('Fail!');
                    }
                })
            }
            else
            {
                this.$Message.error('Fail!');
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

