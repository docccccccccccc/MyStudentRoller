<script setup lang="ts">
// 本地化
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

// 管 Element Plus 的组件的时间
import 'dayjs/locale/zh-cn'
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'
import { useHistoryStore } from './stores/history'
import { storeToRefs } from 'pinia'
import { useSettingStore } from './stores/settings'

const historyStore = useHistoryStore()
const { history } = storeToRefs(historyStore)

// 然后从本地读取数据
onMounted(() => {
  // 历史记录
  if(!localStorage.getItem("history")) {
    localStorage.setItem("history", JSON.stringify([]))
  }
  history.value = JSON.parse(localStorage.getItem('history') as string)
  // 背景图
  document.body.style.backgroundImage = `url("${useSettingStore().settings.backgroundImage}")`
})
// 然后是我自己瞎写的组件，放这里
// 以及一些杂七杂八的数据
</script>

<template style="overflow: hidden;">
  <el-config-provider :locale="zhCn">
    <el-container>
      <el-aside width="120px" class="fixed-aside">
          <el-menu collapse router style="height: 100vh">
            <el-menu-item index="/">
              <font-awesome-icon icon="fas fa-dice" />
              <template #title>抽选</template>
            </el-menu-item>
            <el-menu-item index="/history">
              <font-awesome-icon icon="fas fa-clipboard" />
              <template #title>抽选记录</template>
            </el-menu-item>
            <el-menu-item index="/settings">
              <font-awesome-icon icon="fas fa-gear" />
              <template #title>设置</template>
            </el-menu-item>
            <el-menu-item index="/about">
              <font-awesome-icon icon="fas fa-info" />
              <template #title>关于</template>
            </el-menu-item>
            <el-menu-item index="/help">
              <font-awesome-icon icon="fas fa-question" />
              <template #title>帮助</template>
            </el-menu-item>
          </el-menu>
      </el-aside>
      <el-container>
        <el-main id="main">
          <RouterView />
        </el-main>
      </el-container>
    </el-container>
  </el-config-provider>
</template>

<style scoped lang="scss">
body {
  font-family:
    Inter, 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei',
    '微软雅黑', Arial, sans-serif;
}

.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}

#main {
  // padding: 16px;
  margin-left: 120px;
}

.fixed-aside{
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  z-index: 999;
}
</style>
