<template>
    <div class="cardStyle">
        <a-row justify="space-between">
            <a-col :span="6">
                <a-space>
                    <a-button @click="addOrderVisible = true">
                        <FileAddOutlined />新增订单
                    </a-button>
                    <a-button @click="changePrice">
                        <PayCircleOutlined />价格调整
                    </a-button>
                </a-space>
            </a-col>
            <a-col :span="6" style="text-align: end;">
                <a-space>
                    <a-input-search v-model:value="searchParam.content" placeholder="请输入用户名/车牌号/起止时间" enter-button
                        allowClear bordered @search="searchOrder">
                        <template #addonBefore>
                            <a-select placeholder="搜索关键字" @change="SearchKeyChange"
                                style="background-color: rgba(255,255,255,0.3);border-radius: 5px;min-width: 100px;">
                                <a-select-option value="user_name" style="text-align: center;">用户名</a-select-option>
                                <a-select-option value="plate" style="text-align: center;">车牌号</a-select-option>
                                <a-select-option value="begin_time" style="text-align: center;">开始时间</a-select-option>
                                <a-select-option value="end_time" style="text-align: center;">结束时间</a-select-option>
                            </a-select>
                        </template>
                    </a-input-search>
                </a-space>
            </a-col>
            <!-- 排序框 -->
            <a-col :span="6" style="text-align: end;">
                <a-space>
                    <a-select placeholder="排序顺序" @change="OrdChange">
                        <a-select-option value="asc">升序</a-select-option>
                        <a-select-option value="desc">降序</a-select-option>
                    </a-select>
                    <a-select placeholder="请选择排序关键字" style="width: 160px;text-align: center;" @change="ColChange">
                        <a-select-option value="id" style="text-align: center;">ID (默认)</a-select-option>
                        <a-select-option value="user" style="text-align: center;">用户名</a-select-option>
                        <a-select-option value="plate" style="text-align: center;">车牌号</a-select-option>
                        <a-select-option value="amount" style="text-align: center;">总额</a-select-option>
                        <a-select-option value="duration" style="text-align: center;">停车时长</a-select-option>
                        <a-select-option value="begin_time" style="text-align: center;">开始时间</a-select-option>
                        <a-select-option value="end_time" style="text-align: center;">结束时间</a-select-option>

                    </a-select>
                </a-space>
            </a-col>
        </a-row>
        <!-- 操作框 -->
        <a-row style="margin: 10px 0;">
            <a-table rowKey="id" :columns="columns" :pagination="pagination" :dataSource="orderlist" bordered
                @change="handleTableChange" style="overflow-x: auto;">
                <template #bodyCell="{ column, record }">
                    <template v-if="column.key === col">
                        <span style="font-weight: bold; font-weight: bold;">{{ record[column.key] }}</span>
                    </template>
                    <template v-if="column.key === 'action'">
                        <div class="actionSlot">
                            <a-button type="primary" style="margin-right: 15px" @click="editOrder(record.id)">
                                <EditOutlined />编辑
                            </a-button>
                            <a-button type="primary" danger style="margin-right: 15px" @click="deleteorder(record.id)">
                                <DeleteOutlined />删除
                            </a-button>
                        </div>
                    </template>
                </template>
            </a-table>
        </a-row>

        <!-- 新增订单区域 -->
        <a-modal closable title="新增订单" :open="addOrderVisible" width="60%" @ok="addOrderOk" @cancel="addOrderCancel"
            destroyOnClose>
            <a-form :model="neworder" :rules="addOrderRules" ref="addOrderRef">
                <a-row>
                    <a-col :span="10">
                        <a-form-item label="车牌号" name="plate">
                            <a-input v-model:value="neworder.plate">
                                <template #prefix>
                                    <CarOutlined />
                                </template>
                            </a-input>
                        </a-form-item>
                    </a-col>
                    <a-col :offset="2" :span="10">
                        <a-form-item label="单价" name="price">
                            <a-input v-model:value="neworder.price">
                                <template #prefix>
                                    <DollarCircleOutlined />
                                </template>
                            </a-input>
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row>
                    <a-col :span="10">
                        <a-form-item label="开始时间" name="begin_time">
                            <a-input v-model:value="neworder.begin_time">
                                <template #prefix>
                                    <InfoCircleOutlined />
                                </template>
                            </a-input>
                        </a-form-item>
                    </a-col>
                    <a-col :offset="2" :span="10">
                        <a-form-item label="结束时间" name="end_time">
                            <a-input v-model:value="neworder.end_time">
                                <template #prefix>
                                    <InfoCircleOutlined />
                                </template>
                            </a-input>
                        </a-form-item>
                    </a-col>
                </a-row>
            </a-form>
        </a-modal>

        <!-- 编辑订单区域 -->
        <a-modal closable destroyOnClose title="编辑订单" :open="editOrderVisible" width="60%" @ok="editOrderOk"
            @cancel="editOrderCancel">
            <a-form :model="orderInfo" :rules="orderRules" ref="editOrderRef">
                <a-row>
                    <a-col :span="10">
                        <a-form-item label="用户名" name="user">
                            <a-input v-model:value="orderInfo.user" disabled>
                                <template #prefix>
                                    <LockOutlined />
                                </template>
                            </a-input>
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row>
                    <a-col :span="10">
                        <a-form-item label="车牌号" name="plate">
                            <a-input v-model:value="orderInfo.plate">
                                <template #prefix>
                                    <CarOutlined />
                                </template>
                            </a-input>
                        </a-form-item>
                    </a-col>
                    <a-col :offset="2" :span="10">
                        <a-form-item label="单价" name="price">
                            <a-input v-model:value="orderInfo.price">
                                <template #prefix>
                                    <DollarCircleOutlined />
                                </template>
                            </a-input>
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row>
                    <a-col :span="10">
                        <a-form-item label="开始时间" name="begin_time">
                            <a-input v-model:value="orderInfo.begin_time">
                                <template #prefix>
                                    <InfoCircleOutlined />
                                </template>
                            </a-input>
                        </a-form-item>
                    </a-col>
                    <a-col :offset="2" :span="10">
                        <a-form-item label="结束时间" name="end_time">
                            <a-input v-model:value="orderInfo.end_time">
                                <template #prefix>
                                    <InfoCircleOutlined />
                                </template>
                            </a-input>
                        </a-form-item>
                    </a-col>
                </a-row>
            </a-form>
        </a-modal>

        <!-- 价格调整区域 -->
        <a-modal closable title="价格调整" :open="changePriceVisible" width="60%" @ok="changePriceOk"
            @cancel="changePriceCancel" destroyOnClose>
            <p style="font-size: 16px;">请设置不同时间段的单价, 注意时间格式为00:00:00</p>
            <a-form :model="price" ref="changePriceRef">
                <a-row v-for="(item, index) in price" :key="index">
                    <a-col :span="8">
                        <a-form-item label="开始时间" :name="'begin' + index">
                            <a-input v-model:value="item.begin">
                            </a-input>
                        </a-form-item>
                    </a-col>
                    <a-col :offset="1" :span="8">
                        <a-form-item label="结束时间" :name="'end' + index">
                            <a-input v-model:value="item.end">
                            </a-input>
                        </a-form-item>
                    </a-col>
                    <a-col :offset="1" :span="6">
                        <a-form-item label="价格" :name="'price' + index">
                            <a-input v-model:value="item.price">
                                <template #prefix>
                                    <DollarCircleOutlined />
                                </template>
                            </a-input>
                        </a-form-item>
                    </a-col>
                </a-row>
            </a-form>
        </a-modal>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { FileAddOutlined, EditOutlined, DeleteOutlined, CarOutlined, InfoCircleOutlined, LockOutlined, DollarCircleOutlined, PayCircleOutlined } from '@ant-design/icons-vue'
