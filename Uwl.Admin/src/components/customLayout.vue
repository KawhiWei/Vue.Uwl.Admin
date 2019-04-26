<template>
<div class="layout">
    <div class="Headers">
      <template>
        <div>
          <Row>
            <Col span="23" style="height:80px;">
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
            <!----左侧导航菜单------>
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
            <!----右侧Tabs标签页------>
            <Col span="21">
              <div style="margin:5px 5px;">
                <Tag type="dot" closable color="primary" :key="item.id" :name="item.lable" v-for=" item in TagsList">
                  <router-link :to="item.path" style="color:#000">{{item.lable}}</router-link>
                  </Tag>              
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
      TagsList:[
        {id:1,lable:'个人主页',path:'/'},
        {id:2,lable:'测试1',path:'/test1'},
        {id:3,lable:'测试2',path:'/test2'},
      ]
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
</style>
