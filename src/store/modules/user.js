export default {
    state: {
        info: {},
    },
    mutations: {
        login: (state, data) => {
            state.info = data;
        },
        logout: state => {
            state.info = {};
        }
    }
}
