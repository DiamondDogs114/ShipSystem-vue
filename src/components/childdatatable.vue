<script setup>
import request from '../utils/request.js';

</script>
<template>
    <v-data-table-server :headers="childHeaders" :items="childItems" item-key="id" :items-length="totalRows" class="mt-4"
        :items-per-page="size" @update:options="getData">
        <template v-slot:bottom></template>
    </v-data-table-server>
</template>
  
<script>
export default {
    props: {
        id: {
            type: Number,
            required: true,
        },
        cargoType: {
            type: String,
            required: true,
        },

    },

    data() {
        return {
            childHeaders: [],
            childItems: [],
            totalRows: 1,
            page:0,
            size:1,


        };
    },

    methods: {
        async fetchData() {

            if (this.cargoType === '整箱') {
                try {
                    this.childHeaders = [
                        { title: '起运港', key: 'fclpol', align: 'center', sortable: false },
                        { title: '目的港', key: 'fcldes', align: 'center', sortable: false },
                        { title: '船公司', key: 'fclcarrier', align: 'center', sortable: false },
                        { title: '航线', key: 'fclORT', align: 'center', sortable: false },
                        { title: '中转港', key: 'fclTransit', align: 'center', sortable: false },
                        { title: '航程', key: 'voyage', align: 'center', sortable: false },
                        { title: '船期', key: 'fclShipDate', align: 'center', sortable: false },
                        { title: '截关/开航', key: 'closingdate', align: 'center', sortable: false },
                        { title: '20GP', key: 'smallgpprice', align: 'center', sortable: false },
                        { title: '40GP', key: 'biggpprice', align: 'center', sortable: false },
                        { title: '40HQ', key: 'hqprice', align: 'center', sortable: false },
                    ];

                    // 发起请求
                    const response = await request.get('/ship/findbyFclid',
                        { params: { fclid: this.id } });
                    // 更新分页数据和总行数
                    this.childItems = response.data.content || [];
                    this.totalRows = response.data.totalElements || 0;

                    console.log(response.data);
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            }
            else if (this.cargoType === '拼箱') {
                try {
                    this.childHeaders = [
                        { title: '起运港', key: 'lclpol', align: 'center', sortable: false },
                        { title: '目的港', key: 'lcldes', align: 'center', sortable: false },
                        { title: '运输方式', key: 'transportationmethod', align: 'center', sortable: false },
                        { title: '收货人类型', key: 'consignee', align: 'center', sortable: false },
                        { title: '中转港', key: 'lcltransit', align: 'center', sortable: false },
                        { title: '船公司', key: 'lclcarrier', align: 'center', sortable: false },
                        { title: 'CBM', key: 'cbmprice', align: 'center', sortable: false },
                        { title: 'TON', key: 'tonprice', align: 'center', sortable: false },
                        { title: '其他价格', key: 'otherprice', align: 'center', sortable: false },
                    ];

                    // 发起请求
                    const response = await request.get('/ship/findbyLclid',
                        { params: { lclid: this.id } });
                    // 更新分页数据和总行数
                    this.childItems = response.data.content || [];
                    this.totalRows = response.data.totalElements || 0;

                    console.log(response.data);
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            }
        },
        getData(newOptions) {
            // 处理分页组件的更新事件
            
            this.page = newOptions.page;
            this.size = newOptions.itemsPerPage;

            this.fetchData();
           
        },


    },

};
</script>