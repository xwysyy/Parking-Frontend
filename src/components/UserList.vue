<template>
  <div class="cardStyle">
    <a-row justify="space-between">
      <a-col :span="4">
        <a-button @click="addUserVisible = true">
          <UserOutlined />新增用户
        </a-button>
      </a-col>
      <!-- 搜索框 -->
      <a-col :span="8">
        <a-space>
          <a-input-search v-model:value="searchParam.content" placeholder="请输入用户名/电话/邮箱号/车牌号查找" enter-button allowClear
            bordered @search="searchUser">
            <template #addonBefore>
              <a-select placeholder="搜索关键字" @change="SearchKeyChange"
                style="background-color: rgba(255,255,255,0.3);border-radius: 5px;min-width: 100px;">
                <a-select-option value="name" style="text-align: center;">用户名</a-select-option>
                <a-select-option value="phone" style="text-align: center;">电话</a-select-option>
                <a-select-option value="email" style="text-align: center;">邮箱</a-select-option>
                <a-select-option value="plate" style="text-align: center;">车牌号</a-select-option>
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
            <a-select-option value="name" style="text-align: center;">用户名</a-select-option>
            <a-select-option value="balance" style="text-align: center;">账户余额</a-select-option>
            <a-select-option value="phone" style="text-align: center;">电话</a-select-option>
            <a-select-option value="email" style="text-align: center;">邮箱</a-select-option>
            <a-select-option value="register_time" style="text-align: center;">注册时间</a-select-option>
            <a-select-option value="last_login" style="text-align: center;">最后登录时间</a-select-option>
          </a-select>
        </a-space>
      </a-col>
    </a-row>
    <!-- 操作框 -->
    <a-row style="margin: 10px 0;">
      <a-table rowKey="id" :columns="columns" :pagination="pagination" :dataSource="userlist" bordered
        @change="handleTableChange" style="overflow-x: auto;">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === col">
            <span style="font-weight: bold; font-size: large;">{{ record[column.key] }}</span>
          </template>
          <template v-if="column.key === 'action'">
            <div class="actionSlot">
              <a-button type="primary" style="margin-right: 15px" @click="editUser(record.id)">
                <EditOutlined />编辑
              </a-button>
              <a-button type="primary" danger style="margin-right: 15px" @click="deleteUser(record.name)">
                <DeleteOutlined />删除
              </a-button>
              <a-button @click="ChangePassword(record.name)">
                <InfoCircleOutlined />修改密码
              </a-button>
            </div>
          </template>
        </template>
      </a-table>
    </a-row>

    <!-- 新增用户区域 -->
    <a-modal closable title="新增用户" :open="addUserVisible" width="60%" @ok="addUserOk" @cancel="addUserCancel"
      destroyOnClose>
      <a-form :model="newUser" :rules="addUserRules" ref="addUserRef">
        <a-row>
          <a-col :span="10">
            <a-form-item label="用户名" name="name">
              <a-input v-model:value="newUser.name">
                <template #prefix>
                  <UserOutlined />
                </template>
              </a-input>
            </a-form-item>
          </a-col>
          <a-col :offset="2" :span="10">
            <a-form-item label="账户余额" name="balance">
              <a-input v-model:value="newUser.balance">
                <template #prefix>
                  <DollarCircleOutlined />
                </template>
              </a-input>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="10">
            <a-form-item label="电话" name="phone">
              <a-input v-model:value="newUser.phone">
                <template #prefix>
                  <PhoneOutlined />
                </template>
              </a-input>
            </a-form-item>
          </a-col>
          <a-col :offset="2" :span="10">
            <a-form-item label="邮箱" name="email">
              <a-input v-model:value="newUser.email">
                <template #prefix>
                  <MailOutlined />
                </template>
              </a-input>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="10">
            <a-form-item label="密码" name="passwd">
              <a-input-password v-model:value="newUser.passwd">
                <template #prefix>
                  <LockOutlined />
                </template>
              </a-input-password>
            </a-form-item>
          </a-col>
          <a-col :offset="2" :span="10">
            <a-form-item label="确认密码" name="checkPass">
              <a-input-password v-model:value="newUser.checkPass">
                <template #prefix>
                  <LockOutlined />
                </template>
              </a-input-password>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>

    <!-- 编辑用户区域 -->
    <a-modal closable destroyOnClose title="编辑用户" :open="editUserVisible" width="60%" @ok="editUserOk"
      @cancel="editUserCancel">
      <a-form :model="userInfo" :rules="userRules" ref="editUserRef">
        <a-row>
          <a-col :span="10">
            <a-form-item label="用户名" name="new_name">
              <a-input v-model:value="userInfo.new_name">
                <template #prefix>
                  <UserOutlined />
                </template>
              </a-input>
            </a-form-item>
          </a-col>
          <a-col :offset="2" :span="10">
            <a-form-item label="账户余额" name="balance">
              <a-input v-model:value="userInfo.balance">
                <template #prefix>
                  <DollarCircleOutlined />
                </template>
              </a-input>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="10">
            <a-form-item label="电话" name="phone">
              <a-input v-model:value="userInfo.phone">
                <template #prefix>
                  <PhoneOutlined />
                </template>
              </a-input>
            </a-form-item>
          </a-col>
          <a-col :offset="2" :span="10">
            <a-form-item label="邮箱" name="email">
              <a-input v-model:value="userInfo.email">
                <template #prefix>
                  <MailOutlined />
                </template>
              </a-input>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <template v-for="item in userInfo.plates">
        <a-row style="margin-bottom:15px;">
          <a-col>
            车牌号：<span style="border: 1px solid rgba(0,0,0,0.25);padding: 5px 10px;border-radius: 5px;">
              {{ item }}</span>
            <a-button danger type="link" @click="deletePlate(item)">删除</a-button>
          </a-col>
        </a-row>
      </template>
      <a-row style="margin:15px 0;">
        <a-col>
          <a-input v-model:value="userInfo.new_plate">
            <template #addonBefore>
              车牌号</template>
          </a-input>
        </a-col>
        <a-col>
          <a-button type="link" @click="addPlate">新增车牌号</a-button>
        </a-col>
      </a-row>
    </a-modal>

    <!-- 修改密码 -->
    <a-modal closable title="修改密码" :open="changePasswordVisible" width="60%" @ok="changePasswordOk"
      @cancel="changePasswordCancel" destroyOnClose>
      <a-form :model="changePassword" :rules="changePasswordRules" ref="changePasswordRef">
        <a-form-item has-feedback label="新密码" name="passwd">
          <a-input-password v-model:value="changePassword.passwd">
            <template #prefix>
              <LockOutlined />
            </template>
          </a-input-password>
        </a-form-item>
        <a-form-item has-feedback label="确认密码" name="checkpass">
          <a-input-password v-model:value="changePassword.checkpass">
            <template #prefix>
              <LockOutlined />
            </template>
          </a-input-password>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import dayjs from 'dayjs'
