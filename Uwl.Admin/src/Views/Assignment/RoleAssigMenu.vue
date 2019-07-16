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
                <div @click="RoleAssig(index,role)" :key="role.id" v-for="(role,index) in RoleList" class="Man" :class="{Manbgcol:changebgcol == index }">
                    <span>{{role.name}}</span>
                </div>
            </Card>
        </Col>
        <Col span="18">
            <Card>
                <Tree :data="randomMovieList" @on-check-change="SelectChecked" show-checkbox :render="renderContent">

                </Tree>
            </Card>
        </Col>
    </Row>
    </div>
</template>

<script>
import {RoleAssigGetAllRole,RequestGetAllRole} from '../../APIServer/Api.js';
export default {
    name:'RoleAssigMenu',//角色分配菜单组件
    data(){
        return {
            RoleList: [],
            randomMovieList: [],
            changebgcol: null,
            roleName:'',
            selectlist: ['653d408b-817c-45a9-2c83-08d709986660'],
        }
    },
    mounted:function()
    {
        this.GetRoleList();
    },  
    methods:
    {
       //获取所有的角色
       GetRoleList:function()
       {
           var _this=this;
           RequestGetAllRole({}).then(res=>{
               _this.RoleList=res.data.response.data;
               
           })
       },
       //获取所有的菜单和按钮
       RoleAssig:function(index,item){
            var _this=this;
            RoleAssigGetAllRole({roleId:item.id}).then(res=>{
               _this.treeRecursion(res.data.response.children);
            })
           _this.roleName=item.name
           _this.changebgcol = index;
       },
       SelectChecked(item)
       {
           console.log(item);
       },
       //tree组件渲染自定义视图
       renderContent(h, { root, node, data })
       {
            return h(
                'span',{
                    style:{
                        width:'100%'
                    }
                },
                [
                    h('span',[h('span',data.title),]),//加载每条数据的title
                    //加载子级自定义内容
                    h(
                        'span',{style:{display:"inline-block",float:"right",marginRight: "32px"}},//定义样式和边距
                        [
                            h
                            (
                                "CheckboxGroup",
                                {
                                    props:{value:this.selectlist},
                                    on:{"on-change":event=>{
                                        console.log(event)
                                        this.selectlist=event;
                                        }}
                                },//定义一个复选框数组
                                (data.buttonsList||[]).map(
                                    obj=>{return h("Checkbox",{props:{label:obj.id}},obj.lable
                                )})//渲染出复选框数组下面的所有子级
                            )
                        ]
                    
                    )
                ]
            );
       },
       //递归方法
       treeRecursion(obj)
       {
           var crr=obj; 
           function tree(crr) {
               crr.forEach(element => {
                   element.checked=element.ischecked;
                    var arr=element.children;
                   if(arr.length>0)
                   {
                       tree(arr);
                   }


               }); 
            //    (var i = 0; i < crr.length; i++) {
            //        crr[i].checked=crr[i].ischecked;
            //        var arr=crr[i].children;
            //        if(arr.length>0)
            //        {
            //            tree(arr);
            //        }
            //    }
           }
           tree(crr)
           console.log(obj);
           this.randomMovieList=obj;
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

