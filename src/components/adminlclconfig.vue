<script setup>
import request from '../utils/request.js';
import tooltipbtn from '../components/tooltipbtn.vue';
</script>
<template>
    <v-card flat class="mx-auto  mt-5 mb-10 pa-0 elevation-2" height="585">
        <v-row no-gutters class="operateArea">
            <v-col cols="3" class="col">
                <tooltipbtn icon="mdi-plus" :tooltip-text="'添加'" @click="openimportDialog"></tooltipbtn>
                <tooltipbtn icon="mdi-refresh" :tooltip-text="'刷新'" @click="getlcl()"></tooltipbtn>

            </v-col>

            <v-col cols="9">
                <v-row no-gutters>
                    <v-col cols="4">
                        <v-text-field v-model="pol" label="起运港" variant="solo" hide-details density="comfortable"
                            class="ml-5 mt-1" clearable></v-text-field>
                    </v-col>
                    <v-col cols="4">
                        <v-text-field v-model="des" label="目的港" variant="solo" hide-details density="comfortable"
                            class="ml-5 mt-1" clearable></v-text-field>
                    </v-col>
                    <v-col cols="4">
                        <v-text-field v-model="method" label="运输方式" variant="solo" hide-details density="comfortable"
                            class="ml-5 mt-1" clearable></v-text-field>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
        <v-card-text class="pa-0 mt-5">
            <v-data-table-server :search="search" :headers="headers" :items-length="totalRows" :items="shiplist"
                :loading="loading" loading-text="努力加载中" :items-per-page="size" no-data-text="没有找到数据捏"
                @update:options="updateshipList" items-per-page-text="每页显示" item-value="fclid" fixed-header hover
                height="450">

                <template v-slot:item.actions="{ item }">
                    <v-tooltip text="删除" location="start">
                        <template v-slot:activator="{ props }">
                            <v-icon v-bind="props" size="small" class="me-2" color="red" @click="openDeleteDialog(item)">
                                mdi-close
                            </v-icon>
                        </template>
                    </v-tooltip>
                    <v-tooltip text="修改" location="end">
                        <template v-slot:activator="{ props }">
                            <v-icon v-bind="props" size="small" class="me-2" color="cyan-lighten-2"
                                @click="openConfigDialog(item)">
                                mdi-pencil
                            </v-icon>
                        </template>
                    </v-tooltip>


                </template>
            </v-data-table-server>
        </v-card-text>
    </v-card>
    <v-dialog v-model="configinfo" transition="dialog-top-transition" width="400">

        <v-card>
            <v-form ref="configForm" validate-on="submit lazy" @submit.prevent="config">
                <v-toolbar color="cyan-lighten-2" title="拼箱修改报价"></v-toolbar>
                <v-card-text>
                    <v-row>
                        <v-col>
                            <v-text-field v-model="configpol" label="起运港" variant="outlined" :rules="addrule"
                                readonly></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <v-text-field v-model="configdes" label="目的港" variant="outlined" :rules="addrule"
                                readonly></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <v-text-field v-model="configcbm" label="CBM" variant="outlined"
                                :rules="addrule"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <v-text-field v-model="configton" label="TON" variant="outlined"
                                :rules="addrule"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <v-text-field v-model="configotherprice" label="其他价格" variant="outlined"></v-text-field>
                        </v-col>
                    </v-row>

                </v-card-text>
                <v-card-actions class="justify-end">
                    <v-btn color="cyan-lighten-2" variant="text" type="submit">修改</v-btn>
                    <v-btn variant="text" @click="closeConfigDialog">关闭</v-btn>
                </v-card-actions>
            </v-form>
        </v-card>
    </v-dialog>
    <v-dialog v-model="importlclinfo" transition="dialog-top-transition" width="400">

        <v-card>
            <v-form ref="importForm" validate-on="submit lazy" @submit.prevent="importlcl">
                <v-toolbar color="cyan-lighten-2" title="添加"></v-toolbar>
                <v-card-text>
                    <v-row>
                        <v-col>
                            <v-text-field v-model="importpol" label="起运港" variant="outlined"
                                :rules="importrule"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <v-text-field v-model="importdes" label="目的港" variant="outlined"
                                :rules="importrule"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <v-text-field v-model="importmethod" label="运输方式" variant="outlined"
                                :rules="importrule"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <v-text-field v-model="importconsignee" label="收货人类型" variant="outlined"
                                :rules="importrule"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <v-text-field v-model="importtransit" label="中转港" variant="outlined"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <v-text-field v-model="importcarrier" label="船公司" variant="outlined"
                                :rules="importrule"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <v-text-field v-model="importCBM" label="CBM" variant="outlined"
                                :rules="importrule"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <v-text-field v-model="importTON" label="TON" variant="outlined"
                                :rules="importrule"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <v-text-field v-model="importotherprice" label="其他价格" variant="outlined"></v-text-field>
                        </v-col>
                    </v-row>

                </v-card-text>
                <v-card-actions class="justify-end">
                    <v-btn color="cyan-lighten-2" variant="text" type="submit">添加</v-btn>
                    <v-btn variant="text" @click="closeimportDialog">关闭</v-btn>
                </v-card-actions>
            </v-form>
        </v-card>
    </v-dialog>
    <v-dialog v-model="dialogDelete" max-width="500px">
        <v-card>
            <v-card-title class="text-h6 bg-cyan-lighten-2">提示</v-card-title>
            <v-divider></v-divider>
            <v-card-text>您确定要删除此条数据吗?</v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn density="compact" @click="closeDelete">取消</v-btn>
                <v-btn color="red" density="compact" @click="deleteItemConfirm">删除</v-btn>

            </v-card-actions>
        </v-card>
    </v-dialog>

    <v-snackbar :timeout="2000" color="primary" rounded="pill" close-on-content-click timer v-model="complete">
        <strong>删除成功</strong>.
    </v-snackbar>
    <v-snackbar :timeout="2000" color="success" rounded="pill" close-on-content-click v-model="configcomplete">
        <strong>成功</strong>.
    </v-snackbar>
