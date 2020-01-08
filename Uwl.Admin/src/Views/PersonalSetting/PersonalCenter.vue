<template>
  <div v-cloak>
    <Card class="infocard">
      <div class="Infobox">
        <Card style="width:350px;">
          <div class="headpic">
            <img
              class="header"
              src="https://i.loli.net/2017/08/21/599a521472424.jpg"
              shape="circle"
            />
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
          <Button type="info" @click="modalUpdataDatas">修改信息</Button>
          <Button type="error" @click="modalUpdatapassword">修改密码</Button>
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
            性别:
            <Icon v-if="user.sex" type="md-man" size="32" color="#1E90FF" />
            <Icon size="32" color="#EE82EE" v-else type="md-woman" />
          </div>
          <div class="SelfMsg">
            姓名:
            <span>{{user.name}}</span>
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
          action="/api/User/UpLoad"
        >
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
      <Modal v-model="modalUpdatapwd" title="修改密码" width="50%" height="80%" :mask-closable="false">
        <Form ref="formCustom" :model="formCustom" :rules="ruleCustom" :label-width="80">
          <FormItem label="旧密码：" prop="oldPassWord">
            <Input type="password" v-model="formCustom.oldPassWord"></Input>
          </FormItem>
          <FormItem label="新密码：" prop="newPassWord">
            <Input type="password" v-model="formCustom.newPassWord"></Input>
          </FormItem>
          <FormItem label="确认密码：" prop="passwdCheck">
            <Input type="password" v-model="formCustom.passwdCheck"></Input>
          </FormItem>
        </Form>
        <div slot="footer">
          <Button type="primary" @click="handleSubmit('formCustom')">提交</Button>
          <Button @click="modalUpdatapwd = false" style="margin-left: 8px">取消</Button>
        </div>
      </Modal>
    </div>
    <!-- 修改其他资料弹出框 -->
    <div>
      <Modal v-model="modalUpdatadata" title="修改密码" width="50%" height="80%" :mask-closable="false">
        <Form ref="formCustomdata" :model="formCustomdata" :rules="ruleValidate" :label-width="80">
          <FormItem label="邮箱：" prop="email">
            <Input type="text" v-model="formCustomdata.email"></Input>
          </FormItem>
          <FormItem label="手机号：" prop="mobile">
            <Input type="text" v-model="formCustomdata.mobile"></Input>
          </FormItem>
          <FormItem label="微信：" prop="weChat">
            <Input type="text" v-model="formCustomdata.weChat"></Input>
          </FormItem>
        </Form>
        <div slot="footer">
          <Button type="primary" @click="datahandleSubmit('formCustomdata')">提交</Button>
          <Button @click="modalUpdatadata = false" style="margin-left: 8px">取消</Button>
        </div>
      </Modal>
    </div>
  </div>
