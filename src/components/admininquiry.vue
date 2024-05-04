<script setup>
import request from '../utils/request.js';
import tooltipbtn from '../components/tooltipbtn.vue';
</script>
<template>
    <v-container>
        <v-card flat class="mx-auto  mt-5 mb-10 elevation-2" height="585">
            <v-row no-gutters class="operateArea">
                <v-col cols="3" class="col">

                    <tooltipbtn icon="mdi-refresh" :tooltip-text="'刷新'" @click="getinquiry()"></tooltipbtn>

                </v-col>

                <v-col cols="9">
                    <v-row no-gutters>
                        <v-col cols="4">
                        </v-col>
                        <v-col cols="4">
                        </v-col>
                        <v-col cols="4">
                            <v-select :items="options" item-title="state" item-value="abbr" v-model="status" label="状态"
                                variant="solo" hide-details density="comfortable" class="ml-5 mt-1" clearable></v-select>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>


            <div class="pa-0 mt-5">
                <v-data-table-server :search="search" :headers="headers" :items-length="totalRows" :items="inquirylist"
                    :loading="loading" loading-text="努力加载中" :items-per-page="size" no-data-text="没有找到数据捏"
                    @update:options="updateinquiryList" items-per-page-text="每页显示" fixed-header hover item-value="inquiryID"
                    height="450">
                    <template v-slot:item.actions="{ item }">
                        <v-tooltip :text="item.acceptstatus === '未受理' ? '回复' : '已回复'" location="start">
                            <template v-slot:activator="{ props }">
                                <v-icon v-bind="props" size="small" class="me-2"
                                    :color="item.acceptstatus === '未受理' ? 'cyan-lighten-2' : 'black'"
                                    @click="item.acceptstatus === '未受理' ? opencontactDialog(item) : null">
                                    {{ item.acceptstatus === '未受理' ? 'mdi-comment-text-outline' : 'mdi-check' }}
                                </v-icon>

                            </template>
                        </v-tooltip>
                    </template>

                    <template v-slot:item.acceptstatus="{ item }">
                        <v-chip size="small" :color="item.acceptstatus === '未受理' ? 'grey' : 'blue'"
                            class="font-weight-bold">
                            {{ item.acceptstatus }}</v-chip>
                    </template>
                    <template v-slot:item.photo="{ item }">
                        <v-img :src="getBase64Image(item.photo)" height="100" width="160" cover
                            class="rounded-lg v-card--link" @click="previewImg(item)" />
                    </template>
                </v-data-table-server>
            </div>
        </v-card>
        <v-dialog v-model="contactinfo" transition="dialog-top-transition" width="400">
            <v-card>
                <v-form ref="contactForm" validate-on="submit lazy" @submit.prevent="contact">
                    <v-toolbar color="cyan-lighten-2" title="回复"></v-toolbar>
                    <v-card-text>
                        <v-row>
                            <v-col>
                                <v-text-field v-model="contactman" label="回复人" variant="outlined" readonly
                                    :rules="contactrule"></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col>
                                <v-textarea v-model="contactmessage" label="回复消息" variant="outlined"
                                    :rules="contactrule"></v-textarea>
                            </v-col>
                        </v-row>

                    </v-card-text>
                    <v-card-actions class="justify-end">
                        <v-btn color="cyan-lighten-2" variant="text" type="submit">回复</v-btn>
                        <v-btn variant="text" @click="closeaddDialog">关闭</v-btn>
                    </v-card-actions>
                </v-form>
            </v-card>

        </v-dialog>
        <v-dialog v-model="imgOverlay" location-strategy="connected" scroll-strategy="none">
            <div @click="imgOverlay = false" class="w-screen h-screen d-flex align-center justify-center">
                <v-img height="80%"  :src="ViewerUrl" />
             
            </div>
            
        </v-dialog>
    </v-container>
    <v-snackbar :timeout="2000" color="success" rounded="pill" close-on-content-click v-model="complete">
        <strong>回复成功</strong>.
    </v-snackbar>
    
