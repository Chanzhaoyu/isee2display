<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'
import UpdateNotification from './components/UpdateNotification.vue'

// 应用启动时自动检查更新
onMounted(() => {
  setTimeout(() => {
    if (window.api?.checkForUpdatesAuto && navigator.onLine) {
      window.api.checkForUpdatesAuto()
    }
  }, 3000)
})
</script>

<template>
  <RouterView />
  <UpdateNotification />
</template>
