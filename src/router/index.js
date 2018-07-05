import Vue from 'vue';
import Router from 'vue-router';
import Login from '@/components/Login';
import Register from '@/components/Register';
import Admin from '@/components/Admin';
import Index from '@/components/Index';
import ForgetPassword from '@/components/ForgetPassword';
import Organization from '@/components/Organization';

Vue.use(Router);

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/login',
            name: 'Login',
            component: Login,
        },
        {
            path: '/register',
            name: 'Register',
            component: Register,
        },
        {
            path: '/admin',
            name: 'Admin',
            component: Admin,
        },
        {
            path: '/',
            name: 'Index',
            component: Index,
        },
        {
            path: '/forgetpassword',
            name: 'ForgetPassword',
            component: ForgetPassword,
        },
        {
            path: '/admin/organizations',
            name: 'Organization',
            component: Organization,
        },
    ],
});
