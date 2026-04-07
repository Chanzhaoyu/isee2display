<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
    <!-- 顶部标题栏（毛玻璃效果） -->
    <div class="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-gray-100 px-6 py-3">
      <div class="flex items-center justify-between max-w-4xl mx-auto">
        <div class="flex items-center space-x-3">
          <div class="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg
              class="w-3.5 h-3.5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
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
          </div>
          <h1 class="text-base font-semibold text-gray-800">设置</h1>
        </div>
        <button
          class="flex items-center px-3 py-1.5 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          @click="goHome"
        >
          <svg class="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          返回首页
          <kbd
            class="ml-2 px-1.5 py-0.5 text-xs font-mono bg-white border border-gray-200 rounded shadow-sm"
            >{{ shortcutHome }}</kbd
          >
        </button>
      </div>
    </div>

    <!-- 主内容区域 -->
    <div class="max-w-4xl mx-auto px-6 py-6 space-y-4">
      <!-- URL 设置卡片 -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="flex items-center px-6 py-4 border-b border-gray-50">
          <div class="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center mr-3">
            <svg
              class="w-4 h-4 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
          </div>
          <h2 class="font-semibold text-gray-800">网页地址</h2>
        </div>
        <div class="px-6 py-5">
          <label for="url" class="block mb-2 text-sm font-medium text-gray-600">显示链接</label>
          <div
            class="flex rounded-xl overflow-hidden border border-gray-200 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all"
          >
            <input
              id="url"
              v-model="url"
              type="url"
              placeholder="https://example.com"
              class="flex-grow px-4 py-2.5 text-sm outline-none bg-white min-w-0"
            />
            <button
              class="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors whitespace-nowrap"
              @click="saveUrl"
            >
              保存
            </button>
          </div>
          <div class="flex items-center justify-between mt-3">
            <div class="flex items-center space-x-1.5 min-w-0">
              <span class="text-xs text-gray-400 shrink-0">当前：</span>
              <span class="text-xs text-gray-600 font-mono truncate">{{
                savedUrl || '未设置'
              }}</span>
            </div>
            <button
              v-if="savedUrl"
              class="ml-3 text-xs text-rose-500 hover:text-rose-700 transition-colors shrink-0"
              @click="clearUrl"
            >
              清除
            </button>
          </div>
        </div>
      </div>

      <!-- 系统设置卡片 -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="flex items-center px-6 py-4 border-b border-gray-50">
          <div class="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center mr-3">
            <svg
              class="w-4 h-4 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-2"
              />
            </svg>
          </div>
          <h2 class="font-semibold text-gray-800">系统</h2>
        </div>
        <div class="divide-y divide-gray-50">
          <div class="flex items-center justify-between px-6 py-4">
            <div>
              <p class="text-sm font-medium text-gray-800">开机自动启动</p>
              <p class="text-xs text-gray-400 mt-0.5">系统启动时自动运行应用</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                id="autoStart"
                v-model="autoLaunch"
                type="checkbox"
                class="sr-only peer"
                @change="toggleAutoLaunch"
              />
              <div
                class="w-10 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-4 peer-checked:after:border-white"
              ></div>
            </label>
          </div>
          <div class="flex items-center justify-between px-6 py-4">
            <div>
              <p class="text-sm font-medium text-gray-800">默认全屏显示</p>
              <p class="text-xs text-gray-400 mt-0.5">启动时自动全屏（F11 / Esc 退出）</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                id="fullScreen"
                v-model="fullScreenDefault"
                type="checkbox"
                class="sr-only peer"
                @change="toggleFullScreenDefault"
              />
              <div
                class="w-10 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-4 peer-checked:after:border-white"
              ></div>
            </label>
          </div>
        </div>
      </div>

      <!-- 应用更新卡片 -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="flex items-center px-6 py-4 border-b border-gray-50">
          <div class="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center mr-3">
            <svg
              class="w-4 h-4 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
              />
            </svg>
          </div>
          <h2 class="font-semibold text-gray-800">应用更新</h2>
        </div>
        <div class="px-6 py-5">
          <div class="flex items-center justify-between mb-4">
            <div>
              <p class="text-sm font-medium text-gray-800">当前版本</p>
              <p class="text-xs text-gray-400 mt-0.5">iSee 浏览器</p>
            </div>
            <span
              class="px-2.5 py-1 text-sm font-mono font-medium text-blue-700 bg-blue-50 rounded-lg"
              >v{{ appVersion }}</span
            >
          </div>
          <div class="flex items-center space-x-3">
            <button
              class="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-lg transition-colors"
              :disabled="updateStatus === 'checking'"
              @click="checkForUpdates"
            >
              <svg
                v-if="updateStatus !== 'checking'"
                class="w-4 h-4 mr-1.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <svg v-else class="w-4 h-4 mr-1.5 animate-spin" fill="none" viewBox="0 0 24 24">
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
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                ></path>
              </svg>
              {{ updateStatus === 'checking' ? '检查中...' : '检查更新' }}
            </button>
            <div
              v-if="updateStatus && updateStatus !== 'checking'"
              class="flex items-center space-x-1.5"
            >
              <div
                class="w-1.5 h-1.5 rounded-full"
                :class="{
                  'bg-green-500': updateStatus === 'latest',
                  'bg-orange-500': updateStatus === 'available',
                  'bg-red-500': updateStatus === 'error'
                }"
              ></div>
              <span class="text-sm text-gray-500">{{ updateStatusText }}</span>
            </div>
          </div>
          <div
            v-if="updateInfo && updateInfo.hasUpdate"
            class="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-blue-800">
                  发现新版本 <span class="font-mono">v{{ updateInfo.latestVersion }}</span>
                </p>
                <p v-if="updateInfo.releaseNotes" class="mt-1 text-xs text-blue-600">
                  {{ updateInfo.releaseNotes }}
                </p>
              </div>
              <button
                class="ml-4 px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors whitespace-nowrap"
                @click="startUpdate"
              >
                立即更新
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 设备信息卡片 -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="flex items-center px-6 py-4 border-b border-gray-50">
          <div class="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center mr-3">
            <svg
              class="w-4 h-4 text-orange-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18"
              />
            </svg>
          </div>
          <h2 class="font-semibold text-gray-800">设备信息</h2>
        </div>
        <div class="px-6 py-5">
          <p class="text-xs font-medium text-gray-400 mb-3 uppercase tracking-wide">
            网络接口 MAC 地址
          </p>
          <div v-if="macAddresses.length > 0" class="space-y-2">
            <div
              v-for="(mac, index) in macAddresses"
              :key="index"
              class="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-xl group transition-colors"
            >
              <div class="min-w-0 flex-1">
                <span class="text-xs text-gray-400">{{ mac.split(': ')[0] }}</span>
                <div class="flex items-center flex-wrap gap-x-3 mt-0.5">
                  <code class="text-sm font-mono text-gray-700">{{
                    mac.split(': ')[1] || mac
                  }}</code>
                  <span class="text-xs font-mono text-gray-400">{{
                    formatMacWithoutColons(mac).split(': ')[1]
                  }}</span>
                </div>
              </div>
              <button
                class="ml-3 p-1.5 text-gray-300 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-all opacity-0 group-hover:opacity-100"
                title="复制 MAC 地址"
                @click="copyMac(mac)"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </button>
            </div>
          </div>
          <div v-else class="flex items-center justify-center py-8 text-gray-400 text-sm">
            <svg class="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
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
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              ></path>
            </svg>
            正在获取...
          </div>
        </div>
      </div>
    </div>

    <!-- Toast 提示 -->
    <transition name="toast">
      <div
        v-if="toastMessage"
        class="fixed bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-gray-800 text-white text-sm rounded-full shadow-lg pointer-events-none whitespace-nowrap"
      >
        {{ toastMessage }}
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const LOCAL_STORAGE_URL_KEY = 'display-url'

