<script setup>
import request from '../utils/request.js';
import ChildDataTable from '../components/childdatatable.vue'
</script>
<template>
    <v-parallax height="350"
        src="https://djupload.oss-cn-beijing.aliyuncs.com/etrans56/topSupplier/5fbfed85e292482db0902791bf01fe3a.jpg">
        <div class="d-flex flex-column fill-height justify-center align-center text-white">
            <h1 class="text-h4 font-weight-thin mb-4 text-white">
                订阅报价单
            </h1>
            <h4 class="subheading">
                Subscribe
            </h4>
        </div>
    </v-parallax>
    <v-card flat class="mx-auto  mt-5 mb-10" max-width="1200">
        <v-toolbar>
            <v-card-text>

                <v-btn-group v-model="toggle" divided variant="outlined">
                    <v-btn @click="setCargoType('整箱')">整箱</v-btn>
                    <v-btn @click="setCargoType('拼箱')">拼箱</v-btn>

                </v-btn-group>
            </v-card-text>
            <v-spacer></v-spacer>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-card-text color="primary" dark class="mx-4" prepend-icon="mdi-plus-box">
                订阅请于运价查询表处最左侧订阅
            </v-card-text>
        </v-toolbar>
        <v-divider></v-divider>
        <v-card-text class="pa-0">
            <v-data-table-server v-model:expanded="expanded" :search="search" :headers="headers" :items-length="totalRows"
                :items="sublist" :loading="loading" loading-text="努力加载中" :items-per-page="size" no-data-text="没有找到数据捏"
                @update:options="updatesubList" items-per-page-text="每页显示" fixed-header hover show-expand
                item-value="subscriptionID">

                <template v-slot:item.actions="{ item }">
                    <v-icon size="small" class="me-2" color="blue" @click="openModifyDialog(item)">
                        mdi-pencil
                    </v-icon>

                    <v-icon size="small" class="me-2" color="red" @click="openDeleteDialog(item)">
                        mdi-delete
                    </v-icon>

                </template>
                <template v-slot:expanded-row="{ columns, item }">
                    <td :colspan="columns.length">
                        <ChildDataTable :id="getSpecificId(item)" :cargoType="item.cargotype" />
                    </td>


                </template>
            </v-data-table-server>
        </v-card-text>
    </v-card>
    <v-dialog v-model="dialogDelete" max-width="200px">
        <v-card>
            <v-card-title class="text-h6 text-center">确认删除?</v-card-title>
            <v-divider></v-divider>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="red" density="compact" icon="mdi-close" @click="closeDelete"></v-btn>
                <v-btn color="green" density="compact" icon="mdi-check" @click="deleteItemConfirm"></v-btn>
                <v-spacer></v-spacer>
            </v-card-actions>
        </v-card>
    </v-dialog>
    <v-dialog v-model="dialogModify" max-width="600px">
        <v-card>
            <v-card-title>
                <span class="text-h5">修改</span>
            </v-card-title>

            <v-card-text>
                <v-container>
                    <v-row>
                        <v-col cols="5">
                            <v-text-field v-model="editpol" label="起运港" readonly></v-text-field>
                        </v-col>
                        <v-col cols="5">
                            <v-text-field v-model="editdestination" label="目的港" readonly></v-text-field>
                        </v-col>
                        <v-col cols="5">
                            <v-text-field v-model="editcargotype" label="货物类型" readonly></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="8">
                            <v-text-field v-model="editemail" label="填写邮箱"></v-text-field>
                        </v-col>
                        <v-col cols="12">
                            <v-textarea v-model="editother" label="备注"></v-textarea>
                        </v-col>

                    </v-row>
                </v-container>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="red" icon="mdi-close" variant="text" @click="close"></v-btn>
                <v-btn color="green" icon="mdi-check" variant="text" @click="save"></v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    <v-snackbar :timeout="2000" color="primary" rounded="pill" close-on-content-click timer v-model="complete">
        <strong>修改成功</strong>.
    </v-snackbar>
