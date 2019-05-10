<template>
    <div>
        <div>
            <Row>
                <Button type="info"  @click="FormVisible = true">添加</Button>
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
                        <FormItem label="菜单名称" prop="Name">
                            <Input v-model="formValidate.Name" placeholder="请输入菜单名称"/>
                        </FormItem>
                        <FormItem label="路由地址" prop="UrlAddress">
                            <Input v-model="formValidate.UrlAddress" placeholder="请输入前端路由地址"/>
                        </FormItem>
                         <FormItem label="API接口地址" prop="APIAddress">
                            <Input v-model="formValidate.APIAddress" placeholder="请输入API接口地址"/>
                        </FormItem>
                        <FormItem label="父级菜单" prop="ParentId">
                            <Cascader v-bind:data="TreeArr" 
                                v-model="ParentId" placeholder="请选择父级菜单">
                            </Cascader>
                            <!-- <Input v-model="formValidate.ParentId" placeholder="请输入"/> -->
                        </FormItem>
                         <FormItem label="排序" prop="Sort">
                            <InputNumber  v-model="formValidate.Sort" placeholder="请输入排序"/>
                        </FormItem>
                        <FormItem label="备注" prop="Memo">
                            <Input v-model="formValidate.Memo" placeholder="请输入备注"/>
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
import {RequestMenuByPage} from '../../APIServer/Api.js';

export default {
  components:{PageView},
  name: 'HelloWorld',
  data () {
    return {
        info:JSON.parse(window.sessionStorage.userInfo),
        FormVisible:false,
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
                    ],
        MenuList:[],//存放后台返回的数据
        currentRow:'',//存放当前选中行的数据
        value2: ['jiangsu', 'suzhou', 'zhuozhengyuan'],//有默认值的
        TreeArr: [],
        formValidate: 
        {
            Name: '',//菜单名称
            UrlAddress: '',//前端配置的路由
            APIAddress: '',//API接口
            ParentId: '',//父级菜单
            Sort: 0,//排序字段
            Icon: '',//菜单图标
            Memo: ''//备注
        },
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
            ParentId: 
            [
                { required: true, message: '请选择父级菜单', trigger: 'blur' },
            ],
        }
    }
  },
  mounted:function()
  {
      this.GetMenu();
      this.tree(JSON.parse(window.sessionStorage.menus));//调用递归方法添加级联组件需要的属性
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
      //单击表格选中的数据时
      CurrentRow:function(val)
      {
          this.currentRow=val;
          console.log(this.currentRow);
      },
      handleSubmit (name) 
      {
        this.$refs[name].validate((valid) => {
            if (valid)
            {
                this.$Message.success('Success!');
            }
            else
            {
                this.$Message.error('Fail!');
            }
        })
      },
      //递归添加级联组件需要的属性
      tree(arr)
      {
        for(let i = 0; i < arr.length; i++)
        {
            if(arr[i].children.length>0)
            {
                arr[i].label=arr[i].name;
                arr[i].value=arr[i].id;
                this.tree(arr[i].children);
            }
            else
            {
                arr[i].label=arr[i].name;
                arr[i].value=arr[i].id;
            }
        }
        this.TreeArr=arr;
     }   
  }
}
</script>

