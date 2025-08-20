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

      <div class="flex items-center mt-6 mb-4">
        <input
          id="fullScreen"
          v-model="fullScreenDefault"
          type="checkbox"
          class="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          @change="toggleFullScreenDefault"
        />
        <label for="fullScreen" class="ml-2 text-sm font-medium text-gray-700">
          默认全屏显示
        </label>
      </div>
      <p class="text-sm text-gray-500">
        启用此选项后，应用启动时将自动全屏显示（按 F11 或 Esc 退出全屏）
      </p>
    </div>

    <div class="p-6 mt-6 bg-white rounded-lg shadow">
      <h2 class="mb-4 text-lg font-semibold text-gray-700">设备信息</h2>

      <div class="mb-4">
        <h3 class="mb-2 text-sm font-medium text-gray-700">MAC地址</h3>
        <div class="grid grid-cols-2 gap-4">
          <!-- 左侧：原始MAC地址 -->
          <div>
            <h4 class="mb-2 text-xs font-medium text-gray-500">标准格式</h4>
            <div v-if="macAddresses.length > 0">
              <div
                v-for="(mac, index) in macAddresses"
                :key="`original-${index}`"
                class="p-2 mb-1 text-sm rounded bg-gray-50"
              >
                {{ mac }}
              </div>
            </div>
            <div v-else class="p-2 mb-1 text-sm rounded bg-gray-50">正在获取MAC地址...</div>
          </div>

          <!-- 右侧：无冒号MAC地址 -->
          <div>
            <h4 class="mb-2 text-xs font-medium text-gray-500">无分隔符格式</h4>
            <div v-if="macAddresses.length > 0">
              <div
                v-for="(mac, index) in macAddresses"
                :key="`no-colon-${index}`"
                class="p-2 mb-1 text-sm rounded bg-gray-50"
              >
                {{ formatMacWithoutColons(mac) }}
              </div>
            </div>
            <div v-else class="p-2 mb-1 text-sm rounded bg-gray-50">正在获取MAC地址...</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const LOCAL_STORAGE_URL_KEY = 'display-url'
const LOCAL_STORAGE_FULLSCREEN_KEY = 'display-fullscreen-default'

const url = ref('')
const savedUrl = ref('')
const autoLaunch = ref(false)
const fullScreenDefault = ref(false)

// 添加MAC地址相关变量
const macAddresses = ref<string[]>([])

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

function loadFullScreenSetting(): void {
  const stored = localStorage.getItem(LOCAL_STORAGE_FULLSCREEN_KEY)
  if (stored !== null) {
    fullScreenDefault.value = stored === 'true'
  } else {
    // 如果本地存储中没有设置，从主进程获取
    if (window.api.getFullScreenDefault) {
      window.api
        .getFullScreenDefault()
        .then((value) => {
          fullScreenDefault.value = value
          localStorage.setItem(LOCAL_STORAGE_FULLSCREEN_KEY, value.toString())
        })
        .catch((error) => {
          console.error('获取全屏设置失败:', error)
        })
    }
  }
}

async function toggleFullScreenDefault(): Promise<void> {
  try {
    localStorage.setItem(LOCAL_STORAGE_FULLSCREEN_KEY, fullScreenDefault.value.toString())
    // 通知主进程更新全屏设置
    await window.api.setFullScreenDefault(fullScreenDefault.value)
  } catch (error) {
    console.error('设置全屏模式失败:', error)
  }
}

function formatMacWithoutColons(macAddress: string): string {
  // 分割字符串以处理类似 "eth0: aa:bb:cc:dd:ee:ff" 这样的格式
  const parts = macAddress.split(': ')
  if (parts.length >= 2) {
    const interfaceName = parts[0]
    const macWithColons = parts[1]
    const macWithoutColons = macWithColons.replace(/:/g, '')
    return `${interfaceName}: ${macWithoutColons}`
  }
  // 如果没有找到预期的格式，返回原始字符串但移除所有冒号
  return macAddress.replace(/:/g, '')
}

async function loadMacAddress(): Promise<void> {
  try {
    macAddresses.value = await window.api.getMacAddress()
  } catch (error) {
    console.error('获取MAC地址失败:', error)
  }
}

onMounted(() => {
  loadSavedUrl()
  loadAutoLaunchStatus()
  loadMacAddress()
  loadFullScreenSetting()
})
</script>
