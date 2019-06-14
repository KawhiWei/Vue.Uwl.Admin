<template>
<div class="layout  Font_size">
    <div class="Headers">
      <template>
        <div>
          <Row>
            <Col span="23" style="height:80px;">
            <img src="../assets/Logos.png" alt="">
            </Col>
            <Col span="1">
              <Dropdown placement="bottom-start">
                <span>
                  <div class="demo-avatar">
                    <Avatar src="https://i.loli.net/2017/08/21/599a521472424.jpg" shape="circle"  />
                  </div>
                </span>
                <DropdownMenu slot="list">
                  <DropdownItem>个人资料</DropdownItem>
                  <DropdownItem>修改密码</DropdownItem>
                  <DropdownItem @click.native="logOut">登出</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </Col>
          </Row>
        </div>
      </template>
    </div>
    <div class="Content">
      <template>
        <Row>
          <div>
            <div style="float:left;width:auto;">
            <Menu @on-select="OpenTags">
              <!---------active-name     当前激活菜单的 name 值  ,:open-names="['2']"    当前打开的第几个菜单    -------------->
              <SidebarMenu v-for="menus in routerMenu" :name="menus.id" :key="menus.id" :item="menus"/>
            </Menu>
            </div>
              <!---------active-name     当前激活菜单的 name 值  ,:open-names="['2']"    当前打开的第几个菜单    
              <Menu active-name="3-1" :open-names="['3']">
                  <MenuItem name="1-1">
                  <Icon type="md-home" />
                  个人主页
                  </MenuItem>
                <Submenu name="2">
                  <template slot="title">
                      <Icon type="ios-filing" />
                      Navigation Two
                  </template>
                  <MenuItem name="2-1">Option 5</MenuItem>
                  <MenuItem name="2-2">Option 6</MenuItem>
                  <Submenu name="3">
                      <template slot="title">Submenu</template>
                      <MenuItem name="3-1">Option 7</MenuItem>
                      <MenuItem name="3-2">Option 8</MenuItem>
                  </Submenu>
                </Submenu>
              </Menu>-------------->
            <!----右侧Tabs标签页------>
            <Col span="24" :class="collapsed?'content-collapsed':'content-expanded'">
              <div style="margin:5px 5px;">
                <Tag type="dot" color="primary" :key="item.id"  :name="item.path" :closable="item.IsColse"  v-for=" item in TagsList" @on-close="handleCloseTags">
                  <router-link :to="item.path" style="color:#000" ><Icon type="md-home" />{{item.lable}}</router-link>
                  </Tag>              
              </div>
              <div style="margin:10px;">
                <router-view></router-view>
              </div>
            </Col>
          </div>
        </Row>
      </template>
    </div>
</div>
</template>

<script>
import {RequestMenuTree} from '../APIServer/Api.js';
import SidebarMenu from '@/components/SidebarMenu.vue'
export default {
  components:{SidebarMenu},
  name: 'customLayout',
  data () {
    return {
      info:JSON.parse(window.sessionStorage.userInfo),
      routerMenu:[],
      collapsed: false,
    }
  },
  mounted()
  {
     this.GetMenu(this.info.id)
  },
  methods:{
      GetMenu(userId)
      {
        var _this=this;
        RequestMenuTree({userid:userId}).then(
        res=>{
          _this.routerMenu=res.data.response.children;
          window.sessionStorage.setItem('menus',JSON.stringify(_this.routerMenu));
        })
      },
      logOut()
      {
        this.$router.push('/login');
      },
      //点击菜单添加Tags标签页
      OpenTags(e)
      {
        var _this=this;
        var IsFlag=false;
        if(e!=null)
        {
          for (var i = 0; i < this.$store.state.TagList.length; i++) {
            if(e==this.$store.state.TagList[i].path)
            {
              this.turnToRoute(this.$store.state.TagList[i].path);//路由跳转
              IsFlag=true;
            }
          }
          if(!IsFlag)
          {
            var arr=_this.routerMenu;
            tree(arr);//调用递归方法添加tags标签
            function tree(arr)
            {
              for (let i = 0; i < arr.length; i++) {
                if(e==arr[i].path)
                {
                  var model={id:arr[i].id,lable:arr[i].name,path:e,IsColse:true};
                  _this.$store.commit("SaveTags",model)
                  _this.turnToRoute(e);
                }
                else
                {
                  if(arr[i].children.length>0)
                  {
                    tree(arr[i].children);
                  }
                  else{
                    continue;
                  }
                }
                
              }
            }
          }
        }
        else{
          this.$Message.error('路由地址不正确，请配置路由地址!');
        }
      },
      //关闭Tags标签
      handleCloseTags(event,name)
      {
        for (let i = 0; i < this.$store.state.TagList.length; i++) {
          if(name==this.$store.state.TagList[i].path)
          {
            this.$store.state.TagList.splice(i,1);
            this.turnToRoute(this.$store.state.TagList[i-1].path);//路由跳转
          }         
        }
      },
      turnToRoute(path)
      {
        this.$router.push({path:path});
      }
  },
  watch:{

  },
  //监听Vuex仓库中的tags数组
  computed:{
    TagsList()
    {
      return this.$store.state.TagList;
    }
  }
}
</script>

<style>
.Font_size
{
  font-size: 14px;
  font-family:arial;
}
.Headers{
  /* border: 1px red solid;
  height: 80px; */
  background:#6089d4;
}
.content-expanded{
    max-width: calc(100% - 245px);
    max-height: calc(100% - 80px);
}
</style>
