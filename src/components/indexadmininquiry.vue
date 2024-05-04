<script setup>
import request from '../utils/request.js';

</script>
<template>
    <div class="flex-fill font-weight-bold scroll-container">
        <v-data-table-server  :headers="headers" :items-length="totalRows" :items="inquirylist"
            :loading="loading" loading-text="努力加载中" :items-per-page="size" no-data-text="没有找到数据捏"
            @update:options="updateinquiryList" items-per-page-text="每页显示" fixed-header hover item-value="inquiryID">
            

            <template v-slot:item.acceptstatus="{ item }">
                <v-chip size="small" :color="item.acceptstatus === '未受理' ? 'grey' : 'blue'" class="font-weight-bold">
                    {{ item.acceptstatus }}</v-chip>
            </template>
            <template v-slot:bottom>
                <div class="text-center pt-2">
                    <v-pagination v-model="page" :length="pageCount"></v-pagination>
                </div>
            </template>
        </v-data-table-server>
    </div>
</template>
  
<script>
const storedUser = JSON.parse(localStorage.getItem('admin'));
export default {

    data() {
        return {            
            headers: [

                { title: '状态', key: 'acceptstatus', align: 'center', sortable: false, width: '100px' },
                { title: '起运港', key: 'ipol', align: 'center',sortable: false, width: '100px' },
                { title: '目的港', key: 'ides', align: 'center',sortable: false, width: '100px' },

            ],
            contactrule: [
                value => !!value || '不能为空！',
            ],
            options: [
                { state: '未受理', abbr: '未受理' },
                { state: '已受理', abbr: '已受理' },
            ],

            inquirylist: [],
            loading: false,
            totalRows: 0,
            page: 1,
            size: 10,
            status: null,
            
        }
    },
    computed: {
      pageCount() {
        return Math.ceil(this.inquirylist.length / this.size)
      },
    },    
    methods: {

        async getinquiry() {

            this.loading = true;

            
            const params = {
                
                page: this.page - 1,
                size: this.size,

            };

            try {
                // 发起请求
                const response = await request.get('/trade/unprocessed',
                    { params });

                // 更新分页数据和总行数
                this.inquirylist = response.data.content;
                this.totalRows = response.data.totalElements;
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                this.loading = false;
            }
        },
        updateinquiryList(newOptions) {
            // 处理分页组件的更新事件
            this.loading = true;
            this.page = newOptions.page;
            this.size = newOptions.itemsPerPage;

            this.getinquiry();
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