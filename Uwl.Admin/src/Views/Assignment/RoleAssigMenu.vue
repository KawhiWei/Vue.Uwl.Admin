<!--角色分配菜单组件-->
<template>
    <div>
        <Row>
        <Col span="6" >
            <Card>
                <p slot="title">角色权限</p>
                <div style="border:1px red solid" @click="ss" :key="role.id" v-for="role in RoleList">
                    <span>{{role.name}}</span>
                </div>
            </Card>
        </Col>
        <Col span="18" style="color:green">
            <Card>
                <Tree  show-checkbox></Tree>
            </Card>
        </Col>
    </Row>
    </div>
</template>

<script>
import {RoleAssigGetAllRole} from '../../APIServer/Api.js';
export default {
    name:'RoleAssigMenu',//角色分配菜单组件
    data(){
        return {
            RoleList: [],
            randomMovieList: []
        }
    },
    mounted:function()
    {
        this.GetRoleList();
    },  
    methods:
    {
       GetRoleList:function()
       {
           var _this=this;
           RoleAssigGetAllRole({}).then(res=>{
               _this.RoleList=res.data.response.data;
           })
       },
       ss:function()
       {

       }
    }
}
</script>
<style scoped>

</style>

