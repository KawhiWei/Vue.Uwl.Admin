<template>
<div class="Bg-img">
    <div class="login">
        <div class="loginlogo">

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
    export default {
        data () {
            return {
                formInline: {
                    user: '',
                    password: ''
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
                console.log(this.formInline.user)
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
    margin: 0;
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
