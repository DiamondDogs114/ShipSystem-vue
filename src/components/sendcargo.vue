<script setup>
import request from '../utils/request.js';
import tooltipbtn from '../components/tooltipbtn.vue';

</script>
<template>
    <v-container>
        <v-card flat class="mx-auto  mt-5 mb-10 elevation-2" height="585">
            <v-row no-gutters class="operateArea">
                <v-col cols="3" class="col">
                    <tooltipbtn icon="mdi-refresh" :tooltip-text="'刷新'" @click="getsend()"></tooltipbtn>
                    <tooltipbtn icon="mdi-plus" :tooltip-text="'添加'" @click="openimportDialog"></tooltipbtn>
                </v-col>
                <v-col cols="9">
                    <v-row no-gutters>
                        <v-col cols="4">
                            <v-text-field v-model="scompanyname" label="公司名称" variant="solo" hide-details
                                density="comfortable" class="ml-5 mt-1" clearable></v-text-field>
                        </v-col>
                        <v-col cols="4">
                            <v-text-field v-model="scargoname" label="货物名称" variant="solo" hide-details
                                density="comfortable" class="ml-5 mt-1" clearable></v-text-field>
                        </v-col>
                        <v-col cols="4">
                            <v-text-field v-model="ssendtime" label="装箱日期" variant="solo" hide-details density="comfortable"
                                class="ml-5 mt-1" clearable type="date" suffix="日期"></v-text-field>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>


            <div class="pa-0 mt-5">
                <v-data-table-server :search="search" :headers="headers" :items-length="totalRows" :items="sendlist"
                    :loading="loading" loading-text="努力加载中" :items-per-page="size" no-data-text="没有找到数据捏"
                    @update:options="updatesendList" items-per-page-text="每页显示" fixed-header hover item-value="sendid"
                    height="450">
                    <template v-slot:item.actions="{ item }">
                        <v-row>
                            <v-col>
                                <v-tooltip :text="getconfirmText(item.sendstatus)" location="bottom">
                                    <template v-slot:activator="{ props }">
                                        <v-btn v-bind="props" size="x-small" class="me-2" color="primary" variant="text"
                                            icon="mdi-check" @click="opencontactDialog(item)"
                                            :disabled="isDisabled(item.sendstatus)">

                                        </v-btn>
                                    </template>
                                </v-tooltip>
                                <v-tooltip :text="getmodifyText(item.sendstatus)" location="bottom">
                                    <template v-slot:activator="{ props }">
                                        <v-btn v-bind="props" size="x-small" class="me-2" color="black" variant="text"
                                            icon="mdi-pencil-outline" @click="openmodifyDialog(item)"
                                            :disabled="isDisabled(item.sendstatus)">

                                        </v-btn>
                                    </template>
                                </v-tooltip>
                                <v-tooltip :text="getdeleteText(item.sendstatus)" location="bottom">
                                    <template v-slot:activator="{ props }">
                                        <v-btn v-bind="props" size="x-small" class="me-2" color="red" variant="text"
                                            icon=" mdi-delete-outline" @click="opendeleteDialog(item)"
                                            :disabled="isDisabled(item.sendstatus)">

                                        </v-btn>
                                    </template>
                                </v-tooltip>
                            </v-col>
                        </v-row>
                    </template>
                    <template v-slot:item.sendstatus="{ item }">
                        <v-chip size="small" :color="item.sendstatus === '等待确认' ? 'grey' : 'green'" class="font-weight-bold">
                            {{ item.sendstatus }}</v-chip>
                    </template>
                </v-data-table-server>
            </div>
        </v-card>
        <v-dialog v-model="importsend" transition="dialog-top-transition" width="500">

            <v-card>
                <v-form ref="importForm" validate-on="submit lazy" @submit.prevent="send">
                    <v-toolbar color="cyan-lighten-2" title="添加"></v-toolbar>
                    <v-card-text>
                        <v-row>
                            <v-col>
                                <v-select v-model="addcname" label="所属公司" variant="outlined" :rules="importrule"
                                    :items="cname" clearable item-title="cname" item-value="cname"
                                    @click="fetchCompanyNames"></v-select>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col>
                                <v-select v-model="addcargo" label="货物名称" variant="outlined" :rules="importrule"
                                    :items="cargoforcname" clearable item-title="cargoforcname" item-vcalue="cargoforcname"
                                    @click="updateSelectedCompanyName"></v-select>
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
        <v-dialog v-model="modifysend" transition="dialog-top-transition" width="300">
            <v-card>
                <v-form ref="modifyForm" validate-on="submit lazy" @submit.prevent="modify">
                    <v-toolbar color="cyan-lighten-2" title="修改"></v-toolbar>
                    <v-card-text>
                        <v-row>
                            <v-col>
                                <v-select v-model="modifyset" label="码放方式" variant="outlined" :rules="importrule"
                                    :items="options" clearable item-title="state" item-value="abbr"></v-select>
                            </v-col>
                        </v-row>
                    </v-card-text>
                    <v-card-actions class="justify-end">
                        <v-btn color="cyan-lighten-2" variant="text" type="submit">修改</v-btn>
                        <v-btn variant="text" @click="closemodifyDialog">关闭</v-btn>
                    </v-card-actions>
                </v-form>
            </v-card>
        </v-dialog>
        <v-dialog v-model="confirmsending" max-width="500px">
            <v-card>

                <v-card-title class="text-h6 bg-cyan-lighten-2">提示</v-card-title>
                <v-divider></v-divider>
                <v-card-text>确认出货?
                </v-card-text>
                <v-card-actions class="justify-end">
                    <v-btn color="cyan-lighten-2" variant="text" @click="ItemConfirm">确认</v-btn>
                    <v-btn variant="text" @click="closeDialog">关闭</v-btn>
                </v-card-actions>

            </v-card>

        </v-dialog>
        <v-dialog v-model="confirmdelete" max-width="500px">
            <v-card>

                <v-card-title class="text-h6 bg-cyan-lighten-2">提示</v-card-title>
                <v-divider></v-divider>
                <v-card-text>是否删除?
                </v-card-text>
                <v-card-actions class="justify-end">
                    <v-btn color="red" variant="text" @click="deleteConfirm">确认</v-btn>
                    <v-btn variant="text" @click="closedeleteDialog">关闭</v-btn>
                </v-card-actions>

            </v-card>

        </v-dialog>
        <v-dialog v-model="warning" max-width="300px">
            <v-card>
                <v-card-title class="text-h6 bg-cyan-lighten-2">提示</v-card-title>
                <v-divider></v-divider>
                <v-card-text>该货物的货物编号重复！
                </v-card-text>
                <v-card-actions class="justify-end">
                    <v-btn variant="text" @click="closewarningDialog">关闭</v-btn>
                </v-card-actions>

            </v-card>
        </v-dialog>
        <v-dialog v-model="cargosetwarning" max-width="300px">
            <v-card>
                <v-card-title class="text-h6 bg-cyan-lighten-2">提示</v-card-title>
                <v-divider></v-divider>
                <v-card-text>该货物的码放方式还未确认！
                </v-card-text>
                <v-card-actions class="justify-end">
                    <v-btn color="cyan-lighten-2" variant="text" @click="takemodifyDialog(SendId)">前往确认</v-btn>
                    <v-btn variant="text" @click="closecargosetwarningDialog">关闭</v-btn>
                </v-card-actions>

            </v-card>
        </v-dialog>
    </v-container>
    <v-snackbar :timeout="2000" color="success" rounded="pill" close-on-content-click v-model="complete">
        <strong>成功</strong>.
    </v-snackbar>
