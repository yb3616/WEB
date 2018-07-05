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
                                    <v-text-field v-model="editedItem.rolename" label="角色名" single-line></v-text-field>
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



        <v-data-table :headers="headers" :items="desserts" hide-actions class="elevation-1">
            <template slot="items" slot-scope="props">
                <td class="text-xs-left">{{ props.item.roleid }}</td>
                <td class="text-xs-left">{{ props.item.rolename }}</td>
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
            dialog: false,
            headers: [
                { text: 'Role_ID', align: 'left', value: 'roleid' },
                { text: 'Role_Name', value: 'rolename' },
                { text: 'Actions', align: 'right', sortable: false },
            ],
            desserts: [],
            editedIndex: -1,
            editedItem: {
                rolename: '',
                roleid: '',
            },
            defaultItem: {
                rolename: '',
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
            if (this.editedIndex > -1) {
                // 编辑角色
                this.$http.put("/admin/role/"+parseInt(this.editedItem.roleid.substring(1)), {
                    "role_name": this.editedItem.rolename,
                }).then(resp => {
                    if ("success" == resp.data.msg) {
                        Object.assign(this.desserts[this.editedIndex], this.editedItem)
                    } else {
                        console.log("更新失败")
                    }
                }).catch(err => {
                    console.log(err)
                })
            } else {
                // 创建角色
                this.$http.post("/admin/role", {"role_name": this.editedItem.rolename}).then(resp => {
                    if ("success" == resp.data.msg) {
                        this.desserts.push({
                            rolename: this.editedItem.rolename,
                            roleid: "r"+resp.data.rid,
                        })
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
            const index = this.desserts.indexOf(item)
            if (!confirm('Are you sure you want to delete this item?')) return;

            this.editedItem = Object.assign({}, item)
            this.$http.delete("/admin/role/"+parseInt(this.editedItem.roleid.substring(1))).then(resp => {
                if (this.checkResp(resp.data)) {
                    this.desserts.splice(index, 1)
                }
            }).catch(err => {
                console.log(err);
            });
        },
    },
    mounted () {
        this.$http.get("/admin/role").then( resp => {
            if ("success" == resp.data.msg) {
                resp.data.roles.map((item) => {
                    this.desserts.push({
                        'value': false,
                        'roleid': "r"+item.ID,
                        'rolename': item.RoleName,
                    })
                })
            }
        }).catch(err => {
            console.log(err);
        })
    },
    computed: {
        formTitle () {
            return this.editedIndex === -1 ? '创建角色' : '编辑角色'
        }
    },
}
</script>
