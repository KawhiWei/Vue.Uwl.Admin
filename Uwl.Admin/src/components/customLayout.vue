<template>
<div class="layout">
    <div class="Headers">
      我是头部
    </div>
    <div>
      <div class="NvaiSider">
        我是左侧
      </div>
      <ul>
          <router-link to="/">我是首页</router-link >
          <router-link to="/test1">测试1</router-link >
          <router-link to="/test2">测试2</router-link >
        </ul>
      <div class="NvaContent">
        <div>
          <router-view></router-view>
        </div>
      </div>
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
  border: 1px red solid;
  height: 80px;
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
