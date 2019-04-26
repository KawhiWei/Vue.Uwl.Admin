<template>
<div class="layout">
    <div class="Headers">
      <template>
        <div>
          <Row>
            <Col span="23">
            XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX管理后台
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
                  <DropdownItem>登出</DropdownItem>
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
            <Col span="3">
              <Menu active-name="1" :open-names="['1']">
                <Submenu name="1">
                  <template slot="title">
                      <Icon type="ios-filing" />
                      Navigation Two
                  </template>
                </Submenu>
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
              </Menu>
            </Col>
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
  background:#6089d4;
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
