<script setup>
import request from '../utils/request.js';
import usequoStore from '../stores/quotationinfo';
const store = usequoStore();
</script>
<template>
    <v-parallax height="350"
        src="https://djupload.oss-cn-beijing.aliyuncs.com/etrans56/topSupplier/29c3303e238d4ca3a9f01dae4a29489c.jpg">
        <div class="d-flex flex-column fill-height justify-center align-center text-white">
            <h1 class="text-h4 font-weight-thin mb-4 text-white">
                提交货单
            </h1>
            <h4 class="subheading">
                Cargo List
            </h4>
        </div>
    </v-parallax>
    <v-card flat class="mx-auto  mt-5 mb-10" max-width="1200">
        <v-row>
            <v-col cols="12" md="8" lg="7">
                <v-btn prepend-icon="mdi-plus-box" class="mx-5 mt-5" color="primary" dark
                    @click="openadddialog">添加货物信息</v-btn>
                <v-btn class="mt-5" size="small" icon="mdi-refresh" color="primary" dark @click="getarrival()"></v-btn>
            </v-col>



            <v-col cols="12" offsetLg="2" md="4" lg="3">
                <div class="mt-1 mb-3 d-flex align-center">
                    <v-text-field v-model="usercargoname" label="货物名称" variant="solo" hide-details
                        prepend-inner-icon="mdi-magnify" clearable></v-text-field>
                </div>
            </v-col>
        </v-row>
        <v-divider></v-divider>
        <v-card-text class="pa-0">
            <v-data-table-server :search="search" :headers="headers" :items-length="totalRows" :items="arrivallist"
                :loading="loading" loading-text="努力加载中" :items-per-page="size" no-data-text="没有找到数据捏"
                @update:options="updatearrivalList" items-per-page-text="每页显示" fixed-header hover item-value="arrivalid"
                height="450">

                <template v-slot:item.actions="{ item }">
                    <v-tooltip :text="item.astatus === '未确认' ? '修改' : '已确认无法修改'" location="start">
                        <template v-slot:activator="{ props }">
                            <v-icon v-bind="props" size="small" class="me-2"
                                :color="item.astatus === '未确认' ? 'blue' : 'black'"
                                @click="item.astatus === '未确认' ? openModifyDialog(item) : null">
                                {{ item.astatus === '未确认' ? 'mdi-pencil' : 'mdi-check' }}
                            </v-icon>

                        </template>
                    </v-tooltip>
                </template>
                <template v-slot:item.astatus="{ item }">
                    <v-chip size="small" :color="getColorForAStatus(item.astatus)" class="font-weight-bold">
                        {{ item.astatus }}</v-chip>
                </template>

            </v-data-table-server>
        </v-card-text>
    </v-card>

    <v-dialog v-model="dialogModify" max-width="600px" :persistent="true">
        <v-card>
            <v-form ref="modifyForm" validate-on="submit lazy" @submit.prevent="save">
                <v-card-title>
                    <span class="text-h5">修改</span>
                </v-card-title>

                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col cols="5">
                                <v-text-field v-model="editcargoname" label="货物名称" :rules="modifyrule"></v-text-field>
                            </v-col>
                            <v-col cols="5"></v-col>
                            <v-col cols="5">
                                <v-text-field v-model="editpol" label="起运港" :rules="modifyrule"></v-text-field>
                            </v-col>
                            <v-col cols="5">
                                <v-text-field v-model="editdes" label="目的港" :rules="modifyrule"></v-text-field>
                            </v-col>
                            <v-col cols="5">
                                <v-text-field v-model="editcargosize" label="货物尺寸" :rules="modifyrule"></v-text-field>
                            </v-col>

                            <v-col cols="5">
                                <v-text-field v-model="editcargoweight" suffix="kg" label="货物重量"
                                    :rules="numberrule"></v-text-field>
                            </v-col>
                            <v-col cols="5">
                                <v-text-field v-model="editcargovalue" prefix="$" label="货物价值"
                                    :rules="numberrule"></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-textarea v-model="editdescription" label="货物描述" :rules="modifyrule"></v-textarea>
                            </v-col>

                        </v-row>
                    </v-container>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red" icon="mdi-close" variant="text" @click="close"></v-btn>
                    <v-btn color="green" icon="mdi-check" variant="text" type="submit"></v-btn>
                </v-card-actions>
            </v-form>
        </v-card>
    </v-dialog>
    <v-dialog v-model="store.dialogadd" max-width="600px" :persistent="true">
        <v-card>
            <v-form ref="addForm" validate-on="submit lazy" @submit.prevent="add">
                <v-card-title>
                    <span class="text-h5">添加</span>
                </v-card-title>

                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col cols="5">
                                <v-text-field v-model="addcargoname" label="货物名称" :rules="addrule"></v-text-field>
                            </v-col>
                            <v-col cols="5">
                                <v-text-field v-model="addcompanyname" label="公司名称" :rules="addrule"
                                    readonly></v-text-field>
                            </v-col>
                            <v-col cols="5">
                                <v-text-field v-model="addpol" label="起运港" :rules="addrule"></v-text-field>
                            </v-col>
                            <v-col cols="5">
                                <v-text-field v-model="adddes" label="目的港" :rules="addrule"></v-text-field>
                            </v-col>
                            <v-col cols="5">
                                <v-text-field v-model="addcargosize" label="货物尺寸" :rules="addrule"></v-text-field>
                            </v-col>
                            <v-col cols="5">
                                <v-text-field v-model="addcargoweight" suffix="kg" label="货物重量"
                                    :rules="numberrule"></v-text-field>
                            </v-col>
                            <v-col cols="5">
                                <v-select v-model="addcargotype" :items="options" item-title="state" item-value="abbr"
                                    label="货物类型" :rules="addrule"></v-select>
                            </v-col>
                            <v-col cols="5">
                                <v-select v-model="addcargopackaging" :items="options2" item-title="state" item-value="abbr"
                                    label="货物包装" :rules="addrule"></v-select>
                            </v-col>
                            <v-col cols="5">
                                <v-select v-model="addbearing" :items="options3" item-title="state" item-value="abbr"
                                    label="能否承重" :rules="addrule"></v-select>
                            </v-col>
                            <v-col cols="5">
                                <v-text-field v-model="addcargovalue" prefix="$" label="货物价值"
                                    :rules="numberrule"></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-textarea v-model="adddescription" label="货物描述" :rules="addrule"></v-textarea>
                            </v-col>

                        </v-row>
                    </v-container>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red" icon="mdi-close" variant="text" @click="closeadd"></v-btn>
                    <v-btn color="green" icon="mdi-check" variant="text" type="submit"></v-btn>
                </v-card-actions>
            </v-form>
        </v-card>
    </v-dialog>
    <v-snackbar :timeout="2000" color="primary" rounded="pill" close-on-content-click timer v-model="complete">
        <strong>修改成功</strong>.
    </v-snackbar>
    <v-snackbar :timeout="2000" color="primary" rounded="pill" close-on-content-click timer v-model="configcomplete">
        <strong>添加成功</strong>.
    </v-snackbar>
