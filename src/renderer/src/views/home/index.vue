<template>
  <div class="w-full">
    <div v-if="isValidUrl" class="relative">
      <!-- 加载遮罩层 -->
      <div
        v-if="isLoading"
        class="absolute inset-0 z-10 flex items-center justify-center bg-white bg-opacity-90"
      >
        <div class="flex flex-col items-center">
          <!-- 加载动画 -->
          <svg
            class="w-16 h-16 mb-4 text-blue-600 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p class="text-lg font-medium text-gray-700">页面加载中...</p>
        </div>
      </div>

      <!-- webview组件 -->
      <webview
        :src="webviewUrl"
        style="width: 100%; height: 100vh"
        @did-start-loading="handleStartLoading"
        @did-stop-loading="handleStopLoading"
        @dom-ready="handleDomReady"
      ></webview>
    </div>

    <div v-else class="flex flex-col items-center justify-center w-full h-screen bg-gray-100">
      <div class="max-w-xl p-8 text-center bg-white rounded-lg shadow-lg">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-16 h-16 mx-auto mb-4 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <h2 class="mb-2 text-2xl font-bold text-gray-800">未设置有效链接</h2>
        <p class="mb-6 text-gray-600">请前往设置页面配置有效的网页链接，以便正常显示内容。</p>
        <button
          class="flex items-center justify-center px-6 py-3 mx-auto font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
          @click="goToSettings"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-5 h-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          前往设置（Ctrl + ,）
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const LOCAL_STORAGE_URL_KEY = 'display-url'

const defaultUrl = ''
const webviewUrl = ref('')
const isValidUrl = ref(false)
const isLoading = ref(true) // 加载状态标志

function validateUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

function loadSavedUrl(): void {
  const savedUrl = localStorage.getItem(LOCAL_STORAGE_URL_KEY)

  if (savedUrl && validateUrl(savedUrl)) {
    webviewUrl.value = savedUrl
    isValidUrl.value = true
  } else {
    if (validateUrl(defaultUrl)) {
      webviewUrl.value = defaultUrl
      isValidUrl.value = true
    } else {
      isValidUrl.value = false
    }
  }
}

function goToSettings(): void {
  router.push('/settings')
}

// 处理webview加载开始
function handleStartLoading(): void {
  isLoading.value = true
}

// 处理webview加载结束
function handleStopLoading(): void {
  isLoading.value = false
}

// 处理webview DOM就绪 - 作为备份的加载结束检测
function handleDomReady(): void {
  // 设置一个短暂延迟以确保页面渲染完成
  setTimeout(() => {
    isLoading.value = false
  }, 500)
}

onMounted(() => {
  loadSavedUrl()
})
</script>

<style scoped>
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
