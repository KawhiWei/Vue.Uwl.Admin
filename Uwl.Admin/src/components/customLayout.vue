<template>
<div class="layout  Font_size">
    <div class="Headers">
      <template>
        <div>
          <Row>
            <Col span="22" style="height:80px;" class="TopClass">
              <H2 style="color:white;line-height: 80px;padding-left: 30px;">Uwl.Core.Admin</H2>
            </Col>
            <Col span="2" style="color:white;line-height:80px;">
              <Dropdown placement="bottom-start">
                <span>
                  <div class="demo-avatar">
                    <Avatar src="https://i.loli.net/2017/08/21/599a521472424.jpg" size="large" />
                  </div>
                </span>
                <DropdownMenu slot="list">
                  <DropdownItem @click.native="PersonalSetting">个人资料</DropdownItem>
                  <DropdownItem @click.native="goGithub">Github源码</DropdownItem>
                  <DropdownItem @click.native="logOut">登出</DropdownItem>
                </DropdownMenu>
              </Dropdown>
              <span style="font-size:23px;padding-left: 13px;">{{info.name}}</span>
            </Col>
          </Row>
        </div>
      </template>
    </div>
    <div class="Content">
      <template>
        <Row>
          <div>
            <Col span="3" class="left-menu" >
            <!-- <Scroll> -->
              <Menu :theme="themeStyle" @on-select="OpenTags" :active-name="$route.path" width="auto">
                <!---------active-name     当前激活菜单的 name 值  ,:open-names="['2']"    当前打开的第几个菜单    -------------->
                <SidebarMenu v-for="menus in routerMenu" :name="menus.id" :key="menus.id" :item="menus"/>
              </Menu>
            <!-- </Scroll> -->
            </Col>
            <!----右侧Tabs标签页------>
            <Col span="21" :class="collapsed?'content-collapsed':'content-expanded'">
              <div class="Tags" style="background-color:#e7e7e9;overflow: hidden !important;">
                <!-- -->
                <ul>
                  <li class="Tags-li" v-for=" item in TagsList"   :key="item.id" >
                    <Icon class="Tags-li-icon" type="md-radio-button-on" style="color:#1c97f5;font-size:18px;" v-if="item.path==$route.path"/>
                    <router-link style="color:#000" :to="item.path">
                      <!-- <Icon type="md-home" /> -->
                      {{item.lable}}</router-link>
                      <Icon class="Tags-li-icon" @click="handleCloseTags(item.path)" style="font-size:15px;" type="md-close" v-if="item.IsColse"/>
                  </li>
                </ul>
                <!-- <Tag style="margin:5px;" type="dot" :color="item.path==$route.path?'primary':'default'" :key="item.id"  :name="item.path"
                :closable="item.IsColse"  v-for=" item in TagsList" @on-close="handleCloseTags">
                  <router-link :to="item.path" style="color:#000" ><Icon type="md-home" />{{item.lable}}</router-link>
                  </Tag> -->
              </div>
              <div style="margin:8px 10px 0px 10px;">
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
      Maxheight:500,
      info:JSON.parse(window.sessionStorage.userInfo),
      routerMenu:[],
      collapsed: false,
      token:window.sessionStorage.getItem('Token')?window.sessionStorage.getItem('Token'):'',
      connection: "",
      themeStyle:'dark'
    }
  },
  mounted()
  {
      var _this=this;
      var h=window.innerHeight-150;
      this.Maxheight=h;
      this.$store.commit("SaveTags","");
      this.$store.commit("SaveTags",{id:'1',lable:'个人主页',path:'/PlatformHome',IsColse:false});
      var _this=this;
      {
        var getroute=this.$route;
        //刷新页面之前先判断当前路由是否存在Tags中，如果存在直接跳出循环,不存在则添加到Tags中
        for (var i = 0; i < this.$store.state.TagList.length; i++)
        {
            if(getroute.path==this.$store.state.TagList[i].path)
            {
              break;
            }
            else
            {
              var model={id:'2',lable:getroute.name,path:getroute.path,IsColse:true};
              _this.$store.commit("SaveTags",model)
            }
        }
      }
      if(window.localStorage.router)
      {

        var arr=JSON.parse(window.localStorage.router);
        if(arr.length>=0)
        {
          this.routerMenu=arr;
        }
      }
      else
      {
        this.turnToRoute('/login')
      };
  },
  methods:{
      logOut()
      {
        this.$store.commit("SaveToken","");
        window.sessionStorage.setItem('Token',"");
        window.localStorage.setItem('router',"");
        this.$store.commit("SaveTags","")
        this.$router.push('/login');
      },
      //跳转的个人信息界面
      PersonalSetting()
      {
        var _this=this;
        _this.OpenTags('/PersonalSetting/PersonalCenter')
      },
      //Github主页
      goGithub()
      {
        window.open("https://github.com/GeorGeWzw")
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
      handleCloseTags(name)
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
      },
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
.layout{
  height: 100% !important;
}
.Font_size
{
  font-size: 14px;
  font-family:arial;
}
.Headers{
  /* border: 1px red solid;
  height: 80px; */
  background:#515a6e;
}
.content-expanded{
     /* max-width: calc(100% - 240px); */
    max-height: calc(100% - 80px);
}
.Content {
  height: 100% !important;
}
.ivu-row{
  height: 100%!important;
}
.left-menu{
  height: 100% !important;
}
.ivu-menu{
  height: 100% !important;
}
.ivu-menu-submenu-title{
  color: white !important;
}
.ivu-menu-item{
  color: white !important;
}
.Tags{
  box-shadow:2px 2px 5px #c1c1c1;
}
.Tags ul{
  box-sizing: border-box;
  width: 100%;height: 100%;
  padding: 0;
  margin: 0;
}
.Tags-li{
  float: left;
  height: 26px;
  border-radius: 3px;
  line-height: 26px;
  margin: 5px;
  white-space: nowrap;
  font-size: 13px;
  padding: 1px 10px 4px 10px;
  border: 1px solid #bdbebf;
  color: #000;
  vertical-align: middle;
  background: white;
  overflow: hidden;
  -webkit-transition: all .3s ease-in;
  transition: all .3s ease-in;
}
.Tags-li-icon{
  cursor: pointer;
  margin-bottom: 5px !important;
}
</style>
