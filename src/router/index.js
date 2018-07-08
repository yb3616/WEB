import Vue from 'vue';
import Router from 'vue-router';
import Login from '@/components/Login';
import Register from '@/components/Register';
import Admin from '@/components/Admin';
import Index from '@/components/Index';
import ForgetPassword from '@/components/ForgetPassword';
import Role from '@/components/Role';
import UserRole from '@/components/UserRole';
import SubObj from '@/components/SubObj';
import User from '@/components/User';

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
            path: '/admin/user_role',
            name: 'UserRole',
            component: UserRole,
        },
        {
            path: '/admin/role',
            name: 'Role',
            component: Role,
        },
        {
            path: '/admin/sub_obj',
            name: 'SubObj',
            component: SubObj,
        },
        {
            path: '/admin/user',
            name: 'User',
            component: User,
        },
    ],
});
