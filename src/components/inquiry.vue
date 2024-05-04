<script setup>

import request from '../utils/request.js';
</script>
<template>
    <v-parallax height="350"
        src="https://djupload.oss-cn-beijing.aliyuncs.com/etrans56/topSupplier/95d41443b9a84517b3654e4bed60c322.jpg">
        <div class="d-flex flex-column fill-height justify-center align-center text-white">
            <h1 class="text-h4 font-weight-thin mb-4 text-white">
                询盘
            </h1>
            <h4 class="subheading">
                inquiry
            </h4>
        </div>
    </v-parallax>
    <v-container>
        <v-card flat class="  mt-5 mb-10">


            <v-dialog v-model="Adddialog" max-width="600px">
                <template v-slot:activator="{ props }">
                    <v-card-title>
                        <v-spacer></v-spacer>
                        <v-btn prepend-icon="mdi-plus-box" color="primary" dark v-bind="props">添加询盘</v-btn>
                    </v-card-title>
                </template>
                <v-card>
                    <v-card-title>
                        <span class="text-h5">添加询盘</span>
                    </v-card-title>

                    <v-card-text>
                        <v-container>
                            <v-row>
                                <v-col cols="5">
                                    <v-text-field v-model="addpol" label="起运港" variant="outlined"></v-text-field>
                                </v-col>
                                <v-col cols="5">
                                    <v-text-field v-model="adddes" label="目的港" variant="outlined"></v-text-field>
                                </v-col>
                                <v-col cols="5">
                                    <v-text-field v-model="addvolume" label="出运量" variant="outlined"></v-text-field>
                                </v-col>
                                <v-col cols="5">
                                    <v-text-field v-model="adddate" label="出运日期" variant="outlined" type="date"
                                        suffix="日期"></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="8">
                                    <v-text-field v-model="addotherinfo" label="其他要求" variant="outlined"></v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <v-textarea v-model="adddescribe" label="货物描述" variant="outlined"></v-textarea>
                                </v-col>

                                <v-col cols="8">
                                    <v-file-input v-model="addphoto" ref="addphoto" @change="updatePreviews" counter chips
                                        show-size label="上传货物图片" accept="image/png, image/jpeg, image/bmp"
                                        prepend-icon="mdi-camera" :show-size="1000" variant="outlined">
                                        <template v-slot:selection="{ fileNames }">

                                            <v-chip size="small" label color="primary" class="me-2">
                                                {{ fileNames }}
                                            </v-chip>
                                        </template></v-file-input>
                                </v-col>

                                <v-col v-if="addphoto" class="6" md="12" lg="12" cols="13" :key="addphotoinfo.link">
                                    <v-card>
                                        <v-card-title>
                                            <v-spacer></v-spacer>
                                            <v-btn @click="removeImage" class="text-primary" variant="flat"><v-icon
                                                    size="30">mdi-delete</v-icon></v-btn></v-card-title>
                                        <v-divider></v-divider>
                                        <v-card-text>
                                            <v-img height="300" :src="addphotoinfo.link"></v-img>
                                        </v-card-text>
                                        <v-divider></v-divider>
                                        <div class="d-flex align-center pa-3">
                                            <div class="flex-fill">
                                                <h5 class="text-h6 font-weight-bold">{{ addphotoinfo.name }}</h5>
                                                <h6 class="text-grey">
                                                    {{ addphotoinfo.suffix }} {{ addphotoinfo.imageSize }}
                                                </h6>
                                            </div>
                                            <div>
                                                <v-chip color="primary" class="font-weight-bold" label rounded="sm"
                                                    variant="elevated">
                                                    {{ addphotoinfo.type }}
                                                </v-chip>
                                            </div>
                                        </div>
                                    </v-card>
                                </v-col>
                                <v-col v-else class="6" md="12" lg="12" cols="13">
                                    <v-card>
                                        <v-card-title>
                                            <v-spacer></v-spacer>
                                            <p class="text-h6 font-weight-bold">暂无图片上传</p>
                                        </v-card-title>
                                        <v-divider></v-divider>
                                        <v-card-text>
                                            <v-img height="300" :src="addphotoinfo.link"></v-img>
                                        </v-card-text>
                                        <v-divider></v-divider>
                                        <div class="d-flex align-center pa-3">
                                            <div class="flex-fill">
                                                <h5 class="text-h6 font-weight-bold">{{ addphotoinfo.name }}</h5>
                                                <h6 class="text-grey">
                                                    请上传图片
                                                </h6>
                                            </div>

                                        </div>
                                    </v-card>
                                </v-col>

                                <v-col cols="5">
                                    <v-text-field v-model="addcontactman" label="联系人" variant="outlined"></v-text-field>
                                </v-col>
                                <v-col cols="6">
                                    <v-text-field v-model="addphone" label="手机号码" variant="outlined"></v-text-field>
                                </v-col>

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


            <v-divider></v-divider>
            <div class="pa-0">
                <v-data-table-server :search="search" :headers="headers" :items-length="totalRows" :items="inquirylist"
                    :loading="loading" loading-text="努力加载中" :items-per-page="size" no-data-text="没有找到数据捏"
                    @update:options="updateinquiryList" items-per-page-text="每页显示" fixed-header hover
                    item-value="inquiryID">

                    <template v-slot:item="{ item }">
                        <tr>
                            <td>{{ item.inquiryID }}</td>
                            <td class="text-center">
                                <v-chip size="small" :color="item.acceptstatus === '未受理' ? 'grey' : 'blue'"
                                    class="font-weight-bold">
                                    {{ item.acceptstatus }}</v-chip>
                            </td>
                            <td>{{ item.ipol }}</td>
                            <td>{{ item.ides }}</td>
                            <td>{{ item.volume }}</td>
                            <td>{{ item.shipmentdate }}</td>
                            <td>{{ item.iotherinfo }}</td>
                            <td>{{ item.describe }}</td>
                            <td class="pa-2">
                                <v-img :src="getBase64Image(item.photo)" height="100" width="160" cover
                                    class="rounded-lg v-card--link" @click="previewImg(item)" />
                            </td>

                            <td>{{ item.contactman }}</td>
                            <td>{{ item.phone }}</td>
                            <td>{{ item.createtime }}</td>
                            <td>{{ item.recoverytime }}</td>
                            <td>{{ item.recoveryman }}</td>
                            <td> {{ item.recoveryinfo }}</td>
                        </tr>
                    </template>


                </v-data-table-server>
            </div>
        </v-card>
        <v-dialog v-model="imgOverlay" location-strategy="connected" scroll-strategy="none">
            <div @click="imgOverlay = false" class="w-screen h-screen d-flex align-center justify-center">
                <v-img height="80%"  :src="ViewerUrl" />
            </div>
        </v-dialog>
    </v-container>
    <v-snackbar :timeout="2000" color="primary" rounded="pill" close-on-content-click timer v-model="complete">
        <strong>添加成功</strong>.
    </v-snackbar>