</template>
  
<script>
import usequoStore from '../stores/quotationinfo';
const store=usequoStore();
const storedUser = JSON.parse(localStorage.getItem('user'));
export default {
    data() {
        return {
            search: '',

            headers: [
                { title: '操作', key: 'actions', align: 'center', sortable: false, width: '70px' },
                { title: '状态', key: 'astatus', align: 'center', sortable: false, width: '100px' },
                { title: '跟踪单号', key: 'arrivalid', align: 'center', sortable: false, width: '100px' },
                { title: '货物名称', key: 'acargoname', align: 'center', sortable: false, width: '200px' },
                { title: '货物尺寸', key: 'acargosize', align: 'center', sortable: false, width: '100px' },
                { title: '货物重量', key: 'acargoweight', align: 'center', sortable: false, removable: true, width: '100px' },
                { title: '货物类型', key: 'cargotype', align: 'center', sortable: false, removable: true, width: '100px' },
                { title: '货物包装', key: 'cargopackaging', align: 'center', sortable: false, removable: true, width: '120px' },
                { title: '货物价值', key: 'cargovalue', align: 'center', sortable: false, removable: true, width: '100px' },
                { title: '起运港', key: 'apol', align: 'center', sortable: false, removable: true, width: '100px' },
                { title: '目的港', key: 'ades', align: 'center', sortable: false, removable: true, width: '100px' },
                { title: '货物描述', key: 'cargodescribe', align: 'center', sortable: false, removable: true, width: '200px' },
                { title: '所属公司', key: 'companyinfo.companyname', align: 'center', sortable: false, removable: true, width: '200px' },
                { title: '能否承重', key: 'aisbearing', align: 'center', sortable: false, removable: true, width: '95px' },
                { title: '报告时间', key: 'createtime', align: 'center', sortable: false, removable: true, width: '200px' },



            ],
            modifyrule: [
                value => !!value || '不能为空！',
            ],
            numberrule: [
                value => !!value || '不能为空！',
                value => /^\d+$/.test(value) || '只允许输入数字！',
            ],
            addrule: [
                value => !!value || '不能为空！',
            ],
            options: [
                { state: '个人用品', abbr: '个人用品' },
                { state: '危险品', abbr: '危险品' },
                { state: '易碎品', abbr: '易碎品' },
                { state: '散货', abbr: '散货' },
                { state: '医疗用品', abbr: '医疗用品' },
                { state: '衣物或纺织品', abbr: '衣物或纺织品' },
                { state: '食品和饮料', abbr: '食品和饮料' },
                { state: '建材和家具', abbr: '建材和家具' },
                { state: '工业设备', abbr: '工业设备' },

            ],
            options2: [
                { state: '纸箱', abbr: '纸箱' },
                { state: '木箱', abbr: '木箱' },
                { state: '托盘', abbr: '托盘' },

            ],
            options3: [
                { state: '是', abbr: '是' },
                { state: '否', abbr: '否' },

            ],



            arrivallist: [],
            loading: false,
            totalRows: 0,
            page: 1,
            size: 10,

            complete: false,

            dialogModify: false,
            

            editcargoname: null,
            editcargosize: null,
            editcargoweight: null,
            editcargovalue: null,
            editpol: null,
            editdes: null,
            editdescription: null,

            addcargoname: null,
            addcompanyname: storedUser.companyname,
            addpol: store.quopol,
            adddes: store.quodes,
            addcargosize: null,
            addcargoweight: null,
            addcargotype: null,
            addcargopackaging: null,
            addbearing: null,
            addcargovalue: null,
            adddescription: null,



            configcomplete: false,

            confirmarrival: false,

            arrivalID: null,


            usercargoname: null,




        }
    },
    

    methods: {
        getColorForAStatus(astatus) {
            switch (astatus) {
                case '未确认':
                    return 'grey';
                case '已到达':
                    return 'green';
                default:
                    return 'blue';
            }
        },
        openadddialog() {
            const store=usequoStore();
            store.dialogadd = true;

        },
        closeadd() {
            const store=usequoStore();
            this.addcargoname = null;
            this.addcargosize = null;
            this.addcargoweight = null;
            this.addcargotype = null;
            this.addpol = null;
            this.adddes = null;
            this.addcargopackaging = null;
            this.addbearing = null;
            this.addcargovalue = null;
            this.adddescription = null;
            store.quopol=null;
            store.quodes=null;
            store.dialogadd=false;
            this.dialogadd = false;


        },
        openModifyDialog(item) {
            this.editcargoname = item.acargoname;
            this.editcargosize = item.acargosize;
            this.editcargoweight = item.acargoweight;
            this.editpol = item.apol;
            this.editdes = item.ades;
            this.editcargovalue = item.cargovalue.replace('$', '');
            this.arrivalID = item.arrivalid;
            this.dialogModify = true;

        },
        close() {
            this.editcargoname = null;
            this.editcargosize = null;
            this.editcargoweight = null;
            this.editcargovalue = null;
            this.editdescription = null;
            this.editpol = null;
            this.editdes = null;
            this.arrivalID = null;
            this.dialogModify = false;
        },
        async add() {
            const { valid } = await this.$refs.addForm.validate();
            const storedUser = JSON.parse(localStorage.getItem('user'));
            if (valid) {
                const data = {
                    userid: storedUser.userid,
                    acargoname: this.addcargoname,
                    apol: this.addpol,
                    ades: this.adddes,
                    acargosize: this.addcargosize,
                    acargoweight: this.addcargoweight,
                    cargotype: this.addcargotype,
                    cargopackaging: this.addcargopackaging,
                    cargovalue: this.addcargovalue,
                    cargodescribe: this.adddescription,
                    companyid: storedUser.companyid,
                    aisbearing: this.addbearing,


                };
                console.log('add:', data);
                try {
                    // 发送请求到后端
                    await request.post('/wms/addToarrival', data);
                    this.configcomplete = true;

                    this.getarrival();
                } catch (error) {
                    console.error('Error add subscription:', error);
                } finally {
                    // 关闭对话框
                    this.closeadd();
                }
            }
        },
        async save() {
            const { valid } = await this.$refs.modifyForm.validate();
            if (valid) {
                const requestData = {
                    acargoname: this.editcargoname,
                    apol: this.editpol,
                    ades: this.editdes,
                    acargosize: this.editcargosize,
                    acargoweight: this.editcargoweight,
                    cargovalue: this.editcargovalue,
                    cargodescribe: this.editdescription,

                }

                if (this.arrivalID) {
                    try {
                        // 发送请求到后端
                        await request.put(`/wms/usermodify/${this.arrivalID}`, requestData);
                        this.complete = true;


                        this.getarrival();
                    } catch (error) {
                        console.error('Error deleting subscription:', error);
                    } finally {
                        // 关闭对话框
                        this.close();
                    }
                }
            }

        },
        async getarrival() {
            const storedUser = JSON.parse(localStorage.getItem('user'));
            this.loading = true;

            // 构造查询参数
            const params = {
                userid: storedUser.userid,
                acargoname: this.usercargoname,
                page: this.page - 1,
                size: this.size,

            };

            try {
                // 发起请求
                const response = await request.get('/wms/usergetarrival',
                    { params });

                // 更新分页数据和总行数
                this.arrivallist = response.data.content;
                this.totalRows = response.data.totalElements;
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                this.loading = false;
            }
        },
        updatearrivalList(newOptions) {
            // 处理分页组件的更新事件
            this.loading = true;
            this.page = newOptions.page;
            this.size = newOptions.itemsPerPage;

            this.getarrival();
            this.loading = false;
        },





    }
}
</script>