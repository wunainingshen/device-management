<template>
  <div class="users-page">
    <el-card class="page-card" shadow="never">
      <template #header>
        <div class="page-header">
          <div class="header-left">
            <div class="header-dot"></div>
            <span>用户管理</span>
            <el-tag size="small" effect="dark" round>{{ users.length }} 人</el-tag>
          </div>
          <div class="header-right">
            <el-button type="primary" @click="openAddDialog" :icon="Plus">新增用户</el-button>
          </div>
        </div>
      </template>

      <el-table :data="users" stripe style="width: 100%" v-loading="loading" border>
        <el-table-column prop="id" label="ID" width="70" align="center" />
        <el-table-column prop="username" label="用户名" width="120" />
        <el-table-column prop="nickname" label="昵称" width="120" />
        <el-table-column prop="email" label="邮箱" min-width="200" />
        <el-table-column prop="phone" label="手机号" width="120" />
        <el-table-column prop="enabled" label="状态" width="90" align="center">
          <template #default="{ row }">
            <el-tag :type="row.enabled ? 'success' : 'danger'" effect="dark" round>
              {{ row.enabled ? '正常' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="在线" width="90" align="center">
          <template #default="{ row }">
            <el-tag :type="row.isOnline ? 'success' : 'info'" round size="small">
              {{ row.isOnline ? '在线' : '离线' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="注册时间" width="160">
          <template #default="{ row }">{{ formatDateTime(row.createdAt) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right" align="center">
          <template #default="{ row }">
            <el-button :type="row.enabled ? 'warning' : 'success'" size="small" link @click="handleToggleStatus(row)">
              <el-icon><Switch /></el-icon> {{ row.enabled ? '禁用' : '启用' }}
            </el-button>
            <el-button size="small" type="danger" link @click="handleDelete(row)">
              <el-icon><Delete /></el-icon> 删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="addDialogVisible" title="新增用户" width="450px" :close-on-click-modal="false">
      <el-form ref="addFormRef" :model="addForm" :rules="addRules" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" type="password" placeholder="请输入密码" show-password />
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="addForm.nickname" placeholder="请输入昵称" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="addForm.phone" placeholder="请输入手机号" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleAddUser" :loading="adding">创建</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Switch, Delete } from '@element-plus/icons-vue'
import axios from '../utils/axios'

const loading = ref(false)
const adding = ref(false)
const users = ref([])
const addDialogVisible = ref(false)
const addFormRef = ref(null)
const addForm = ref({ username: '', email: '', password: '', nickname: '', phone: '' })
const addRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }, { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }, { min: 6, message: '密码至少6位', trigger: 'blur' }]
}

const formatDateTime = (d) => d ? d.replace('T', ' ').substring(0, 19) : '-'

const fetchUsers = async () => {
  loading.value = true
  try {
    const res = await axios.get('/api/admin/users')
    if (res.data.code === 200) users.value = res.data.data
  } catch (e) { ElMessage.error('获取用户列表失败') }
  finally { loading.value = false }
}

const handleToggleStatus = async (user) => {
  try {
    const action = user.enabled ? '禁用' : '启用'
    await ElMessageBox.confirm(`确定要${action}用户"${user.username}"吗？`, '确认操作', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
    await axios.put(`/api/admin/users/${user.id}/toggle-status?enabled=${!user.enabled}`)
    ElMessage.success(`${action}成功`); fetchUsers()
  } catch (e) { if (e !== 'cancel') ElMessage.error('操作失败') }
}

const handleDelete = async (user) => {
  try {
    await ElMessageBox.confirm(`确定要删除用户"${user.username}"吗？`, '确认删除', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
    await axios.delete(`/api/admin/users/${user.id}`)
    ElMessage.success('用户已删除'); fetchUsers()
  } catch (e) { if (e !== 'cancel') ElMessage.error('删除失败') }
}

const openAddDialog = () => { addForm.value = { username: '', email: '', password: '', nickname: '', phone: '' }; addDialogVisible.value = true }

const handleAddUser = async () => {
  const valid = await addFormRef.value.validate().catch(() => false)
  if (!valid) return; adding.value = true
  try { await axios.post('/api/admin/users', addForm.value); ElMessage.success('用户创建成功'); addDialogVisible.value = false; fetchUsers() }
  catch (e) { ElMessage.error(e.response?.data?.message || '创建失败') }
  finally { adding.value = false }
}

onMounted(fetchUsers)
</script>

<style scoped>
.users-page {
  max-width: 1400px; margin: 0 auto;
  animation: fadeSlideUp 0.5s ease-out;
}
@keyframes fadeSlideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }

.page-card { border-radius: var(--radius-lg) !important; }

.page-header { display: flex; justify-content: space-between; align-items: center; }

.header-left { display: flex; align-items: center; gap: 10px; font-size: 16px; font-weight: 600; color: var(--text-primary); }

.header-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--danger-color); }

.header-right { display: flex; gap: 8px; }
</style>
