<script setup>
import request from '../utils/request.js';
import tooltipbtn from '../components/tooltipbtn.vue';
</script>
<template>
    <v-container>
        <v-card flat class="mx-auto  mt-5 mb-10 elevation-2" height="585">
            <v-row no-gutters class="operateArea">
                <v-col cols="3" class="col">
                    <tooltipbtn icon="mdi-plus" :tooltip-text="'添加'" @click="openaddDialog"></tooltipbtn>
                    <tooltipbtn icon="mdi-refresh" :tooltip-text="'刷新'" @click="setBussinessType()"></tooltipbtn>
                    <tooltipbtn icon="mdi-alpha-f" :tooltip-text="'整箱'" @click="setBussinessType('整箱')"> </tooltipbtn>
                    <tooltipbtn icon="mdi-alpha-l" :tooltip-text="'拼箱'" @click="setBussinessType('拼箱')"> </tooltipbtn>
                </v-col>

                <v-col cols="9">
                    <v-row no-gutters>
                        <v-col cols="4">
                            <v-text-field v-model="pol" label="起运港" variant="solo" hide-details density="comfortable"
                                class="ml-5 mt-1" clearable></v-text-field>
                        </v-col>
                        <v-col cols="4">
                            <v-text-field v-model="des" label="目的港" variant="solo" hide-details density="comfortable"
                                class="ml-5 mt-1" clearable></v-text-field>
                        </v-col>
                        <v-col cols="4">
                            <v-text-field v-model="clientname" label="客户名称" variant="solo" hide-details
                                density="comfortable" class="ml-5 mt-1" clearable></v-text-field>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>

            <v-card-text class="pa-0 mt-5">
                <v-data-table-server :search="search" :headers="headers" :items-length="totalRows" :items="quotationlist"
                    :loading="loading" loading-text="努力加载中" :items-per-page="size" no-data-text="没有找到数据捏"
                    @update:options="updatequotationList" items-per-page-text="每页显示" fixed-header hover
                    item-value="quotationid" height="450">

                    <template v-slot:item.businesstype="{ item }">

                        <v-chip size="small" :color="item.businesstype === '整箱' ? 'blue' : 'yellow'"
                            class="font-weight-bold">
                            {{ item.businesstype }}</v-chip>

                    </template>
                    <template v-slot:item.quostatus="{ item }">

                        <v-chip size="small" :color="item.quostatus === '已接受' ? 'green' : 'grey'" class="font-weight-bold">
                            {{ item.quostatus }}</v-chip>

                    </template>
                    <template v-slot:item.actions="{ item }">
                        <v-tooltip text="删除" location="start">
                            <template v-slot:activator="{ props }">
                                <v-icon v-bind="props" size="small" class="me-2" color="red"
                                    @click="openDeleteDialog(item)">
                                    mdi-close
                                </v-icon>
                            </template>
                        </v-tooltip>
                    </template>

                </v-data-table-server>
            </v-card-text>
        </v-card>
        <v-dialog v-model="addinto" transition="dialog-top-transition" width="400">

            <v-card>
                <v-form ref="addForm" validate-on="submit lazy" @submit.prevent="add">
                    <v-toolbar color="cyan-lighten-2" title="添加报价"></v-toolbar>
                    <v-card-text>
                        <v-row>
                            <v-col>
                                <v-text-field v-model="addpol" label="起运港" variant="outlined"
                                    :rules="addrule"></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col>
                                <v-text-field v-model="adddes" label="目的港" variant="outlined"
                                    :rules="addrule"></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col>
                                <v-select :items="options" item-title="state" item-value="abbr" v-model="addtype" chips
                                    label="业务类型" variant="outlined" clearable :rules="addrule"></v-select>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col>
                                <v-text-field v-model="addcom" label="航司" variant="outlined"
                                    :rules="addrule"></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col>
                                <v-text-field v-model="addvolume" label="货量" variant="outlined"
                                    :rules="addrule"></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col>
                                <v-text-field v-model="addqman" label="报价人" variant="outlined" readonly
                                    :rules="addrule"></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12">
                                <v-select v-model="addcname" label="客户名称" variant="outlined" :items="cname" clearable
                                    item-title="cname" item-value="cname" :rules="addrule"
                                    @click="fetchCompanyNames"></v-select>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12">
                                <v-autocomplete v-model="addcman" label="联系人" variant="outlined" :items="cman" clearable
                                    :rules="addrule" @click="updateSelectedCompanyName"
                                    no-data-text="没有数据捏"></v-autocomplete>
                            </v-col>
                        </v-row>
                    </v-card-text>
                    <v-card-actions class="justify-end">
                        <v-btn color="cyan-lighten-2" variant="text" type="submit">添加</v-btn>
                        <v-btn variant="text" @click="closeaddDialog">关闭</v-btn>
                    </v-card-actions>
                </v-form>
            </v-card>

        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
                <v-card-title class="text-h6 bg-cyan-lighten-2">提示</v-card-title>
                <v-divider></v-divider>
                <v-card-text>您确定要删除此条数据吗?</v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn density="compact" @click="closeDelete">取消</v-btn>
                    <v-btn color="red" density="compact" @click="deleteItemConfirm">删除</v-btn>

                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-snackbar :timeout="2000" color="success" rounded="pill" close-on-content-click v-model="complete">
            <strong>添加成功</strong>.
        </v-snackbar>
    </v-container>
