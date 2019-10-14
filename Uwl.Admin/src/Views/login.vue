<template>
  <div class="Bg-img">
    <div class="login">
      <div class="loginlogo"></div>
      <Form class="foms">
        <FormItem>
          <Input type="text" v-model="formInline.user" placeholder="Username">
            <Icon type="ios-person-outline" slot="prepend"></Icon>
          </Input>
        </FormItem>
        <FormItem>
          <Input type="password" v-model="formInline.password" placeholder="Password" @keyup.enter.native="handleSubmit()">
            <Icon type="ios-lock-outline" slot="prepend"></Icon>
          </Input>
        </FormItem>
        <FormItem>
          <Button
            type="primary"
            style="width:100%;"
            :loading="loading"
            @click="handleSubmit()"
          >{{LoadingTitle}}</Button>

          <Button type="primary" style="width:100%;" @click="SenMsg()">发送消息</Button>
        </FormItem>
      </Form>
    </div>
  </div>
</template>
<script>
import {
  RequestLogin,
  RequestUserInfo,
  RequestMenuTree
} from "../APIServer/Api.js";
import router from "../router";
import { filterAsyncRouterMap } from "../router/index.js";
import * as singnalR from "@aspnet/signalr";
export default {
  data() {
    return {
      formInline: {
        user: "test",
        password: "123456"
      },
      loading: false,
      LoadingTitle: "登录",
      connection: "",
      ruleInline: {
        user: [
          {
            required: true,
            message: "Please fill in the user name",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "Please fill in the password.",
            trigger: "blur"
          },
          {
            type: "string",
            min: 6,
            message: "The password length cannot be less than 6 bits",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    var _that = this;
    _that.connection = new singnalR.HubConnectionBuilder()
      .withUrl("/api/chatHub") //配置路由通道
      .configureLogging(singnalR.LogLevel.Information) //接受的消息
      .build(); //创建
    _that.connection.on("ReceiveMessage", function(user, message) {
      _that.$Message.error({ content: message + user, duration: 1 });
    });
    _that.connection.on("ReceiveUpdate", function(update) {
      _that.$Message.error({ content: update, duration: 1 });
      window.clearInterval(this.t);
    });
  },
  mounted() {
    this.getMsg();
  },

  methods: {
    handleSubmit() {
      var _this = this;
      var param = {
        user: _this.formInline.user,
        password: _this.formInline.password
      };
      RequestLogin(param).then(res => {
        _this.loading = true;
        if (res.data.success) {
          _this.$Notice.success({ title: "获取通行证成功" });
          _this.$store.commit("SaveToken", res.data.response.token);
          _this.GetUserInfo(res.data.response.token);
        } else {
          _this.loading = false;
          _this.$Notice.error({ title: "获取通行证失败" });
        }
      });
    },
    //根据Token获取用户信息
    GetUserInfo(tokens) {
      var _this = this;
      _this.LoadingTitle = "正在获取用户信息";
      // debugger
      RequestUserInfo({ token: tokens }).then(res => {
        if (res.data.success) {
          _this.$Notice.success({ title: "获取用户信息成功" });
          window.sessionStorage.setItem(
            "userInfo",
            JSON.stringify(res.data.response)
          ); //将用户信息写入到session缓存中
          _this.$store.commit("SaveUser", res.data.response);
          _this.LoadingTitle = "正在获取左侧菜单";
          RequestMenuTree({ userid: res.data.response.id }).then(res => {
              if(res.data.success)
              {
                  _this.$Notice.success({ title: "获取用户菜单成功，自动跳转至首页" });
                  var routeArr = res.data.response.children;
                  window.localStorage.setItem("router", JSON.stringify(routeArr));
                  routeArr = filterAsyncRouterMap(routeArr);
                  router.addRoutes(routeArr);
                  if (_this.$route.query.ReturnUrl) {
                    _this.$router.push(_this.$route.query.ReturnUrl);
                  } 
                  else
                  {
                    _this.$router.push("/");
                  }
              }
          });
        }
        else{
            _this.$Notice.error({ title: "获取用户信息失败" });
        }

        //_this.$router.push('/')
      });
    },
    SenMsg() {
      var msg = "我给你发送消息了！！！！";
      var username = "uwl";
      this.connection.invoke("SendMessage", username, msg).catch(function(err) {
        return console.error(err);
      });
    },
    getMsg() {
      var _that = this;
      _that.connection.start().then(() => {
        _that.connection.invoke("GetLatestCount", 1).catch(function(err) {
          return console.error(err);
        });
      });
    }
    //根据用户ID获取他的菜单
    // GetMenu(userId)
    // {
    //     _this.$router.replace(_this.$route.query.ReturnUrl?_this.$route.query.ReturnUrl:'/')
    // }
  }
};
</script>
<style>
.Bg-img {
  background: url(../assets/login-bg.jpg) no-repeat top left;
  background-size: cover;
  height: 100%;
  width: 100%;
  margin: 0px;
  position: absolute;
}
.Bg-img .login {
  width: 30%;
  height: 38%;
  background-color: white;
  position: relative;
  left: 48%;
  top: 20%;
  border-radius: 10px;
  right: 20%;
  opacity: 1;
  padding: 25px 30px 25px 50px;
}
.Bg-img .login .foms {
  width: 96%;
}

.Bg-img .login .loginlogo {
  width: 96%;
  height: 140px;
}
</style>