const url = ref('')
const savedUrl = ref('')
const autoLaunch = ref(false)
const fullScreenDefault = ref(false)

const macAddresses = ref<string[]>([])

const appVersion = ref('')
const updateStatus = ref<'checking' | 'latest' | 'available' | 'error' | ''>('')
const updateInfo = ref<{
  hasUpdate: boolean
  currentVersion: string
  latestVersion?: string
  releaseNotes?: string
} | null>(null)

// Toast 通知
const toastMessage = ref('')
let toastTimer: ReturnType<typeof setTimeout> | null = null

function showToast(msg: string): void {
  toastMessage.value = msg
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    toastMessage.value = ''
  }, 2500)
}

// 平台快捷键提示
const isMac = process.platform === 'darwin'
const shortcutHome = computed(() => (isMac ? 'Cmd+Shift+H' : 'Ctrl+Shift+H'))

// 更新状态文本
const updateStatusText = computed(() => {
  switch (updateStatus.value) {
    case 'checking':
      return '正在检查更新...'
    case 'latest':
      return '已是最新版本'
    case 'available':
      return '有新版本可用'
    case 'error':
      return '检查更新失败'
    default:
      return ''
  }
})

function loadSavedUrl(): void {
  const storedUrl = localStorage.getItem(LOCAL_STORAGE_URL_KEY)
  if (storedUrl) {
    savedUrl.value = storedUrl
    url.value = storedUrl
  }
}

