<template>
    <v-adapter>
        <!-- 表格头部内容 -->
        <v-toolbar flat color="transparent">
            <v-toolbar-title>用户管理</v-toolbar-title>
            <v-divider
                class="mx-2"
                inset
                vertical
                ></v-divider>
            <v-spacer></v-spacer>
            <v-dialog v-model="dialog" max-width="500px">
                <v-card>
                    <v-card-title>
                        <span class="headline">{{ formTitle }}</span>
                    </v-card-title>

                    <v-card-text>
                        <v-container grid-list-md>
                            <v-layout wrap>
                                <v-flex xs12 sm6 md6>
                                    <v-text-field v-model="editedItem.UserName" label="登录名"></v-text-field>
                                </v-flex>
                                <v-flex xs12 sm6 md6>
                                    <v-text-field v-model="editedItem.NickName" label="昵称"></v-text-field>
                                </v-flex>
                                <v-flex xs12 sm6 md6>
                                    <v-text-field v-model="editedItem.EmailAddress" label="邮箱"></v-text-field>
                                </v-flex>
                                <v-flex xs12 sm6 md6>
                                    <v-text-field v-model="editedItem.PhoneNumber" label="手机号"></v-text-field>
                                </v-flex>
                                <v-flex xs12 sm6 md6>
                                    <v-text-field v-model="editedItem.Password" label="密码"></v-text-field>
                                </v-flex>
                                <v-flex xs12 sm6 md6>
                                    <v-text-field v-model="editedItem.Password2" label="重复密码"></v-text-field>
                                </v-flex>
                                <v-flex xs12 sm12 md12>
                                    <v-switch
                                        :label="`${editedItem.DeletedAt ? '禁用':'启用'}`"
                                        v-model="editedItem.DeletedAt"
                                        :value="false"
                                        ></v-switch>
                                </v-flex>
                            </v-layout>
                        </v-container>
                    </v-card-text>

                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" flat @click.native="close">取消</v-btn>
                        <v-btn color="blue darken-1" flat @click.native="save">保存</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-toolbar>


        <!-- 数据内容表格 -->
        <v-data-table
            :headers="headers"
            :items="desserts"
            class="elevation-1"
            :pagination.sync="pagination"
            :total-items="totalDesserts"
            :loading="loading"
            :rows-per-page-items="[5, 10, 100]"
            disable-initial-sort
            >
            <template slot="items" slot-scope="props">
                <td class="text-xs-left">{{ props.item.UUID }}</td>
                <td class="text-xs-left">{{ props.item.UserName }}</td>
                <td class="text-xs-left">{{ props.item.NickName }}</td>
                <td class="text-xs-left">{{ props.item.PhoneNumber }}</td>
                <td class="text-xs-left">{{ props.item.EmailAddress }}</td>
                <td class="text-xs-left">{{ props.item.EmailAddress }}</td>
                <td class="text-xs-left">{{ props.item.DeletedAt?'禁用':'启用' }}</td>
                <td class="text-xs-right">
                    <v-icon small @click="editItem(props.item)">edit</v-icon>
                </td>
            </template>
        </v-data-table>
    </v-adapter>
</template>
<script>
import adapter from '@/components/Adapter.vue';
export default {
    data() {
        return {
            // V-DATA-TABLE
            // 排序字段需指定value
            headers: [
                { text: 'UID', align: 'left', value: 'ID' },
                { text: '登录名', align: 'left', value: 'UserName' },
                { text: '昵称', align: 'left', value: 'NickName' },
                { text: '手机号', align: 'left', value: 'PhoneNumber' },
                { text: '邮箱地址', align: 'left', value: 'EmailAddress' },
                { text: '角色', align: 'left', value: 'Roles' },
                { text: '是否禁用', align: 'left', value: 'DeletedAt' },
                { text: '操作', align: 'right', sortable: false },
            ],
            desserts: [],
            totalDesserts: 0,
            pagination: {},
            loading: true,
            editedIndex: -1,
            editedItem: {
                ID: 0,
                UUID: '',
                UserName: '',
                NickName: '',
                EmailAddress: '',
                PhoneNumber: '',
                Roles: [],
                Password: '',
                Password2: '',
                DeletedAt: '',
            },
            defaultItem: {
                ID: 0,
                UUID: '',
                UserName: '',
                NickName: '',
                EmailAddress: '',
                PhoneNumber: '',
                Roles: [],
                Password: '',
                Password2: '',
                DeletedAt: '',
            },
            dialog: false,
        }
    },

    methods: {
        // 加载表格数据内容
        getDataFromApi () {
            // 分页
            const { sortBy, descending, page, rowsPerPage } = this.pagination
            // 显示进度条
            this.loading = true
            // 向后台请求数据
            return this.$http.get("/admin/user2",{
                params: {
                    start: (page-1)*rowsPerPage+1,
                    lines: rowsPerPage,
                }
            }).then( resp => {
                return new Promise((resolve, reject) => {
                    if(this.checkResp(resp.data)) {
                        resolve(resp.data)
                    } else {
                        reject(resp.data.err)
                    }
                })
            }).then(resp => {
                // 对所有数据排序
                return new Promise((resolve, reject) => {
                    let items = resp.value
                    const total = resp.total
                    if (this.pagination.sortBy) {
                        items = items.sort((a, b) => {
                            const sortA = a[sortBy]
                            const sortB = b[sortBy]

                            if (descending) {
                                if (sortA < sortB) return 1
                                if (sortA > sortB) return -1
                                return 0
                            } else {
                                if (sortA < sortB) return -1
                                if (sortA > sortB) return 1
                                return 0
                            }
                        })
                    }
                    resolve({items, total})
                })
            })
        },
        // 修改内容
        editItem (item) {
            this.editedIndex = this.desserts.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialog = true
        },

        // 关闭dialog
        close () {
            this.dialog = false
            setTimeout(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            }, 300)
        },

        save () {
            let id = this.editedIndex
            let it = this.editedItem

            if (!it.DeletedAt) {
                it.DeletedAt = null
            } else {
                it.DeletedAt = new Date()
            }
            if (id > -1) {
                // 更新
                this.$http.put("/admin/user2", it).then(resp => {
                    if (this.checkResp(resp.data)) {
                        Object.assign(this.desserts[id], it)
                    }
                })
            } else {
                // 新增
            }
            this.close()
        },

    },

    watch: {
        // V-DATA-TABLE
        // 分页监听
        pagination: {
            handler () {
                this.getDataFromApi().then( resp => {
                    let items = resp.items
                    let total = resp.total
                    for (let i=0,l=items.length; i<l; i++) {
                        items[i].UUID = "u"+items[i].ID
                    }
                    this.desserts = items;
                    this.totalDesserts = total
                    this.loading = false
                })
            },
            deep: true
        }
    },


    // 网页不变内容
    components: {
        'v-adapter': adapter,
    },

    computed: {
        formTitle () {
            return this.editedIndex === -1 ? '新建映射' : '编辑映射'
        },
    },

}
</script>
