<script setup>
import request from '../utils/request.js';
import tooltipbtn from '../components/tooltipbtn.vue';
</script>
<template>
    
        <v-card flat class="mx-auto  mt-5 mb-10 elevation-2" height="585">
            <v-row no-gutters class="operateArea">
                <v-col cols="3" class="col">
                    <tooltipbtn icon="mdi-refresh" :tooltip-text="'刷新'" @click="getarrival()"></tooltipbtn>
                </v-col>
                <v-col cols="9">
                    <v-row no-gutters>
                        <v-col cols="4">
                        </v-col>
                        <v-col cols="4">
                            <v-text-field v-model="scompanyname" label="公司名称" variant="solo" hide-details
                                density="comfortable" class="ml-5 mt-1" clearable></v-text-field>
                        </v-col>
                        <v-col cols="4">
                            <v-text-field v-model="scargoname" label="货物名称" variant="solo" hide-details
                                density="comfortable" class="ml-5 mt-1" clearable></v-text-field>
                        </v-col>
                        
                    </v-row>
                </v-col>
            </v-row>


            <div class="pa-0 mt-5">
                <v-data-table-server :search="search" :headers="headers" :items-length="totalRows" :items="arrivallist"
                    :loading="loading" loading-text="努力加载中" :items-per-page="size" no-data-text="没有找到数据捏"
                    @update:options="updatearrivalList" items-per-page-text="每页显示" fixed-header hover item-value="arrivalid"
                    height="450">
                    <template v-slot:item.actions="{ item }">
                        <v-tooltip text="确认" location="start">
                            <template v-slot:activator="{ props }">
                                <v-icon v-bind="props" size="small" class="me-2" color="cyan-lighten-2"
                                    @click="opencontactDialog(item)">
                                    mdi-check
                                </v-icon>
                            </template>
                        </v-tooltip>
                    </template>
                </v-data-table-server>
            </div>
        </v-card>
        <v-dialog v-model="confirmarrival" max-width="500px">
            <v-card>

                <v-card-title class="text-h6 bg-cyan-lighten-2">提示</v-card-title>
                <v-divider></v-divider>
                <v-card-text>是否确认?
                </v-card-text>
                <v-card-actions class="justify-end">
                    <v-btn color="cyan-lighten-2" variant="text" @click="ItemConfirm">确认</v-btn>
                    <v-btn variant="text" @click="closeDialog">关闭</v-btn>
                </v-card-actions>

            </v-card>

        </v-dialog>
    
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
                { title: '客户跟踪单号', key: 'arrivalid', align: 'center', sortable: false, width: '130px' },
                { title: '货物名称', key: 'acargoname', align: 'center', sortable: false, width: '200px' },
                { title: '货物尺寸', key: 'acargosize', align: 'center', sortable: false, width: '100px' },
                { title: '货物重量', key: 'acargoweight', align: 'center', sortable: false, removable: true, width: '100px' },
                { title: '货物类型', key: 'cargotype', align: 'center', sortable: false, removable: true, width: '120px' },
                { title: '货物价值', key: 'cargovalue', align: 'center', sortable: false, removable: true, width: '120px' },
                { title: '起运港', key: 'apol', align: 'center', sortable: false, removable: true, width: '100px' },
                { title: '目的港', key: 'ades', align: 'center', sortable: false, removable: true, width: '100px' },
                { title: '货物描述', key: 'cargodescribe', align: 'center', sortable: false, removable: true, width: '200px' },
                { title: '所属公司', key: 'companyinfo.companyname', align: 'center', sortable: false, removable: true, width: '200px' },
                { title: '能否承重', key: 'aisbearing', align: 'center', sortable: false, removable: true, width: '95px' },
                { title: '报告时间', key: 'createtime', align: 'center', sortable: false, removable: true, width: '200px' },



            ],



            arrivallist: [],
            loading: false,
            totalRows: 0,
            page: 1,
            size: 10,

            complete: false,


            confirmarrival: false,

            arrivalID: null,

            wmscargoname:null,
            wmscompany:null, 
            wmscargosize:null,
            wmscargoweight:null,
            wmscargotype:null,
            wmsdecription:null,

            scompanyname: null,
            scargoname: null,
            
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
       

    },
    methods: {

        opencontactDialog(item) {
            this.arrivalID = item.arrivalid;
            this.wmscargoname=item.acargoname;
            this.wmscompany=item.companyinfo.companyname;
            this.wmscargosize=item.acargosize;
            this.wmscargoweight=item.acargoweight;
            this.wmscargotype=item.cargotype;
            this.wmsdecription=item.cargodescribe;
            this.confirmarrival = true;

        },
        closeDialog() {
            this.confirmarrival = false;
        },

        async ItemConfirm() {
            const requestData = {
                astatus: "已入库"

            }
            const cargoinfo ={
                cargoname: this.wmscargoname,
                companyname: this.wmscompany,
                cargosize: this.wmscargosize,
                cargoweight: this.wmscargoweight,
                cargotype:this.wmscargotype,
                description:this.wmsdecription,
                arrivalid:this.arrivalID,
            }
            if (this.arrivalID) {
                try {
                    // 发送请求到后端
                    await request.put(`/wms/modifyarrival/${this.arrivalID}`, requestData);
                    await request.post('/wms/getintoWMS',cargoinfo);
                    this.complete = true;


                    this.getarrival();
                } catch (error) {
                    console.error('Error deleting subscription:', error);
                } finally {
                    // 关闭对话框
                    this.closeDialog();
                }
            }
        },
        async getarrival() {
            this.loading = true;

            // 构造查询参数
            const params = {
                companyname: this.scompanyname,
                acargoname: this.scargoname,
               
                page: this.page - 1,
                size: this.size,

            };

            try {
                // 发起请求
                const response = await request.get(`/wms/getarrival?astatus=${this.statusfilter}`,
                    { params });

                // 更新分页数据和总行数
                this.arrivallist = response.data.content;
                this.totalRows = response.data.totalElements;
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                this.loading = false;
            }
        },
        updatearrivalList(newOptions) {
            // 处理分页组件的更新事件
            this.loading = true;
            this.page = newOptions.page;
            this.size = newOptions.itemsPerPage;

            this.getarrival();
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