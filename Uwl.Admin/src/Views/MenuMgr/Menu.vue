<template>
    <div class="margin-top:50px;">
        <Row>
            <Button type="info">添加</Button>
            <Button type="success">查看</Button>
            <Button type="warning">修改</Button>
            <Button type="error">删除</Button>
        </Row>
        <div>
            <PageView/>
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
      MenuList:[],
    }
  },
  mounted:function()
  {
      this.GetMenu();
  },
  methods:{
      GetMenu:function()
      {
          RequestMenuByPage({PageIndex:1,PageSize:20}).then(res=>
          {
              console.log(res.data.response.totalCount);
              console.log(res.data.response.data);
          })
      }
  }
}
</script>

