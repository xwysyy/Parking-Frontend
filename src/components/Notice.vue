<template>
    <div style="margin: 15px;">
        <a-row justify="space-between">
            <a-col :span="4">
                <a-button @click="addNoticeVisible = true">
                    <FileAddOutlined />新增通知
                </a-button>
            </a-col>
        </a-row>
        <!-- 操作框 -->
        <a-row style="margin: 10px 0;">
            <a-table rowKey="id" :columns="columns" :dataSource="noticelist" bordered
                style="overflow-x: auto; width: 100%;">
                <template #bodyCell="{ column, record }">
                    <template v-if="column.key === 'title'">
                        <span style="font-weight: bold; font-size: large;">{{ record[column.key] }}</span>
                    </template>
                    <template v-if="column.key === 'action'">
                        <div style="display: flex; justify-content: center;">
                            <a-button type="primary" style="margin-right: 15px" @click="editNotice(record.id)">
                                <EditOutlined />编辑
                            </a-button>
                            <a-button type="primary" danger style="margin-right: 15px" @click="deleteNotice(record.id)">
                                <DeleteOutlined />删除
                            </a-button>
                        </div>
                    </template>
                </template>
            </a-table>
        </a-row>

        <!-- 新增通知区域 -->
        <a-modal closable title="新增通知" :open="addNoticeVisible" width="60%" @ok="addNoticeOk" @cancel="addNoticeCancel"
            destroyOnClose style="min-width: 650px; overflow: hidden;">
            <a-form :model="newNotice" :rules="addNoticeRules" ref="addNoticeRef">
                <a-row>
                    <a-form-item label="标题" name="title">
                        <a-input v-model:value="newNotice.title">
                            <template #prefix>
                                <FileAddOutlined />
                            </template>
                        </a-input>
                    </a-form-item>
                </a-row>
                <a-row>
                    <a-form-item label="内容" name="content">
                        <a-textarea v-model:value="newNotice.content" allow-clear  style="width: 600px;">
                            <template #prefix>
                                <FileAddOutlined />
                            </template>
                        </a-textarea>
                    </a-form-item>
                </a-row>
                <a-row>
                    <div v-html="newNotice.content" style="width: 550px; margin-left: 20px;"></div>
                </a-row>
            </a-form>
        </a-modal>

        <!-- 编辑通知区域 -->
        <a-modal closable destroyOnClose title="编辑通知" :open="editNoticeVisible" width="60%" @ok="editNoticeOk"
            @cancel="editNoticeCancel" style="min-width: 650px; overflow: hidden;">
            <a-form :model="noticeInfo" :rules="noticeRules" ref="editNoticeRef">
                <a-row>
                    <a-form-item label="标题" name="title">
                        <a-input v-model:value="noticeInfo.title">
                            <template #prefix>
                                <FileAddOutlined />
                            </template>
                        </a-input>
                    </a-form-item>
                </a-row>
                <a-row>
                    <a-form-item label="内容" name="content">
                        <a-textarea v-model:value="noticeInfo.content" allow-clear style="width: 600px;">
                            <template #prefix>
                                <FileAddOutlined />
                            </template>
                        </a-textarea>
                    </a-form-item>
                </a-row>
                <a-row>
                    <div v-html="noticeInfo.content" style="width: 550px; margin-left: 20px;"></div>
                </a-row>
            </a-form>
        </a-modal>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import dayjs from 'dayjs'
import { FileAddOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import { message, Modal } from 'ant-design-vue'
import http from '../plugin/http'
import qs from 'qs'

const addNoticeVisible = ref(false)
const editNoticeVisible = ref(false)
const addNoticeRef = ref(null)
const editNoticeRef = ref(null)

// 表单数据
const newNotice = reactive({
    title: '',
    content: '',
})
const noticeInfo = reactive({
    id: '',
    title: '',
    content: '',
    create_time: '',
})
const noticeRules = {
    title: [
        { required: true, message: '请输入标题', trigger: 'blur' },
    ],
    content: [
        { required: true, message: '请输入内容', trigger: 'blur' },
    ],
}
const addNoticeRules = {
    title: [
        { required: true, message: '请输入标题', trigger: 'blur' },
    ],
    content: [
        { required: true, message: '请输入内容', trigger: 'blur' },
    ],
}
// 表格列
const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        width: 100,
        align: 'center',
    },
    {
        title: '标题',
        dataIndex: 'title',
        key: 'title',
        width: 200,
        align: 'center',
    },
    {
        title: '创建时间',
        dataIndex: 'create_time',
        key: 'create_time',
        width: 200,
        align: 'center',
    },
    {
        title: '操作',
        key: 'action',
        width: 300,
        align: 'center',
    },
]
const noticelist = ref([]);
// 获取通知列表
async function getNoticeList() {
    const { data: res1 } = await http.get('api/manage/notice.query', {
    })
    if (res1.status !== 0) {
        message.error(res1.msg)
        return
    }
    noticelist.value = res1.data
}
// 新增通知
const addNoticeOk = () => {
    addNoticeRef.value.validateFields()
        .then(() => {
            return http.post('api/manage/notice.add', qs.stringify({
                title: newNotice.title,
                content: newNotice.content,
                create_time: dayjs().format('YYYY-MM-DD HH:mm:ss')
            }))
        })
        .then(response => {
            const res = response.data
            if (res.status !== 0) {
                throw new Error(res.msg);
            }
            addNoticeRef.value.resetFields()
            addNoticeVisible.value = false
            message.success('添加通知成功')
            getNoticeList()
        })
        .catch(error => {
            message.error(error.message || '发生错误，请重试')
        })
}
const addNoticeCancel = () => {
    addNoticeRef.value.resetFields()
    addNoticeVisible.value = false
    message.info('新增通知已取消')
}
// 编辑通知
async function editNotice(id) {
    editNoticeVisible.value = true
    const { data: res } = await http.get('api/manage/notice.query', {
        params: { id }
    })
    noticeInfo.id = id
    noticeInfo.title = res.data[0].title
    noticeInfo.content = res.data[0].content
    noticeInfo.create_time = res.data[0].create_time
}
function editNoticeOk() {
    let data = qs.stringify({
        id: noticeInfo.id,
        title: noticeInfo.title,
        content: noticeInfo.content,
        create_time: dayjs().format('YYYY-MM-DD HH:mm:ss')
    })
    editNoticeRef.value.validateFields()
        .then(() => { return http.post('api/manage/notice.modify', data) }
        )
        .then(response => {
            const res = response.data;
            if (res.status != 0) {
                message.error(res.msg)
                return;
            }
            editNoticeVisible.value = false;
            message.success('更新通知信息成功')
            getNoticeList()
        })
        .catch(error => {
            if (error && error.message) {
                message.error(error.message)
            } else {
                message.error('发生错误，请重试')
            }
        });
}
function editNoticeCancel() {
    editNoticeRef.value.resetFields()
    editNoticeVisible.value = false
    message.info('编辑已取消')
}
// 删除通知
function deleteNotice(id) {
    Modal.confirm({
        title: '提示：请再次确认',
        content: '确定要删除该通知吗？一旦删除，无法恢复',
        onOk: async () => {
            const { data: res } = await http.post('api/manage/notice.del', qs.stringify({ id }))
            if (res.status != 0) return message.error(res.msg)
            message.success('删除成功')
            getNoticeList()
        },
        onCancel: () => {
            message.info('已取消删除')
        },
    })
}
onMounted(() => {
    getNoticeList()
})
</script>

<style scoped></style>
