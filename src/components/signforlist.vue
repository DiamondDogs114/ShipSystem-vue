<script setup>
import request from '../utils/request.js';
import tooltipbtn from '../components/tooltipbtn.vue';
</script>
<template>
    <v-container>
        <v-card flat class="mx-auto  mt-5 mb-10 elevation-2" height="585">
            <v-row no-gutters class="operateArea">
                <v-col cols="3" class="col">
                    <tooltipbtn icon="mdi-refresh" :tooltip-text="'刷新'" @click="getsignfor()"></tooltipbtn>
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
                            <v-text-field v-model="ssignfortime" label="抵港日期" variant="solo"  hide-details
                                density="comfortable" class="ml-5 mt-1" clearable type="date" suffix="日期"></v-text-field>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>


            <div class="pa-0 mt-5">
                <v-data-table-server :search="search" :headers="headers" :items-length="totalRows" :items="signforlist"
                    :loading="loading" loading-text="努力加载中" :items-per-page="size" no-data-text="没有找到数据捏"
                    @update:options="updatesignforList" items-per-page-text="每页显示" fixed-header hover item-value="signforid"
                    height="450">
                    <template v-slot:item.actions="{ item }">
                        <v-tooltip text="确认签收" location="start">
                            <template v-slot:activator="{ props }">
                                <v-icon v-bind="props" size="small" class="me-2" color="primary"
                                    @click="opencontactDialog(item)">
                                    mdi-email-check
                                </v-icon>
                            </template>
                        </v-tooltip>
                    </template>
                    
                </v-data-table-server>
            </div>
        </v-card>
        <v-dialog v-model="confirmsignfor" max-width="500px">
            <v-card>

                <v-card-title class="text-h6 bg-cyan-lighten-2">提示</v-card-title>
                <v-divider></v-divider>
                <v-card-text>是否确认到达?
                </v-card-text>
                <v-card-actions class="justify-end">
                    <v-btn color="cyan-lighten-2" variant="text" @click="ItemConfirm">确认</v-btn>
                    <v-btn variant="text" @click="closeDialog">关闭</v-btn>
                </v-card-actions>

            </v-card>

        </v-dialog>
    </v-container>
    <v-snackbar :timeout="2000" color="success" rounded="pill" close-on-content-click v-model="complete">
        <strong>确认成功</strong>.
    </v-snackbar>
</template>
  
<script>

export default {

    data() {
        return {


            search: '',

            headers: [
                { title: '操作', key: 'actions', align: 'center', sortable: false, width: '70px' },
                { title: '#', key: 'signforid', align: 'center', sortable: false, width: '70px' },
                { title: '跟单编号', key: 'arrival.arrivalid', align: 'center', sortable: false, width: '100px' },
                { title: '货物名称', key: 'cargoname', align: 'center', sortable: false, width: '200px' },
                { title: '目的港', key: 'ades', align: 'center', sortable: false, removable: true, width: '100px' },
                { title: '货物尺寸', key: 'cargosize', align: 'center', sortable: false, width: '100px' },
                { title: '货物重量', key: 'cargoweight', align: 'center', sortable: false, removable: true, width: '100px' },  
                { title: '所属公司', key: 'companyinfo.companyname', align: 'center', sortable: false, removable: true, width: '200px' },
                { title: '到达时间', key: 'signfortime', align: 'center', sortable: false, removable: true, width: '200px' },



            ],



            signforlist: [],
            loading: false,
            totalRows: 0,
            page: 1,
            size: 10,

            complete: false,


            confirmsignfor: false,
            arrivalID:null,
            signforID: null,

            scompanyname: null,
            scargoname: null,
            ssignfortime: null,
            statusfilter: "未确认",
        }

    },
    watch: {
        scompanyname() {
            this.search = String(Date.now())
        },
        scargoname() {
            this.search = String(Date.now())
        },
        ssignfortime() {
            this.search = String(Date.now())
        },

    },
    methods: {

        opencontactDialog(item) {
            this.arrivalID=item.arrival.arrivalid;
            this.signforID = item.signforid;
            this.confirmsignfor = true;

        },
        closeDialog() {
            this.confirmsignfor = false;
        },

        async ItemConfirm() {
            const SignforrequestData = {
                signforstatus: "已签收"

            }
            const arrivalrequestData={
                astatus:"已到达"
            }
            if (this.signforID) {
                try {
                    // 发送请求到后端
                    await request.put(`/wms/modifyarrival/${this.arrivalID}`, arrivalrequestData);
                    await request.put(`/wms/modifysignfor/${this.signforID}`, SignforrequestData);
                    this.complete = true;


                    this.getsignfor();
                } catch (error) {
                    console.error('Error deleting subscription:', error);
                } finally {
                    // 关闭对话框
                    this.closeDialog();
                }
            }
        },
        async getsignfor() {
            this.loading = true;

            // 构造查询参数
            const params = {
                companyname: this.scompanyname,
                cargoname: this.scargoname,
                signfortime: this.ssignfortime,
                page: this.page - 1,
                size: this.size,

            };

            try {
                // 发起请求
                const response = await request.get(`/wms/getsignfor?status=${this.statusfilter}`,
                    { params });

                // 更新分页数据和总行数
                this.signforlist = response.data.content;
                this.totalRows = response.data.totalElements;
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                this.loading = false;
            }
        },
        updatesignforList(newOptions) {
            // 处理分页组件的更新事件
            this.loading = true;
            this.page = newOptions.page;
            this.size = newOptions.itemsPerPage;

            this.getsignfor();
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