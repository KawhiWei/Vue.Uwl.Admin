<template>
  <div class="Bg-img">
    <div class="landscape">
    <div id="extwaiimpotscp"	style="display:none" v="{e3d1" f="ZTJVelpERXdOREJrTFdWaE1XVXRORE16TnkxaU5URmlMVGxtTXpVek9ERTNNVGcwWm4wPQ==" q="96ba1cd6" c="322.1" i="326.0" u="2.654" s="19120923" w="false" m="BMe=" vn="0trpt">
	  </div>
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
          <!-- <Button type="primary" style="width:100%;" @click="SenMsg()">发送消息</Button> -->
        </FormItem>
      </Form>
    </div>
    </div>
    <div class="filter">
    </div>
    <canvas id="canvas" width="1920" ref="canvasbg" height="930"></canvas>
  </div>
</template>
<script>
import {
  RequestLogin,
  RequestUserInfo,
  RequestMenuTree
} from "../APIServer/Api.js";
import axios from 'axios' //在APi访问接口引入Vuex
import router from "../router";
import * as singnalR from "@aspnet/signalr";
import { filterAsyncRouterMap } from "../router/index.js";

export default {
  data() {
    return {
      formInline: {
        user: "test",
        password: "123456"
      },
      loading: false,
      LoadingTitle: "登录",
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
      },
      connection: "",
      ctx:'',//canvas 使用
      WIDTH:930,
	    HEIGHT:1910,
	    mouseMoving : false,
	    mouseX:0,
	    mouseY:0,
	    stars : [],
	    initStarsPopulation : 80,
	    dots : [],
	    dotsMinDist :2,
	    maxDistFromCursor :50,
    };
  },

  mounted() {

  },
  created() {
var _that = this;
{
function Star(id, x, y){
	this.id = id;
	this.x = x;
	this.y = y;
	this.r = Math.floor(Math.random()*2)+1;
	var alpha = (Math.floor(Math.random()*10)+1)/10/2;
	this.color = "rgba(255,255,255,"+alpha+")";
}

Star.prototype.draw = function() {
	_that.ctx.fillStyle = this.color;
	_that.ctx.shadowBlur = this.r * 2;
	_that.ctx.beginPath();
	_that.ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
	_that.ctx.closePath();
	_that.ctx.fill();
}

Star.prototype.move = function() {
	this.y -= .15;
	if (this.y <= -10) this.y = _that.HEIGHT + 10;
	this.draw();
}

Star.prototype.die = function() {
    _that.stars[this.id] = null;
    delete _that.stars[this.id];
}


function Dot(id, x, y, r) {
	this.id = id;
	this.x = x;
	this.y = y;
	this.r = Math.floor(Math.random()*5)+1;
	this.maxLinks = 2;
	this.speed = .5;
	this.a = .5;
	this.aReduction = .005;
	this.color = "rgba(255,255,255,"+this.a+")";
	this.linkColor = "rgba(255,255,255,"+this.a/4+")";

	this.dir = Math.floor(Math.random()*140)+200;
}
Dot.prototype.draw = function() {
	_that.ctx.fillStyle = this.color;
	_that.ctx.shadowBlur = this.r * 2;
	_that.ctx.beginPath();
	_that.ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
	_that.ctx.closePath();
	_that.ctx.fill();
}
Dot.prototype.link = function() {
	if (this.id == 0) return;
	var previousDot1 = getPreviousDot(this.id, 1);
	var previousDot2 = getPreviousDot(this.id, 2);
	var previousDot3 = getPreviousDot(this.id, 3);
	if (!previousDot1) return;
	_that.ctx.strokeStyle = this.linkColor;
	_that.ctx.moveTo(previousDot1.x, previousDot1.y);
	_that.ctx.beginPath();
	_that.ctx.lineTo(this.x, this.y);
	if (previousDot2 != false) _that.ctx.lineTo(previousDot2.x, previousDot2.y);
	if (previousDot3 != false) _that.ctx.lineTo(previousDot3.x, previousDot3.y);
	_that.ctx.stroke();
	_that.ctx.closePath();
}
function getPreviousDot(id, stepback) {
	if (id == 0 || id - stepback < 0) return false;
	if (typeof _that.dots[id - stepback] != "undefined") return _that.dots[id - stepback];
	else return false;//getPreviousDot(id - stepback);
}
Dot.prototype.move = function() {
	this.a -= this.aReduction;
	if (this.a <= 0) {
		this.die();
		return
	}
	this.color = "rgba(255,255,255,"+this.a+")";
	this.linkColor = "rgba(255,255,255,"+this.a/4+")";
	this.x = this.x + Math.cos(degToRad(this.dir))*this.speed,
	this.y = this.y + Math.sin(degToRad(this.dir))*this.speed;

	this.draw();
	this.link();
}
Dot.prototype.die = function() {
    _that.dots[this.id] = null;
    delete _that.dots[this.id];
}
_that.$nextTick(function()
{
  var canvas  = document.getElementById('canvas');
	_that.ctx = canvas.getContext('2d');
setCanvasSize();
init();
})
function setCanvasSize() {
	_that.WIDTH = document.documentElement.clientWidth,
    _that.HEIGHT = document.documentElement.clientHeight;

	canvas.setAttribute("width", _that.WIDTH);
	canvas.setAttribute("height", _that.HEIGHT);
}
function init() {
	_that.ctx.strokeStyle = "white";
	_that.ctx.shadowColor = "white";
	for (var i = 0; i < _that.initStarsPopulation; i++) {
		_that.stars[i] = new Star(i, Math.floor(Math.random()*_that.WIDTH), Math.floor(Math.random()*_that.HEIGHT));
		//stars[i].draw();
	}
	_that.ctx.shadowBlur = 0;
	animate();
}
function animate() {
    _that.ctx.clearRect(0, 0, _that.WIDTH, _that.HEIGHT);

    for (var i in _that.stars) {
    	_that.stars[i].move();
    }
    for (var i in _that.dots) {
    	_that.dots[i].move();
    }
    drawIfMouseMoving();
    requestAnimationFrame(animate);
}
window.onmousemove = function(e){
	_that.mouseMoving = true;
	_that.mouseX = e.clientX;
	_that.mouseY = e.clientY;
	clearInterval(_that.mouseMoveChecker);
	_that.mouseMoveChecker = setTimeout(function() {
		_that.mouseMoving = false;
	}, 100);
}
function drawIfMouseMoving(){
	if (!_that.mouseMoving) return;

	if (_that.dots.length == 0) {
		_that.dots[0] = new Dot(0, _that.mouseX, _that.mouseY);
		_that.dots[0].draw();
		return;
	}
	var previousDot = getPreviousDot(_that.dots.length, 1);
	var prevX = previousDot.x;
	var prevY = previousDot.y;
	var diffX = Math.abs(prevX - _that.mouseX);
	var diffY = Math.abs(prevY - _that.mouseY);
	if (diffX < _that.dotsMinDist || diffY < _that.dotsMinDist) return;
	var xVariation = Math.random() > .5 ? -1 : 1;
	xVariation = xVariation*Math.floor(Math.random()*_that.maxDistFromCursor)+1;
	var yVariation = Math.random() > .5 ? -1 : 1;
	yVariation = yVariation*Math.floor(Math.random()*_that.maxDistFromCursor)+1;
	_that.dots[_that.dots.length] = new Dot(_that.dots.length, _that.mouseX+xVariation, _that.mouseY+yVariation);
	_that.dots[_that.dots.length-1].draw();
	_that.dots[_that.dots.length-1].link();
}
function degToRad(deg) {
	return deg * (Math.PI / 180);
}
}











    // debugger
    // _that.connection = new singnalR.HubConnectionBuilder()
    //   .withUrl("https://www.baiclouds.top/signalr") //配置路由通道
    //   .configureLogging(singnalR.LogLevel.Information) //接受的消息
    //   .build(); //创建
    // this.StartSignalR();
    // //接收别人发过来的消息
    // _that.connection.on("ReceiveMessage", function(user, message) {
    //   _that.$Message.error({ content: message + user, duration: 1 });
    // });
    // //接收服务端主动向客户端发起数据
    // _that.connection.on("ReceiveUpdate", function(update) {
    //   debugger
    //   _that.$Message.error({ content: update, duration: 1 });
    //   window.clearInterval(this.t);
    // });





  },
  methods: {
    handleSubmit() {
      var _this = this;
      var param = {
        user: _this.formInline.user,
        password: _this.formInline.password
      };
      _this.$Notice.success({ title: "正在获取通行证" });
      _this.loading = true;
      RequestLogin(param).then(res => {
        if (res.data.success) {
          _this.$Notice.success({ title: "获取通行证成功" });
          _this.$store.commit("SaveToken", res.data.response.token);
          _this.GetUserInfo(res.data.response.token);
        } else {
          _this.loading = false;
          _this.$Notice.error({ title: res.data.msg});
        }
      });
    },
    //根据Token获取用户信息
    GetUserInfo(tokens) {
      var _this = this;
      _this.LoadingTitle = "正在获取用户信息";
      RequestUserInfo({ token: tokens }).then(res => {
        if (res.data.success) {
          _this.$Notice.success({ title: "获取用户信息成功" });
          window.sessionStorage.setItem(
            "userInfo",
            JSON.stringify(res.data.response)
          );
          //将用户信息写入到Vuex缓存中
          _this.$store.commit("SaveUser", res.data.response);
          _this.LoadingTitle = "正在获取左侧菜单";
          RequestMenuTree({ userid: res.data.response.id }).then(res => {
              if(res.data.success)
              {
                  //_this.CreateSignalRConnection(tokens);//创建SignalR连接
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
              else
              {
                _this.$Notice.warning({ title: res.data.msg });
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
      this.connection.invoke("SendMessage", username, msg,"121545","1212112").catch(function(err) {
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
    },
    CreateSignalRConnection(token)
    {
        // console.log(process.env.NODE_ENV)
        var url = process.env.NODE_ENV === 'production' ? '/api2/chatHub' :'/api2/chatHub';
        var _that=this;
        _that.connection = new singnalR.HubConnectionBuilder()
          .withUrl(url,{ accessTokenFactory: () => token }) //配置路由通道
          .configureLogging(singnalR.LogLevel.Information) //接受的消息
          .build(); //创建
        _that.StartSignalR();//开始连接SignalR
    },
    StartSignalR() {
        var _that = this;
        _that.connection.start().then(() => {
          _that.connection.invoke("GetLatestCount", 1).catch(function(err) {
            return console.error(err);
          });
        });
        _that.$store.commit("SaveSignalRconnection", _that.connection);
    },

  }
};

</script>

<style scoped>
.Bg-img {
  margin:0;
	overflow:hidden;
	width:100%;
	height:100%;
	background:black;
	background:linear-gradient(to bottom,#000000 0%,#5788fe 100%);
}
.landscape {
position: absolute;
bottom: 0px;
left: 0;
width: 100%;
height: 100%;
background: url(../assets/xkbg.png) no-repeat top left;
background-size: 1000px 250px;
background-repeat: repeat-x;
background-position: center bottom;
}
.filter{
  width:100%;
	height:100%;
	position:absolute;
	top:0;
	left:0;
	background:#fe5757;
	animation:colorChange 30s ease-in-out infinite;
	animation-fill-mode:both;
	mix-blend-mode:overlay;
}
@keyframes colorChange {
	0%,100% {
	opacity:0;
}
50% {
	opacity:.9;
}
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
