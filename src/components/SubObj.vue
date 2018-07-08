<template>
    <v-adapter>
        <!-- 表格头部内容 -->
        <v-toolbar flat color="transparent">
            <v-toolbar-title>角色-权限</v-toolbar-title>
            <v-divider
                class="mx-2"
                inset
                vertical
                ></v-divider>
            <v-spacer></v-spacer>
            <v-dialog v-model="dialog" max-width="500px">
                <v-btn slot="activator" flat dark class="mb-2">新建映射</v-btn>
                <v-card>
                    <v-card-title>
                        <span class="headline">{{ formTitle }}</span>
                    </v-card-title>

                    <v-card-text>
                        <v-container grid-list-md>
                            <v-layout wrap>
                                <v-flex xs12 sm6 md6>
                                    <v-select
                                        v-model="editedItem.SubID"
                                        :items="roles"
                                        item-text="RoleName"
                                        item-value="ID"
                                        label="角色"
                                        single-line
                                        :disabled="editedIndex != -1"
                                        ></v-select>
                                </v-flex>
                                <v-flex xs12 sm6 md6>
                                    <v-text-field v-model="editedItem.Obj" label="资源" :disabled="editedIndex != -1"></v-text-field>
                                </v-flex>
                                <v-flex xs4 sm4 md4>
                                    <v-switch
                                        :label="`${editedItem.Deny == 'allow' ? '允许':'拒绝'}`"
                                        v-model="editedItem.Deny"
                                        value="allow"
                                        ></v-switch>
                                </v-flex>
                                <v-flex xs8 sm8 md8>
                                    <v-layout>
                                        <v-flex xs4><v-checkbox label="增" v-model="editedItem.ActA" value="POST"></v-checkbox></v-flex>
                                        <v-flex xs4><v-checkbox label="删" v-model="editedItem.ActA" value="DELETE"></v-checkbox></v-flex>
                                        <v-flex xs4><v-checkbox label="改" v-model="editedItem.ActA" value="PUT"></v-checkbox></v-flex>
                                        <v-flex xs4><v-checkbox label="查" v-model="editedItem.ActA" value="GET"></v-checkbox></v-flex>
                                    </v-layout>
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
                <td class="text-xs-left">{{ props.item.SubValue }}</td>
                <td class="text-xs-left">{{ props.item.Obj }}</td>
                <td class="text-xs-left">{{ disposeAct(props.item.ActA).join("，") }}</td>
                <td class="text-xs-left">{{ props.item.Deny == 'allow' ? '允许':'拒绝' }}</td>
                <td class="text-xs-right">
                    <v-icon small @click="editItem(props.item)">edit</v-icon>
                    <v-icon small @click="deleteItem(props.item)">delete</v-icon>
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
            // ToolBar
            dialog: false,
            roles: [],

            // V-DATA-TABLE
            // 排序字段需指定value
            headers: [
                { text: '角色名称', align: 'left', value: 'SubValue' },
                { text: '资源路径', align: 'left', value: 'Obj' },
                { text: '请求方法', align: 'left', value: 'Act' },
                { text: '允许拒绝', align: 'left', value: 'Deny' },
                { text: '修改删除', align: 'right', sortable: false },
            ],
            desserts: [],
            totalDesserts: 0,
            pagination: {},
            loading: true,
            editedIndex: -1,
            editedItem: {
                SubValue: '',
                SubID: 0,
                Obj: '',
                Act: '',
                ActA: [],
                Deny: '',
            },
            defaultItem: {
                SubValue: '',
                SubID: 0,
                Obj: '',
                Act: '',
                ActA: [],
                Deny: '',
            }
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
            return this.$http.get("/admin/sub_obj",{
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
                // 对所有数据排序（忽视分页）
                return new Promise((resolve, reject) => {
                    let items = resp.value
                    const total = items.length
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
                    if (rowsPerPage > 0) {
                        items = items.slice((page - 1) * rowsPerPage, page * rowsPerPage)
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

        // 删除内容
        deleteItem (item) {
            const index = this.desserts.indexOf(item)
            if (!confirm('Are you sure you want to delete this item?')) return
            this.$http.delete("/admin/sub_obj", {data:item}).then(resp => {
                if (this.checkResp(resp.data)) {
                    this.desserts.splice(index, 1)
                }
            })
        },

        // 关闭dialog
        close () {
            this.dialog = false
            setTimeout(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            }, 300)
        },

        // 执行dialog中的按钮操作
        save () {
            let id = this.editedIndex
            let it = this.editedItem
            if ("" == it.Deny || null == it.Deny) {
                it.Deny = "deny"
            }

            if (id > -1) {
                // 更新
                this.$http.put("/admin/sub_obj", it).then(resp => {
                    if (this.checkResp(resp.data)) {
                        Object.assign(this.desserts[id], it)
                    }
                })
            } else {
                // 新增
                this.$http.post("/admin/sub_obj", it).then(resp => {
                    if (this.checkResp(resp.data)) {
                        this.desserts.unshift(it)
                    }
                })
            }
            this.close()
        },

        // (POST)|(GET) => ["POST","GET"]
        disposeActA() {
            for(let i=0, l=this.desserts.length; i<l; i++) {
                let rult = this.desserts[i].Act.split("|")
                let tmpr = new Array()
                for(let j=0, m=rult.length; j<m; j++) {
                    switch(rult[j]) {
                        case "(POST)":
                            rult[j]="POST"; break;
                        case "(DELETE)":
                            rult[j]="DELETE"; break;
                        case "(PUT)":
                            rult[j]="PUT"; break;
                        case "(GET)":
                            rult[j]="GET"; break;
                    }
                }
                this.desserts[i].ActA = rult
            }
        },

        // ["POST","GET"] => ["增","查"]
        disposeAct(arr) {
            let a = new Array();
            arr.map(r => {
                switch(r) {
                    case "POST": a.push("增"); break;
                    case "DELETE": a.push("删"); break;
                    case "PUT": a.push("改"); break;
                    case "GET": a.push("查"); break;
                }
            })
            return a;
        },

        getRoles() {
            this.$http.get("/admin/role",{
                params: {
                    start: 1,
                    lines: -1,
                }
            }).then(resp => {
                if (this.checkResp(resp.data)) {
                    this.roles = resp.data.roles
                }
            })
        }
    },

    watch: {
        // V-DATA-TABLE
        // 分页监听
        pagination: {
            handler () {
                this.getDataFromApi().then(resp => {
                    this.desserts = resp.items
                    this.disposeActA()
                    this.totalDesserts = resp.total
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

    mounted: function() {
        this.getRoles()
    }
}
</script>
