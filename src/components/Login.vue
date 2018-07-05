<template>
    <v-adapter>
        <v-toolbar dark>
            <v-toolbar-title>登录框</v-toolbar-title>
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
                    :append-icon="e1 ? 'visibility' : 'visibility_off'"
                    :append-icon-cb="() => (e1 = !e1)"
                    :type="e1 ? 'text' : 'password'"
                    label="密码"
                    v-model="password"
                    required
                    :rules= 'passwordRules'
                    prepend-icon="lock"
                    single-line ></v-text-field>
            </v-form>
        </v-card-text>
        <v-card-actions>
            <v-btn @click="$router.push('/register')" flat>注册</v-btn>
            <v-btn @click="$router.push('/forgetpassword')" flat>忘记密码</v-btn>
            <v-spacer></v-spacer>
            <v-btn @click="login">提交登录</v-btn>
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
        loginid: '',
        loginidRules: [
            v => !!v || '必须填入账号',
            v => /^1\d{10}$/.test(v) || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || /^[a-zA-Z]+\w{3,}$/.test(v) || '账号格式不正确',
        ],
        password: '',
        passwordRules: [
            v => !!v || '必须填入密码',
            v => v.length >= 6 || '最少六位密码',
        ],
    }),
    methods: {
        login: function() {
            if (this.$refs.form.validate()) {
                var data
                if (/^1\d{10}$/.test(this.loginid)) {
                    var data = {
                        phone:    this.loginid,
                        password: this.password,
                    }
                } else if (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(this.loginid)) {
                    var data = {
                        email:    this.loginid,
                        password: this.password,
                    }
                } else if (/^[a-zA-Z]+\w{3,}$/.test(this.loginid)) {
                    var data = {
                        user_name:    this.loginid,
                        password: this.password,
                    }
                }

                this.$http.post('/login', data).then( resp => {
                    if ("success" == resp.data.msg) {
                        return this.$http.get("/user/info")
                    } else {
                        this.dialog = true
                    }
                }).then( resp => {
                    if ("success" == resp.data.msg) {
                        this.$store.commit('login', resp.data.result)
                        this.$router.back(-1);
                    } else {
                        console.log(resp);
                    }
                }).catch( err => {
                    console.log(err);
                })
            }
        }
    },
}
</script>
