import {UserManager} from 'oidc-client'
import store from '../Vuex/store'

class ApplicationUserManager extends UserManager{
  constructor(){
    super({
      authority:'http://localhost:5000',
      client_id:'uwladminjs',
      redirect_uri:'http://127.0.0.1:2365/LoginedCallbackView',
      response_type:'id_token token',
      scope:'openid profile roles uwlcore.api',
      post_logout_redirect_uri: 'http://127.0.0.1:2365'
    })
  }
  async login()
  {
    await this.signinRedirect()
    var user=await this.getUser();
     store.commit("SaveToken",user.access_token);
     window.localStorage.setItem("userInfo",JSON.stringify(user.profile));
     window.localStorage.setItem('Token',user.access_token);
    return user
  }
  async logout () {
    return this.signoutRedirect()
  }
}
const applicationUserManager = new ApplicationUserManager()
export { applicationUserManager as default }
