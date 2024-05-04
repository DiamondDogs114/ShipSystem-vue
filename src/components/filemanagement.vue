<script setup>
import request from '../utils/request.js';
</script>
<template>
    <v-parallax height="350"
        src="https://djupload.oss-cn-beijing.aliyuncs.com/etrans56/topSupplier/60b4dd573b2142a7874de5e9dcb56c2f.jpg">
        <div class="d-flex flex-column fill-height justify-center align-center text-white">
            <h1 class="text-h4 font-weight-thin mb-4 text-white ">
                上传单据
            </h1>
            <h4 class="subheading">
                Document management
            </h4>
        </div>
    </v-parallax>
    <v-container>
        <v-card flat class="  mt-5 mb-10">
            <div class="d-flex justify-space-between align-start">
                <v-row>
                    <v-col cols="12" md="8" lg="7">
                        <v-dialog v-model="Adddialog" max-width="1400px" :persistent="true">
                            <template v-slot:activator="{ props }">
                                <v-card-title>
                                    <v-spacer></v-spacer>
                                    <v-btn prepend-icon="mdi-plus-box" color="primary" class="mx-2 mt-1" dark
                                        v-bind="props">上传文件</v-btn>
                                </v-card-title>
                            </template>
                            <v-card>
                                <v-card-title>
                                    <span class="text-h5">添加文件</span>
                                </v-card-title>

                                <v-card-text>
                                    <v-container>
                                        <v-row>
                                            <v-col cols="8">
                                                <v-file-input v-model="setfile" ref="setfile" @change="showPreview" counter
                                                    chips show-size label="上传文件" accept=".pdf"
                                                    prepend-icon="mdi-file-multiple-outline" :show-size="1000"
                                                    variant="solo">
                                                </v-file-input>
                                            </v-col>
                                            <iframe v-if="this.setfileinfo.previewEnabled" :src="ViewerUrl" width="100%"
                                                height="800px" frameborder="0"></iframe>

                                        </v-row>
                                    </v-container>
                                </v-card-text>
                                <v-divider></v-divider>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn color="red" icon="mdi-close" variant="text" @click="close"></v-btn>
                                    <v-btn color="green" icon="mdi-check" variant="text" @click="add"></v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>

                    </v-col>
                    <v-col cols="12" offsetLg="2" md="4" lg="3">
                        <div class="mt-1 mb-3 d-flex align-center">
                            <v-text-field v-model="searchfilename" variant="solo" label="搜索文件" hide-details
                                prepend-inner-icon="mdi-magnify"></v-text-field>
                        </div>
                    </v-col>
                </v-row>
            </div>

            <v-divider></v-divider>
            <div class="pa-0">
                <v-data-table-server :search="search" :headers="headers" :items-length="totalRows" :items="filelist"
                    :loading="loading" loading-text="努力加载中" :items-per-page="size" no-data-text="没有找到数据捏"
                    @update:options="updatefileList" items-per-page-text="每页显示" fixed-header hover item-value="fileid">
                    <template v-slot:item.actions="{ item }">
                        <v-tooltip text="预览" location="start">
                            <template v-slot:activator="{ props }">
                                <v-icon v-bind="props" size="small" class="me-2" color="blue" @click="takealook(item)">
                                    mdi-file-eye-outline
                                </v-icon>

                            </template>
                        </v-tooltip>
                    </template>

                </v-data-table-server>
            </div>
        </v-card>

    </v-container>
    <v-snackbar :timeout="2000" color="primary" rounded="pill" close-on-content-click timer v-model="complete">
        <strong>添加成功</strong>.
    </v-snackbar>
</template>
  
<script>


export default {

    data: () => ({


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

        complete: false,

        Adddialog: false,

        setfile: null,
        setfileinfo: {
            name: '',
            size: '',
            type: '',
            suffix: '',
            link: '',
            previewEnabled: false,
        },

        searchfilename: null,

    }),
    computed: {
        ViewerUrl() {

            return this.setfileinfo.link;
        },
    },
    watch: {
        setfile() {
            this.showPreview();
        },
        searchfilename() {
            this.search = String(Date.now())
        },
    },

    methods: {
        async takealook(item) {

            const response = await request.get(`/trade/viewfiles/${item.fileid}`, { responseType: 'blob' });
            const blob = await response.data;

            // 创建 Blob 对象的 URL
            const blobUrl = URL.createObjectURL(blob, { type: 'application/pdf' });

            // 打开新窗口预览
            window.open(blobUrl, '_blank');



        },
        async showPreview() {

            const file = this.setfile[0];
            console.log("file", this.setfile)
            if (file) {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                this.setfileinfo.name = file.name;
                this.setfileinfo.size = this.formatFileSize(file.size);
                // 创建Promise以确保读取完成
                const filePromise = new Promise((resolve, reject) => {
                    reader.onload = () => {

                        this.setfileinfo.type = file.type;

                        this.setfileinfo.suffix = file.name.split(".").pop();
                        this.setfileinfo.link = URL.createObjectURL(file, { type: 'application/pdf' });
                        this.setfileinfo.previewEnabled = true;

                        resolve();
                    };
                    reader.onerror = () => {
                        reject(reader.error);
                    };
                });



                // 等待Promise完成
                await filePromise;
            }

            console.log(this.setfileinfo);
        },
        formatFileSize(size) {
            const kbSize = size / 1024;
            if (kbSize < 1024) {
                return kbSize.toFixed(2) + ' KB';
            } else {
                return (kbSize / 1024).toFixed(2) + ' MB';
            }
        },
        close() {
            this.setfile = null;
            this.setfileinfo = {
                name: '',
                size: '',
                type: '',
                suffix: '',
                link: '',
                previewEnabled: false,

            };
            this.Adddialog = false;


        },
        async add() {
            const storedUser = JSON.parse(localStorage.getItem('user'));
            const formData = new FormData();
            formData.append('file', this.setfile[0]);
            console.log('file:', this.setfile);
            const data = {
                userid: storedUser.userid,
                fileName: this.setfileinfo.name,
                fileSize: this.setfileinfo.size,
                contentType: this.setfileinfo.suffix,

            };
            try {
                // 发送请求到后端
                await request.post('/trade/addTofile', formData, {
                    params: data,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                this.complete = true;

                this.getfile();
            } catch (error) {
                console.error('Error:', error);
            } finally {
                this.close();
            }
        },



        async getfile() {
            const storedUser = JSON.parse(localStorage.getItem('user'));
            this.loading = true;

            // 构造查询参数
            const params = {
                userid: storedUser.userid,
                fileName: this.searchfilename,
                page: this.page - 1,
                size: this.size,

            };


            try {
                // 发起请求
                const response = await request.get('/trade/getfile',
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