<script setup>
import request from '../utils/request.js';
import tooltipbtn from '../components/tooltipbtn.vue';
</script>
<template>
    <div class="flex-fill font-weight-bold scroll-container">
        <v-data-table-server :headers="headers" :items-length="totalRows" :items="companylist" :loading="loading"
            loading-text="努力加载中" :items-per-page="size" no-data-text="没有找到数据捏" @update:options="updatecompanyList"
            items-per-page-text="每页显示" item-value="companyid" fixed-header hover v-model:page="page">
            <template v-slot:bottom>
                <div class="text-center pt-2">
                    <v-pagination v-model="page" :length="pageCount"></v-pagination>
                </div>
            </template>
        </v-data-table-server>
    </div>
</template>
  
<script>
export default {

    data: () => ({


        companylist: [],
        loading: false,
        totalRows: 0,
        page: 1,
        size: 10,

        headers: [
            { title: '公司名称', key: 'companyname', align: 'center', sortable: false, width: '100px' },
            { title: '负责人', key: 'contactpeople', align: 'center', sortable: false, width: '100px' },
        ],

    }),
    computed: {
      pageCount() {
        return Math.ceil(this.companylist.length / this.size)
      },
    },

    methods: {
        async getcompanyinfo() {
            this.loading = true;
            const storedUser = JSON.parse(localStorage.getItem('admin'));
            const params = {
                companyname: this.scompanyname,
                adminid: storedUser.adminid,
                page: this.page - 1,
                size: this.size,
            };

            try {
                // 发起请求
                const response = await request.get('/com/comlist',
                    { params });

                // 更新分页数据和总行数
                this.companylist = response.data.content;
                this.totalRows = response.data.totalElements;

            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                this.loading = false;
            }
        },

        updatecompanyList(newOptions) {
            // 处理分页组件的更新事件
            this.loading = true;
            this.page = newOptions.page;
            this.size = newOptions.itemsPerPage;

            this.getcompanyinfo();
            this.loading = false;
        },

    },

}
</script>
<style>
.scroll-container {
    max-height: 340px;
    /* 你可以根据需要调整最大高度 */
    overflow-y: auto;
}
</style>