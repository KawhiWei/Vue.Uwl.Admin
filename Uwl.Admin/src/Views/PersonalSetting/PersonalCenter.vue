<template>
  <div v-cloak>
    <Card class="infocard" >
      <div class="Infobox">
        <Card style="width:350px;">
          <div class="headpic">
            <img class="header" src="https://i.loli.net/2017/08/21/599a521472424.jpg" shape="circle"/>
          </div>
          <Button type="primary" @click="UpdataHeadImg()" class="changehead">更换头像</Button>
          <div class="Binding">
            手机:
            <span v-if="user.mobile">{{user.mobile}}</span>
            <span v-else>未绑定</span>
          </div>
          <div class="Binding">
            邮箱:
            <span v-if="user.email">{{user.email}}</span>
            <span v-else>未绑定</span>
          </div>
          <div class="Binding">
            微信:
            <span v-if="user.weChat">{{user.weChat}}</span>
            <span v-else>未绑定</span>
          </div>
          <Button type="info">修改信息</Button>
          <Button type="error">修改密码</Button>
          </Card>
      </div>
      <div class="Infobox">
        <Card style="width:350px">
          <p slot="title">个人信息</p>
          <div class="SelfMsg">
            <span>
              用户名:
              <span v-if="user.account">{{user.account}}</span>
              <span v-else>未绑定</span>
            </span>
          </div>
          <div class="SelfMsg">
            角色:
            <span v-if="user.email">{{user.email}}</span>
              <span v-else>未绑定</span>
          </div>
          <div class="SelfMsg">
            性别:<Icon v-if="user.sex"  type="md-man" size="32" color="#1E90FF"/> <Icon size="32" color="#EE82EE" v-else type="md-woman" />
          </div>
          <div class="SelfMsg">
            姓名:<span >{{user.name}}</span>
          </div>
          </Card>
      </div>
    </Card>
    <div>
      <Modal v-model="modalUpdataHeadImg" :closable="false" :mask-closable="false">
        <Upload
        :headers="Tokens"
        :before-upload="handleUpload"
        :show-upload-list="false"
        :on-success="uploadSuccess"
        :on-format-error="handleFormatError"
        :on-error="handleError"
        :format="['jpg','png','gif']"
        type="drag"
        action="/api/User/UpLoad">
        <div style="padding: 20px 0">
            <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
            <p>点击，或拖动图片至此处</p>
        </div>
        </Upload>
        <div slot="footer">
          <Button @click="modalUpdataHeadImg = false" style="margin-left: 8px">取消</Button>
        </div>
    </Modal>
    </div>
    <!-- 修改密码弹出框 -->
    <div>

    </div>
    <!-- 修改其他资料弹出框 -->
    <div>

    </div>
  </div>

</template>
<script>
export default {
  components:{},
  name: 'personalCenter',
  data () {
    return {
      user:this.$store.state.User,
      file:[],//上传的图片
      modalUpdataHeadImg:false,//更换头像弹出框
      modalUpdatapwd:false,//修改密码弹出框
      modalUpdatadata:false,//修改其他资料弹出框
      Tokens: {
        Authorization: "Bearer " + window.sessionStorage.getItem("Token")
      },
    }
  },
  created()
  {
  },
  methods:{
    UpdataHeadImg()
    {
      if(this.modalUpdataHeadImg)
      {
        this.modalUpdataHeadImg=false;
      }
      else(!this.modalUpdataHeadImg)
      {
        this.modalUpdataHeadImg=true;
      }
    },
    handleUpload(file)
    {
      this.file = file;//获取文件
    },
    //检查文件格式
    handleFormatError(file) {
      //_this.$Message.success(res.data.msg);
      this.$Notice.warning({
        title: "文件格式不正确",
        desc: "文件 " + file.name + " 格式不正确，请上传.jpg,.png,gif文件。"
      });
      this.file = null;
    },
    uploadSuccess(res, file,fileList)
    {
      if(res.success)
      {
        this.$Notice.success({
        title: "上传头像",
        desc: "头像更换成功",
        });
        this.file = null;
        this.UpdataHeadImg=false;
      }
      else{
        this.$Notice.warning({
        title: "上传头像",
        desc: "头像更换失败"+res.msg,
        });
      }
    },
    handleError(error,file)
    {
      this.$Notice.error({
        title: "上传头像",
        desc: "上传头像文件失败",
      });
      this.file = null;
    }
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
  box-shadow: 0 4px 21px #d6d6d6;
  overflow: hidden;
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
.headpic{
  text-align: center;
}
.changehead{
  display: block;
  margin: 0 auto;
}
.Binding{
  overflow: hidden;
  margin: 10px 0;
}
.SelfMsg{
  margin-bottom: 10px ;
}
.Infobox{
  float: left;
}
.Infobox:nth-child(2){
  margin-left: 10px;
}
.ivu-card-body{
  overflow: hidden;
}
</style>
