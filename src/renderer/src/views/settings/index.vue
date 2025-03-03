<template>
  <div class="min-h-screen p-6 bg-gray-50">
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-2xl font-bold text-gray-800">设置</h1>
      <button
        class="flex items-center px-4 py-2 text-gray-700 transition-colors bg-gray-200 rounded-lg hover:bg-gray-300"
        @click="goHome"
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
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
        返回首页（Ctrl + h）
      </button>
    </div>

    <div class="p-6 bg-white rounded-lg shadow">
      <h2 class="mb-4 text-lg font-semibold text-gray-700">网页 URL 设置</h2>
      <div class="mb-6">
        <label for="url" class="block mb-1 text-sm font-medium text-gray-700">网页地址</label>
        <div class="flex">
          <input
            id="url"
            v-model="url"
            type="url"
            placeholder="请输入网页URL，例如 https://example.com"
            class="flex-grow px-4 py-2 border border-gray-300 rounded-l-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            class="px-4 py-2 font-medium text-white transition-colors bg-blue-600 rounded-r-lg hover:bg-blue-700"
            @click="saveUrl"
          >
            保存
          </button>
        </div>
        <p class="mt-1 text-sm text-gray-500">当前保存的URL: {{ savedUrl || '未设置' }}</p>
      </div>

      <div class="pt-4 mt-6 border-t border-gray-200">
        <button
          class="px-4 py-2 transition-colors border rounded-lg text-rose-700 border-rose-300 bg-rose-50"
          @click="clearUrl"
        >
          清除URL设置
        </button>
      </div>
    </div>

    <div class="p-6 mt-6 bg-white rounded-lg shadow">
      <h2 class="mb-4 text-lg font-semibold text-gray-700">系统设置</h2>
      <div class="flex items-center mb-4">
        <input
          id="autoStart"
          v-model="autoLaunch"
          type="checkbox"
          class="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          @change="toggleAutoLaunch"
        />
        <label for="autoStart" class="ml-2 text-sm font-medium text-gray-700"> 开机自动启动 </label>
      </div>
      <p class="text-sm text-gray-500">启用此选项后，系统启动时将自动运行</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const LOCAL_STORAGE_URL_KEY = 'display-url'

const url = ref('')
const savedUrl = ref('')
const autoLaunch = ref(false)

function loadSavedUrl(): void {
  const storedUrl = localStorage.getItem(LOCAL_STORAGE_URL_KEY)
  if (storedUrl) {
    savedUrl.value = storedUrl
    url.value = storedUrl
  }
}

function saveUrl(): void {
  if (!url.value) {
    alert('请输入有效的URL')
    return
  }

  try {
    new URL(url.value)
    localStorage.setItem(LOCAL_STORAGE_URL_KEY, url.value)
    savedUrl.value = url.value
    alert('URL已保存成功')
  } catch {
    alert('请输入有效的URL格式')
  }
}

function clearUrl(): void {
  localStorage.removeItem(LOCAL_STORAGE_URL_KEY)
  url.value = ''
  savedUrl.value = ''
  alert('URL设置已清除')
}

function goHome(): void {
  router.push('/')
}

async function loadAutoLaunchStatus(): Promise<void> {
  try {
    autoLaunch.value = await window.api.getAutoLaunchStatus()
  } catch (error) {
    console.error('Failed to get auto launch status:', error)
  }
}

async function toggleAutoLaunch(): Promise<void> {
  try {
    autoLaunch.value = await window.api.setAutoLaunch(autoLaunch.value)
  } catch (error) {
    console.error('Failed to set auto launch status:', error)
  }
}

onMounted(() => {
  loadSavedUrl()
  loadAutoLaunchStatus()
})
</script>
