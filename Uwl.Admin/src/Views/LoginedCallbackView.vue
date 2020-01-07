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
export default {
  name: "logincallback-view",
  data() {
    return {};
  },
  async created() {
    debugger
    try {
      await applicationUserManager.signinRedirectCallback();
      let _this=this;
      let user = await applicationUserManager.getUser();
      console.log(user);
      _this.$store.commit("saveToken", user.access_token);
    }
    catch (e) {
      this.$root.$emit("show-snackbar", { message: e });
    }
  },
  methods: {
  }
};
</script>
