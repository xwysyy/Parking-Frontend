<template>
    <a-layout-sider breakpoint="lg" style="min-height: 100vh;" class="SideMenu" collapsible theme="light"
        v-model:collapsed="collapsed">
        <div style="text-align: center;">
            <a-avatar :size="55" src="/favicon.ico" class="avatar" />
            <p style="margin-left:5px;font-family: kaiti; font-size: 28px;font-weight: 600;">{{ collapsed ? '' :
                '智泊云界' }}</p>
        </div>
        <a-menu mode="inline" @click="(item) => { router.push('/' + item.key).catch((err) => err) }">
            <a-menu-item key="index">
                <DashboardOutlined style="font-size:20px" />
                <span>仪表盘</span>
            </a-menu-item>
            <a-menu-item key="userlist">
                <UserOutlined style="font-size:20px" />
                <span>用户列表</span>
            </a-menu-item>
            <a-menu-item key="orderlist">
                <FileAddOutlined style="font-size:20px" />
                <span>订单管理</span>
            </a-menu-item>
            <a-menu-item key="notice">
                <NotificationOutlined style="font-size:20px" />
                <span>通知发布</span>
            </a-menu-item>
        </a-menu>
    </a-layout-sider>
</template>

<script setup>
import { ref } from 'vue'
import router from '@/router'
import { DashboardOutlined, UserOutlined, FileAddOutlined, NotificationOutlined } from '@ant-design/icons-vue'
const collapsed = ref(false)
</script>
<style scoped>
span {
    font-size: 20px;
}

.SideMenu {
    background-color: rgba(255, 255, 255, 0.25);
}

.avatar:hover {
    transform: rotate(360deg);
    transition: transform 1s;
}
</style>