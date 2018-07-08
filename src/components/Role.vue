<template>
    <v-adapter>
        <v-toolbar flat class="transparent">
            <v-toolbar-title>组织架构</v-toolbar-title>
            <v-divider class="mx-2" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-dialog v-model="dialog" max-width="500px">
                <v-btn slot="activator" class="mb-2" flat>创建角色</v-btn>
                <v-card>
                    <v-card-title>
                        <span class="headline">{{ formTitle }}</span>
                    </v-card-title>

                    <v-card-text>
                        <v-container grid-list-md>
                            <v-layout wrap>
                                <v-flex xs12 sm12 md12>
                                    <v-text-field v-model="editedItem.RoleName" label="角色名" single-line></v-text-field>
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
                <td class="text-xs-left">{{ props.item.IDS }}</td>
                <td class="text-xs-left">{{ props.item.RoleName }}</td>
                <td class="text-xs-right">
                    <v-icon small class="mr-2" @click="editItem(props.item)">edit</v-icon>
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
            headers: [
                { text: 'Role_ID', align: 'left', value: 'ID' },
                { text: 'Role_Name', value: 'RoleName' },
                { text: 'Actions', align: 'right', sortable: false },
            ],
            desserts: [],
            editedIndex: -1,
            editedItem: {
                RoleName: '',
                ID: 0,
            },
            defaultItem: {
                RoleName: '',
                ID: 0,
            }
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
            const it = this.editedItem
            const id = this.editedIndex
            if (id > -1) {
                // 编辑角色
                this.$http.put("/admin/role/" + it.ID, {
                    "role_name": it.RoleName,
                }).then(resp => {
                    if ("success" == resp.data.msg) {
                        Object.assign(this.desserts[id], it)
                    } else {
                        console.log("更新失败")
                    }
                }).catch(err => {
                    console.log(err)
                })
            } else {
                // 创建角色
                this.$http.post("/admin/role", {"role_name": it.RoleName}).then(resp => {
                    if (this.checkResp(resp.data)) {
                        let tmp = resp.data
                        tmp.IDS = "r" + resp.data.rid
                        tmp.RoleName = it.RoleName
                        this.desserts.unshift(tmp)
                    } else {
                        console.log("添加失败")
                    }
                }).catch( err => {
                    console.log(err)
                })
            }
            this.close()
        },

        editItem (item) {
            this.editedIndex = this.desserts.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialog = true
        },

        deleteItem (item) {
            if (item.ID < 4) {
                return
            }
            const index = this.desserts.indexOf(item)
            if (!confirm('Are you sure you want to delete this item?')) return;

            this.editedItem = Object.assign({}, item)
            this.$http.delete("/admin/role/" + item.ID).then(resp => {
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
            return this.$http.get("/admin/role",{
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
                    let items = resp.roles
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
    },
    watch: {
        pagination: {
            handler () {
                this.getDataFromApi().then( resp => {
                    let items = resp.items
                    let total = resp.total
                    for (let i=0,l=items.length; i<l; i++) {
                        items[i].IDS = "r" + items[i].ID
                    }
                    this.desserts = items;
                    this.totalDesserts = total
                    this.loading = false
                })
            },
            deep: true
        }
    },
    mounted () {
        // this.getDataFromApi()
    },
    computed: {
        formTitle () {
            return this.editedIndex === -1 ? '创建角色' : '编辑角色'
        }
    },
}
</script>
