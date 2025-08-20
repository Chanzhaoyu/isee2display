<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'
import UpdateNotification from './components/UpdateNotification.vue'

// 应用启动时自动检查更新
onMounted(() => {
  // 延迟3秒后检查更新，让应用完全加载
  setTimeout(() => {
    if (window.api?.checkForUpdatesAuto) {
      window.api.checkForUpdatesAuto()
    }
  }, 5000)
})
</script>

<template>
  <RouterView />
  <UpdateNotification />
</template>
