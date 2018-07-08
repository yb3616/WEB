<template>
    <v-app dark>
        <!-- 左侧栏 -->
        <v-navigation-drawer
            clipped
            fixed
            v-model="drawer"
            app
            >
            <v-list>
                <v-list-group prepend-icon="supervisor_account">
                    <v-list-tile slot="activator">
                        <v-list-tile-title>账号管理</v-list-tile-title>
                    </v-list-tile>
                    <v-list-tile
                        v-for="(r, i) in rs"
                        :key="i"
                        @click="$router.push(r[2])"
                        >
                        <v-list-tile-title v-text="r[0]"></v-list-tile-title>
                        <v-list-tile-action>
                            <v-icon v-text="r[1]"></v-icon>
                        </v-list-tile-action>
                    </v-list-tile>
                </v-list-group>
            </v-list>
        </v-navigation-drawer>



        <!-- Header -->
        <v-toolbar app fixed clipped-left>
            <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
            <v-toolbar-title class="white--text">{{application}}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon>
                <v-menu bottom left>
                    <v-btn slot="activator" dark icon>
                        <v-icon>{{ this.$store.state.adapter.config.icon }}</v-icon>
                    </v-btn>
                    <v-list>
                        <v-list-tile
                            v-for="(item, i) in this.$store.state.adapter.config.icon_btns"
                            :key="i"
                            @click="go2(item.url)"
                            >
                            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                        </v-list-tile>
                    </v-list>
                </v-menu>
            </v-btn>
        </v-toolbar>



        <!-- Logout -->
        <v-dialog
            v-model="dialog" max-width="290">
            <v-card>
                <v-card-title class="headline">警告</v-card-title>
                <v-card-text>确定退出登录？</v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="green darken-1" flat="flat" @click="dialog = false">取消操作</v-btn>
                    <v-btn color="error darken-1" flat="flat" @click="logout">确定退出</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>



        <!-- Content -->
        <v-content>
            <v-container fluid>
                <slot></slot>
            </v-container>
        </v-content>



        <!-- Footer -->
        <v-footer app fixed>
            <span>&copy; {{ new Date().getFullYear() }}</span>
        </v-footer>
    </v-app>
</template>





<script>
export default {
    data: () => ({
        application: 'My APP',
        drawer: false,
        dialog: false,
        rs: [
            ['用户管理', 'list', '/admin/user'],
            ['组织结构', 'list', '/admin/role'],
            ['用户-角色分配', 'assignment', '/admin/user_role'],
            ['角色-权限分配', 'assignment', '/admin/sub_obj'],
        ]
    }),
    mounted() {
        this.$store.commit("logout")
        this.$http.get("/user/info").then( result => {
            if ("success" == result.data.msg) {
                this.$store.commit('login', result.data.result)
            } else {
                console.log(result);
            }
        }).catch( err => {
            console.log(err);
        })
    },
    methods: {
        go2(url) {
            if (url != '/logout') {
                this.$router.push(url);
            } else {
                this.dialog = true
            }
        },
        logout() {
            this.$http.get('/logout').then( resp => {
                if (resp.data.msg == "success") {
                    this.$store.commit("logout");
                    this.dialog = false;
                }
            }).catch( err => {
                console.log(err);
            } );
        },
    },
}
</script>