</template>
<script>
import {
  ResponseChangePassword,
  ResponseChangeData,
  RequestUserInfo
} from "../../APIServer/Api.js";
export default {
  components: {},
  name: "personalCenter",
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入新密码"));
      } else {
        if (this.formCustom.passwdCheck !== "") {
          // 对第二个密码框单独验证
          this.$refs.formCustom.validateField("passwdCheck");
        }
        callback();
      }
    };
    const validatePassCheck = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入新密码"));
      } else if (value !== this.formCustom.newPassWord) {
        callback(new Error("两次输入的新密码不一致，请重新输入!"));
      } else {
        callback();
      }
    };
    const validateoldPass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入旧密码"));
      } else {
        callback();
      }
    };
    return {
      user: JSON.parse(window.localStorage.userInfo),
      file: [], //上传的图片
      modalUpdataHeadImg: false, //更换头像弹出框
      modalUpdatapwd: false, //修改密码弹出框
      modalUpdatadata: false, //修改其他资料弹出框
      Tokens: {
        Authorization: "Bearer " + window.localStorage.getItem("Token")
      },
      formCustom: {
        oldPassWord: "",
        newPassWord: "",
        passwdCheck: ""
      },
      //自定义校验
      ruleCustom: {
        newPassWord: [{ validator: validatePass, trigger: "blur" }],
        passwdCheck: [{ validator: validatePassCheck, trigger: "blur" }],
        oldPassWord: [{ validator: validateoldPass, trigger: "blur" }]
      },

      formCustomdata: {
        email: "",
        mobile: "",
        weChat: ""
      },
      ruleValidate: {
        email: [
          { required: true, message: "邮箱不可为空", trigger: "blur" },
          { type: "email", message: "邮箱格式不正确", trigger: "blur" }
        ]
      }
    };
  },
  created() {},
  methods: {
    UpdataHeadImg() {
      if (this.modalUpdataHeadImg) {
        this.modalUpdataHeadImg = false;
      } else !this.modalUpdataHeadImg;
      {
        this.modalUpdataHeadImg = true;
      }
    },
    //修改个人资料弹出框
    modalUpdataDatas() {
      this.formCustomdata.mobile = this.user.mobile;
      this.formCustomdata.email = this.user.email;
      this.formCustomdata.weChat = this.user.weChat;
      this.modalUpdatadata = true;
    },
    datahandleSubmit(name) {
      var _this = this;
      this.$refs[name].validate(valid => {
        if (valid) {
          let params = Object.assign({}, this.formCustomdata);
          ResponseChangeData(params).then(res => {
            if (res.data.success) {
              RequestUserInfo({ token: window.localStorage.getItem("Token") }).then(res => {
                if (res.data.success) {
                  _this.$Notice.success({ title: "用户信息刷新成功" });
                  window.localStorage.setItem("userInfo",JSON.stringify(res.data.response));
                  //将用户信息写入到Vuex缓存中
                  _this.$store.commit("SaveUser", res.data.response);
                  _this.$Message.success(res.data.msg);
                  _this.user=JSON.parse(window.localStorage.userInfo);
                  _this.modalUpdatadata = false;
                }
                else {
                  _this.$Message.error({ content: res.data.msg, duration: 3 });
                }
              });
              //需要重新刷新一下个人信息数据
            } else {
              this.$Message.error(res.data.msg);
            }
          });
        } else {
          this.$Message.error("信息填写不完整!");
        }
      });
    },

    //修改密码弹出框
    modalUpdatapassword() {
      this.formCustom.oldPassWord = "";
      this.formCustom.newPassWord = "";
      this.formCustom.passwdCheck = "";
      this.modalUpdatapwd = true;
    },
    //修改密码接口访问保存
    handleSubmit(name) {
      var _this = this;
      this.$refs[name].validate(valid => {
        if (valid) {
          let params = Object.assign({}, this.formCustom);
          ResponseChangePassword(params).then(res => {
            if (res.data.success) {
              this.$Message.success(res.data.msg);
              _this.modalUpdatapwd = false;
            } else {
              this.$Message.error(res.data.msg);
            }
          });
        } else {
          this.$Message.error("信息填写不完整!");
        }
      });
    },
    handleUpload(file) {
      this.file = file; //获取文件
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
    uploadSuccess(res, file, fileList) {
      if (res.success) {
        this.$Notice.success({
          title: "上传头像",
          desc: "头像更换成功"
        });
        this.file = null;
        this.UpdataHeadImg = false;
      } else {
        this.$Notice.warning({
          title: "上传头像",
          desc: "头像更换失败" + res.msg
        });
      }
    },
    handleError(error, file) {
      this.$Notice.error({
        title: "上传头像",
        desc: "上传头像文件失败"
      });
      this.file = null;
    }
  }
};
</script>
<style  scoped>
.infocard {
  min-width: 800px;
  width: 60%;
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
.infocard .header {
  height: 150px;
  width: 150px;
  border-radius: 50%;
  margin-right: 0;
  top: 4px;
  position: relative;
  border: 3px solid #dfdfdf;
}
.headpic {
  text-align: center;
}
.changehead {
  display: block;
  margin: 0 auto;
}
.Binding {
  overflow: hidden;
  margin: 10px 0;
}
.SelfMsg {
  margin-bottom: 10px;
}
.Infobox {
  float: left;
}
.Infobox:nth-child(2) {
  margin-left: 10px;
}
.ivu-card-body {
  overflow: hidden;
}
</style>
