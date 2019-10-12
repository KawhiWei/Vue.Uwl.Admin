<template>
  <div >
    <Card class="infocard" >
      <div>
        <Card style="width:350px">
          <img class="header" src="https://i.loli.net/2017/08/21/599a521472424.jpg" shape="circle"/>
          <div>
            手机:1388888888888<Button style="float:right;" type="info" size="small">修改手机</Button>
          </div>
          <div>
            邮箱:1388888888888<Button style="float:right;" type="info" size="small">修改邮箱</Button>
          </div>
          <div>
            微信:1388888888888<Button style="float:right;" type="info" size="small">修改微信</Button>
          </div>
          <Button type="error">修改密码</Button>
          </Card>
      </div>
        
    </Card>
  </div>
</template>
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