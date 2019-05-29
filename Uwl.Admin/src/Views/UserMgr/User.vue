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
               <!--  <Table width="100%" border :loading="loading"
                show-header
                highlight-row
                @on-current-change="CurrentRow"
                :columns="columns2" :data="MenuList"></Table>
                <Spin size="large"> 加载中</Spin> -->
            </div>
            <div style="padding:5px;">
                <PageView v-on:pageref="GetUser" ref="PageArr"/>
            </div>
        </div>
    </div>
</template>

<script>
import PageView from '@/components/Page.vue'
export default {
    name:'User',
    components:{PageView},
    data(){
        return {
            Search:{
                name:'',
                accont:'',
                AccontState:'',
            }
        }
    },
    methods:{
        search:function()
        {

        },
        GetUser:function()
        {

        },
        AddModal:function() {
            
        }
    }
}
</script>
