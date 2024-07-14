<template>
    <div class="container">
        <div class="loginBox">
            <p>登录</p>
            <a-form ref="loginFormRef" :model="formdata" :rules="rules" class="loginForm">
                <a-form-item name="name">
                    <a-input v-model:value="formdata.name" placeholder="请输入用户名">
                        <template #prefix>
                            <UserOutlined />
                        </template>
                    </a-input>
                </a-form-item>

                <a-form-item name="passwd">
                    <a-input-password v-model:value="formdata.passwd" placeholder="请输入密码" type="password"
                        v-on:keyup.enter="login">
                        <template #prefix>
                            <LockOutlined />
                        </template>
                    </a-input-password>
                </a-form-item>

                <a-form-item class="loginBtn">
                    <a-button type="primary" style="margin:10px;" @click="login">登录</a-button>
                    <a-button style="margin:10px;" @click="resetForm">重置</a-button>
                </a-form-item>
            </a-form>
        </div>
    </div>
</template>
<script setup>
import { message } from 'ant-design-vue'
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'
import router from '@/router';
import { reactive, ref } from 'vue'
import http from '../plugin/http'
import qs from 'qs'

const formdata = reactive({
    name: '',
    passwd: ''
})
const loginFormRef = ref('')

const rules = {
    name: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        {
            min: 4,
            max: 12,
            message: '用户名必须在4到12个字符之间',
            trigger: 'blur',
        }
    ],
    passwd: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        {
            min: 4,
            max: 20,
            message: '密码必须在4到20个字符之间',
            trigger: 'blur',
        }
    ]
}
const login = () => {
    let data = qs.stringify({
        "name": formdata.name,
        "passwd": formdata.passwd
    })
    loginFormRef.value.validateFields()
        .then(() => {
            return http.post('api/manage/account.login', data)
        })
        .then(response => {
            const res = response.data
            if (res.status != 0) {
                message.error(res.msg)
                return;
            }
            message.success('登录成功')
            router.push({ path: '/index' })
        })
        .catch(error => {
            if (error && error.message) {
                message.error(error.message)
            } else {
                message.error('发生错误，请重试')
            }
        })
}
const resetForm = () => {
    loginFormRef.value.resetFields()
}
</script>

<style scoped>
.container {
    height: 100%;
    background-image: url("/images/login.jpg");
    background-size: cover;
}

.loginBox {
    width: 450px;
    height: 300px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: rgba(255, 255, 255, 0.6);
    transition: width 0.3s, padding 0.3s;
    border-right: 1px solid rgba(0, 0, 0, 0.2);
    border-left: 1px solid rgba(255, 255, 255, 0.25);
    border-top: 2px solid rgba(0, 0, 0, 0.2);
    border-bottom: 2px solid rgba(0, 0, 0, 0.2);
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5);
    border-radius: 8px 8px;
}

p {
    font-size: 30px;
    font-weight: 500;
    margin: 15px;
    text-align: center;
}

.loginForm {
    width: 100%;
    position: absolute;
    bottom: 10%;
    padding: 0 20px;
    box-sizing: border-box;
}

.loginBtn {
    display: flex;
    justify-content: flex-end;
}
</style>