function saveUrl(): void {
  if (!url.value) {
    showToast('请输入有效的 URL')
    return
  }

  try {
    new URL(url.value)
    localStorage.setItem(LOCAL_STORAGE_URL_KEY, url.value)
    savedUrl.value = url.value
    showToast('URL 已保存')
  } catch {
    showToast('URL 格式不正确')
  }
}

function clearUrl(): void {
  localStorage.removeItem(LOCAL_STORAGE_URL_KEY)
  url.value = ''
  savedUrl.value = ''
  showToast('URL 已清除')
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
  if (window.api.getFullScreenDefault) {
    window.api
      .getFullScreenDefault()
      .then((value) => {
        fullScreenDefault.value = value
      })
      .catch((error) => {
        console.error('获取全屏设置失败:', error)
      })
  }
}

async function toggleFullScreenDefault(): Promise<void> {
  try {
    await window.api.setFullScreenDefault(fullScreenDefault.value)
  } catch (error) {
    console.error('设置全屏模式失败:', error)
  }
}

function formatMacWithoutColons(macAddress: string): string {
  const parts = macAddress.split(': ')
  if (parts.length >= 2) {
    return `${parts[0]}: ${parts[1].replace(/:/g, '')}`
  }
  return macAddress.replace(/:/g, '')
}

async function copyMac(mac: string): Promise<void> {
  const rawMac = mac.split(': ')[1] || mac
  try {
    await navigator.clipboard.writeText(rawMac)
    showToast('已复制到剪贴板')
  } catch {
    showToast('复制失败')
  }
}

async function loadMacAddress(): Promise<void> {
  try {
    macAddresses.value = await window.api.getMacAddress()
  } catch (error) {
    console.error('获取MAC地址失败:', error)
  }
}

async function loadAppVersion(): Promise<void> {
  try {
    appVersion.value = await window.api.getAppVersion()
  } catch (error) {
    console.error('获取应用版本失败:', error)
    appVersion.value = '未知版本'
  }
}

async function checkForUpdates(): Promise<void> {
  if (updateStatus.value === 'checking') return

  updateStatus.value = 'checking'
  updateInfo.value = null

  try {
    const result = await window.api.checkForUpdates()
    updateInfo.value = result

    if (result.hasUpdate) {
      updateStatus.value = 'available'
    } else {
      updateStatus.value = 'latest'
      setTimeout(() => {
        updateStatus.value = ''
      }, 3000)
    }
  } catch (error) {
    console.error('检查更新失败:', error)
    updateStatus.value = 'error'
    setTimeout(() => {
      updateStatus.value = ''
    }, 3000)
  }
}

function startUpdate(): void {
  window.api.startDownloadUpdate()
}

onMounted(() => {
  loadSavedUrl()
  loadAutoLaunchStatus()
  loadMacAddress()
  loadFullScreenSetting()
  loadAppVersion()
})
</script>

<style scoped>
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

.toast-enter-active,
.toast-leave-active {
  transition: all 0.25s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(12px);
}
</style>