import { message, Modal } from 'ant-design-vue'
import http from '../plugin/http'
import qs from 'qs'

const addOrderVisible = ref(false)
const editOrderVisible = ref(false)
const changePriceVisible = ref(false)
const editOrderRef = ref(null)
const addOrderRef = ref(null)
const changePriceRef = ref(null)
// 表单数据
const neworder = reactive({
    plate: '',
    price: '',
    begin_time: '',
    end_time: '',
})
const orderInfo = reactive({
    id: '',
    user: '',
    plate: '',
    price: '',
    begin_time: '',
    end_time: '',
})
const price = reactive([
    { begin: '00:00:00', end: '05:59:59', price: 0.1 },
    { begin: '06:00:00', end: '11:59:59', price: 0.1 },
    { begin: '12:00:00', end: '17:59:59', price: 0.1 },
    { begin: '18:00:00', end: '23:59:59', price: 0.1 }
])
// 表单验证规则
const orderRules = {
    plate: [
        { required: true, message: '请输入车牌号', trigger: 'blur' },
        { min: 4, message: '车牌号长度不能小于4位', trigger: 'blur' },
    ],
    price: [
        { required: true, message: '请输入单价', trigger: 'blur' },
    ],
    begin_time: [
        { required: true, message: '请输入开始时间', trigger: 'blur' },
        { pattern: /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/, message: '请输入正确的时间格式', trigger: 'blur' },
    ],
    end_time: [
        { pattern: /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/, message: '请输入正确的时间格式', trigger: 'blur' },
    ],
}
const addOrderRules = {
    plate: [
        { required: true, message: '请输入车牌号', trigger: 'blur' },
        { min: 4, message: '车牌号长度不能小于4位', trigger: 'blur' },
    ],
    price: [
        { required: true, message: '请输入单价', trigger: 'blur' },
    ],
    begin_time: [
        { required: true, message: '请输入开始时间', trigger: 'blur' },
        { pattern: /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/, message: '请输入正确的时间格式', trigger: 'blur' },
    ],
    end_time: [
        { pattern: /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/, message: '请输入正确的时间格式', trigger: 'blur' },
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
        title: '用户名',
        dataIndex: 'user',
        key: 'user',
        width: 200,
        align: 'center',
    },
    {
        title: '车牌号',
        dataIndex: 'plate',
        key: 'plate',
        width: 200,
        align: 'center',
    },
    {
        title: '总额',
        dataIndex: 'amount',
        key: 'amount',
        width: 200,
        align: 'center',
    },
    {
        title: '停车时长',
        dataIndex: 'duration',
        key: 'duration',
        width: 200,
        align: 'center',
    },
    {
        title: '开始时间',
        dataIndex: 'begin_time',
        key: 'begin_time',
        width: 200,
        align: 'center',
    },
    {
        title: '结束时间',
        dataIndex: 'end_time',
        key: 'end_time',
        width: 200,
        align: 'center',
    },
    {
        title: '操作',
        key: 'action',
        width: 400,
        align: 'center',
    },
];
// 分页
const pagination = reactive({
    pageSizeOptions: ['5', '10', '20'],
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
    showTotal: (total) => `共${total}条`,
})

