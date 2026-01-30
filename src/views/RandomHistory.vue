<script setup lang="ts">
import { useHistoryStore } from '@/stores/history'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

const historyStore = useHistoryStore()
const { history } = storeToRefs(historyStore)
const handleDelete = () => {
  historyStore.clearHistory()
  deleteRecordDialogVisible.value = false
}

const deleteRecordDialogVisible = ref(false)
</script>

<template>
  <div>
    <h1>抽选记录</h1>
    <el-card>
      <el-table :data="history" stripe>
        <el-table-column fixed label="时间" prop="formattedTime" width="240" />
        <el-table-column label="学生列表" prop="students" />
      </el-table>
      <template #footer>
        <el-button @click="deleteRecordDialogVisible = true" type="danger">删除所有记录</el-button>
      </template>
    </el-card>
  </div>
  <el-dialog title="警告" width="640" v-model="deleteRecordDialogVisible" :show-close="false">
    你确定要删除所有记录吗? 删了就找不回来了哦~
    <template #footer>
      <el-button type="danger" @click="handleDelete">是的我就这么做</el-button>
      <el-button @click="deleteRecordDialogVisible = false">点错了点错了</el-button>
    </template>
  </el-dialog>
</template>