</template>
  
<script>
const storedUser = JSON.parse(localStorage.getItem('admin'));
export default {

    data() {
        return {


            search: '',
            Adddialog: false,
            headers: [
                { title: '操作', key: 'actions', align: 'center', sortable: false, width: '70px' },
                { title: '编号', key: 'inquiryID', align: 'center', sortable: false, width: '70px' },
                { title: '状态', key: 'acceptstatus', align: 'center', sortable: false, width: '200px' },
                { title: '起运港', key: 'ipol', sortable: false, width: '100px' },
                { title: '目的港', key: 'ides', sortable: false, width: '100px' },
                { title: '出运量', key: 'volume', sortable: false, removable: true, width: '100px' },
                { title: '出运日期', key: 'shipmentdate', align: 'center', sortable: false, removable: true, width: '120px' },
                { title: '其他要求', key: 'iotherinfo', align: 'center', sortable: false, removable: true, width: '300px' },
                { title: '货物描述', key: 'describe', align: 'center', sortable: false, removable: true, width: '300px' },
                { title: '货物照片', key: 'photo', align: 'center', sortable: false, removable: true, width: '200px' },
                { title: '联系人', key: 'contactman', sortable: false, removable: true, width: '100px' },
                { title: '手机号码', key: 'phone', align: 'center', sortable: false, removable: true, width: '100px' },
                { title: '创建时间', key: 'createtime', align: 'center', sortable: false, removable: true, width: '200px' },
                { title: '回复时间', key: 'recoverytime', align: 'center', sortable: false, removable: true, width: '200px' },
                { title: '回复人', key: 'recoveryman', align: 'center', sortable: false, removable: true, width: '100px' },
                { title: '回复消息', key: 'recoveryinfo', align: 'center', sortable: false, removable: true, width: '300px' },


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

            complete: false,


            status: null,
            contactman: storedUser.adminrealname,
            contactmessage: null,
            contactID: '',


            iscontacted: false,
            contactinfo: false,

            imgOverlay: false,
            photourl:null,
        }

    },
    watch: {
        status() {
            this.search = String(Date.now())
        },

    },
    computed: {
        ViewerUrl() {

            return this.photourl;
        },
    },
    methods: {
        async previewImg(item) {
            const response = await request.get(`/trade/viewphotos/${item.inquiryID}`, { responseType: 'blob' });
            const blob = await response.data;

            this.$nextTick(() => {
                this.photourl = URL.createObjectURL(blob, { type: 'image/jpeg' });
                this.imgOverlay = true;
            });
        },
        opencontactDialog(item) {
            this.contactID = item.inquiryID;
            this.contactinfo = true;

        },
        closeaddDialog() {
            this.contactman = storedUser.adminrealname;
            this.contactmessage = null;
            this.contactinfo = false;

        },

        getBase64Image(photo) {
            // 将 base64 编码的字符串转换为数据 URI
            return `data:image/jpeg;base64,${photo}`;
        },

        async contact() {
            const { valid } = await this.$refs.contactForm.validate();
            if (valid) {
                const requestData = {
                    recoveryman: this.contactman,
                    recoveryinfo: this.contactmessage,

                }
                console.log('Otherman:', this.editemail);
                console.log('Otherinfo:', this.editother);
                console.log('ID:', this.contactID);
                if (this.contactID) {
                    try {
                        // 发送请求到后端
                        await request.put(`/trade/contact/${this.contactID}`, requestData);
                        this.complete = true;


                        this.getinquiry();
                    } catch (error) {
                        console.error('Error deleting subscription:', error);
                    } finally {
                        // 关闭对话框
                        this.closeaddDialog();
                        this.iscontacted = true;
                    }
                }
            }

        },


        async getinquiry() {

            this.loading = true;

            // 构造查询参数
            const params = {
                acceptstatus: this.status,
                page: this.page - 1,
                size: this.size,

            };

            try {
                // 发起请求
                const response = await request.get('/trade/inquiryList',
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