<script setup>
import request from '../utils/request.js';
import tooltipbtn from '../components/tooltipbtn.vue';
</script>
<template>
    <v-container>
        <v-card flat class="mx-auto  mt-5 mb-10 elevation-2" height="585">
            <v-row no-gutters class="operateArea">
                <v-col cols="3" class="col">
                    <tooltipbtn icon="mdi-refresh" :tooltip-text="'刷新'" @click="getfile()"></tooltipbtn>
                </v-col>
                <v-col cols="9">
                    <v-row no-gutters>
                        <v-col cols="4">
                        </v-col>
                        <v-col cols="4">
                        </v-col>
                        <v-col cols="4">
                            <v-text-field v-model="searchfilename" label="文件名称" variant="solo" hide-details
                                density="comfortable" class="ml-5 mt-1" clearable></v-text-field>
                        </v-col>

                    </v-row>
                </v-col>
            </v-row>


            <div class="pa-0 mt-5">
                <v-data-table-server :search="search" :headers="headers" :items-length="totalRows" :items="filelist"
                    :loading="loading" loading-text="努力加载中" :items-per-page="size" no-data-text="没有找到数据捏"
                    @update:options="updatefileList" items-per-page-text="每页显示" fixed-header hover item-value="fileid">
                    <template v-slot:item.actions="{ item }">
                        <v-tooltip text="下载" location="start">
                            <template v-slot:activator="{ props }">
                                <v-icon v-bind="props" size="small" class="me-2" color="cyan-lighten-2" @click="download(item)">
                                    mdi-download
                                </v-icon>

                            </template>
                        </v-tooltip>
                    </template>

                </v-data-table-server>
            </div>
        </v-card>
    </v-container>
</template>
  
<script>

export default {

    data() {
        return {


            search: '',

            headers: [
                { title: '操作', key: 'actions', align: 'center', sortable: false, width: '70px' },
                { title: '编号', key: 'fileid', align: 'center', sortable: false, width: '100px' },
                { title: '文件名', key: 'fileName', align: 'center', sortable: false, removable: true, width: '200px' },
                { title: '文件大小', key: 'fileSize', align: 'center', sortable: false, removable: true, width: '100px' },
                { title: '文件类型', key: 'contentType', align: 'center', sortable: false, removable: true, width: '100px' },
                { title: '上传时间', key: 'uploadTime', align: 'center', sortable: false, removable: true, width: '150px' },




            ],



            filelist: [],
            loading: false,
            totalRows: 0,
            page: 1,
            size: 10,


            searchfilename: null,

        }

    },
    watch: {
        searchfilename() {
            this.search = String(Date.now())
        },

    },
    methods: {
        async download(item) {
            try {
            
                const response = await request.get(`/trade/downloadfile/${item.fileid}`, { responseType: 'arraybuffer' });
                const arrayBuffer = await response.data;
                const uint8Array = new Uint8Array(arrayBuffer);
                const file = new Blob([uint8Array], { type: 'application/pdf' });

                const link = document.createElement('a');
                link.href = URL.createObjectURL(file);

                link.download = item.fileName;
                link.click();
            } catch (error) {
                console.error('Error downloading PDF:', error);
            }
        },
        async getfile() {
           
            this.loading = true;
            // 构造查询参数
            const params = {
                fileName: this.searchfilename,
                page: this.page - 1,
                size: this.size,

            };
            try {
                // 发起请求
                const response = await request.get('/trade/admingetfile',
                    { params });

                // 更新分页数据和总行数
                this.filelist = response.data.content;
                this.totalRows = response.data.totalElements;


            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                this.loading = false;
            }
        },
        updatefileList(newOptions) {
            // 处理分页组件的更新事件
            this.loading = true;
            this.page = newOptions.page;
            this.size = newOptions.itemsPerPage;

            this.getfile();
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