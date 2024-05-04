<script setup>
import request from '../utils/request.js';

</script>
<template>
    <v-parallax src="https://djupload.oss-cn-beijing.aliyuncs.com/etrans56/topSupplier/7415e297f25d4f61ae23467814f0d4f7.jpg"
        height="600">

        <h1
            class=" font-weight-thin mt-15 mb-15 flex-column  justify-center  d-flex justify-center align-center text-white text-center">
            运价和船期
            <span class="text-subtitle-2">Freight and shipping</span>
        </h1>



        <v-card class="mx-auto" max-width="600" title="搜索">
            <v-row>
                <v-col>
                    <v-card-text>
                        <div v-if="tabletype === '整箱'" class="text-subtitle-2 font-weight-black mb-1">
                            起运港
                        </div>
                        <div v-else-if="tabletype === '拼箱'" class="text-subtitle-2 font-weight-black mb-1">
                            起运港
                        </div>

                        <v-text-field v-if="tabletype === '整箱'" v-model="pol" prepend-inner-icon="mdi-alpha-a-circle"
                            placeholder="填写起运港" single-line variant="outlined" clearable
                            @keyup.enter="getfcl"></v-text-field>

                        <v-text-field v-else-if="tabletype === '拼箱'" v-model="lclpol"
                            prepend-inner-icon="mdi-alpha-a-circle" placeholder="填写起运港" single-line variant="outlined"
                            clearable @keyup.enter="getfcl"></v-text-field>
                    </v-card-text>
                </v-col>
                <v-col>
                    <v-card-text>
                        <div v-if="tabletype === '整箱'" class="text-subtitle-2 font-weight-black mb-1">
                            目的港
                        </div>
                        <div v-else-if="tabletype === '拼箱'" class="text-subtitle-2 font-weight-black mb-1">
                            目的港
                        </div>


                        <v-text-field v-if="tabletype === '整箱'" v-model="des" prepend-inner-icon="mdi-alpha-b-circle"
                            placeholder="填写目的港" single-line variant="outlined" clearable
                            @keyup.enter="getfcl"></v-text-field>
                        <v-text-field v-else-if="tabletype === '拼箱'" v-model="lcldes"
                            prepend-inner-icon="mdi-alpha-b-circle" placeholder="填写目的港" single-line variant="outlined"
                            clearable @keyup.enter="getfcl"></v-text-field>
                    </v-card-text>
                </v-col>
            </v-row>

            <template v-slot:actions>
                
                    <v-card-text>
                        <div class="text-subtitle-4 font-weight-black mb-1 ms-13 mr-9">
                            查询类型
                        </div>
                        <v-select v-model="tabletype" :items="options" class="ms-13" variant="outlined"
                            density="comfortable" label="选择服务" single-line @update:modelValue="changeTableType"
                            :rules="TypeRules"></v-select>
                    </v-card-text>

                    <v-btn prepend-icon="mdi-magnify" :loading="loading" class="flex-grow-1 me-16 ms-10 text-button"
                        height="48" variant="tonal" @click="getfcl" color="blue-darken-4" size="small" width="100" :disabled="isBtnDisabled">
                        搜索
                    </v-btn>
                
            </template>
        </v-card>
    </v-parallax>
    <v-card flat class="mx-auto  mt-5 mb-10 pa-0">
        <v-data-table-server :search="search" :headers="headers" :items-length="totalRows" :items="shiplist"
            :loading="loading" loading-text="努力加载中" :items-per-page="size" no-data-text="没有找到数据捏"
            @update:options="updateshipList" items-per-page-text="每页显示" fixed-header hover>
            <template v-slot:top>
                <tr>

                    <td>
                        <v-text-field v-if="tabletype === '整箱'" v-model="fclcarrier" placeholder="船公司" class="ma-8  w-100"
                            density="compact"></v-text-field>
                        <v-select v-if="tabletype === '拼箱'" v-model="consignee" placeholder="收货人类型" class="ma-8 px-4 w-100"
                            clearable item-title="state" :items="options3" item-value="abbr" density="compact"></v-select>
                    </td>
                    <td>
                        <v-text-field v-if="tabletype === '整箱'" v-model="transit" placeholder="中转港" class="ma-8 px-4 w-100"
                            density="compact"></v-text-field>
                        <v-select v-if="tabletype === '拼箱'" v-model="method" placeholder="运输方式" class="ma-8 px-4 w-100"
                            clearable item-title="state" :items="options4" item-value="abbr" density="compact"></v-select>
                    </td>
                    <td>
                        <v-select v-if="tabletype === '整箱'" v-model="shipdate" placeholder="船期" class="ma-8 px-4 w-100"
                            clearable item-title="state" :items="options2" item-value="abbr" density="compact"></v-select>
                        <v-text-field v-if="tabletype === '拼箱'" v-model="lcltransit" placeholder="中转港" class="ma-8  w-100"
                            density="compact"></v-text-field>
                    </td>
                </tr>
            </template>
            <template v-slot:item.actions="{ item }">
                <v-icon v-if="tabletype === '整箱'" size="small" class="me-2" color="blue" @click="subscribetoFCL(item)">
                    mdi-plus-box
                </v-icon>
                <v-icon v-if="tabletype === '拼箱'" size="small" class="me-2" color="blue" @click="subscribetoLCL(item)">
                    mdi-plus-box
                </v-icon>

            </template>
        </v-data-table-server>
    </v-card>
    <v-snackbar :timeout="2000" color="primary" rounded="pill" close-on-content-click timer v-model="complete">
        <strong>订阅成功</strong>.
    </v-snackbar>
    <v-snackbar :timeout="2000" color="red" rounded="pill" close-on-content-click timer="black" v-model="error">
        <strong>订阅失败,你的订阅已经有此信息</strong>.
    </v-snackbar>
