<script setup>
import { Icon } from '@iconify/vue';
import request from '../utils/request.js';

</script>
<template>
    <v-sheet elevation="0" class="mx-auto" color="transparent" max-width="1600">
        <v-row>
            <v-col cols="12" md="3">
                <v-card>
                    <div class="d-flex flex-column pa-10">
                        <v-avatar size="120" class="mx-auto elevation-12" color="white">
                            <v-img
                                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwrAiMevuwrbU9o0Ck2paVf4ufHUDb2dU48MEDrAlrQw&s">
                            </v-img>
                        </v-avatar>

                        <div class="text-center mt-5">
                            <h3 class="text-h6 font-weight-bold">
                                {{ storedUser.username }}
                                <v-chip size="small" class="font-weight-bold" color="blue">
                                    客户
                                </v-chip>
                            </h3>
                            <p class="text-body-2">交易客户</p>
                        </div>
                    </div>
                    <v-divider></v-divider>
                    <div class="py-5 px-10">
                        <v-icon color="grey"> mdi-map-marker </v-icon>
                        <span class="ml-4">{{ storedUser.companyname }}</span>
                    </div>

                    <v-divider></v-divider>
                    <div class="py-5 px-10">
                        <v-icon color="grey"> mdi-email-check-outline </v-icon>
                        <span class="ml-4">{{ storedUser.email }}</span>
                    </div>
                    <v-divider></v-divider>

                    <div class="py-5 px-10">
                        <v-icon color="grey"> mdi-phone-outline </v-icon>
                        <span class="ml-4">{{ storedUser.phone }}</span>
                    </div>
                    <v-divider></v-divider>


                </v-card>
            </v-col>
            <v-col cols="12" md="9">
                <!-- ---------------------------------------------- -->
                <!--   Basic Infomation -->
                <!-- ---------------------------------------------- -->
                <v-card class="mb-5">
                    <v-form ref="userinfoform" validate-on="submit lazy" @submit.prevent="update">
                        <v-card-title class=" py-4 font-weight-bold">
                            基本信息
                        </v-card-title>
                        <v-divider></v-divider>
                        <v-card-text class="pa-7">
                            <v-row>
                                <v-col cols="12" sm="6">
                                    <v-label class="font-weight-medium mb-2">用户名</v-label>
                                    <v-text-field color="primary" variant="outlined" density="compact" type="text"
                                        placeholder="填写用户名" hide-details v-model="editusername" :rules="username" />
                                </v-col>
                                <v-col cols="12" sm="6">
                                    <v-label class="font-weight-medium mb-2">真实姓名</v-label>
                                    <v-text-field color="primary" variant="outlined" density="compact" type="text"
                                        placeholder="填写你的真实姓名" hide-details v-model="editrealname" :rules="realname" />
                                </v-col>
                                <v-col cols="12" sm="6">
                                    <v-label class="font-weight-medium mb-2">邮箱</v-label>
                                    <v-text-field readonly color="primary" variant="outlined" density="compact" type="text"
                                        placeholder="填写邮箱" hide-details v-model="storedUser.email" /></v-col>
                                <v-col cols="12" sm="6">
                                    <v-label class="font-weight-medium mb-2">手机</v-label>
                                    <v-text-field color="primary" variant="outlined" density="compact" type="text"
                                        placeholder="填写手机号码" hide-details v-model="editphone" :rules="phoneRules" /></v-col>
                            </v-row>
                        </v-card-text>
                        <v-divider></v-divider>
                        <v-card-actions class="pa-5">
                            <v-spacer></v-spacer>
                            <v-btn class="px-5" color="primary" elevation="1" variant="elevated" type="submit">
                                更新</v-btn>
                        </v-card-actions>
                    </v-form>
                </v-card>

                <!-- ---------------------------------------------- -->
                <!--   Authentication  -->
                <!-- ---------------------------------------------- -->
                <v-card class="mb-5">
                    <v-card-title class=" py-4 font-weight-bold">
                        绑定</v-card-title>
                    <v-divider></v-divider>
                    <v-card-text class="pa-7">
                        <v-row>
                            <v-col cols="12" md="6">
                                <v-btn color="primary" size="large" block variant="elevated" disabled>
                                    <Icon icon="fa-brands:weixin" class="mr-3 my-2" />微信
                                </v-btn>
                            </v-col>

                            <v-col cols="12" md="6">
                                <v-btn size="large" block variant="elevated" color="primary" disabled>
                                    <Icon icon="fa6-brands:qq" class="mr-3 my-2" />QQ
                                </v-btn>
                            </v-col>


                        </v-row>
                    </v-card-text>
                </v-card>

                <!-- ---------------------------------------------- -->
                <!--   Change Password  -->
                <!-- ---------------------------------------------- -->
                <v-card class="mb-5">
                    <v-form ref="passwordForm" validate-on="submit lazy" @submit.prevent="save">
                        <v-card-title class=" py-4 font-weight-bold">
                            修改密码
                        </v-card-title>
                        <v-divider></v-divider>
                        <v-card-text class="pa-7">
                            <v-row>
                                <v-col cols="12" sm="6">
                                    <v-label class="font-weight-medium mb-2">当前密码</v-label>
                                    <v-text-field readonly density="compact" color="primary" variant="outlined"
                                        placeholder="Current Password" hide-details v-model="storedUser.password"
                                        :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                                        :type="visible ? 'text' : 'password'" @click:append-inner="visible = !visible">
                                        
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6"> </v-col>
                                <v-col cols="12" sm="6">
                                    <v-label class="font-weight-medium mb-2">新密码</v-label>
                                    <v-text-field density="compact" color="primary" variant="outlined" placeholder="填写新密码"
                                        v-model="password" :append-inner-icon="visible2 ? 'mdi-eye-off' : 'mdi-eye'"
                                        :type="visible2 ? 'text' : 'password'" @click:append-inner="visible2 = !visible2"
                                        :rules="passwordRules">
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6">
                                    <v-label class="font-weight-medium mb-2">确认密码</v-label>
                                    <v-text-field density="compact" color="primary" variant="outlined" placeholder="再输入一遍密码"
                                        v-model="confirmpassword" :append-inner-icon="visible3 ? 'mdi-eye-off' : 'mdi-eye'"
                                        :type="visible3 ? 'text' : 'password'" @click:append-inner="visible3 = !visible3"
                                        :rules="confirmpasswordRules">
                                    </v-text-field></v-col>
                            </v-row>
                        </v-card-text>
                        <v-divider></v-divider>
                        <v-card-actions class="pa-5">
                            <h4>修改密码后需重新登录</h4>
                            <v-spacer></v-spacer>
                            <v-btn class="px-5" color="primary" elevation="1" variant="elevated" type="submit">
                                更新密码</v-btn>
                        </v-card-actions>
                    </v-form>
                </v-card>

                <!-- ---------------------------------------------- -->
                <!--   Notifications  -->
                <!-- ---------------------------------------------- -->
                <v-card class="mb-5">
                    <v-card-title class=" py-4 font-weight-bold">
                        Notifications</v-card-title>
                    <v-divider></v-divider>
                    <v-card-text class="pa-7">
                        <div>
                            <v-switch color="primary" class="mr-4" hide-details
                                label=" Receive newsletters, promotions and news from lux"></v-switch>
                        </div>
                        <div>
                            <v-switch color="primary" class="mr-4" hide-details
                                label=" Notify me when someone I follow uploads new workx"></v-switch>
                        </div>
                    </v-card-text>
                    <v-divider></v-divider>
                    <v-card-actions class="pa-5">
                        <v-spacer></v-spacer>
                        <v-btn class="px-5" color="primary" elevation="1" variant="elevated">
                            Unpdate Notifications</v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </v-sheet>
    <v-snackbar :timeout="2000" color="success" close-on-content-click timer="white" v-model="complete">
        <strong>修改成功</strong>
    </v-snackbar>