</template>
  
<script>
const storedUser = JSON.parse(localStorage.getItem('user'));
export default {

    data: () => ({


        search: '',
        Adddialog: false,
        headers: [

            { title: '编号', key: 'inquiryID', sortable: false, width: '100px' },
            { title: '状态', key: 'acceptstatus', align: 'center', sortable: false, width: '200px' },
            { title: '起运港', key: 'ipol', sortable: false, width: '100px' },
            { title: '目的港', key: 'ides', sortable: false, width: '100px' },
            { title: '出运量', key: 'volume', sortable: false, removable: true, width: '100px' },
            { title: '出运日期', key: 'shipmentdate', align: 'center', sortable: false, removable: true, width: '100px' },
            { title: '其他要求', key: 'iotherinfo', align: 'center', sortable: false, removable: true, width: '300px' },
            { title: '货物描述', key: 'describe', align: 'center', sortable: false, removable: true, width: '300px' },
            { title: '货物照片', key: 'photo', sortable: false, removable: true, width: '200px' },
            { title: '联系人', key: 'contactman', sortable: false, removable: true, width: '100px' },
            { title: '手机号码', key: 'phone', align: 'center', sortable: false, removable: true, width: '100px' },
            { title: '创建时间', key: 'createtime', align: 'center', sortable: false, removable: true, width: '200px' },
            { title: '回复时间', key: 'recoverytime', align: 'center', sortable: false, removable: true, width: '200px' },
            { title: '回复人', key: 'recoveryman', align: 'center', sortable: false, removable: true, width: '100px' },
            { title: '回复消息', key: 'recoveryinfo', align: 'center', sortable: false, removable: true, width: '300px' },


        ],

        inquirylist: [],
        loading: false,
        totalRows: 0,
        page: 1,
        size: 10,
        imgOverlay: false,
        complete: false,

        addpol: '',
        adddes: '',
        addvolume: '',
        adddate: '',
        addotherinfo: '',
        adddescribe: '',
        addcontactman: storedUser.realname,
        addphone: storedUser.phone,
        addphoto: null,
        addphotoinfo: {
            name: "",
            link: "",
            suffix: "",
            imageSize: "",
            type: ""
            // 其他属性...
        },
        photourl: null,


    }),
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
        getBase64Image(photo) {
            // 将 base64 编码的字符串转换为数据 URI
            return `data:image/jpeg;base64,${photo}`;
        },

        close() {

            this.addpol = null,
                this.adddes = null,
                this.addvolume = null,
                this.adddate = null,
                this.addotherinfo = null,
                this.adddescribe = null,
                this.removeImage(),
                this.addcontactman = storedUser.realname,
                this.addphone = storedUser.phone,
                this.Adddialog = false;

        },
        async add() {
            const storedUser = JSON.parse(localStorage.getItem('user'));
            const formData = new FormData();
            formData.append('file', this.addphoto[0]);// 添加照片数据

            console.log('addphoto:', this.addphoto);
            const data = {
                userid: storedUser.userid,
                ipol: this.addpol,
                ides: this.adddes,
                volume: this.addvolume,
                shipmentdate: this.adddate,
                iotherinfo: this.addotherinfo,
                describe: this.adddescribe,
                contactman: this.addcontactman,
                phone: this.addphone,

            };
            console.log('addphoto:', this.addphoto);
            try {
                // 发送请求到后端
                await request.post('/trade/addToinquiry', formData, {
                    params: data,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                this.complete = true;

                this.getinquiry();
            } catch (error) {
                console.error('Error deleting subscription:', error);
            } finally {
                // 关闭对话框
                this.close();
            }
        },

        async updatePreviews() {
            const file = this.addphoto[0];

            if (file) {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                this.addphotoinfo.name = file.name;
                this.addphotoinfo.size = this.formatFileSize(file.size);

                const filePromise = new Promise((resolve, reject) => {
                    reader.onload = () => {
                        // 获取图片的长宽尺寸
                        const img = new Image();
                        img.src = reader.result;
                        img.onload = () => {
                            const width = img.width;
                            const height = img.height;

                            this.addphotoinfo.imageSize = width + "x" + height;
                            this.addphotoinfo.type = file.type;
                            this.addphotoinfo.suffix = file.name.split(".").pop();
                            this.addphotoinfo.link = reader.result;
                            this.addphotoinfo.previewEnabled = true;

                            resolve();
                        };
                    };
                    reader.onerror = () => {
                        reject(reader.error);
                    };
                });

                await filePromise;
            }

            console.log(this.addphotoinfo);
        },

        formatFileSize(size) {
            const kbSize = size / 1024;
            if (kbSize < 1024) {
                return kbSize.toFixed(2) + ' KB';
            } else {
                return (kbSize / 1024).toFixed(2) + ' MB';
            }
        },
        removeImage(index) {
            this.addphoto = null;
            this.addphotoinfo = {
                name: "",
                link: "",
                suffix: "",
                imageSize: "",
                type: "",

            }; //
        },
        async getinquiry() {
            const storedUser = JSON.parse(localStorage.getItem('user'));
            this.loading = true;

            // 构造查询参数
            const params = {
                userid: storedUser.userid,
                page: this.page - 1,
                size: this.size,

            };


            try {
                // 发起请求
                const response = await request.get('/trade/inquirylist',
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