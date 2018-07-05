// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
import Vuex from 'vuex';
import store from './store';
import axios from 'axios';

// axios 配置
axios.defaults.timeout = 5000;
axios.defaults.baseURL = 'http://127.0.0.1:8080';
axios.defaults.withCredentials = true
Vue.prototype.$http = axios;

Vue.prototype.checkResp = resp => {
    if (resp.hasOwnProperty('msg') && "success" == resp.msg) {
        return true;
    }
    console.log(resp)
    return false;
};

Vue.use(Vuetify);

Vue.config.productionTip = false;

/* eslint-disable no-new */
var vueDeb = new Vue({
    el: '#app',
    router,
    store,
    components: {App},
    template: '<App/>',
});
