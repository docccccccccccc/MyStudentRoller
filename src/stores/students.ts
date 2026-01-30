import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export const defaultStudentList = [
    '路人 1',
    '路人 2',
    '路人 3',
    '路人 4',
    '路人 5',
    '路人 6',
    '路人 7',
    '路人 8',
    '路人 9',
    '路人 10',
    '路人 11',
    '路人 12',
    '路人 13',
    '路人 14',
    '路人 15',
    '路人 16',
    '路人 17',
    '路人 18',
    '路人 19',
    '路人 20',
    '路人 21',
    '路人 22',
    '路人 23',
    '路人 24',
  ]

export const useStudentsStore = defineStore('students', () => {
  const savedStudentList = localStorage.getItem('students')
  const parsedStudentList = savedStudentList ? JSON.parse(savedStudentList) : defaultStudentList
  const students = ref<string[]>(parsedStudentList)
  const getStudentList = computed(() => {
    return students.value
  })
  function setStudentList(list: string[]): void {
    students.value = [...list]
    localStorage.setItem('students', JSON.stringify(list))
  }

  function resetStudentList() {
    students.value = defaultStudentList
    localStorage.setItem('students', JSON.stringify(students.value))
  }

  return { students, getStudentList, setStudentList, resetStudentList }
})