import { EditOutlined, PhoneOutlined, DeleteOutlined, MailOutlined, InfoCircleOutlined, UserOutlined, LockOutlined, DollarCircleOutlined } from '@ant-design/icons-vue'
import { message, Modal } from 'ant-design-vue'
import http from '../plugin/http'
import qs from 'qs'

const addUserVisible = ref(false)
const editUserVisible = ref(false)
const changePasswordVisible = ref(false)
const changePasswordRef = ref(null)
const editUserRef = ref(null)
const addUserRef = ref(null)

// 表单数据
const newUser = reactive({
  name: '',
  passwd: '',
  checkPass: '',
  phone: '',
  email: '',
  balance: '',
})
const userInfo = reactive({
  id: '',
  name: '',
  new_name: '',
  checkPass: '',
  phone: '',
  email: '',
  balance: '',
  plates: [],
  new_plate: '',
  passwd: '',
})
const changePassword = reactive({
  name: '',
  passwd: '',
  checkPass: '',
})
// 表单验证规则
const changePasswordRules = {
  passwd: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 4, message: '密码长度不能小于4位', trigger: 'blur' },
  ],
  checkpass: [
    {
      validator: (rule, value) => {
        return new Promise((resolve, reject) => {
          if (changePassword.checkpass == '') {
            reject('请输入密码');
          }
          if (changePassword.passwd !== changePassword.checkpass) {
            reject('密码不一致，请重新输入');
          } else {
            resolve();
          }
        })
      },
      trigger: 'blur',
    },
  ],
}
const userRules = {
  new_name: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 4, message: '用户名长度不能小于4位', trigger: 'blur' },
  ],
  email: [
    { type: 'email', message: '请输入正确的邮箱', trigger: 'blur' },
  ],
}
const addUserRules = {
  name: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 4, message: '用户名长度不能小于4位', trigger: 'blur' },
  ],
  passwd: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 4, message: '密码长度不能小于4位', trigger: 'blur' },
  ],
  balance: [
    { required: true, message: '请输入账户余额', trigger: 'blur' },
  ],
  checkPass: [
    {
      validator: (rule, value) => {
        return new Promise((resolve, reject) => {
          if (newUser.checkPass == '') {
            reject('请输入密码');
          }
          if (newUser.passwd !== newUser.checkPass) {
            reject('密码不一致，请重新输入');
          } else {
            resolve();
          }
        })
      },
      trigger: 'blur',
    },
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
    dataIndex: 'name',
    key: 'name',
    width: 200,
    align: 'center',
  },
  {
    title: '账户余额',
    dataIndex: 'balance',
    key: 'balance',
    width: 200,
    align: 'center',
  },
  {
    title: '电话',
    dataIndex: 'phone',
    key: 'phone',
    width: 300,
    align: 'center',
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    key: 'email',
    width: 300,
    align: 'center',
  },
  {
    title: '注册时间',
    dataIndex: 'register_time',
    key: 'register_time',
    width: 300,
    customRender: ({ text }) => {
      return dayjs(text).format('YYYY-MM-DD HH:mm:ss');
    },
    align: 'center',
  },
  {
    title: '最后登录时间',
    dataIndex: 'last_login',
    key: 'last_login',
    width: 300,
    customRender: ({ text }) => {
      return dayjs(text).format('YYYY-MM-DD HH:mm:ss');
    },
    align: 'center',
  },
  {
    title: '操作',
    key: 'action',
    width: 300,
    align: 'center',
  },
]
// 分页
const pagination = reactive({
  pageSizeOptions: ['2', '5', '10', '20'],
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showTotal: (total) => `共${total}条`,
})