const col = ref('id')
const ord = ref('sesc')
const orderlist = ref([]);

const queryParam = reactive({
    pagenum: 1,
    pagesize: 10,
})

const searchParam = reactive({
    key: '',
    content: '',
})

// 获取订单列表
async function getOrderList() {
    const { data: res1 } = await http.get('api/manage/order.query', {
        params: {
            sort_column: col.value,
            sort: ord.value,
            off: queryParam.pagenum * queryParam.pagesize - queryParam.pagesize,
            limit: queryParam.pagesize
        },
    })
    if (res1.status !== 0) {
        message.error(res1.msg)
        return
    }
    orderlist.value = res1.data.query
    const { data: res2 } = await http.get('api/manage/order.query', {
        params: {
            no_data: 1
        },
    })
    if (res2.status !== 0) {
        message.error(res2.msg)
        return
    }
    pagination.total = res2.data.count
}
// 更改分页
function handleTableChange(newPagination, filters, sorter) {
    pagination.current = newPagination.current
    pagination.pageSize = newPagination.pageSize
    queryParam.pagesize = newPagination.pageSize
    queryParam.pagenum = newPagination.current

    if (pagination.pageSize !== newPagination.pageSize) {
        queryParam.pagenum = 1
        pagination.current = 1
    }
    getOrderList()
}
// 更改排序关键字
function ColChange(value) {
    col.value = value
    getOrderList()
}
// 更改排序顺序
function OrdChange(value) {
    ord.value = value
    getOrderList()
}
// 搜索订单
async function searchOrder() {
    if (searchParam.content === '') {
        getOrderList()
        return
    }
    let data = qs.stringify({
        [searchParam.key]: searchParam.content
    })
    const { data: res } = await http.post('api/manage/order.info', data)
    if (res.status !== 0) {
        message.error(res.msg)
        return
    }
    orderlist.value = res.data.info
    pagination.total = res.data.count
    pagination.current = 1
    pagination.pageSize = pagination.total

}
// 更改搜索关键字
function SearchKeyChange(value) {
    searchParam.key = value
}
// 新增订单
const addOrderOk = () => {
    let data = ''
    if (neworder.end_time) {
        data = qs.stringify({
            plate: neworder.plate,
            price: neworder.price,
            begin_time: neworder.begin_time,
            end_time: neworder.end_time,
        })
    } else {
        data = qs.stringify({
            plate: neworder.plate,
            price: neworder.price,
            begin_time: neworder.begin_time,
        })
    }
    addOrderRef.value.validateFields()
        .then(() => {
            return http.post('api/manage/order.add', data)
        })
        .then(response => {
            const res = response.data
            if (res.status !== 0) {
                throw new Error(res.msg);
            }
            addOrderRef.value.resetFields()
            addOrderVisible.value = false
            message.success('添加订单成功')
            getOrderList()
        })
        .catch(error => {
            message.error(error.message || '发生错误，请重试')
        })
}
const addOrderCancel = () => {
    addOrderRef.value.resetFields()
    addOrderVisible.value = false
    message.info('新增订单已取消')
}
// 价格调整
async function changePrice() {
    changePriceVisible.value = true
    const { data: res } = await http.get('api/manage/price.info')
    if (res.status !== 0) {
        message.error(res.msg)
        return
    }
    price = res.data.info
}
const changePriceOk = () => {
    //     POST /api/manage/price.modify

    // Body: price=[
    //     {'begin': '00:00:00', 'end': '05:59:59', 'price': 0.1},
    //     {'begin': '06:00:00', 'end': '11:59:59', 'price': 0.1},
    //     {'begin': '12:00:00', 'end': '17:59:59', 'price': 0.1},
    //     {'begin': '18:00:00', 'end': '23:59:59', 'price': 0.1}
    //     ]
    // # 这里price=后面使用json格式

    // Response: {"status": 0, "msg": "success", "data": null}
    let data = qs.stringify({
        price: JSON.stringify(price)
    })
    changePriceRef.value.validateFields()
        .then(() => {
            return http.post('api/manage/price.modify', data)
        })
        .then(response => {
            const res = response.data
            if (res.status !== 0) {
                throw new Error(res.msg)
            }
            changePriceRef.value.resetFields()
            changePriceVisible.value = false
            message.success('价格调整成功')
            getOrderList()
        })
        .catch(error => {
            message.error(error.message || '发生错误，请重试')
        })

}
const changePriceCancel = () => {
    changePriceRef.value.resetFields()
    changePriceVisible.value = false
    message.info('价格调整已取消')
}
// 编辑订单
async function editOrder(id) {
    editOrderVisible.value = true
    const { data: res } = await http.post('api/manage/order.info', qs.stringify({ id }))
    orderInfo.id = id
    orderInfo.user = res.data.info[0].user
    orderInfo.plate = res.data.info[0].plate
    orderInfo.price = res.data.info[0].price
    orderInfo.begin_time = res.data.info[0].begin_time
    orderInfo.end_time = res.data.info[0].end_time
}
function editOrderOk() {
    let data = ''
    if (orderInfo.end_time) {
        data = qs.stringify({
            id: orderInfo.id,
            plate: orderInfo.plate,
            price: orderInfo.price,
            begin_time: orderInfo.begin_time,
            end_time: orderInfo.end_time,
        })
    } else {
        data = qs.stringify({
            id: orderInfo.id,
            plate: orderInfo.plate,
            price: orderInfo.price,
            begin_time: orderInfo.begin_time,
        })
    }
    editOrderRef.value.validateFields()
        .then(() => { return http.post('api/manage/order.modify', data) }
        )
        .then(response => {
            const res = response.data;
            if (res.status != 0) {
                message.error(res.msg);
                return;
            }
            editOrderVisible.value = false;
            message.success('更新订单信息成功');
            getOrderList();
        })
        .catch(error => {
            if (error && error.message) {
                message.error(error.message);
            } else {
                message.error('发生错误，请重试');
            }
        });
}
function editOrderCancel() {
    editOrderRef.value.resetFields()
    editOrderVisible.value = false
    message.info('编辑已取消')
}
// 删除订单
function deleteorder(id) {
    Modal.confirm({
        title: '提示：请再次确认',
        content: '确定要删除该订单吗？一旦删除，无法恢复',
        onOk: async () => {
            const { data: res } = await http.post('api/manage/order.del', qs.stringify({ id }))
            if (res.status != 0) return message.error(res.msg)
            message.success('删除成功')
            getOrderList()
        },
        onCancel: () => {
            message.info('已取消删除')
        },
    })
}

onMounted(() => {
    getOrderList()
})
</script>

<style scoped>
.cardStyle {
    margin: 15px;
}

.actionSlot {
    display: flex;
    justify-content: center;
}
</style>