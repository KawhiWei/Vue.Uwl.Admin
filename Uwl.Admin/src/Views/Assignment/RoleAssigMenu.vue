<!--角色分配菜单组件-->
<template>
    <div>
        <Row>
        <Col span="6" >
            <Card>
                <span slot="title" style="font-weight:bold;"> 
                    <span >角色权限</span>      
                    <span style="float:right">当前选中:
                        <span style="color:red;">{{roleName}}</span> 
                    </span>
                </span>
                <div @click="ss(index,role)" :key="role.id" v-for="(role,index) in RoleList" class="Man" :class="{Manbgcol:changebgcol == index }">
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
            randomMovieList: [],
            changebgcol: null,
            roleName:'',
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
       ss:function(index,item){
           var _this=this;
           console.log(item)
           _this.roleName=item.name
           _this.changebgcol = index;
       }
    }
}
</script>
<style scoped>
.Man{
    border: 1px solid #e8eaec;
    margin: 10px 0;
    padding: 5px ;
    cursor: pointer;
}
.Manbgcol{
    background: #6089d4;
    color: #fff;
}
</style>

