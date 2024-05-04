<script setup>
import request from '../utils/request.js';
import tooltipbtn from '../components/tooltipbtn.vue';
</script>
<template>
    <v-container>
        <v-card flat class="mx-auto  mt-5 mb-10 pa-0 elevation-2" height="585">
            <v-row no-gutters class="operateArea">
                <v-col cols="3" class="col">
                    <tooltipbtn icon="mdi-plus" :tooltip-text="'添加'" @click="openimportDialog"></tooltipbtn>
                    <tooltipbtn icon="mdi-refresh" :tooltip-text="'刷新'" @click="getcompanyinfo()"></tooltipbtn>

                </v-col>

                <v-col cols="9">
                    <v-row no-gutters>
                        <v-col cols="4">
                        </v-col>
                        <v-col cols="4">
                        </v-col>
                        <v-col cols="4">
                            <v-text-field v-model="scompanyname" label="公司名称" variant="solo" hide-details
                                density="comfortable" class="ml-5 mt-1" clearable></v-text-field>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
            <v-card-text class="pa-0 mt-5">
                <v-data-table-server :search="search" :headers="headers" :items-length="totalRows" :items="companylist"
                    :loading="loading" loading-text="努力加载中" :items-per-page="size" no-data-text="没有找到数据捏"
                    @update:options="updatecompanyList" items-per-page-text="每页显示" item-value="companyid" fixed-header hover
                    height="450">

                    <template v-slot:item.actions="{ item }">
                        <v-tooltip text="删除" location="start">
                            <template v-slot:activator="{ props }">
                                <v-icon v-bind="props" size="small" class="me-2" color="red"
                                    @click="openDeleteDialog(item)">
                                    mdi-close
                                </v-icon>
                            </template>
                        </v-tooltip>
                        <v-tooltip text="修改" location="end">
                            <template v-slot:activator="{ props }">
                                <v-icon v-bind="props" size="small" class="me-2" color="cyan-lighten-2"
                                    @click="openConfigDialog(item)">
                                    mdi-pencil
                                </v-icon>
                            </template>
                        </v-tooltip>


                    </template>
                </v-data-table-server>
            </v-card-text>
        </v-card>
    </v-container>
    <v-dialog v-model="configinfo" transition="dialog-top-transition" width="400">

        <v-card>
            <v-form ref="configForm" validate-on="submit lazy" @submit.prevent="config">
                <v-toolbar color="cyan-lighten-2" title="修改"></v-toolbar>
                <v-card-text>
                    <v-row>
                        <v-col>
                            <v-text-field v-model="configname" label="公司名称" variant="outlined" :rules="addrule"
                                readonly></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <v-text-field v-model="configcity" label="所在地" variant="outlined" readonly></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <v-text-field v-model="configaddress" label="地址" variant="outlined"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <v-text-field v-model="configman" label="负责人" variant="outlined"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <div
                                class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between text-caption text-decoration-none">
                                <v-sapcer></v-sapcer>可填写qq,email,手机号码等联系方式
                            </div>
                            <v-text-field v-model="configcontactway" label="联系方式" variant="outlined"></v-text-field>
                        </v-col>
                    </v-row>

                </v-card-text>
                <v-card-actions class="justify-end">
                    <v-btn color="cyan-lighten-2" variant="text" type="submit">修改</v-btn>
                    <v-btn variant="text" @click="closeConfigDialog">关闭</v-btn>
                </v-card-actions>
            </v-form>
        </v-card>
    </v-dialog>
    <v-dialog v-model="importcominfo" transition="dialog-top-transition" width="400">

        <v-card>
            <v-form ref="importForm" validate-on="submit lazy" @submit.prevent="importcom">
                <v-toolbar color="cyan-lighten-2" title="添加"></v-toolbar>
                <v-card-text>
                    <v-row>
                        <v-col>
                            <v-text-field v-model="importname" label="公司名称" variant="outlined"
                                :rules="importrule"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <v-text-field v-model="importcity" label="所在地" variant="outlined"
                                :rules="importrule"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <v-text-field v-model="importaddress" label="地址" variant="outlined"
                                :rules="importrule"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <v-text-field v-model="importman" label="负责人" variant="outlined"
                                :rules="importrule"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <div
                                class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between text-caption text-decoration-none">
                                <v-sapcer></v-sapcer>可填写qq,email,手机号码等联系方式
                            </div>
                            <v-text-field v-model="importcontactway" label="联系方式" variant="outlined"></v-text-field>
                        </v-col>
                    </v-row>

                </v-card-text>
                <v-card-actions class="justify-end">
                    <v-btn color="cyan-lighten-2" variant="text" type="submit">添加</v-btn>
                    <v-btn variant="text" @click="closeimportDialog">关闭</v-btn>
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

    <v-snackbar :timeout="2000" color="primary" rounded="pill" close-on-content-click timer v-model="complete">
        <strong>删除成功</strong>.
    </v-snackbar>
    <v-snackbar :timeout="2000" color="success" rounded="pill" close-on-content-click v-model="configcomplete">
        <strong>成功</strong>.
    </v-snackbar>
