<template>
  <RouterView />
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useRouter, RouterView } from 'vue-router'

const router = useRouter()

const navigateTo = (_, route: string): void => {
  router.push(route)
}

onMounted(() => {
  window.electron?.ipcRenderer?.on('navigate-to', navigateTo)
})

onUnmounted(() => {
  window.electron?.ipcRenderer?.removeListener('navigate-to', navigateTo)
})
</script>