</template>
  
<script>
import ChildDataTable from '../components/childdatatable.vue'
const storedUser = JSON.parse(localStorage.getItem('user'));
export default {
    components: {
        ChildDataTable,
    },
    data() {
        return {
            expanded: [],
            search: '',
            sublist: [],
            page: 1,
            size: 10,
            totalRows: 0,
            loading: false,
            headers: [

                { title: '起运港', key: 'pol', align: 'center', sortable: false },
                { title: '目的港', key: 'destination', align: 'center', sortable: false },
                { title: '货物类型', key: 'cargotype', align: 'center', sortable: false },
                { title: '邮箱', key: 'email', align: 'center', sortable: false },
                { title: '备注', key: 'other', align: 'center', sortable: false },
                { title: '修改/删除', key: 'actions', align: 'center', sortable: false },


            ],
            cargoType: '',
            dialogDelete: false,
            dialogModify: false,
            selectedItemToDelete: '',


            editpol: '',
            editdestination: '',
            editcargotype: '',
            editemail: '',
            editother: '',
            editID: '',

            complete: false,



        }
    },
    methods: {
        getSpecificId(item) {
            if (item.cargotype === '整箱') {
                return item.fcl.fclid;
            } else if (item.cargotype === '拼箱') {
                return item.lcl.lclid;
            }
        },
        openDeleteDialog(item) {
            this.selectedItemToDelete = item.subscriptionID;
            this.dialogDelete = true;
        },
        closeDelete() {
            this.selectedItemToDelete = null;
            this.dialogDelete = false;
        },
        openModifyDialog(item) {

            this.editpol = item.pol;
            this.editdestination = item.destination;
            this.editcargotype = item.cargotype;
            this.editemail = item.email;
            this.editother = item.other;
            this.editID = item.subscriptionID;
           
            this.dialogModify = true;


        },
        close() {
            this.editpol = null;
            this.editdestination = null;
            this.editcargotype = null;
            this.editemail = null;
            this.editother = null;
            this.editID = null;

            this.dialogModify = false;

        },

        async save() {
            const requestData = {
                email: this.editemail,
                other: this.editother,
                
            }
            console.log('Email:', this.editemail);
            console.log('Other:', this.editother);
            console.log('ID:', this.editID);
            if (this.editID) {
                try {
                    // 发送请求到后端
                    await request.put(`/ship/modify/${this.editID}`, requestData);
                    this.complete = true;


                    this.setCargoType();
                } catch (error) {
                    console.error('Error deleting subscription:', error);
                } finally {
                    // 关闭对话框
                    this.close();
                }
            }

        },
        async deleteItemConfirm() {

            if (this.selectedItemToDelete) {
                try {

                    // 发送删除请求到后端
                    await request.delete(`/ship/deletesub/${this.selectedItemToDelete}`);

                    // 在前端更新列表，可以重新调用获取列表的方法或直接从列表中移除被删除的项

                    this.setCargoType();
                } catch (error) {
                    console.error('Error deleting subscription:', error);
                } finally {
                    // 关闭对话框
                    this.closeDelete();
                }
            }
        },

        async setCargoType(type) {
            const storedUser = JSON.parse(localStorage.getItem('user'));
            
            this.loading = true;
            this.cargoType = type;
            // 构造查询参数
            const params = {
                cargotype: this.cargoType,
                userid:storedUser.userid,
                page: this.page - 1,
                size: this.size,


            };


            try {
                // 发起请求
                const response = await request.get('/ship/getSub',
                    { params });

                // 更新分页数据和总行数
                this.sublist = response.data.content;
                this.totalRows = response.data.totalElements;
                console.log(response.data);


            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                this.loading = false;
            }
        },
        updatesubList(newOptions) {
            // 处理分页组件的更新事件
            this.loading = true;
            this.page = newOptions.page;
            this.size = newOptions.itemsPerPage;

            this.setCargoType();
            this.loading = false;
        },





    }
}
</script>