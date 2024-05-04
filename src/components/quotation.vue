<script setup>
import request from '../utils/request.js';

</script>
<template>
    <v-parallax height="350" src="http://www.vastfreight.com/skins/images/n_banner1.jpg">
        <div class="d-flex flex-column fill-height justify-center align-center text-white">
            <h1 class="text-h4 font-weight-thin mb-4 text-white">
                报价单查询
            </h1>
            <h4 class="subheading">
                Quotation
            </h4>
        </div>
    </v-parallax>
    <v-card flat class="mx-auto  mt-5 mb-10" max-width="1200">
        <v-row>
            <v-col>
                <v-card-text>
                    <div class=" text-subtitle-2 font-weight-black mb-1">
                        客户名称
                    </div>

                    <v-text-field v-model="clientname" @input="setBussinessType(type)" label="输入客户名称" single-line
                        variant="outlined" clearable></v-text-field>
                </v-card-text>
            </v-col>
            <v-col>
                <v-card-text>
                    <div class="text-subtitle-2 font-weight-black mb-1">
                        报价时间
                    </div>

                    <v-text-field v-model="qcreatetime" @input="setBussinessType(type)" label="输入日期" single-line
                        variant="outlined" type="date" suffix="日期"></v-text-field>
                </v-card-text>
            </v-col>

            <v-col>
                <v-card-text>
                    <div class="text-subtitle-2 font-weight-black mb-1">
                        业务类型
                    </div>
                    <v-btn-group v-model="toggle" divided variant="outlined">
                        <v-btn @click="setBussinessType('整箱')">整箱</v-btn>
                        <v-btn @click="setBussinessType('拼箱')">拼箱</v-btn>

                    </v-btn-group>
                </v-card-text>
            </v-col>

        </v-row>


        <v-divider></v-divider>
        <v-card-text class="pa-0">
            <v-data-table-server :search="search" :headers="headers" :items-length="totalRows" :items="quotationlist"
                :loading="loading" loading-text="努力加载中" :items-per-page="size" no-data-text="没有找到数据捏"
                @update:options="updatequotationList" items-per-page-text="每页显示" fixed-header hover
                item-value="quotationid">

                <template v-slot:item.businesstype="{ item }">

                    <v-chip size="small" :color="item.businesstype === '整箱' ? 'blue' : 'yellow'" class="font-weight-bold">
                        {{ item.businesstype }}</v-chip>

                </template>
                <template v-slot:item.quostatus="{ item }">

                    <v-chip size="small" :color="item.quostatus === '已接受' ? 'green' : 'grey'" class="font-weight-bold">
                        {{ item.quostatus }}</v-chip>

                </template>
                <template v-slot:item.actions="{ item }">
                    <v-row>
                        <v-col>
                            <v-tooltip text="删除" location="bottom">
                                <template v-slot:activator="{ props }">
                                    <v-btn v-bind="props" size="small" class="me-2" color="red" variant="text"
                                        icon="mdi-close-box" @click="openDeleteDialog(item)"
                                        :disabled="isDisabled(item.quostatus)">
                                    </v-btn>
                                </template>
                            </v-tooltip>
                            <v-tooltip text="接收报价" location="bottom">
                                <template v-slot:activator="{ props }">
                                    <v-btn v-bind="props" size="small" class="me-2" color="primary" variant="text"
                                        icon="mdi-playlist-check" @click="openConfirmDialog(item)"
                                        :disabled="isDisabled(item.quostatus)">
                                    </v-btn>
                                </template>
                            </v-tooltip>
                        </v-col>
                    </v-row>


                </template>




            </v-data-table-server>
        </v-card-text>
    </v-card>
    <v-dialog v-model="dialogDelete" max-width="200px">
        <v-card>
            <v-card-title class="text-h6 text-center">确认删除?</v-card-title>
            <v-divider></v-divider>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="red" density="compact" icon="mdi-close" @click="closeDelete"></v-btn>
                <v-btn color="green" density="compact" icon="mdi-check" @click="deleteItemConfirm"></v-btn>
                <v-spacer></v-spacer>
            </v-card-actions>
        </v-card>
    </v-dialog>
    <v-dialog v-model="confirmquo" max-width="500px">
        <v-card>
            <v-card-title class="text-h6">提示</v-card-title>
            <v-divider></v-divider>
            <v-card-text>是否接受报价?
            </v-card-text>
            <v-card-actions class="justify-end">
                <v-btn color="red" icon="mdi-close" @click="closeDialog"></v-btn>
                <v-btn color="green" icon="mdi-check" @click="ItemConfirm"></v-btn>
            </v-card-actions>
        </v-card>

    </v-dialog>
    <v-dialog v-model="cargosetconfirm" max-width="500px">
        <v-card>
            <v-card-title class="text-h6">提示</v-card-title>
            <v-divider></v-divider>
            <v-card-text>报价已经接受，是否立刻前往登记货物信息？
            </v-card-text>
            <v-card-actions class="justify-end">
                <v-tooltip text="关闭" location="bottom">
                    <template v-slot:activator="{ props }">
                        <v-btn v-bind="props" color="red" icon="mdi-close" @click="closecargosetDialog"></v-btn>
                    </template>
                </v-tooltip>
                <v-tooltip text="前往页面" location="bottom">
                    <template v-slot:activator="{ props }">
                        <v-btn v-bind="props" color="green" icon="mdi-open-in-new" @click="takemodifyDialog"></v-btn>
                    </template>
                </v-tooltip>
            </v-card-actions>

        </v-card>
    </v-dialog>
    <v-snackbar :timeout="2000" color="primary" rounded="pill" close-on-content-click timer v-model="complete">
        <strong>报价已接受</strong>.
    </v-snackbar>
