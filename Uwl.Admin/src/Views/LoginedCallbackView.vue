<template>
  <div>
    <div desktop="12" tablet="8">
      <dl>
        <dt>Login successful</dt>
        <dt>Your browser should be redirected soon</dt>
      </dl>
    </div>
  </div>
</template>
<script>
import applicationUserManager from "../UwlAuth/ApplicationUserManager";
import { RequestMenuTree } from "../APIServer/Api.js";
import { filterAsyncRouterMap } from "../router/index.js";
import router from "../router";
export default {
  name: "logincallback-view",
  data() {
    return {};
  },
  async created() {
    try {
      let _this=this;
      await applicationUserManager.signinRedirectCallback();
      let user = await applicationUserManager.getUser();
      console.log(user)
      debugger
      _this.$store.commit("SaveToken", user.access_token);
      _this.$store.commit("SaveUser", user.profile);
      window.localStorage.setItem("userInfo",JSON.stringify(user.profile));
          RequestMenuTree({ userid: user.profile.sub }).then(res => {
              if(res.data.success)
              {
                  this.$Notice.success({ title: "获取用户菜单成功，自动跳转至首页" });
                  var routeArr = res.data.response.children;
                  window.localStorage.setItem("router", JSON.stringify(routeArr));
                  routeArr = filterAsyncRouterMap(routeArr);
                  router.addRoutes(routeArr);
                  if (this.$route.query.ReturnUrl) {
                    this.$router.replace(_this.$route.query.ReturnUrl);
                  }
                  else
                  {
                    this.$router.replace("/");
                    window.location=window.location;//强刷界面
                  }
              }
              else
              {
                this.$Notice.warning({ title: res.data.msg });
              }
          });
    }
    catch (e) {
      this.$root.$emit("show-snackbar", { message: e });
    }
  },
  methods: {
  }
};
</script>
