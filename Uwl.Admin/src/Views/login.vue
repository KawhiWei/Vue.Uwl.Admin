<template>
<div class="Bg-img">
    <div class="login">
        <div class="loginlogo">
            我是放Logo的
        </div>
        <Form>
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
            <Button type="primary" @click="handleSubmit()">Login</Button>
        </FormItem>
        </Form>
    </div>
</div>
</template>
<script>
    import {RequestLogin} from '../APIServer/Api.js';
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
        methods: {
            handleSubmit() {
                var _this=this;
                RequestLogin({User:_this.formInline.user,Password:_this.formInline.password}).then(res=>{
                        _this.$store.commit("SaveToken",res.data.token)
                        _this.$router.replace(_this.$route.query.ReturnUrl?_this.$route.query.ReturnUrl:'/')
                    }
                )
                console.log(this.formInline.user)
                console.log(this.formInline.password)
            }
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
    width: 600px;
    height: 450px;
    border: 1px red solid;
}
.Bg-img .login .loginlogo{
    width: 350px;
    height: 140px;
    border: 1px solid yellow;
    text-align: center;
}
</style>