</template>
  
<script>
import usequoStore from '../stores/quotationinfo';
export default {
    data() {
        return {
            quotationlist: [],
            search: '',
            loading: false,
            totalRows: 0,
            page: 1,
            size: 10,
            selected: [],
            headers: [
                { title: '操作', key: 'actions', align: 'center', sortable: false, width: '150px' },
                { title: '编号', key: 'quotationid', align: 'center', sortable: false, width: '70px' },
                { title: '业务类型', key: 'businesstype', align: 'center', sortable: false, width: '100px' },
                { title: '状态', key: 'quostatus', align: 'center', sortable: false, width: '100px' },
                { title: '起运港', key: 'qpol', align: 'center', sortable: false, width: '100px' },
                { title: '目的港', key: 'qdes', align: 'center', sortable: false, width: '100px' },
                { title: '航司', key: 'carrier', align: 'center', sortable: false, removable: true, width: '100px' },
                { title: '货量', key: 'qvolume', align: 'center', sortable: false, removable: true, width: '100px' },
                { title: '报价人', key: 'qman', align: 'center', sortable: false, removable: true, width: '100px' },
                { title: '创建时间', key: 'qcreatetime', align: 'center', sortable: false, removable: true, width: '200px' },
                { title: '客户名称', key: 'clientname', sortable: false, align: 'center', removable: true, width: '200px' },
                { title: '联系人', key: 'clientman', sortable: false, align: 'center', removable: true, width: '100px' },



            ],
            businesstype: '',
            clientname: '',
            qcreatetime: '',
            Qid: null,
            Qadminid: null,

            dialogDelete: false,
            confirmquo: false,
            complete: false,
            cargosetconfirm: false,

            selectedItemToDelete: '',


        }
    },
    watch: {
        clientname() {
            this.search = String(Date.now())
        },
        qcreatetime() {
            this.search = String(Date.now())
        },
    },
    methods: {
        isDisabled(sendStatus) {

            return sendStatus === "已接受";
        },
        openConfirmDialog(item) {
            const quoStore = usequoStore();
            this.Qid = item.quotationid;
            this.Qadminid = item.admin.adminid;
            this.confirmquo = true;
            quoStore.setAddPol(item.qpol);
            quoStore.setAddDes(item.qdes);
            quoStore.dialogadd = true;

        },
        closeDialog() {
            this.Qid = null;
            this.Qadminid = null;
            this.confirmquo = false;

        },
        openDeleteDialog(item) {
            this.selectedItemToDelete = item.quotationid;
            this.dialogDelete = true;

        },
        closeDelete() {
            this.selectedItemToDelete = null;
            this.dialogDelete = false;
        },
        closecargosetDialog() {
            this.cargosetconfirm = false;

        },
        takemodifyDialog() {
            this.$router.push('/index/arrival');

        },
        async deleteItemConfirm() {

            if (this.selectedItemToDelete) {
                try {

                    // 发送删除请求到后端
                    await request.delete(`/trade/deletequo/${this.selectedItemToDelete}`);

                    // 在前端更新列表，可以重新调用获取列表的方法或直接从列表中移除被删除的项

                    this.setBussinessType();
                } catch (error) {
                    console.error('Error deleting subscription:', error);
                } finally {
                    // 关闭对话框
                    this.closeDelete();
                }
            }
        },
        async ItemConfirm() {
            const currentDate = new Date();

            // 将日期时间格式化为字符串
            const formattedDate = currentDate.toISOString().slice(0, 19).replace('T', ' ');
            const requestData = {
                quostatus: "已接受"
            }
            const counstData = {
                adminid: this.Qadminid,
                createdate:formattedDate,

            }
            if (this.Qid) {

                try {
                    console.log('quo', this.Qid)
                    // 发送请求到后端
                    await request.put(`/trade/updatequostatus/${this.Qid}`, requestData);
                    await request.post('/trade/updatecount',counstData);
                    this.complete = true;

                    this.setBussinessType();

                } catch (error) {
                    console.error('Error deleting :', error);
                } finally {
                    // 关闭对话框
                    this.closeDialog();
                    this.cargosetconfirm = true;
                }
            }
        },
        async setBussinessType(type) {
            this.loading = true;
            this.businesstype = type;
            const storedUser = JSON.parse(localStorage.getItem('user'));
            // 构造查询参数
            const params = {
                userid: storedUser.userid,
                clientname: this.clientname,
                qcreatetime: this.qcreatetime,
                businesstype: this.businesstype,
                page: this.page - 1,
                size: this.size,

            };
            console.log(params);

            try {
                // 发起请求
                const response = await request.get('/trade/getquo',
                    { params });

                // 更新分页数据和总行数
                this.quotationlist = response.data.content;
                this.totalRows = response.data.totalElements;
                console.log(response.data);


            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                this.loading = false;
            }
        },
        updatequotationList(newOptions) {
            // 处理分页组件的更新事件
            this.loading = true;
            this.page = newOptions.page;
            this.size = newOptions.itemsPerPage;

            this.setBussinessType();
            this.loading = false;
        },






    }
}
</script>