</template>
  
<script>
const storedUser = JSON.parse(localStorage.getItem('admin'));
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
                { title: '操作', key: 'actions', align: 'center', sortable: false, width: '70px' },
                { title: '编号', key: 'quotationid', align: 'center', sortable: false, width: '70px' },
                { title: '业务类型', key: 'businesstype', align: 'center', sortable: false, width: '100px' },
                { title: '状态', key: 'quostatus', align: 'center', sortable: false, width: '100px' },
                { title: '起运港', key: 'qpol', align: 'center',sortable: false, width: '100px' },
                { title: '目的港', key: 'qdes', align: 'center',sortable: false, width: '100px' },
                { title: '航司', key: 'carrier', align: 'center',sortable: false, removable: true, width: '100px' },
                { title: '货量', key: 'qvolume', align: 'center', sortable: false, removable: true, width: '100px' },
                { title: '报价人', key: 'qman', align: 'center', sortable: false, removable: true, width: '100px' },
                { title: '创建时间', key: 'qcreatetime', align: 'center', sortable: false, removable: true, width: '200px' },
                { title: '客户名称', key: 'clientname', align: 'center',sortable: false, removable: true, width: '200px' },
                { title: '联系人', key: 'clientman', align: 'center',sortable: false, removable: true, width: '100px' },



            ],
            options: [
                { state: '整箱', abbr: '整箱' },
                { state: '拼箱', abbr: '拼箱' },
            ],
            addrule: [
                value => !!value || '不能为空！',
            ],
            businesstype: '',
            pol: '',
            des: '',
            clientname: '',

            addpol: '',
            adddes: '',
            addtype: null,
            addcom: '',
            addvolume: '',
            addqman: storedUser.adminrealname,
            addcname: null,
            addcman: null,
            

            cname: [],
            cman: [],

            addinto: false,

            dialogDelete: false,

            selectedItemToDelete: '',

            complete: false,


        }

    },
    watch: {
        clientname() {
            this.search = String(Date.now())
        },
        pol() {
            this.search = String(Date.now())
        },
        des() {
            this.search = String(Date.now())
        },
    },

    methods: {
        async updateSelectedCompanyName() {
            try {
                const response = await request.get(`/com/getcontactman?companyname=${this.addcname}`);
                if (response.status = 200) {
                    const data = response.data;
                    this.cman = data;
                } else {
                    console.error('Failed to fetch contact men');
                }
            } catch (error) {
                console.error('Error during fetch:', error);
            }
        },
        async fetchCompanyNames() {
            const storedUser = JSON.parse(localStorage.getItem('admin'));
            try {
                const response = await request.get(`/com/companynames/${storedUser.adminid}`);
                if (response.status = 200) {
                    const companyNames = response.data;

                    this.cname = companyNames;
                } else {
                    console.error('Failed to fetch company names');

                }
            } catch (error) {
                console.error('Error during fetch:', error);
                throw error;
            }
        },
        closeaddDialog() {

            this.addpol = null;
            this.adddes = null;
            this.addtype = null;
            this.addcom = null;
            this.addvolume = null;
            this.addqman = storedUser.adminrealname;
            this.addcname = null;
            this.addcman = null;

            this.addinto = false;
        },


        openaddDialog() {
            this.addinto = true;

        },

        openDeleteDialog(item) {
            this.selectedItemToDelete = item.quotationid;
            this.dialogDelete = true;
        },
        closeDelete() {
            this.selectedItemToDelete = null;
            this.dialogDelete = false;
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
        async add() {
            const { valid } = await this.$refs.addForm.validate();
            const storedUser = JSON.parse(localStorage.getItem('admin'));
            const addman=this.addcman.split('-')[1];
            const addmanid=this.addcman.split('-')[0];
            if (valid) {
                const data = {
                    adminid: storedUser.adminid,
                    businesstype: this.addtype,
                    qpol: this.addpol,
                    qdes: this.adddes,
                    carrier: this.addcom,
                    qvolume: this.addvolume,
                    qman: this.addqman,
                    clientname: this.addcname,
                    clientman: addman,
                    userid:addmanid,


                };
                console.log('add:', data);
                try {
                    // 发送请求到后端
                    await request.post('/trade/addToquo', data);
                    this.complete = true;

                    this.setBussinessType();
                } catch (error) {
                    console.error('Error add subscription:', error);
                } finally {
                    // 关闭对话框
                    this.closeaddDialog();
                }
            }
        },




        async setBussinessType(type) {

            this.loading = true;
            this.businesstype = type;
            const storedUser = JSON.parse(localStorage.getItem('admin'));
            // 构造查询参数
            const params = {
                adminid: storedUser.adminid,
                clientname: this.clientname,
                qpol: this.pol,
                qdes: this.des,
                businesstype: this.businesstype,
                page: this.page - 1,
                size: this.size,

            };
            console.log(params);

            try {
                // 发起请求
                const response = await request.get('/trade/admingetquo',
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