</template>
  
<script>

export default {

    data() {
        return {


            search: '',

            headers: [
                { title: '操作', key: 'actions', align: 'center', sortable: false, width: '170px' },
                { title: '状态', key: 'sendstatus', align: 'center', sortable: false, width: '130px' },
                { title: '发货单号', key: 'sendid', align: 'center', sortable: false, width: '120px' },
                { title: '货物编号', key: 'cargoid', align: 'center', sortable: false, width: '120px' },
                { title: '货物名称', key: 'cargoname', align: 'center', sortable: false, width: '200px' },
                { title: '货物尺寸', key: 'cargosize', align: 'center', sortable: false, width: '100px' },
                { title: '货物重量', key: 'cargoweight', align: 'center', sortable: false, removable: true, width: '100px' },
                { title: '码放方式', key: 'cargoset', align: 'center', sortable: false, removable: true, width: '120px' },
                { title: '所属公司', key: 'companyinfo.companyname', align: 'center', sortable: false, removable: true, width: '200px' },
                { title: '能否承重', key: 'isbearing', align: 'center', sortable: false, removable: true, width: '100px' },
                { title: '出库时间', key: 'sendtime', align: 'center', sortable: false, removable: true, width: '200px' },

            ],
            importrule: [
                value => !!value || '不能为空！',
            ],



            sendlist: [],
            loading: false,
            totalRows: 0,
            page: 1,
            size: 10,


            importsend: false,

            complete: false,
            warning: false,
            modifysend: false,
            confirmdelete: false,
            confirmsending: false,
            cargosetwarning: false,


            confirmpacking: false,

            SendId: null,
            CargoId: null,
            arrivalID: null,
            addcname: null,
            addcargo: null,
            cname: [],
            cargoforcname: [],
            modifyset: null,
            options: [
                { state: '正放', abbr: '正放' },
                { state: '旋转', abbr: '旋转' },
                { state: '正放&旋转', abbr: '正放&旋转' },
                { state: '翻转', abbr: '翻转' },
                { state: '倾斜', abbr: '倾斜' },


            ],
            pcompanyname: null,
            pcargoname: null,
            pcargosize: null,
            pcargoweight: null,
            pcargoset: null,
            pisbearing: null,




            scompanyname: null,
            scargoname: null,
            ssendtime: null,

        }

    },
    watch: {
        scompanyname() {
            this.search = String(Date.now())
        },
        scargoname() {
            this.search = String(Date.now())
        },
        ssendtime() {
            this.search = String(Date.now())
        },

    },
    methods: {
        isDisabled(sendStatus) {

            return sendStatus === "已确认出库";
        },
        getconfirmText(sendStatus) {
            return this.isDisabled(sendStatus) ? "已确认" : "确认";
        },
        getmodifyText(sendStatus) {
            return this.isDisabled(sendStatus) ? "已确认无法修改" : "修改";
        },
        getdeleteText(sendStatus) {
            return this.isDisabled(sendStatus) ? "已确认无法删除" : "删除";
        },
        async fetchCompanyNames() {

            try {
                const response = await request.get('/com/allcompanynames');
                if (response.status = 200) {
                    const companyNames = response.data;

                    this.cname = companyNames;
                } else {
                    console.error('Failed to fetch company names');

                }
            } catch (error) {
                console.error('Error during fetch:', error);
                throw error;
            }
        },
        async send() {
            const { valid } = await this.$refs.importForm.validate();
            if (valid) {
                try {
                    const cargoId = this.addcargo.split('-')[0];
                    const checkDuplicateResponse = await request.get(`/wms/checkduplicate/${cargoId}`);

                    if (checkDuplicateResponse.data.isDuplicate) {
                        // 如果存在相同的 cargoid，则提示重复无法添加
                        this.warning = true;
                    } else {
                        console.log('cargoid', cargoId);
                        await request.post(`/wms/sendcargoinfo/${cargoId}`);
                        this.getsend();
                        this.closeimportDialog();
                        this.complete = true;
                    }
                } catch (error) {
                    console.error('Error during fetch:', error);
                    throw error;
                }
            }
        },
        async modify() {
            const { valid } = await this.$refs.modifyForm.validate();
            if (valid) {
                const requestData = {
                    cargoset: this.modifyset,
                }

                if (this.SendId) {
                    try {
                        // 发送请求到后端
                        await request.put(`/wms/sendmodify/${this.SendId}`, requestData);
                        this.complete = true;

                        this.getsend();
                    } catch (error) {
                        console.error('Error deleting:', error);
                    } finally {
                        // 关闭对话框
                        this.closemodifyDialog();
                    }
                }
            }


        },
        async updateSelectedCompanyName() {
            try {
                const response = await request.get(`/wms/getcargo?companyname=${this.addcname}`);
                if (response.status = 200) {
                    const data = response.data;
                    this.cargoforcname = data;
                } else {
                    console.error('Failed to fetch contact men');
                }
            } catch (error) {
                console.error('Error during fetch:', error);
            }
        },
        async deleteConfirm() {
            if (this.SendId) {
                try {

                    // 发送删除请求到后端
                    await request.delete(`/wms/deletesend/${this.SendId}`);

                    // 在前端更新列表，可以重新调用获取列表的方法或直接从列表中移除被删除的项

                    this.getsend();
                    this.complete = true;
                } catch (error) {
                    console.error('Error deleting:', error);
                } finally {
                    // 关闭对话框
                    this.closedeleteDialog();
                }
            }

        },
        openimportDialog() {
            this.importsend = true;
        },
        closewarningDialog() {
            this.warning = false;
        },
        closecargosetwarningDialog() {
            this.cargosetwarning = false;
        },
        closeimportDialog() {
            this.addcname = null;
            this.addcargo = null;
            this.importsend = false;

        },
        openmodifyDialog(item) {
            this.SendId = item.sendid;
            this.modifysend = true;
        },
        takemodifyDialog(SendId) {
            this.modifysend = true;
            this.cargosetwarning = false;
        },
        opendeleteDialog(item) {
            this.SendId = item.sendid;
            this.confirmdelete = true;
        },
        closedeleteDialog() {
            this.Sendid = null;
            this.confirmdelete = false;

        },
        closemodifyDialog() {
            this.modifyset = null;
            this.modifysend = false;

        },
        opencontactDialog(item) {
            this.SendId = item.sendid;
            this.CargoId = item.cargoid;
            this.arrivalID = item.arrival.arrivalid;
            this.pcargoname = item.cargoname;
            this.pcargosize = item.cargosize;
            this.pcargoweight = item.cargoweight;
            this.pcargoset = item.cargoset;
            this.pcompanyname = item.companyinfo.companyname;
            this.pisbearing = item.isbearing;
            this.confirmsending = true;

        },
        closeDialog() {

            this.confirmsending = false;
        },

        async ItemConfirm() {
            const arrivalrequestData = {
                astatus: "已出库"
            }
            const sendrequestData = {
                sendstatus: "已确认出库"
            }
            const packingrequestData = {
                arrivalid: this.arrivalID,
                cargoid: this.CargoId,
                cargoname: this.pcargoname,
                companyname: this.pcompanyname,
                cargosize: this.pcargosize,
                cargoweight: this.pcargoweight,
                cargoset: this.pcargoset,
                isbearing: this.pisbearing,
            }
            if (this.SendId) {

                try {
                    const checkCargosetResponse = await request.get(`/wms/checkcargoset/${this.SendId}`);
                    if (checkCargosetResponse.data.cargosetIsNull) {
                        this.cargosetwarning = true;
                    } else {
                        console.log('arrival', this.arrivalID)
                        // 发送请求到后端
                        await request.put(`/wms/modifyarrival/${this.arrivalID}`, arrivalrequestData);
                        await request.put(`/wms/modifysend/${this.SendId}`, sendrequestData);
                        await request.post('/wms/getintopacking', packingrequestData);

                        await request.delete(`/wms/deletewms/${this.CargoId}`);
                        this.complete = true;

                        this.getsend();
                    }
                } catch (error) {
                    console.error('Error deleting subscription:', error);
                } finally {
                    // 关闭对话框
                    this.closeDialog();
                }
            }
        },
        async getsend() {
            this.loading = true;

            // 构造查询参数
            const params = {
                companyname: this.scompanyname,
                cargoname: this.scargoname,
                sendtime: this.ssendtime,
                page: this.page - 1,
                size: this.size,

            };

            try {
                // 发起请求
                const response = await request.get('/wms/getsend',
                    { params });

                // 更新分页数据和总行数
                this.sendlist = response.data.content;
                this.totalRows = response.data.totalElements;
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                this.loading = false;
            }
        },
        updatesendList(newOptions) {
            // 处理分页组件的更新事件
            this.loading = true;
            this.page = newOptions.page;
            this.size = newOptions.itemsPerPage;

            this.getsend();
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
}</style>