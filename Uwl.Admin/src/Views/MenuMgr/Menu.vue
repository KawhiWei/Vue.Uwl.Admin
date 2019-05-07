<template>
    <div class="margin-top:50px;">
        <Row>
            <Button type="info">添加</Button>
            <Button type="success">查看</Button>
            <Button type="warning">修改</Button>
            <Button type="error">删除</Button>
        </Row>
        <div>
            <Table  border :columns="columns2" :data="MenuList"></Table>
        </div>
        <div style="padding:5px;">
            <PageView v-on:pageref="GetMenu" ref="PageArr"/>
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
      columns2: 
      [
        {title: '菜单名称',key: 'name',width: 150,},
        {title: '父节点',key: 'parentId',width: 300},
        {title: '路由地址',key: 'urlAddress',width: 150},
        {title: 'API接口',key: 'apiAddress', width: 150},
        {title: '排序',key: 'sort',width: 100,},
        {title: '创建时间',key: 'createdDate',width: 150,},
        {title: '创建人',key: 'createdName',width: 100,},
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
    }
  },
  mounted:function()
  {
      this.GetMenu();
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
      }
  }
}
</script>

