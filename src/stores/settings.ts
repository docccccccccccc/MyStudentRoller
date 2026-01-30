import { defineStore } from "pinia";
import { ref, watch } from 'vue'

interface Settings {
  animation: {
    enabled: boolean,
    interval: number,
    duration: number,
  },
  title: string,
  panelPosition: 'left' | 'right' | 'top' | 'bottom',
  opacity: number,
  backgroundImage: string
}

export const defaultSettings: Settings = {
    animation: {
      enabled: true,
      interval: 50,
      duration: 5,
    },
    title: '',
    panelPosition: 'right',
    opacity: 100,
    backgroundImage: ''
  }

export const useSettingStore = defineStore('settingStore', () => {
  const savedSettings = localStorage.getItem("settings")
  const parsedSettings: Settings = savedSettings ? (JSON.parse(savedSettings) as Settings) : defaultSettings
  const settings = ref<Settings>(parsedSettings)

  watch(settings, (newSettings: Settings) => {
    localStorage.setItem('settings', JSON.stringify(newSettings))
  }, {deep: true})

  function resetSettings() {
    settings.value = defaultSettings
  }

  return { settings, resetSettings }
})
