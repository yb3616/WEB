<template>
    <v-app dark>
        <v-content>
            <v-container fluid fill-height>
                <v-layout align-center justify-center>
                    <v-flex xs12 sm8 md4>
                        <v-card class="elevation-12">
                            <slot></slot>
                        </v-card>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-content>
    </v-app>
</template>

<script>
export default {
    mounted() {
        this.$store.commit("logout");
        this.$http.get("/user/info").then( result => {
            if ("success" == result.data.msg) {
                this.$store.commit('login', result.data.result);
                this.$router.back(-1)
            } else {
                console.log(result);
            }
        }).catch( err => {
            console.log(err);
        })
    },
};
</script>
