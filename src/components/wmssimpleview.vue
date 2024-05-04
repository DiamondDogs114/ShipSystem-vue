<script setup>
import request from '../utils/request.js';
import tooltipbtn from '../components/tooltipbtn.vue';
</script>
<template>
    
        <v-card flat class="mx-auto  mt-5 mb-10 elevation-2" height="585">
            <v-row no-gutters class="operateArea">
                <v-col cols="3" class="col">
                    <tooltipbtn icon="mdi-refresh" :tooltip-text="'刷新'" @click="getwms()"></tooltipbtn>
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
                <v-data-table-server :search="search" :headers="headers" :items-length="totalRows" :items="wmslist"
                    :loading="loading" loading-text="努力加载中" :items-per-page="size" no-data-text="没有找到数据捏"
                    @update:options="updatewmsList" items-per-page-text="每页显示" fixed-header hover item-value="inquiryID"
                    height="450">
                </v-data-table-server>
            </div>
        </v-card>
        
</template>
  
<script>

export default {

    data() {
        return {


            search: '',

            headers: [
                
                { title: '货物编号', key: 'cargoid', align: 'center', sortable: false, width: '100px' },
                { title: '货物名称', key: 'cargoname', align: 'center', sortable: false, width: '200px' },
                { title: '所属公司', key: 'companyinfo.companyname', align: 'center', sortable: false, removable: true, width: '200px' },
                { title: '货物尺寸', key: 'cargosize', align: 'center', sortable: false, width: '100px' },
                { title: '货物重量', key: 'cargoweight', align: 'center', sortable: false, removable: true, width: '100px' },
                { title: '货物类型', key: 'cargotype', align: 'center', sortable: false, removable: true, width: '120px' },
                { title: '货物描述', key: 'description', align: 'center', sortable: false, removable: true, width: '200px' },
                
              


            ],



            wmslist: [],
            loading: false,
            totalRows: 0,
            page: 1,
            size: 10,


           

            scompanyname: null,
            scargoname: null,
            
            
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
        async getwms() {
            this.loading = true;

            // 构造查询参数
            const params = {
                companyname: this.scompanyname,
                cargoname: this.scargoname,
               
                page: this.page - 1,
                size: this.size,

            };

            try {
                // 发起请求
                const response = await request.get('/wms/getwmsall',
                    { params });

                // 更新分页数据和总行数
                this.wmslist = response.data.content;
                this.totalRows = response.data.totalElements;
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                this.loading = false;
            }
        },
        updatewmsList(newOptions) {
            // 处理分页组件的更新事件
            this.loading = true;
            this.page = newOptions.page;
            this.size = newOptions.itemsPerPage;

            this.getwms();
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