<template>
  <div v-cloak>
    <Card class="infocard" >
      <div>
        <Card style="width:350px;">
          <img class="header" src="https://i.loli.net/2017/08/21/599a521472424.jpg" shape="circle"/>
          <div>
            手机:
            <span v-if="user.mobile">{{user.mobile}}</span>
            <span v-else>未绑定</span>
            <Button style="float:right;" type="info" size="small">修改手机</Button>
          </div>
          <div>
            邮箱:
            <span v-if="user.email">{{user.email}}</span>
            <span v-else>未绑定</span>
            <Button style="float:right;" type="info" size="small">修改邮箱</Button>
          </div>
          <div>
            微信:
            <span v-if="user.weChat">{{user.weChat}}</span>
            <span v-else>未绑定</span>
            <Button style="float:right;" type="info" size="small">修改微信</Button>
          </div>
          <Button type="error">修改密码</Button>
          </Card>
      </div>
      <div>
        <Card style="width:350px">
          <p slot="title">个人信息</p>
          <div>
            <span>
              用户名:
              <span v-if="user.account">{{user.account}}</span>
              <span v-else>未绑定</span>
            </span>
          </div>
          <div>
            角色:
            <span v-if="user.email">{{user.email}}</span>
              <span v-else>未绑定</span>
          </div>
          <div>
            性别:<Input v-model="user.name" placeholder="Enter something..." style="width: 300px" />
          </div>
          <div>
            真实姓名:<Input v-model="user.sex" placeholder="Enter something..." style="width: 300px" />
          </div>
          </Card>
      </div>
    </Card>
  </div>
</template>
<script>
export default {
  components:{},
  name: 'personalCenter',
  data () {
    return {
      user:this.$store.state.User,
    }
  },
  created()
  {
    console.log(this.user)
  }
}
</script>
<style  scoped>
.infocard{
  min-width: 800px;
  width:60%;
  /* transform: translateY(-40%); */
  top: 120%;
  position: absolute;
  padding: 0;
  right: 0;
  margin: 0 auto;
  left: 0;
  height: 550px;
  box-shadow: 0 4px 21px #d6d6d6;
}
.infocard .header{
  height: 150px;
width: 150px;
border-radius: 50%;
margin-right: 0;
top: 4px;
position: relative;
border: 3px solid #dfdfdf;
}
</style>