</template>
<script>

const storedUser = JSON.parse(localStorage.getItem('user'));

export default {

    data() {
        return {
            visible: false,
            visible2: false,
            visible3: false,
            password: '',
            confirmpassword: '',
            username: [
                value => !!value || '不能为空！',
            ],
            realname: [
                value => !!value || '不能为空！',
            ],
            phoneRules: [
                v => !!v || "不能为空",
                v => v.length >= 11 || '最少11个数字',
            ],
            passwordRules: [
                value => !!value || '不能为空！',
                v => v.length >= 8 || '最少8个字节',
                v => /(?=.*\d)/.test(v) || '最少包含一个数字',
                v => /(?=.*[A-Z])/.test(v) || '最少包含一个大写字母',

            ],
            confirmpasswordRules: [
                v => !!v || '不能为空！',
                v => v === this.password || '确认密码与新密码不一致',

            ],
            editusername: storedUser.username,
            editrealname: storedUser.realname,
            editphone: storedUser.phone,

            completepassword: false,
            complete: false,
            user: {
                userid: null,
                username: null,
                email: null,
                password: null,
                companyid: null,
                phone: null,
                companyname: null,
                realname: null,
            },
            token: '',








        }
    },
    methods: {
        async save() {
            const { valid } = await this.$refs.passwordForm.validate();
            if (valid) {
                const storedUser = JSON.parse(localStorage.getItem('user'));
                const requestData = {
                    password: this.password,
                }

                if (storedUser.userid) {
                    try {
                        // 发送请求到后端
                        await request.put(`/userconfig/${storedUser.userid}`, requestData);


                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        this.$router.push('/');
                    } catch (error) {
                        console.error('Error update:', error);
                        throw error
                    }
                }
            }
        },
        async update() {
            const { valid } = await this.$refs.userinfoform.validate();
            if (valid) {
                const storedUser = JSON.parse(localStorage.getItem('user'));
                const requestData = {
                    username: this.editusername,
                    realname: this.editrealname,
                    phone: this.editphone,
                }

                if (storedUser.userid) {
                    try {
                        // 发送请求到后端
                        await request.put(`/userinfoconfig/${storedUser.userid}`, requestData);
                        this.complete = true;

                        this.updateinfo();


                    } catch (error) {
                        console.error('Error update:', error);
                        throw error

                    }
                }
            }

        },


        async updateinfo() {
            const storedUser = JSON.parse(localStorage.getItem('user'));
            const userid =storedUser.userid;
            try {
                const response =await request.post('/updateuserinfo', { userid });
                this.user = response.data;
                this.token = response.data.token;
                window.localStorage.setItem('user', JSON.stringify(this.user));
                window.localStorage.setItem('token', this.token);

                console.log("user", this.user)

                location.reload();
            } catch (error) {
                console.error('Error loading:', error);
                throw error;
            }
        }





    }





}
</script>