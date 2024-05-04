<script setup>
import axios from 'axios'
</script>
<template>
    <v-parallax src="https://djupload.oss-cn-beijing.aliyuncs.com/etrans56/topSupplier/7415e297f25d4f61ae23467814f0d4f7.jpg"
        height="600">

        <h1
            class=" font-weight-thin mt-15 mb-15 flex-column  justify-center  d-flex justify-center align-center text-white text-center">
            运价和船期
            <span class="text-subtitle-2">Freight and shipping</span>
        </h1>



        <v-card class="mx-auto" max-width="600" title="整箱搜索">
            <v-row>
                <v-col>
                    <v-card-text>
                        <div class="text-subtitle-2 font-weight-black mb-1">
                            起运港
                        </div>

                        <v-text-field v-model="pol" prepend-inner-icon="mdi-alpha-a-circle" placeholder="填写起运港" single-line
                            variant="outlined" clearable @keyup.enter="getfcl"></v-text-field>
                    </v-card-text>
                </v-col>
                <v-col>
                    <v-card-text>
                        <div class="text-subtitle-2 font-weight-black mb-1">
                            目的港
                        </div>

                        <v-text-field v-model="des" prepend-inner-icon="mdi-alpha-b-circle" placeholder="填写目的港" single-line
                            variant="outlined" clearable @keyup.enter="getfcl"></v-text-field>
                    </v-card-text>
                </v-col>
            </v-row>

            <template v-slot:actions>
                <v-card-text>
                    <div class="text-subtitle-4 font-weight-black mb-1 ms-13 mr-9">
                        查询类型
                    </div>
                    <v-select v-model="tabletype" item-title="state" :items="options" item-value="abbr" class="ms-13"
                        variant="outlined" density="comfortable" label="选择服务" single-line></v-select>
                </v-card-text>

                <v-btn prepend-icon="mdi-magnify" :loading="loading" class="flex-grow-1 me-16 ms-10 text-button" height="48"
                    variant="tonal" @click="getfcl" color="blue-darken-4" size="small" width="100">
                    搜索
                </v-btn>
            </template>
        </v-card>
    </v-parallax>
    <v-card flat class="mx-auto  mt-5 mb-10 pa-0">
        <v-data-table-server v-model:expanded="expanded" :search="search" :headers="headers" :items-length="totalRows"
            :items="fcllist" :loading="loading" loading-text="努力加载中" :items-per-page="size" no-data-text="没有找到数据捏"
            @update:options="updatefclList" items-per-page-text="每页显示" fixed-header hover >
            <template v-slot:top>
                <tr>
                    <td>
                        <v-text-field v-model="fclcarrier" hide-details placeholder="船公司" class="ma-8  w-100"
                            density="compact"></v-text-field>
                    </td>
                    <td>
                        <v-text-field v-model="transit" hide-details placeholder="中转港" class="ma-8 px-4 w-100"
                            density="compact"></v-text-field>
                    </td>
                    <td>
                        <v-select v-model="shipdate" hide-details placeholder="船期" class="ma-8 px-4 w-100" clearable
                            item-title="state" :items="options2" item-value="abbr" density="compact"></v-select>
                    </td>
                </tr>
            </template>
            <template v-slot:item.actions="{ item }">
                <v-icon size="small" class="me-2" color="blue" @click="subscribetoFCL(item)">
                    mdi-plus-box
                </v-icon>

            </template>
        </v-data-table-server>
    </v-card>
    <v-snackbar
      :timeout="2000"
      color="primary"
      rounded="pill"
      close-on-content-click
      timer
      v-model="complete"
    >
    <strong>订阅成功</strong>.
    </v-snackbar>
    <v-snackbar
      :timeout="2000"
      color="red"
      rounded="pill"
      close-on-content-click
      timer="black"
      v-model="error"
    >
    <strong>订阅失败,你的订阅已经有此信息</strong>.
    </v-snackbar>

</template>
  
<script>
export default {

    data: () => ({
        tabletype: '',
        expanded: [],
        selectedRowInfo: null, // 选定的行信息
        dialogVisible: false,
        complete:false,
        error:false,

        options: [
            { state: '整箱', abbr: '1' },
            { state: '拼箱', abbr: '2' },
        ],
        options2: [
            { state: '周一', abbr: '周一' },
            { state: '周二', abbr: '周二' },
            { state: '周三', abbr: '周三' },
            { state: '周四', abbr: '周四' },
            { state: '周五', abbr: '周五' },
            { state: '周六', abbr: '周六' },
            { state: '周日', abbr: '周日' },
        ],


        headers: [
            { title: '订阅', key: 'actions', sortable: false },
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
            { title: '备注', key: 'otherinfo', align: 'center', sortable: false },

        ],



        search: '',
        fcllist: [],
        loading: false,
        totalRows: 0,
        page: 1,
        size: 10,

        fclcarrier: '',
        transit: '',
        shipdate: null,
        pol: '',
        des: '',






    }),
    watch: {
        fclcarrier() {
            this.search = String(Date.now())
        },
        transit() {
            this.search = String(Date.now())
        },
        shipdate() {
            this.search = String(Date.now())
        },


    },
    methods: {

        async getfcl() {
            this.loading = true;

            // 构造查询参数
            const params = {
                fclpol: this.pol,
                fcldes: this.des,
                fclcarrier: this.fclcarrier,
                fclTransit: this.transit,
                fclShipDate: this.shipdate,
                page: this.page - 1,
                size: this.size,

            };


            try {
                // 发起请求
                const response = await axios.get('/ship/getfcl',
                    { params });

                // 更新分页数据和总行数
                this.fcllist = response.data.content;
                this.totalRows = response.data.totalElements;


            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                this.loading = false;
            }
        },
        updatefclList(newOptions) {
            // 处理分页组件的更新事件
            this.loading = true;
            this.page = newOptions.page;
            this.size = newOptions.itemsPerPage;

            this.getfcl();
            this.loading = false;
        },
        async subscribetoFCL(item) {
            // 在这里实现将订阅数据发送到后端的逻辑
            const subscriptionData = {
                // 从表格行数据中提取需要的订阅信息
                fclid: item.fclid, // 请根据实际情况替换为表格行中FCL的唯一标识字段
                pol: item.fclpol,
                destination: item.fcldes,
                cargotype:'整箱'
            
                

            };
            console.log('Subscription Data:', subscriptionData);


            try {
                // 发送订阅数据到后端
                const response = await axios.post('/ship/subscribeToFcl', subscriptionData);

                // 处理后端返回的响应，可以根据需要进行操作
                this.complete=true;
                console.log(response.data);
            } catch (error) {
                this.error=true;
                console.error('Error subscribing to FCL:', error);
            }
        },

    },


}
</script>