</template>
  
<script>
const storedUser = JSON.parse(localStorage.getItem('admin'));
export default {

    data: () => ({

        search: '',
        shiplist: [],
        loading: false,
        totalRows: 0,
        page: 1,
        size: 10,

        dialogDelete: false,
        complete: false,
        configinfo: false,
        configcomplete: false,
        importlclinfo:false,

        headers: [
            { title: '操作', key: 'actions', align: 'center', sortable: false, width: '100px' },
            { title: '编号', key: 'lclid', align: 'center', sortable: false, width: '100px' },
            { title: '起运港', key: 'lclpol', align: 'center', sortable: false, width: '100px' },
            { title: '目的港', key: 'lcldes', align: 'center', sortable: false, width: '100px' },
            { title: '运输方式', key: 'transportationmethod', align: 'center', sortable: false, width: '100px' },
            { title: '收货人类型', key: 'consignee', align: 'center', sortable: false, width: '100px' },
            { title: '中转港', key: 'lcltransit', align: 'center', sortable: false, width: '100px' },
            { title: '船公司', key: 'lclcarrier', align: 'center', sortable: false, width: '100px' },
            { title: 'CBM', key: 'cbmprice', align: 'center', sortable: false, width: '100px' },
            { title: 'TON', key: 'tonprice', align: 'center', sortable: false, width: '100px' },
            { title: '其他价格', key: 'otherprice', align: 'center', sortable: false, width: '100px' },




        ],
        addrule: [
            value => !!value || '不能为空！',
        ],
        importrule: [
            value => !!value || '不能为空！',
        ],




        method: '',
        pol: '',
        des: '',
        selectedItemToDelete: null,

        configID: null,
        configpol: null,
        configdes: null,
        configcbm: null,
        configton: null,
        configotherprice: null,

        importpol: null,
        importdes: null,
        importcarrier: null,
        importconsignee: null,
        importtransit: null,
        importmethod: null,
        importCBM: null,
        importTON: null,
        importotherprice: null,






    }),
    watch: {
        pol() {
            this.search = String(Date.now())
        },
        des() {
            this.search = String(Date.now())
        },
        method() {
            this.search = String(Date.now())
        },



    },
    methods: {
        openDeleteDialog(item) {
            this.selectedItemToDelete = item.lclid;
            this.dialogDelete = true;
        },
        closeDelete() {
            this.selectedItemToDelete = null;
            this.dialogDelete = false;
        },
        openConfigDialog(item) {
            this.configpol = item.lclpol;
            this.configdes = item.lcldes;
            this.configID = item.lclid;
            this.configinfo = true;


        },
        closeConfigDialog() {
            this.configcbm = null;
            this.configton = null;
            this.configotherprice = null;

            this.configID = null;
            this.configinfo = false;


        },
        openimportDialog() {
            this.importlclinfo = true;
        },
        closeimportDialog() {
            this.importpol = null;
            this.importdes = null;
            this.importcarrier = null;
            this.importconsignee = null;
            this.importtransit = null;
            this.importmethod = null;
            this.importCBM = null;
            this.importTON = null;
            this.importotherprice = null;


            this.importlclinfo = false;

        },
        async importlcl() {
            const { valid } = await this.$refs.importForm.validate();
            if (valid) {
                const data = {
                    lclpol: this.importpol,
                    lcldes: this.importdes,
                    lclcarrier: this.importcarrier,
                    consignee: this.importconsignee,
                    lcltransit: this.importtransit,
                    transportationmethod: this.importmethod,
                    cbmprice: this.importCBM,
                    tonprice: this.importTON,
                    otherprice: this.importotherprice,


                };
                console.log('add:', data);
                try {
                    // 发送请求到后端
                    await request.post('/ship/addTolcl', data);
                    this.configcomplete = true;

                    this.getlcl();
                } catch (error) {
                    console.error('Error add subscription:', error);
                } finally {
                    // 关闭对话框
                    this.closeimportDialog();
                }
            }
        },
        async config() {
            const { valid } = await this.$refs.configForm.validate();
            if (valid) {
                const requestData = {
                    cbmprice: this.configcbm,
                    tonprice: this.configton,
                    otherprice: this.configotherprice,


                }

                if (this.configID) {
                    try {
                        // 发送请求到后端
                        await request.put(`/ship/modifylcl/${this.configID}`, requestData);

                        this.configcomplete = true;
                        this.getlcl();
                    } catch (error) {
                        console.error('Error deleting subscription:', error);
                    } finally {
                        // 关闭对话框
                        this.closeConfigDialog();
                        this.iscontacted = true;
                    }
                }
            }

        },
        async deleteItemConfirm() {

            if (this.selectedItemToDelete) {
                try {

                    // 发送删除请求到后端
                    await request.delete(`/ship/deletelcl/${this.selectedItemToDelete}`);

                    // 在前端更新列表，可以重新调用获取列表的方法或直接从列表中移除被删除的项

                    this.getlcl();
                } catch (error) {
                    console.error('Error deleting subscription:', error);
                } finally {
                    // 关闭对话框
                    this.closeDelete();
                }
            }
        },

        async getlcl() {
            this.loading = true;
            const params = {
                lclpol: this.pol,
                lcldes: this.des,
                transportationmethod: this.method,

                page: this.page - 1,
                size: this.size,
            };

            try {
                // 发起请求
                const response = await request.get('/ship/getlcl',
                    { params });

                // 更新分页数据和总行数
                this.shiplist = response.data.content;
                this.totalRows = response.data.totalElements;

            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                this.loading = false;
            }
        },

        updateshipList(newOptions) {
            // 处理分页组件的更新事件
            this.loading = true;
            this.page = newOptions.page;
            this.size = newOptions.itemsPerPage;

            this.getlcl();
            this.loading = false;
        },

    },





}
</script>
<style>
.operateArea {
    width: 100%;
    min-width: 760px;
    display: flex;
    align-items: center;
    border-radius: 10px;
    padding: 0 10px;
}

.col {
    display: flex;
    align-items: center;
}
</style>