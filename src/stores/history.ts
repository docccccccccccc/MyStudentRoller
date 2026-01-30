import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { v4 as uuidv4 } from 'uuid'

export interface SingleRecord {
  uuid: string // UUID 唯一标识符(通用唯一识别码)
  timestamp: number // 时间戳
  formattedTime: string
  students: string[] // 学生列表
}

export const useHistoryStore = defineStore('randomHistory', () => {
  const savedHistory = localStorage.getItem('history')
  const parsedHistory = savedHistory ? JSON.parse(savedHistory) : []
  const history = ref<SingleRecord[]>(Array.isArray(parsedHistory) ? parsedHistory : [])
  // 获取当前历史记录
  const getHistory = computed(() => {
    return history
  })

  // 根据索引查找记录
  const getRecordByIndex = (index: number): SingleRecord | undefined => {
    // 返回单条记录或 null
    if (index >= history.value.length || index < 0 || Math.floor(index) !== index) {
      // 越界或者不是整数就不找
      return undefined
    }
    return history.value[index]
  }

  // 根据 UUID 查找记录
  const getRecordByUUID = (uuid: string): SingleRecord | undefined => {
    return history.value.find((item) => item.uuid === uuid)
  }

  // 按索引删除记录
  function deleteRecordByIndex(index: number): void {
    if (index >= history.value.length || index < 0 || Math.floor(index) !== index) {
      // 越界或者不是整数就不删
      return
    }
    history.value.splice(index, 1)
    saveToLocalStorage()
  }

  // 按 UUID 删除记录
  function deleteRecordByUUID(uuid: string): void {
    const index = history.value.findIndex((item) => item.uuid === uuid)
    console.log(1)
    if (index === -1) {
      return
    }
    console.log(2)
    history.value.splice(index, 1)
    console.log(3)
    saveToLocalStorage()
  }

  function clearHistory(): void {
    history.value = []
    saveToLocalStorage()
  }

  function saveToLocalStorage(): void {
    try {
      localStorage.setItem('history', JSON.stringify(history.value))
    } catch (error) {
      console.error('无法保存本地历史记录：', error)
    }
  }
  // 添加记录
  function addRecord(studentList: string[]) {
    const currentTime = new Date()
    const formattedTime = `${currentTime.getFullYear()}.${currentTime.getMonth() + 1}.${currentTime.getDate()} ${currentTime.getHours()}:${currentTime.getMinutes().toString().padStart(2, '0')}:${currentTime.getSeconds().toString().padStart(2, '0')}`
    history.value.splice(0, 0, {
      uuid: uuidv4(),
      timestamp: currentTime.getTime(),
      formattedTime: formattedTime,
      students: studentList,
    })
    saveToLocalStorage()
  }

  // 然后, 统统放出来
  return {
    history,
    getHistory,
    getRecordByIndex,
    getRecordByUUID,
    deleteRecordByIndex,
    deleteRecordByUUID,
    clearHistory,
    addRecord,
  }
})
