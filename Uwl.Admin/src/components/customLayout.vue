<template>
<div class="layout">
    <div class="Headers">
      <template>
        <div>
          <Row>
            <Col span="23">
            col-12
            </Col>
            <Col span="1">
              <Dropdown placement="bottom-start">
                    <span><img  style="width:80px;height:80px;" src="../assets/headimg.jpg" alt=""></span>
                    <DropdownMenu slot="list">
                        <DropdownItem>驴打滚</DropdownItem>
                        <DropdownItem>炸酱面</DropdownItem>
                        <DropdownItem>豆汁儿</DropdownItem>
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
            <Col span="3" style="border:solid 1px red;">我是左侧</Col>
            <Col span="21">
              <div>
                <ul>
                <router-link to="/">我是首页</router-link >
                <router-link to="/test1">测试1</router-link >
                <router-link to="/test2">测试2</router-link >
                </ul>
              </div>
              <div>
                <router-view></router-view>
              </div>
          </Col>
        </Row>
      </template>
    </div>
</div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<style>
.Headers{
  /* border: 1px red solid;
  height: 80px; */
  background:rgb(8, 234, 250);
}
.NvaiSider{
  border: 1px rgb(50, 68, 2) solid;
  width: 240px;
  float: left;
  height: 855px;
}
.NvaContent{
border: 1px rgb(0, 72, 180) solid;
  width: 1650px;
  float: left;
  height: 855px;
}
</style>