</template>
  
<script>
const storedUser = JSON.parse(localStorage.getItem('admin'));
export default {

    data: () => ({

        search: '',
        companylist: [],
        loading: false,
        totalRows: 0,
        page: 1,
        size: 10,

        dialogDelete: false,
        complete: false,
        configinfo: false,
        configcomplete: false,
        importcominfo: false,

        headers: [
            { title: '操作', key: 'actions', align: 'center', sortable: false, width: '100px' },
            { title: '公司名称', key: 'companyname', align: 'center', sortable: false, width: '100px' },
            { title: '所在地', key: 'cityfrom', align: 'center', sortable: false, width: '100px' },
            { title: '地址', key: 'address', align: 'center', sortable: false, width: '100px' },
            { title: '负责人', key: 'contactpeople', align: 'center', sortable: false, width: '100px' },
            { title: '联系方式', key: 'contactway', align: 'center', sortable: false, width: '100px' },

        ],
        addrule: [
            value => !!value || '不能为空！',
        ],
        importrule: [
            value => !!value || '不能为空！',
        ],




        scompanyname: '',

        selectedItemToDelete: null,

        configID: null,
        configname: null,
        configcity: null,
        configaddress: null,
        configman: null,
        configcontactway: null,

        importname: null,
        importcity: null,
        importaddress: null,
        importman: null,
        importcontactway: null,
        





    }),
    watch: {
        scompanyname() {
            this.search = String(Date.now())
        },
    },
    methods: {
        openDeleteDialog(item) {
            this.selectedItemToDelete = item.companyID;
            this.dialogDelete = true;
        },
        closeDelete() {
            this.selectedItemToDelete = null;
            this.dialogDelete = false;
        },
        openConfigDialog(item) {
            this.configname = item.companyname;
            this.configcity = item.cityfrom;
            this.configaddress = item.address;
            this.configman = item.contactpeople;
            this.configcontactway = item.contactway;
            this.configID = item.companyID;
            this.configinfo = true;


        },
        closeConfigDialog() {
            this.configname = null;
            this.configcity = null;
            this.configaddress = null;
            this.configman = null;
            this.configcontactway = null;

            this.configID = null;
            this.configinfo = false;

        },
        openimportDialog() {
            this.importcominfo = true;
        },
        closeimportDialog() {
            this.importname = null;
            this.importcity = null;
            this.importaddress = null;
            this.importman = null;
            this.importcontactway = null;
            
            this.importcominfo = false;

        },
        async importcom() {
            const { valid } = await this.$refs.importForm.validate();
            const storedUser = JSON.parse(localStorage.getItem('admin'));
            if (valid) {
                const data = {
                    adminid:storedUser.adminid,
                    companyname: this.importname,
                    cityfrom: this.importcity,
                    address: this.importaddress,
                    contactpeople: this.importman,
                    contactway: this.importcontactway,

                };
                console.log('add:', data);
                try {
                    // 发送请求到后端
                    await request.post('/com/addTocom', data);
                    this.configcomplete = true;

                    this.getcompanyinfo();
                } catch (error) {
                    console.error('Error add subscription:', error);
                } finally {
                    // 关闭对话框
                    this.closeimportDialog();
                }
            }
        },
        async config() {
            const { valid } = await this.$refs.configForm.validate();
            if (valid) {
                const requestData = {
                    companyname: this.configname,
                    cityfrom: this.configcity,
                    address: this.configaddress,
                    contactpeople: this.configman,
                    contactway: this.configcontactway,


                }

                if (this.configID) {
                    try {
                        // 发送请求到后端
                        await request.put(`/com/modifycom/${this.configID}`, requestData);

                        this.configcomplete = true;
                        this.getcompanyinfo();
                    } catch (error) {
                        console.error('Error deleting subscription:', error);
                    } finally {
                        // 关闭对话框
                        this.closeConfigDialog();

                    }
                }
            }

        },
        async deleteItemConfirm() {

            if (this.selectedItemToDelete) {
                try {

                    // 发送删除请求到后端
                    await request.delete(`/com/deletecom/${this.selectedItemToDelete}`);
                    this.complete = true;
                    // 在前端更新列表，可以重新调用获取列表的方法或直接从列表中移除被删除的项

                    this.getcompanyinfo();
                } catch (error) {
                    console.error('Error deleting subscription:', error);
                } finally {
                    // 关闭对话框
                    this.closeDelete();
                }
            }
        },

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