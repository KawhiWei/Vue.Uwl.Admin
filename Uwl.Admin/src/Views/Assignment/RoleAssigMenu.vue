<!--角色分配菜单组件-->
<template>
    <div>
        <Row>
        <Col span="6" >
            <Card>
                <span slot="title" style="font-weight:bold;"> 
                    <span >角色列表</span>      
                    <span style="float:right">当前选中:
                        <span style="color:red;">{{roleRow.name}}</span> 
                    </span>
                </span>
                <div @click="RoleAssig(index,role)" :key="role.id" v-for="(role,index) in RoleList" class="Man" :class="{Manbgcol:changebgcol == index }">
                    <span>{{role.name}}</span>
                </div>
            </Card>
        </Col>
        <Col span="18">
            <Card>
                <div><Button  type="primary" @click="Gets">保存修改</Button></div>
                <Tree :data="randomMovieList" ref="mm" @on-check-change="SelectChecked" show-checkbox :render="renderContent">
                </Tree>
            </Card>
        </Col>
    </Row>
    </div>
</template>

<script>
import {RoleAssigGetAllRole,RequestGetAllRole,ResponseRoleAssigBySave} from '../../APIServer/Api.js';
export default {
    name:'RoleAssigMenu',//角色分配菜单组件
    data(){
        return {
            RoleList: [],
            randomMovieList: [],
            changebgcol: null,
            roleRow:{},
            selectlist: [],
            info: JSON.parse(window.sessionStorage.userInfo),
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
           _this.roleRow=item
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
           var _this=this;
           var crr=obj; 
           function tree(crr) {
               crr.forEach(element => {
                   element.checked=element.ischecked;
                   if(element.buttonsList.length>0)
                   {
                       var btnarr=element.buttonsList;
                       btnarr.forEach(arr=>{
                           if(arr.ischecked)
                           {
                               _this.selectlist.push(arr.id);
                           }
                       });
                   }
                   var arr=element.children;
                   var Ischeck=[];
                   arr.forEach(element => {
                       if(element.ischecked)
                        {
                            Ischeck.push(element);
                        }
                   });
                   if(Ischeck.length<arr.length)
                   {
                       element.checked=false;
                   }
                   if(arr.length>0)
                   {
                       tree(arr);
                   }
               }); 
           }
           tree(crr)
           _this.randomMovieList=obj;
       },
       Gets()
       {
           console.log(this.roleRow.id);
           var btn=JSON.stringify(this.selectlist);
           var menus=JSON.stringify(this.$refs.mm.getCheckedAndIndeterminateNodes());
           var param={RoleId:this.roleRow.id,menuIds:menus,BtnIds:btn,CreatedId:this.info.id,CreatedName:this.info.name};
           console.log(param)
           ResponseRoleAssigBySave(param).then(res=>{
               console.log(res.data)
           })
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

