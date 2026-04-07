<template>
  <div class="w-full">
    <div v-if="isValidUrl" class="relative">
      <div
        v-if="isLoading && isFirstLoad"
        class="absolute inset-0 z-10 flex items-center justify-center bg-white/95 backdrop-blur-sm"
      >
        <div class="flex flex-col items-center">
          <!-- 三点跳动加载动画 -->
          <div class="flex items-end space-x-2 mb-5">
            <div
              class="w-2.5 h-2.5 bg-blue-500 rounded-full loader-dot"
              style="animation-delay: 0ms"
            ></div>
            <div
              class="w-2.5 h-2.5 bg-blue-400 rounded-full loader-dot"
              style="animation-delay: 150ms"
            ></div>
            <div
              class="w-2.5 h-2.5 bg-blue-300 rounded-full loader-dot"
              style="animation-delay: 300ms"
            ></div>
          </div>
          <!-- 进度条 -->
          <div class="w-40 h-0.5 bg-gray-100 rounded-full overflow-hidden">
            <div class="h-full bg-blue-500 rounded-full loader-bar"></div>
          </div>
          <p class="mt-4 text-sm font-medium text-gray-400 tracking-wide">页面加载中</p>
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

    <div
      v-else
      class="flex flex-col items-center justify-center w-full h-screen bg-gradient-to-br from-slate-50 to-blue-50"
    >
      <div class="flex flex-col items-center text-center px-8">
        <!-- 图标 -->
        <div
          class="w-16 h-16 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center mb-6"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-8 h-8 text-gray-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
            />
          </svg>
        </div>
        <h2 class="mb-2 text-xl font-semibold text-gray-700">尚未配置显示链接</h2>
        <p class="mb-8 text-sm text-gray-400 max-w-xs">
          请前往设置页面添加网页地址，配置后将自动加载显示。
        </p>
        <button
          class="flex items-center px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm"
          @click="goToSettings"
        >
          <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
          前往设置
          <kbd class="ml-2 px-1.5 py-0.5 text-xs font-mono bg-blue-500 rounded">Ctrl+,</kbd>
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

const webviewUrl = ref('')

const isValidUrl = ref(false)

const isLoading = ref(true)

const isFirstLoad = ref(true)

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
    isValidUrl.value = false
  }
}

function goToSettings(): void {
  router.push('/settings')
}

function handleStartLoading(): void {
  if (isFirstLoad.value) {
    isLoading.value = true
  }
}

function handleStopLoading(): void {
  isLoading.value = false
  if (isFirstLoad.value) {
    isFirstLoad.value = false
  }
}

function handleDomReady(): void {
  setTimeout(() => {
    isLoading.value = false
    if (isFirstLoad.value) {
      isFirstLoad.value = false
    }
  }, 500)
}

onMounted(() => {
  loadSavedUrl()
  if (isValidUrl.value) {
    isFirstLoad.value = true
    isLoading.value = true
  }
})
</script>

<style scoped>
.loader-dot {
  animation: dotBounce 0.8s ease-in-out infinite alternate;
}

@keyframes dotBounce {
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(-8px);
    opacity: 0.4;
  }
}

.loader-bar {
  animation: barSlide 1.4s ease-in-out infinite;
}

@keyframes barSlide {
  0% {
    width: 0%;
    margin-left: 0%;
  }
  50% {
    width: 60%;
    margin-left: 20%;
  }
  100% {
    width: 0%;
    margin-left: 100%;
  }
}
</style>