const col = ref('id')
const ord = ref('sesc')
const userlist = ref([]);

const queryParam = reactive({
  pagenum: 1,
  pagesize: 10,
})

const searchParam = reactive({
  key: '',
  content: '',
})

// 获取用户列表
async function getUserList() {
  const { data: res1 } = await http.get('api/manage/user.query', {
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
  userlist.value = res1.data.query
  const { data: res2 } = await http.get('api/manage/user.query', {
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
  getUserList()
}
// 更改排序关键字
function ColChange(value) {
  col.value = value
  getUserList()
}
// 更改排序顺序
function OrdChange(value) {
  ord.value = value
  getUserList()
}
// 搜索用户
async function searchUser() {
  if (searchParam.content === '') {
    getUserList()
    return
  }
  let data = qs.stringify({
    [searchParam.key]: searchParam.content
  })
  const { data: res } = await http.post('api/manage/user.info', data)
  if (res.status !== 0) {
    message.error(res.msg)
    return
  }
  userlist.value = res.data.info
  pagination.total = res.data.count
  pagination.current = 1
  pagination.pageSize = 5

}
// 更改搜索关键字
function SearchKeyChange(value) {
  searchParam.key = value
}
// 新增用户
const addUserOk = () => {
  addUserRef.value.validateFields()
    .then(() => {
      return http.post('api/manage/user.add', qs.stringify({
        name: newUser.name,
        passwd: newUser.passwd,
        phone: newUser.phone,
        email: newUser.email,
        balance: newUser.balance,
      }))
    })
    .then(response => {
      const res = response.data
      if (res.status !== 0) {
        throw new Error(res.msg);
      }
      addUserRef.value.resetFields()
      addUserVisible.value = false
      message.success('添加用户成功')
      getUserList()
    })
    .catch(error => {
      message.error(error.message || '发生错误，请重试')
    })
}
const addUserCancel = () => {
  addUserRef.value.resetFields()
  addUserVisible.value = false
  message.info('新增用户已取消')
}
// 编辑用户
async function editUser(id) {
  editUserVisible.value = true
  const { data: res } = await http.post('api/manage/user.info', qs.stringify({ id }))
  userInfo.id = id
  userInfo.name = res.data.info[0].name
  userInfo.new_name = res.data.info[0].name
  userInfo.phone = res.data.info[0].phone
  userInfo.email = res.data.info[0].email
  userInfo.balance = res.data.info[0].balance
  userInfo.plates = res.data.info[0].plates
}
function editUserOk() {
  let data = '';
  if (userInfo.new_name !== userInfo.name) data = qs.stringify({
    name: userInfo.name,
    new_name: userInfo.new_name,
    phone: userInfo.phone,
    email: userInfo.email,
    balance: userInfo.balance,
  })
  else data = qs.stringify({
    name: userInfo.name,
    phone: userInfo.phone,
    email: userInfo.email,
    balance: userInfo.balance,
  })
  editUserRef.value.validateFields()
    .then(() => { return http.post('api/manage/user.modify', data) }
    )
    .then(response => {
      const res = response.data;
      if (res.status != 0) {
        message.error(res.msg);
        return;
      }
      editUserVisible.value = false;
      message.success('更新用户信息成功');
      getUserList();
    })
    .catch(error => {
      if (error && error.message) {
        message.error(error.message);
      } else {
        message.error('发生错误，请重试');
      }
    });
}
function editUserCancel() {
  editUserRef.value.resetFields()
  editUserVisible.value = false
  message.info('编辑已取消')
}
// 删除车牌号
function deletePlate(plate) {
  Modal.confirm({
    title: '提示：请再次确认',
    content: '确定要删除该车牌号吗？一旦删除，无法恢复',
    onOk: async () => {
      const { data: res } = await http.post('api/manage/plate.del', qs.stringify({ plate }))
      if (res.status != 0) return message.error(res.msg)
      message.success('删除成功')
      editUser(userInfo.id)
    },
    onCancel: () => {
      message.info('已取消删除')
    },
  })
}
// 新增车牌号
function addPlate() {
  Modal.confirm({
    title: '提示：请再次确认',
    content: '确定要新增车牌号吗？',
    onOk: async () => {
      const { data: res } = await http.post('api/manage/plate.add', qs.stringify({ user_name: userInfo.name, plate: userInfo.new_plate }))
      if (res.status != 0) return message.error(res.msg)
      message.success('新增成功')
      userInfo.new_plate = ''
      editUser(userInfo.id)
    },
    onCancel: () => {
      message.info('已取消新增')
    },
  })
}
// 删除用户
function deleteUser(name) {
  Modal.confirm({
    title: '提示：请再次确认',
    content: '确定要删除该用户吗？一旦删除，无法恢复',
    onOk: async () => {
      const { data: res } = await http.post('api/manage/user.del', qs.stringify({ name }))
      if (res.status != 0) return message.error(res.msg)
      message.success('删除成功')
      getUserList()
    },
    onCancel: () => {
      message.info('已取消删除')
    },
  })
}
// 修改密码
function ChangePassword(name) {
  changePasswordVisible.value = true
  changePassword.name = name
}
function changePasswordOk() {
  changePasswordRef.value.validateFields()
    .then(() => {
      return http.post('api/manage/user.modify', qs.stringify({
        name: changePassword.name,
        passwd: changePassword.passwd,
      }))
    })
    .then(response => {
      const res = response.data
      if (res.status != 0) {
        message.error(res.msg)
        return;
      }
      changePasswordVisible.value = false
      message.success('修改密码成功')
      changePasswordRef.value.resetFields()
      getUserList();
    })
    .catch(error => {
      if (error && error.message) {
        message.error(error.message);
      } else {
        message.error('发生错误，请重试');
      }
    })
}
function changePasswordCancel() {
  changePasswordRef.value.resetFields()
  changePasswordVisible.value = false
  message.info('已取消')
}

onMounted(() => {
  getUserList()
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
