<template>
  <div class="profile-page">
    <el-row :gutter="24">
      <el-col :span="8">
        <el-card class="profile-card" shadow="never">
          <div class="avatar-section">
            <div class="avatar-wrapper">
              <el-avatar :size="88" :icon="UserFilled" class="avatar" />
              <div class="avatar-ring"></div>
            </div>
            <h3>{{ authStore.currentUser?.nickname || authStore.currentUser?.username }}</h3>
            <el-tag :type="authStore.isAdminUser ? 'danger' : 'primary'" effect="dark" round>
              {{ authStore.isAdminUser ? '管理员' : '普通用户' }}
            </el-tag>
          </div>
          <el-divider style="background:var(--border-color);margin:20px 0" />
          <div class="info-list">
            <div class="info-item">
              <span class="label">用户名</span>
              <span class="value">{{ authStore.currentUser?.username }}</span>
            </div>
            <div class="info-item">
              <span class="label">邮箱</span>
              <span class="value">{{ authStore.currentUser?.email }}</span>
            </div>
            <div class="info-item">
              <span class="label">手机号</span>
              <span class="value">{{ authStore.currentUser?.phone || '未设置' }}</span>
            </div>
            <div class="info-item">
              <span class="label">注册时间</span>
              <span class="value">{{ formatDate(authStore.currentUser?.createdAt) }}</span>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="16">
        <el-card class="profile-card" shadow="never">
          <template #header>
            <div class="card-title">
              <div class="card-title-dot"></div>
              修改个人信息
            </div>
          </template>
          <el-form ref="profileFormRef" :model="profileForm" :rules="profileRules" label-width="80px">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="昵称" prop="nickname">
                  <el-input v-model="profileForm.nickname" placeholder="请输入昵称" size="large" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="邮箱" prop="email">
                  <el-input v-model="profileForm.email" placeholder="请输入邮箱" size="large" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="profileForm.phone" placeholder="请输入手机号" size="large" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleUpdate" :loading="updating" size="large">
                保存修改
              </el-button>
            </el-form-item>
          </el-form>

          <el-divider style="background:var(--border-color);margin:24px 0" />

          <div class="card-title" style="margin-bottom:20px">
            <div class="card-title-dot" style="background:var(--warning-color)"></div>
            修改密码
          </div>
          <el-form ref="passwordFormRef" :model="passwordForm" :rules="passwordRules" label-width="80px">
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="原密码" prop="oldPassword">
                  <el-input v-model="passwordForm.oldPassword" type="password" placeholder="原密码" size="large" show-password />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="新密码" prop="newPassword">
                  <el-input v-model="passwordForm.newPassword" type="password" placeholder="新密码 (6位以上)" size="large" show-password />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="确认" prop="confirmPassword">
                  <el-input v-model="passwordForm.confirmPassword" type="password" placeholder="确认新密码" size="large" show-password />
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item>
              <el-button type="warning" @click="handleChangePassword" :loading="changingPwd" size="large">
                修改密码
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { UserFilled } from '@element-plus/icons-vue'
import { useAuthStore } from '../store/auth'
import axios from '../utils/axios'

const authStore = useAuthStore()
const updating = ref(false)
const changingPwd = ref(false)
const profileFormRef = ref(null)
const passwordFormRef = ref(null)

const profileForm = reactive({ nickname: '', email: '', phone: '' })
const passwordForm = reactive({ oldPassword: '', newPassword: '', confirmPassword: '' })

const profileRules = {
  email: [{ type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }]
}

const passwordRules = {
  oldPassword: [{ required: true, message: '请输入原密码', trigger: 'blur' }],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '新密码至少6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    { validator: (rule, value, cb) => value !== passwordForm.newPassword ? cb(new Error('两次密码不一致')) : cb(), trigger: 'blur' }
  ]
}

const formatDate = (date) => {
  if (!date) return '-'
  return date.replace('T', ' ').substring(0, 19)
}

onMounted(() => {
  const user = authStore.currentUser
  if (user) {
    profileForm.nickname = user.nickname || ''
    profileForm.email = user.email || ''
    profileForm.phone = user.phone || ''
  }
})

const handleUpdate = async () => {
  const valid = await profileFormRef.value.validate().catch(() => false)
  if (!valid) return
  updating.value = true
  try {
    await authStore.updateUserInfo({
      nickname: profileForm.nickname, email: profileForm.email, phone: profileForm.phone
    })
    ElMessage.success('个人信息已更新')
  } catch (e) {
    ElMessage.error(e.message || '更新失败')
  } finally {
    updating.value = false
  }
}

const handleChangePassword = async () => {
  const valid = await passwordFormRef.value.validate().catch(() => false)
  if (!valid) return
  changingPwd.value = true
  try {
    await axios.put('/api/user/password', {
      oldPassword: passwordForm.oldPassword, newPassword: passwordForm.newPassword
    })
    ElMessage.success('密码修改成功')
    passwordForm.oldPassword = ''
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''
  } catch (e) {
    ElMessage.error(e.response?.data?.message || '密码修改失败')
  } finally {
    changingPwd.value = false
  }
}
</script>

<style scoped>
.profile-page {
  max-width: 1200px;
  margin: 0 auto;
  animation: fadeSlideUp 0.5s ease-out;
}

@keyframes fadeSlideUp {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}

.profile-card {
  margin-bottom: 24px;
}

.avatar-section {
  text-align: center;
  padding: 16px 0;
}

.avatar-wrapper {
  position: relative;
  display: inline-block;
  margin-bottom: 16px;
}

.avatar {
  background: var(--primary-gradient) !important;
  border: 3px solid rgba(6, 182, 212, 0.3);
}

.avatar-ring {
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  border: 1px solid rgba(6, 182, 212, 0.15);
  animation: spin 15s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.avatar-section h3 {
  font-size: 18px;
  color: var(--text-primary);
  margin-bottom: 10px;
  font-weight: 600;
}

.info-list {
  padding: 0 4px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid var(--border-light);
}

.info-item:last-child { border-bottom: none; }

.info-item .label { color: var(--text-muted); font-size: 14px; }
.info-item .value { color: var(--text-primary); font-weight: 500; }

.card-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.card-title-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--primary-color);
}
</style>
