<template>
  <teleport to="body">
    <!-- 更新提示弹窗 -->
    <div
      v-if="showUpdateDialog"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div class="w-full max-w-md p-6 bg-white rounded-lg shadow-xl">
        <div class="mb-4">
          <h2 class="text-xl font-bold text-gray-800">{{ dialogTitle }}</h2>
          <p class="mt-2 text-gray-600">{{ dialogMessage }}</p>
        </div>

        <!-- 下载进度条 -->
        <div v-if="showProgress" class="mb-4">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm text-gray-600">下载进度</span>
            <span class="text-sm text-gray-600">{{ Math.round(downloadProgress) }}%</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div
              class="bg-blue-600 h-2 rounded-full transition-all duration-300"
              :style="{ width: downloadProgress + '%' }"
            ></div>
          </div>
          <div class="mt-2 text-xs text-gray-500">{{ formatBytes(downloadSpeed) }}/s</div>
        </div>

        <!-- 操作按钮 -->
        <div class="flex justify-end space-x-3">
          <button
            v-if="showCancelButton"
            class="px-4 py-2 text-gray-600 transition-colors bg-gray-200 rounded hover:bg-gray-300"
            @click="closeDialog"
          >
            {{ cancelButtonText }}
          </button>
          <button
            v-if="showConfirmButton"
            class="px-4 py-2 text-white transition-colors bg-blue-600 rounded hover:bg-blue-700"
            :disabled="confirmButtonDisabled"
            @click="confirmAction"
          >
            {{ confirmButtonText }}
          </button>
        </div>
      </div>
    </div>

    <!-- 简单的更新通知 -->
    <div
      v-if="showNotification"
      class="fixed top-4 right-4 z-50 w-80 p-4 bg-white rounded-lg shadow-lg border border-gray-200"
    >
      <div class="flex items-start">
        <div class="flex-shrink-0">
          <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div class="ml-3 flex-1">
          <h3 class="text-sm font-medium text-gray-900">{{ notificationTitle }}</h3>
          <p class="mt-1 text-sm text-gray-600">{{ notificationMessage }}</p>
        </div>
        <button
          class="ml-3 flex-shrink-0 text-gray-400 hover:text-gray-600"
          @click="closeNotification"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// 弹窗相关状态
const showUpdateDialog = ref(false)
const dialogTitle = ref('')
const dialogMessage = ref('')
const showProgress = ref(false)
const downloadProgress = ref(0)
const downloadSpeed = ref(0)
const showCancelButton = ref(true)
const showConfirmButton = ref(true)
const cancelButtonText = ref('取消')
const confirmButtonText = ref('确定')
const confirmButtonDisabled = ref(false)

// 通知相关状态
const showNotification = ref(false)
const notificationTitle = ref('')
const notificationMessage = ref('')

// 当前状态
interface UpdateAction {
  action: 'download' | 'install'
  data?: unknown
}

const currentUpdateInfo = ref<UpdateAction | null>(null)
let notificationTimeout: ReturnType<typeof setTimeout> | null = null

// 格式化字节数
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 关闭弹窗
function closeDialog(): void {
  showUpdateDialog.value = false
  showProgress.value = false
  downloadProgress.value = 0
  downloadSpeed.value = 0
}

// 关闭通知
function closeNotification(): void {
  showNotification.value = false
  if (notificationTimeout) {
    clearTimeout(notificationTimeout)
    notificationTimeout = null
  }
}

// 显示通知
function showSimpleNotification(title: string, message: string, duration = 5000): void {
  notificationTitle.value = title
  notificationMessage.value = message
  showNotification.value = true

  if (notificationTimeout) {
    clearTimeout(notificationTimeout)
  }

  notificationTimeout = setTimeout(() => {
    closeNotification()
  }, duration)
}

// 确认操作
function confirmAction(): void {
  if (currentUpdateInfo.value?.action === 'download') {
    // 开始下载更新
    window.api.startDownloadUpdate()
    dialogTitle.value = '正在下载更新'
    dialogMessage.value = '正在下载最新版本，请稍候...'
    showProgress.value = true
    showConfirmButton.value = false
    cancelButtonText.value = '在后台下载'
  } else if (currentUpdateInfo.value?.action === 'install') {
    // 安装更新并重启
    window.api.quitAndInstall()
  } else {
    closeDialog()
  }
}

// 处理更新消息
function handleUpdaterMessage(message: { type: string; data?: unknown }): void {
  console.log('收到更新消息:', message)

  switch (message.type) {
    case 'checking-for-update':
      showSimpleNotification('检查更新', '正在检查是否有新版本...')
      break

    case 'update-available':
      closeNotification()
      currentUpdateInfo.value = { action: 'download', data: message.data }
      dialogTitle.value = '发现新版本'
      dialogMessage.value = `有新版本可用，是否立即下载？`
      showProgress.value = false
      showCancelButton.value = true
      showConfirmButton.value = true
      confirmButtonText.value = '立即下载'
      cancelButtonText.value = '稍后提醒'
      confirmButtonDisabled.value = false
      showUpdateDialog.value = true
      break

    case 'update-not-available':
      closeNotification()
      showSimpleNotification('已是最新版本', `当前版本已是最新版本`)
      break

    case 'download-progress':
      if (showProgress.value) {
        const progressData = message.data as { percent?: number; bytesPerSecond?: number }
        downloadProgress.value = Number(progressData?.percent) || 0
        downloadSpeed.value = Number(progressData?.bytesPerSecond) || 0
      }
      break

    case 'update-downloaded':
      closeNotification()
      currentUpdateInfo.value = { action: 'install', data: message.data }
      dialogTitle.value = '下载完成'
      dialogMessage.value = '新版本已下载完成，是否立即重启安装？'
      showProgress.value = false
      showCancelButton.value = true
      showConfirmButton.value = true
      confirmButtonText.value = '立即重启'
      cancelButtonText.value = '稍后安装'
      confirmButtonDisabled.value = false
      showUpdateDialog.value = true
      break

    case 'update-error':
      closeNotification()
      showSimpleNotification('更新失败', `更新过程中出现错误: ${message.data}`, 8000)
      closeDialog()
      break
  }
}

onMounted(() => {
  // 监听更新消息
  window.api.onUpdaterMessage(handleUpdaterMessage)
})

onUnmounted(() => {
  // 移除监听器
  window.api.removeUpdaterListener()
  if (notificationTimeout) {
    clearTimeout(notificationTimeout)
  }
})
</script>
