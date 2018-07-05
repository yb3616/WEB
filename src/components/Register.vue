<template>
    <v-adapter>
        <v-toolbar dark>
            <v-toolbar-title>注册账号</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-tooltip bottom>
                <v-btn slot="activator" icon large @click="$router.back(-1)">
                    <v-icon large>reply</v-icon>
                </v-btn>
                <span>返回</span>
            </v-tooltip>
        </v-toolbar>
        <v-card-text>
            <v-form ref="form" v-model="valid" lazy-validation>
                <v-text-field
                    :rules="loginidRules"
                    v-model="loginid"
                    type="text"
                    label="账号"
                    prepend-icon="person"
                    clearable
                    required
                    single-line></v-text-field>
                <v-text-field
                    :rules="phoneRules"
                    v-model="phone"
                    type="text"
                    label="手机号码"
                    prepend-icon="smartphone"
                    required
                    single-line
                    clearable
                    ></v-text-field>
                <v-text-field
                    :rules="emailRules"
                    v-model="email"
                    label="邮箱账号"
                    prepend-icon="email"
                    required
                    single-line
                    clearable
                    ></v-text-field>
                <v-text-field
                    :append-icon="e1 ? 'visibility' : 'visibility_off'"
                    :append-icon-cb="() => (e1 = !e1)"
                    :type="e1 ? 'text' : 'password'"
                    label="密码"
                    v-model="password"
                    required
                    :rules= 'passwordRules'
                    prepend-icon="lock"
                    single-line ></v-text-field>
                <v-text-field
                    :append-icon="e2 ? 'visibility' : 'visibility_off'"
                    :append-icon-cb="() => (e2 = !e2)"
                    :type="!e2 ? 'password' : 'text'"
                    label="重复密码"
                    v-model="password2"
                    :rules="[() => !!password2 || '必须填入密码', () => password2.length >= 6 || '最少六位密码', () => password == password2 || '两次密码不一致' ]"
                    single-line
                    required
                    prepend-icon="lock"
                    ></v-text-field>
            </v-form>
        </v-card-text>
        <v-card-actions>
            <v-btn @click="$router.push('/login')" flat>登录</v-btn>
            <v-btn @click="$router.push('/forgetpassword')" flat>忘记密码</v-btn>
            <v-spacer></v-spacer>
            <v-btn @click="register">提交注册</v-btn>
        </v-card-actions>
    </v-adapter>
</template>

<script>
import adapter from '@/components/Adapter2.vue';
export default {
    components: {
        'v-adapter': adapter,
    },
    data: () => ({
        drawer: null,
        valid: true,
        e1: false,
        e2: false,
        loginid: '',
        loginidRules: [
            v => !!v || '必须填入账号',
            v => /^1\d{10}$/.test(v) || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || /^[a-zA-Z]+\w{3,}$/.test(v) || '账号格式不正确',
        ],
        phone:'',
        phoneRules:[ (v) => !!v || '必须输入手机号码', (v) => /^1\d{10}$/.test(v) || '手机号码格式不正确' ],
        email: '',
        emailRules:[ (v) => !!v || '必须填入邮箱', (v) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || '邮箱格式不正确' ],
        password: '',
        password2: '',
        passwordRules: [
            v => !!v || '必须填入密码',
            v => v.length >= 6 || '最少六位密码',
        ],
    }),
    methods: {
        register: function() {
            let data = {
                "user_name": this.loginid,
                phone: this.phone,
                email: this.email,
                password: this.password,
            }
            if (this.$refs.form.validate()) {
                this.$http.post('/logon', data).then( resp => {
                    if ("success" == resp.data.msg) {
                        return this.$http.post("/login", {
                            "user_name": this.loginid,
                            "password": this.password,
                        })
                    } else {
                        console.log(resp);
                        this.dialog = true
                    }
                }).then( resp => {
                    if ("success" == resp.data.msg) {
                        return this.$http.get("/user/info")
                    } else {
                        console.log(resp);
                        this.dialog = true
                    }
                }).then( resp => {
                    if ("success" == resp.data.msg) {
                        this.$store.commit('login', resp.data.result)
                        this.$router.back(-1);
                    } else {
                        console.log(resp);
                        this.dialog = true
                    }
                }).catch( err => {
                    console.log(err);
                })
            }
        }
    },
}
</script>
