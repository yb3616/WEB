import _ from 'lodash';
export default {
    state: {
        config: {}
    },
    mutations: {
        login: (state, data) => {
            state.config.icon = "verified_user";
            state.config.icon_btns = [];
            if (_.includes(data.Roles, "r1")) {
                state.config.icon_btns.push({ title: '后台', url: '/admin' })
                // state.config.left_items.splice(1, 0, { title: '账号管理', icon: 'supervisor_account' })
            }
            state.config.icon_btns.push({ title: '注销', url: '/logout' })
        },
        logout: state => {
            // 初始化状态
            state.config = {
                icon: "more_vert",
                icon_btns: [
                    { title: '登录', url: '/login' },
                    { title: '注册', url: '/register' },
                ],
            }
        },
    },
}
