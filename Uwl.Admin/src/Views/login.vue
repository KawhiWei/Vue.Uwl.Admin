<template>
<div class="Bg-img">
    <div class="login">
        <div class="loginlogo">
        </div>
        <Form class="foms">
            <FormItem>
            <Input type="text" v-model="formInline.user" placeholder="Username">
                <Icon type="ios-person-outline" slot="prepend"></Icon>
            </Input>
        </FormItem>
        <FormItem>
            <Input type="password" v-model="formInline.password" placeholder="Password">
                <Icon type="ios-lock-outline" slot="prepend"></Icon>
            </Input>
        </FormItem>
        <FormItem>
            <Button type="primary" style="width:100%;" @click="handleSubmit()">Login</Button>
        </FormItem>
        </Form>
    </div>
</div>
</template>
<script>
import {RequestLogin,RequestUserInfo,RequestMenuTree} from '../APIServer/Api.js';
import router from '../router'
import {filterAsyncRouterMap} from '../router/index.js';

export default {
        data () {
            return {
                formInline: {
                    user: 'uwl',
                    password: '123456'
                },
                ruleInline: {
                    user: [
                        { required: true, message: 'Please fill in the user name', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: 'Please fill in the password.', trigger: 'blur' },
                        { type: 'string', min: 6, message: 'The password length cannot be less than 6 bits', trigger: 'blur' }
                    ]
                }
            }
        },
        mounted()
        {
        },
        methods: {
            handleSubmit() {
                var _this=this;
                var param={user:_this.formInline.user,password:_this.formInline.password};
                console.log(param)
                RequestLogin(param).then(res=>{
                    if(res.data.success)
                    {
                        _this.$store.commit("SaveToken",res.data.response.token)
                        _this.GetUserInfo(res.data.response.token);
                    }
                        
                    }
                )
            },
            //根据Token获取用户信息
            GetUserInfo(tokens)
            {
                var _this=this;
                // debugger
                RequestUserInfo({token:tokens}).then(res=>{
                    window.sessionStorage.setItem('userInfo',JSON.stringify(res.data.response));//将用户信息写入到session缓存中
                    RequestMenuTree({userid:res.data.response.id}).then(
                        res=>{
                        var routeArr=res.data.response.children;
                        window.localStorage.setItem('router',JSON.stringify(routeArr));
                        routeArr=filterAsyncRouterMap(routeArr)
                        router.addRoutes(routeArr); 
                        if(_this.$route.query.ReturnUrl)
                        {
                            _this.$router.push(_this.$route.query.ReturnUrl);    
                        }
                        else
                        {
                            _this.$router.push('/');
                        }
                        
                    })
                    
                    
                    //_this.$router.push('/')
                })
            },
            //根据用户ID获取他的菜单
            // GetMenu(userId)
            // {
            //     _this.$router.replace(_this.$route.query.ReturnUrl?_this.$route.query.ReturnUrl:'/')
            // }
            
        }
    }
</script>
<style>
.Bg-img{
    background: url(../assets/login-bg.jpg) no-repeat top left;
    background-size: cover;
    height: 100%;
    width: 100%;
    margin: 0px;
    position: absolute;
}
.Bg-img .login{
    width: 30%;
    height:38%;
    background-color: white;
    position: relative;
    left: 48%;
    top: 20%;
    border-radius:10px; 
    right: 20%;
    opacity: 1;
    padding: 25px 30px 25px 50px;
}
.Bg-img .login .foms
{
    width: 96%;
}

.Bg-img .login .loginlogo{
    width: 96%;
    height: 140px;
}
</style>
