<template>
    <a-row justify="end">
        <a-col :span="3" style="text-align: end;">
            <a-dropdown>
                <template #overlay>
                    <a-menu>
                        <a-menu-item key="1" @click="changePasswd">
                            <InfoCircleOutlined /><span>修改密码</span>
                        </a-menu-item>
                        <a-menu-item key="2" @click="loginOut">
                            <LogoutOutlined /><span>退出</span>
                        </a-menu-item>
                    </a-menu>
                </template>
                <a-button size="large">
                    <span>管理员</span>
                    <DownOutlined />
                </a-button>
            </a-dropdown>
        </a-col>
    </a-row>

    <!-- 修改密码 -->
    <a-modal closable title="修改密码" :open="changePasswordVisible" width="60%" @ok="changePasswordOk"
        @cancel="changePasswordCancel" destroyOnClose>
        <a-form :model="changePassword" :rules="changePasswordRules" ref="changePasswordRef">
            <a-form-item has-feedback label="旧密码" name="passwd">
                <a-input-password v-model:value="changePassword.passwd">
                    <template #prefix>
                        <LockOutlined />
                    </template>
                </a-input-password>
            </a-form-item>
            <a-form-item has-feedback label="新密码" name="new_passwd">
                <a-input-password v-model:value="changePassword.new_passwd">
                    <template #prefix>
                        <LockOutlined />
                    </template>
                </a-input-password>
            </a-form-item>
            <a-form-item has-feedback label="确认新密码" name="checkpass">
                <a-input-password v-model:value="changePassword.checkpass">
                    <template #prefix>
                        <LockOutlined />
                    </template>
                </a-input-password>
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<script setup>
import { LogoutOutlined, DownOutlined, InfoCircleOutlined,LockOutlined } from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'
import http from '../plugin/http'
import { message } from 'ant-design-vue'
import { reactive,ref} from 'vue'
import qs from 'qs'

const router = useRouter()
const changePasswordVisible = ref(false)
const changePassword = reactive({
    passwd: '',
    new_passwd: '',
    checkpass: ''
})
const changePasswordRules = {
    passwd: [
        {
            validator: (rule, value) => {
                return new Promise((resolve, reject) => {
                    if (changePassword.passwd == '') {
                        reject('请输入密码');
                    }
                    if ([...changePassword.passwd].length < 4 || [...changePassword.passwd].length > 20) {
                        reject('密码应当在4到20位之间');
                    } else {
                        resolve();
                    }
                });
            },
            trigger: 'blur',
        },
    ],
    new_passwd: [
        {
            validator: (rule, value) => {
                return new Promise((resolve, reject) => {
                    if (changePassword.new_passwd == '') {
                        reject('请输入密码');
                    }
                    if ([...changePassword.new_passwd].length < 4 || [...changePassword.new_passwd].length > 20) {
                        reject('密码应当在4到20位之间');
                    } else {
                        resolve();
                    }
                });
            },
            trigger: 'blur',
        },
    ],
    checkpass: [
        {
            validator: (rule, value) => {
                return new Promise((resolve, reject) => {
                    if (changePassword.checkpass == '') {
                        reject('请输入密码');
                    }
                    if (changePassword.new_passwd !== changePassword.checkpass) {
                        reject('密码不一致，请重新输入');
                    } else {
                        resolve();
                    }
                });
            },
            trigger: 'blur',
        },
    ],
}
const changePasswd = () => {
    changePasswordVisible.value = true
}
const changePasswordRef = ref(null)
const changePasswordOk = () => {
    let data = qs.stringify({
        "passwd": changePassword.passwd,
        "new_passwd": changePassword.new_passwd
    })
    changePasswordRef.value.validateFields()
        .then(() => {
            return http.post('api/manage/account.passwd', data);
        })
        .then(response => {
            const res = response.data;
            if (res.status != 0) {
                message.error("修改密码失败：" + res.msg);
                return;
            }
            changePasswordVisible.value = false;
            message.success('修改密码成功');
            changePasswordRef.value.resetFields()
            loginOut()
        })
        .catch(error => {
            if (error && error.message) {
                message.error(error.message);
            } else {
                message.error('发生错误，请重试');
            }
        });
};

const changePasswordCancel = () => {
    changePasswordRef.value.resetFields()
    changePasswordVisible.value = false
    message.info('已取消')
};
function clearCookie(name) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
}

const loginOut = () => {
    http.get('api/manage/account.logout').then(res => {
            clearCookie('SESSION')
            router.push('/login')
            location.reload()
    }).catch(error =>
        message.error('error.message'))
}
</script>
<style scoped>
span {
    margin-left: 5px;
    font-size: 17px;
    font-weight: 500;
}
</style>