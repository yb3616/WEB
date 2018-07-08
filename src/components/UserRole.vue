<template>
    <v-adapter>
        <v-toolbar flat class="transparent">
            <v-toolbar-title>用户-角色</v-toolbar-title>
            <v-divider class="mx-2" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-dialog v-model="dialog" max-width="500px">
                <v-btn slot="activator" class="mb-2" flat>创建映射</v-btn>
                <v-card>
                    <v-card-title>
                        <span class="headline">{{ formTitle }}</span>
                    </v-card-title>

                    <v-card-text>
                        <v-container grid-list-md>
                            <v-layout wrap>
                                <v-flex xs12 sm6 md6>
                                    <v-select v-model="editedItem.uid" :items="users" item-text="UserName" item-value="ID" label="用户"></v-select>
                                </v-flex>
                                <v-flex xs12 sm6 md6>
                                    <v-select v-model="editedItem.rid" :items="roles" item-text="RoleName" item-value="ID" label="角色"></v-select>
                                </v-flex>
                            </v-layout>
                        </v-container>
                    </v-card-text>

                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn flat @click.native="close">取消</v-btn>
                        <v-btn flat @click.native="save">保存</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-toolbar>



        <v-data-table :headers="headers" :items="desserts" class="elevation-1" :pagination.sync="pagination" :total-items="totalDesserts" :loading="loading" :rows-per-page-items="rppi" disable-initial-sort>
            <template slot="items" slot-scope="props">
                <td class="text-xs-left">{{ props.item.uuid }}</td>
                <td class="text-xs-left">{{ props.item.username }}</td>
                <td class="text-xs-left">{{ props.item.rrid }}</td>
                <td class="text-xs-left">{{ props.item.rolename }}</td>
                <td class="text-xs-right">
                    <v-icon small @click="deleteItem(props.item)">delete</v-icon>
                </td>
            </template>
        </v-data-table>
    </v-adapter>
</template>

<script>
import adapter from '@/components/Adapter.vue';
export default {
    components: {
        'v-adapter': adapter,
    },
    data () {
        return {
            rppi: [5, 10, 100],
            dialog: false,
            totalDesserts: 0,
            pagination: {},
            loading: true,
            // 数据表头，排序验证字段，对齐方式
            headers: [
                { text: 'UID', align: 'left', value: 'uuid' },
                { text: 'User_Name', align: 'left', value: 'username' },
                { text: 'RID', align: 'left', value: 'rrid' },
                { text: 'Role_Name', align: 'left', value: 'rolename' },
                { text: 'Actions', align: 'right', sortable: false },
            ],
            desserts: [],
            editedIndex: -1,
            editedItem: {
                uuid: '',
                uid: '',
                username: '',
                rrid: '',
                rid: '',
                rolename: '',
                value: false,
            },
            defaultItem: {
                uuid: '',
                uid: '',
                rrid: '',
                username: '',
                rid: '',
                rolename: '',
                value: false,
            },
            roles: [],
            users: [],
        }
    },
    methods: {
        close () {
            this.dialog = false
            setTimeout(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            }, 300)
        },

        save () {
            if (this.editedIndex > -1) {
                // 编辑角色
            } else {
                // 创建角色
                this.$http.post("/admin/user_role", {
                    "rids": [this.editedItem.rid],
                    "uid": this.editedItem.uid,
                }).then(resp => {
                    if (this.checkResp(resp.data)) {
                        this.editedItem.username = this.getUserNameOrRoleNameByID(this.editedItem.uid, this.users)
                        this.editedItem.rolename = this.getUserNameOrRoleNameByID(this.editedItem.rid, this.roles)
                        this.editedItem.rrid = "r" + this.editedItem.rid;
                        this.editedItem.uuid = "u" + this.editedItem.uid;
                        this.desserts.unshift(this.editedItem)
                    } else {
                        console.log("添加失败")
                    }
                }).catch( err => {
                    console.log(err)
                })
            }
            this.close()
        },

        getUserNameOrRoleNameByID(id, arr) {
            let i = 0
            let l = arr.length
            for(; i<l; i++) {
                if (id == arr[i].ID) {
                    return arr[i].hasOwnProperty("UserName") ? arr[i].UserName : arr[i].RoleName
                }
            }
            return false
        },

        deleteItem (item) {
            if (0 == item.uid || (1 == item.rid && 1 == item.uid )) {
                return
            }
            const index = this.desserts.indexOf(item)
            if (!confirm('Are you sure you want to delete this item?')) return;

            this.editedItem = Object.assign({}, item)
            this.$http.delete("/admin/user_role/"+this.editedItem.rid+"/"+this.editedItem.uid).then(resp => {
                if (this.checkResp(resp.data)) {
                    this.desserts.splice(index, 1)
                }
            }).catch(err => {
                console.log(err);
            });
        },

        getDataFromApi () {
            const { sortBy, descending, page, rowsPerPage } = this.pagination
            this.loading = true
            this.$http.get("/admin/user_role", {
                params: {
                    start: (page-1)*rowsPerPage+1,
                    lines: rowsPerPage,
                }
            }).then( resp => {
                if (this.checkResp(resp.data)) {
                    this.desserts = []
                    resp.data.policy.map(item => {
                        this.desserts.push({
                            'value': false,
                            'uuid': "u"+item.User.ID,
                            'uid': item.User.ID,
                            'rrid': "r"+item.Role.ID,
                            'rid': item.Role.ID,
                            'username': item.User.Value,
                            'rolename': item.Role.Value,
                        })
                    })
                    this.totalDesserts = resp.data.total
                    this.loading = false
                }
            }).catch(err => {
                console.log(err);
            })
        },

        getUserRole() {
            this.$http.get("/admin/user", {
                params: {
                    start: 1,
                    lines: -1,
                }
            }).then(resp => {
                if (this.checkResp(resp.data)) {
                    this.users = resp.data.data
                    return this.$http.get("/admin/role", {
                        params: {
                            start: 1,
                            lines: -1,
                        }
                    })
                }
            }).then(resp => {
                if (this.checkResp(resp.data)) {
                    this.roles = resp.data.roles
                }
            }).catch(err => {
                console.log(err);
            })
        },
    },
    watch: {
        pagination: {
            handler () {
                this.getDataFromApi()
            },
            deep: true
        }
    },
    mounted () {
        this.getUserRole()
    },
    computed: {
        formTitle () {
            return this.editedIndex === -1 ? '创建角色' : '编辑角色'
        }
    },
}
</script>
