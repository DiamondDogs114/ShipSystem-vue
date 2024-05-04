<script setup>
import request from '../utils/request.js';
import tooltipbtn from '../components/tooltipbtn.vue';
</script>
<template>
    <v-card flat class="mx-auto  mt-5 mb-10 pa-0 elevation-2" height="585">
        <v-row no-gutters class="operateArea">
            <v-col cols="3" class="col">
                <tooltipbtn icon="mdi-plus" :tooltip-text="'添加'" @click="openimportDialog"></tooltipbtn>
                <tooltipbtn icon="mdi-refresh" :tooltip-text="'刷新'" @click="getfcl()"></tooltipbtn>

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
                        <v-text-field v-model="fclcarrier" label="船公司" variant="solo" hide-details density="comfortable"
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
                <v-toolbar color="cyan-lighten-2" title="整箱修改报价"></v-toolbar>
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
                            <v-text-field v-model="configdate" label="船期" variant="outlined"
                                :rules="addrule"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <v-text-field v-model="configclosingdate" label="截关" variant="outlined"
                                :rules="addrule"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <v-text-field v-model="config20gp" label="20GP" variant="outlined"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <v-text-field v-model="config40gp" label="40GP" variant="outlined"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12">
                            <v-text-field v-model="config40hq" label="40HQ" variant="outlined"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12">
                            <v-text-field v-model="configother" label="备注" variant="outlined"></v-text-field>
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
    <v-dialog v-model="importfclinfo" transition="dialog-top-transition" width="400">

        <v-card>
            <v-form ref="importForm" validate-on="submit lazy" @submit.prevent="importfcl">
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
                            <v-text-field v-model="importcarrier" label="船公司" variant="outlined"
                                :rules="importrule"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <v-text-field v-model="importORT" label="航线" variant="outlined"
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
                            <v-text-field v-model="importvoyage" label="航程" variant="outlined"
                                :rules="importrule"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <v-text-field v-model="importdate" label="船期" variant="outlined"
                                :rules="importrule"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <v-text-field v-model="importclosingdate" label="截关" variant="outlined"
                                :rules="importrule"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <v-text-field v-model="import20gp" label="20GP" variant="outlined"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <v-text-field v-model="import40gp" label="40GP" variant="outlined"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12">
                            <v-text-field v-model="import40hq" label="40HQ" variant="outlined"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12">
                            <v-text-field v-model="importother" label="备注" variant="outlined"></v-text-field>
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

    <v-snackbar :timeout="2000" color="success" rounded="pill" close-on-content-click v-model="complete">
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

        configinfo: false,
        dialogDelete: false,
        complete: false,
        configcomplete: false,
        importfclinfo: false,


        headers: [
            { title: '操作', key: 'actions', align: 'center', sortable: false, width: '100px' },
            { title: '编号', key: 'fclid', align: 'center', sortable: false, width: '100px' },
            { title: '起运港', key: 'fclpol', align: 'center', sortable: false, width: '100px' },
            { title: '目的港', key: 'fcldes', align: 'center', sortable: false, width: '100px' },
            { title: '船公司', key: 'fclcarrier', align: 'center', sortable: false, width: '100px' },
            { title: '航线', key: 'fclORT', align: 'center', sortable: false, width: '100px' },
            { title: '中转港', key: 'fclTransit', align: 'center', sortable: false, width: '100px' },
            { title: '航程', key: 'voyage', align: 'center', sortable: false, width: '100px' },
            { title: '船期', key: 'fclShipDate', align: 'center', sortable: false, width: '120px' },
            { title: '截关/开航', key: 'closingdate', align: 'center', sortable: false, width: '100px' },
            { title: '20GP', key: 'smallgpprice', align: 'center', sortable: false, width: '100px' },
            { title: '40GP', key: 'biggpprice', align: 'center', sortable: false, width: '100px' },
            { title: '40HQ', key: 'hqprice', align: 'center', sortable: false, width: '100px' },
            { title: '备注', key: 'otherinfo', align: 'center', sortable: false, width: '120px' },




        ],
        addrule: [
            value => !!value || '不能为空！',
        ],
        importrule: [
            value => !!value || '不能为空！',
        ],



        fclcarrier: '',
        pol: '',
        des: '',
        selectedItemToDelete: null,

        configID: null,
        configpol: null,
        configdes: null,
        configdate: null,
        configclosingdate: null,
        config20gp: null,
        config40gp: null,
        config40hq: null,
        configother: null,

        importpol: null,
        importdes: null,
        importcarrier: null,
        importORT: null,
        importtransit: null,
        importvoyage: null,
        importdate: null,
        importclosingdate: null,
        import20gp: null,
        import40gp: null,
        import40hq: null,
        importother: null,


    }),
    watch: {
        pol() {
            this.search = String(Date.now())
        },
        des() {
            this.search = String(Date.now())
        },
        fclcarrier() {
            this.search = String(Date.now())
        },



    },
    methods: {
        openDeleteDialog(item) {
            this.selectedItemToDelete = item.fclid;
            this.dialogDelete = true;
        },
        closeDelete() {
            this.selectedItemToDelete = null;
            this.dialogDelete = false;
        },
        openConfigDialog(item) {
            this.configpol = item.fclpol;
            this.configdes = item.fcldes;
            this.configID = item.fclid;
            this.configinfo = true;


        },
        closeConfigDialog() {
            this.configdate = null;
            this.configclosingdate = null;
            this.config20gp = null;
            this.config40gp = null;
            this.config40hq = null;
            this.configother - null;
            this.configID = null;
            this.configinfo = false;


        },
        openimportDialog() {
            this.importfclinfo = true;
        },
        closeimportDialog() {
            this.importpol = null;
            this.importdes = null;
            this.importcarrier = null;
            this.importORT = null;
            this.importtransit = null;
            this.importvoyage = null;
            this.importdate = null;
            this.importclosingdate = null;
            this.import20gp = null;
            this.import40gp = null;
            this.import40hq = null;
            this.importother = null;

            this.importfclinfo = false;

        },
        async importfcl() {
            const { valid } = await this.$refs.importForm.validate();
            if (valid) {
                const data = {
                    fclpol: this.importpol,
                    fcldes: this.importdes,
                    fclcarrier: this.importcarrier,
                    fclORT: this.importORT,
                    fclTransit: this.importtransit,
                    voyage: this.importvoyage,
                    fclShipDate: this.importdate,
                    closingdate: this.importclosingdate,
                    smallgpprice: this.import20gp,
                    biggpprice: this.import40gp,
                    hqprice: this.import40hq,
                    otherinfo: this.importother,

                };
                console.log('add:', data);
                try {
                    // 发送请求到后端
                    await request.post('/ship/addTofcl', data);
                    this.configcomplete = true;

                    this.getfcl();
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
                    fclShipDate: this.configdate,
                    closingdate: this.configclosingdate,
                    smallgpprice: this.config20gp,
                    biggpprice: this.config40gp,
                    hqprice: this.config40gp,
                    otherinfo: this.configother,

                }

                if (this.configID) {
                    try {
                        // 发送请求到后端
                        await request.put(`/ship/modifyfcl/${this.configID}`, requestData);

                        this.configcomplete = true;
                        this.getfcl();
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
                    await request.delete(`/ship/deletefcl/${this.selectedItemToDelete}`);

                    // 在前端更新列表，可以重新调用获取列表的方法或直接从列表中移除被删除的项

                    this.getfcl();
                    this.complete = true;
                } catch (error) {
                    console.error('Error deleting subscription:', error);
                } finally {
                    // 关闭对话框
                    this.closeDelete();
                }
            }
        },

        async getfcl() {
            this.loading = true;
            const params = {
                fclpol: this.pol,
                fcldes: this.des,
                fclcarrier: this.fclcarrier,

                page: this.page - 1,
                size: this.size,
            };

            try {
                // 发起请求
                const response = await request.get('/ship/getfcl',
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

            this.getfcl();
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