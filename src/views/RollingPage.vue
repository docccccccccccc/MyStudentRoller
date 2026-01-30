<script setup lang="ts">
import { useHistoryStore } from '@/stores/history'
import { useSettingStore } from '@/stores/settings'
import { useStudentListStore } from '@/stores/students'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'

const studentsStore = useStudentListStore()
const historyStore = useHistoryStore()
const settingStore = useSettingStore()

const { studentList } = storeToRefs(studentsStore)
const { settings } = storeToRefs(settingStore)
// const { addRecord } = historyStore

const openFullscreen = () => {
  document.documentElement.requestFullscreen()
}

/* 关闭全屏 */
const exitFullscreen = () => {
  document.exitFullscreen()
}

function handleRandom() {
  let chosenStudentIndex: number = 0 // 被抽中学生的索引
  chosenStudentList.value = [] // 先清空名单
  randomIsDone.value = false // 状态设置为未完成
  resultDialogVisible.value = true // 显示窗口
  // 先确定结果
  for (let i = 0; i < numberOfStudent.value; i++) {
    chosenStudentIndex = Math.floor(Math.random() * studentList.value.length) // 从 0 - 长度中选择一个
    chosenStudentList.value.push(studentList.value[chosenStudentIndex] || '') // 然后加进列表里面
  }
  // 如果不立即显示结果
  if (settings.value.animation.enabled) {
    // 播放动画
    const animation = setInterval(() => {
      randomAnimationStudent.value = studentList.value[Math.floor(Math.random() * studentList.value.length)] || ''
    }, settings.value.animation.interval)
    setTimeout(() => {
      clearInterval(animation)
      randomIsDone.value = true // 状态设置为完成
    }, settings.value.animation.duration * 1000)
  }else{
    randomIsDone.value = true // 状态设置为完成
  }
  console.log(typeof chosenStudentList.value, chosenStudentList.value)
  // 添加记录
  if (Array.isArray(chosenStudentList.value) && chosenStudentList.value.length > 0) {
    historyStore.addRecord(chosenStudentList.value)
  }
  console.log(chosenStudentList.value)
}

const numberOfStudent = ref(1)

const isVerticalLayout = computed(() => {
  return settings.value.panelPosition === 'top' || settings.value.panelPosition === 'bottom'
})

const resultDialogVisible = ref(false)
const randomIsDone = ref(false)
const chosenStudentList = ref<string[]>([])
const randomAnimationStudent = ref(studentList.value[0]) // 播放动画时显示的名字
</script>

<template>
  <div>
    <h1>{{ settings.title ? settings.title : '随机抽选' }}</h1>
    <el-row :gutter="8" :class="`panel-on-${settings.panelPosition}`">
      <el-col :span="isVerticalLayout ? 24 : 18">
        <el-card>
          <template #header> 学生名单 </template>
          <el-empty v-if="studentList.length === 0" description="空空如也" />
          <el-space wrap v-if="studentList.length !== 0">
            <div v-for="student in studentList" :key="student">
              <el-text size="large" class="student-name"> {{ student }} </el-text>
            </div>
          </el-space>
        </el-card>
      </el-col>
      <el-divider v-if="isVerticalLayout" />
      <el-col :span="isVerticalLayout ? 24 : 6">
        <el-card>
          <template #header> 操作 </template>
          <el-form label-position="top">
            <el-form-item label="人数">
              <el-slider
                :min="1"
                :max="studentList.length - 1"
                v-model="numberOfStudent"
                :show-tooltip="false"
                show-input
              />
            </el-form-item>
          </el-form>
          <el-button @click="handleRandom">抽选</el-button>
          <el-button @click="openFullscreen">进入全屏</el-button>
          <el-button @click="exitFullscreen">退出全屏</el-button>
        </el-card>
      </el-col>
    </el-row>
  </div>
  <el-dialog
    title="结果"
    width="1280"
    v-model="resultDialogVisible"
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <div style="text-align: center">
      <p v-if="!randomIsDone || numberOfStudent === 1" style="font-size: 128px">
        {{ randomIsDone ? chosenStudentList[0] : randomAnimationStudent }}
      </p>
      <el-space wrap v-else>
        <el-text size="large" class="student-name" v-for="item in chosenStudentList" :key="item">
          {{ item }}
        </el-text>
      </el-space>
    </div>
    <template #footer>
      <el-button @click="resultDialogVisible = false" :disabled="!randomIsDone" type="primary">
        好的
      </el-button>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.student-name {
  width: 96px;
  display: inline-block;
}

.panel-on-right {
  flex-direction: row;
}

.panel-on-top {
  flex-direction: column-reverse;
}

.panel-on-left {
  flex-direction: row-reverse;
}

.panel-on-bottom {
  flex-direction: column;
}

.el-slider {
  max-width: 600px;
}
</style>