</template>
  
<script>
const storedUser = JSON.parse(localStorage.getItem('user'));
export default {

    data: () => ({
        tabletype: null,


        dialogVisible: false,
        complete: false,
        error: false,

        options: [
            '整箱',
            '拼箱'
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
        options3: [
            { state: '同行', abbr: '同行' },
            { state: '直客', abbr: '直客' },
        ],
        options4: [
            { state: '直拼', abbr: '直拼' },
            { state: '转拼', abbr: '转拼' },
        ],
        TypeRules: [
            v => !!v || "请选择类型",

        ],


        search: '',
        shiplist: [],
        loading: false,
        totalRows: 0,
        page: 1,
        size: 10,

        fclcarrier: '',
        transit: '',
        shipdate: null,
        pol: '',
        des: '',
        lclpol: '',
        lcldes: '',

        lcltransit: '',
        method: null,
        consignee: null,

        






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
        consignee() {
            this.search = String(Date.now())
        },
        method() {
            this.search = String(Date.now())
        },
        lcltransit() {
            this.search = String(Date.now())
        },
    },
    computed: {
        isBtnDisabled() {
            // 根据tabletype是否有值来决定按钮是否禁用
            return !this.tabletype;
        },
    },
    methods: {
        

        async getfcl() {
            this.loading = true;
            const type = this.tabletype;

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
            const params2 = {
                lclpol: this.lclpol,
                lcldes: this.lcldes,
                consignee: this.consignee,
                transportationmethod: this.method,
                lcltransit: this.lcltransit,
                page: this.page - 1,
                size: this.size,




            };
            if (type === '整箱') {

                params.typeSpecificParam = 'value';

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
            }
            else if (type === '拼箱') {

                params2.typeSpecificParam = 'value';

                try {
                    // 发起请求
                    const response = await request.get('/ship/getlcl',
                        { params: params2 });

                    // 更新分页数据和总行数
                    this.shiplist = response.data.content;
                    this.totalRows = response.data.totalElements;


                } catch (error) {
                    console.error('Error fetching data:', error);
                } finally {
                    this.loading = false;
                }
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

        changeTableType() {
            // Clear existing headers
            this.headers = [];



            // Add type-specific headers
            if (this.tabletype === '整箱') {
                this.headers.push(
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

                    // Add other headers specific to '整箱'
                );
            } else if (this.tabletype === '拼箱') {
                this.headers.push(
                    { title: '订阅', key: 'actions', sortable: false },
                    { title: '起运港', key: 'lclpol', align: 'center', sortable: false },
                    { title: '目的港', key: 'lcldes', align: 'center', sortable: false },
                    { title: '运输方式', key: 'transportationmethod', align: 'center', sortable: false },
                    { title: '收货人类型', key: 'consignee', align: 'center', sortable: false },
                    { title: '中转港', key: 'lcltransit', align: 'center', sortable: false },
                    { title: '船公司', key: 'lclcarrier', align: 'center', sortable: false },
                    { title: 'CBM', key: 'cbmprice', align: 'center', sortable: false },
                    { title: 'TON', key: 'tonprice', align: 'center', sortable: false },
                    { title: '其他价格', key: 'otherprice', align: 'center', sortable: false },

                    // Add other headers specific to '拼箱'
                );
            }
        },
        async subscribetoFCL(item) {
            const storedUser = JSON.parse(localStorage.getItem('user'));
            const userid = storedUser.userid;
            // 在这里实现将订阅数据发送到后端的逻辑
            const subscriptionFCLData = {
                // 从表格行数据中提取需要的订阅信息
                fclid: item.fclid, // 请根据实际情况替换为表格行中FCL的唯一标识字段
                pol: item.fclpol,
                destination: item.fcldes,
                cargotype: this.tabletype,
            };
            console.log('Subscription Data:', subscriptionFCLData);
            try {
                // 发送订阅数据到后端
                const response = await request.post(`/ship/subscribeToFcl/${userid}`, subscriptionFCLData);
                // 处理后端返回的响应，可以根据需要进行操作
                this.complete = true;
                console.log(response.data);
            } catch (error) {
                this.error = true;
                console.error('Error subscribing to shipList:', error);
            }
        },
        async subscribetoLCL(item) {
            const storedUser = JSON.parse(localStorage.getItem('user'));
            const userid = storedUser.userid;
            // 在这里实现将订阅数据发送到后端的逻辑
            const subscriptionLCLData = {
                // 从表格行数据中提取需要的订阅信息
                lclid: item.lclid, // 请根据实际情况替换为表格行中FCL的唯一标识字段
                pol: item.lclpol,
                destination: item.lcldes,
                cargotype: this.tabletype,
            };
            console.log('Subscription Data:', subscriptionLCLData);
            try {
                // 发送订阅数据到后端
                const response = await request.post(`/ship/subscribeToLcl/${userid}`, subscriptionLCLData);
                // 处理后端返回的响应，可以根据需要进行操作
                this.complete = true;
                console.log(response.data);
            } catch (error) {
                this.error = true;
                console.error('Error subscribing to shipList:', error);
            }
        },


    },


}
</script>