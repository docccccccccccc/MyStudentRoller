<script setup lang="ts">
// 颜色主题切换
import { isDark } from '@/utils/colorScheme'
import { useStudentListStore } from '@/stores/students'
import { storeToRefs } from 'pinia'
import { useSettingStore, defaultSettings } from '@/stores/settings'
import { reactive } from 'vue'
import { ElMessage } from 'element-plus'

const { settings } = storeToRefs(useSettingStore())

if(!localStorage.getItem("settings")) {
  localStorage.setItem("settings", JSON.stringify(defaultSettings)) // 从 LocalStorage 读取设置
}

// 控制对话框开关状态
const dialogs = reactive({
  importStudentList: false,
  resetSettings: false,
  resetStudentList: false
})

const handleSettingReset = () => {
  useSettingStore().resetSettings() // 重置设置
  dialogs.resetSettings = false
}

const handleStudentListReset = () => {
  useStudentListStore().resetStudentList() // 重置设置
  dialogs.resetStudentList = false
}

// 学生名单上传
const handleUploadStudentList = () => {
  const uploadButton = document.querySelector('#select-student-list-file') as HTMLInputElement;
  uploadButton.value = '' // 清空
  uploadButton.click() // 点一下

  // 监听变化
  uploadButton?.addEventListener('change', (event) => {
    const target = event.target as HTMLInputElement
    if (target.files && target.files.length > 0) {
      const studentListFile = target.files[0] as File

      const reader = new FileReader()

      reader.addEventListener('load', () => {
        try {
          const content = reader.result as string
          const lines = content.split('\n') // 先分割
            .map(line => line.trim()) // 然后去掉空格
            .filter(line => line.length > 0) // 再清理空行

          if(lines.length < 2) {
            ElMessage.error('名字不够！（需 ≥2 人）')
          } else {
            // 更新列表
            useStudentListStore().setStudentList(lines)
          }

          ElMessage.success('成功导入！回到主界面查看详细信息')
          dialogs.importStudentList = false;
        } catch (error) {
          console.error('上传时出错：', error)
          ElMessage.error('出错了，打开控制台查看详细信息')
        }
      })

      reader.addEventListener('error', (error) => {
        console.error('出错了：', error)
        ElMessage.error('出错了，打开控制台查看详细信息')
      })

      reader.readAsText(studentListFile, 'UTF-8')
    }
  })
}

// 背景图上传
const handleUploadBackgroundImage = () => {
  const uploadButton = document.querySelector('#select-bg-file') as HTMLInputElement;
  uploadButton.value = '' // 清空
  uploadButton.click() // 点一下

  // 监听变化
  uploadButton?.addEventListener('change', (event) => {
    const target = event.target as HTMLInputElement
    if (target.files && target.files.length > 0) {
      const backgroundImageFile = target.files[0] as File

      const reader = new FileReader()

      reader.addEventListener("load", () => {
        try {
          document.body.style.backgroundImage = `url("${reader.result}")`
          useSettingStore().settings.backgroundImage = reader.result as string
          ElMessage.success('成功修改背景图！')
        } catch (error) {
          console.error('上传时出错：', error)
          ElMessage.error('出错了，打开控制台查看详细信息')
        }
      })

      reader.addEventListener("error", (error) => {
        console.error('出错了：', error)
        ElMessage.error('出错了，打开控制台查看详细信息')
      })

      reader.readAsDataURL(backgroundImageFile)
    }
  })
}
</script>

<template>
  <div>
    <h1>设置</h1>
    <el-card>
      <template #header>外观</template>
      <el-form>
        <el-form-item label="深色模式">
          <el-switch v-model="isDark" />
        </el-form-item>
        <el-form-item label="抽选操作面板显示位置">
          <el-radio-group v-model="settings.panelPosition">
            <el-radio-button label="下方" value="bottom" />
            <el-radio-button label="上方" value="top" />
            <el-radio-button label="左侧" value="left" />
            <el-radio-button label="右侧" value="right" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="背景图（可选，是张图都行）">
          <el-button @click="handleUploadBackgroundImage">点击上传</el-button>
          <input type="file" accept="image/*" style="display: none;" id="select-bg-file">
        </el-form-item>
        <el-form-item label="不透明度（%）">
          <el-slider :min="80" :max="100" v-model="settings.opacity" show-input />
        </el-form-item>
      </el-form>
    </el-card>
    <el-divider />
    <el-card>
      <template #header>抽选</template>
      <el-form>
        <el-form-item label="播放动画（关闭则立即显示结果）">
          <el-switch v-model="settings.animation.enabled" />
        </el-form-item>
        <el-form-item label="动画速度（值越小越快）" v-if="settings.animation.enabled">
          <el-slider :max="500" :min="10" v-model="settings.animation.interval" :step="10" show-input/>
        </el-form-item>
        <el-form-item label="动画持续时间（秒）" v-if="settings.animation.enabled">
          <el-slider :max="5" :min="1" v-model="settings.animation.duration" :step="0.1" show-input/>
        </el-form-item>
        <el-form-item label="学生名单（.txt 文件, 格式详见帮助）">
          <el-button @click="dialogs.importStudentList = true">点击上传</el-button>
        </el-form-item>
        <el-form-item label="标题">
          <el-input v-model="settings.title" placeholder="随机抽选" />
        </el-form-item>
      </el-form>
    </el-card>
    <el-divider />
    <el-card>
      <template #header>危险操作</template>
      <el-button type="danger" @click="dialogs.resetSettings = true">
        重置设置
      </el-button>
      <el-button type="danger" @click="dialogs.resetStudentList = true">
        重置学生名单
      </el-button>
    </el-card>
  </div>
  <el-dialog title="警告" v-model="dialogs.importStudentList">
    <p>导入新的名单文件将会覆盖原先的名单且不可恢复！</p>
    <p>你确定要导入吗？</p>
    <p>（导入失败不会影响当前名单）</p>
    <input type="file" accept=".txt" style="display: none;" id="select-student-list-file">
    <template #footer>
      <el-button @click="dialogs.importStudentList = false">点错了点错了</el-button>
      <el-button type="primary" @click="handleUploadStudentList">选择文件</el-button>
    </template>
  </el-dialog>
  <el-dialog title="警告" :show-close="false" v-model="dialogs.resetSettings">
    <p>你即将重置所有设置！！</p>
    <p><b>（仅推荐在新的班级使用时重置）</b></p>
    <p>这是最后的警告，你确定要清除吗？</p>
    <template #footer>
      <el-button @click="dialogs.resetSettings = false">点错了点错了</el-button>
      <el-button type="danger" @click="handleSettingReset">重置吧</el-button>
    </template>
  </el-dialog>
  <el-dialog title="警告" :show-close="false" v-model="dialogs.resetStudentList">
    <p>你即将重置学生名单！！</p>
    <p><b>（仅推荐在新的班级使用时重置）</b></p>
    <p>这是最后的警告，你确定要清除吗？</p>
    <template #footer>
      <el-button @click="dialogs.resetStudentList = false">点错了点错了</el-button>
      <el-button type="danger" @click="handleStudentListReset">重置吧</el-button>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
  .el-slider {
    max-width: 500px;
  }
</style>
