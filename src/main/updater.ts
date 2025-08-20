import { autoUpdater } from 'electron-updater'
import { BrowserWindow, app } from 'electron'
import { is } from '@electron-toolkit/utils'

let mainWindow: BrowserWindow | null = null
let isManualCheck = false

// 获取用户友好的错误消息
function getErrorMessage(error: Error): string {
  const message = error.message.toLowerCase()

  if (message.includes('network') || message.includes('timeout')) {
    return '网络连接失败，请检查网络连接后重试'
  } else if (message.includes('permission') || message.includes('access')) {
    return '权限不足，请以管理员身份运行应用'
  } else if (message.includes('signature') || message.includes('verify')) {
    return '更新包验证失败，请稍后重试'
  } else if (message.includes('disk') || message.includes('space')) {
    return '磁盘空间不足，请清理磁盘空间后重试'
  } else {
    return `更新失败: ${error.message}`
  }
}

// 设置更新相关配置
export function setupUpdater(window: BrowserWindow): void {
  mainWindow = window

  // 配置自动更新器
  autoUpdater.autoDownload = false // 不自动下载，需要用户确认
  autoUpdater.autoInstallOnAppQuit = true // 应用退出时自动安装

  // 开发环境下不检查更新
  if (is.dev && !process.env.DEBUG_UPDATER) {
    console.log('开发环境，跳过自动更新检查')
    return
  }

  // 监听更新事件
  setupUpdateEvents()
}

// 设置更新事件监听器
function setupUpdateEvents(): void {
  // 检查更新出错
  autoUpdater.on('error', (error) => {
    console.error('更新出错:', error)
    const errorMessage = getErrorMessage(error)
    sendUpdateMessage('update-error', errorMessage, isManualCheck)
  })

  // 检查更新
  autoUpdater.on('checking-for-update', () => {
    console.log('正在检查更新...')
    sendUpdateMessage('checking-for-update', undefined, isManualCheck)
  })

  // 发现可用更新
  autoUpdater.on('update-available', (info) => {
    console.log('发现新版本:', info.version)
    sendUpdateMessage('update-available', info, isManualCheck)
  })

  // 没有可用更新
  autoUpdater.on('update-not-available', (info) => {
    console.log('已是最新版本:', info.version)
    sendUpdateMessage('update-not-available', info, isManualCheck)
  })

  // 更新下载进度
  autoUpdater.on('download-progress', (progressObj) => {
    console.log('下载进度:', Math.round(progressObj.percent) + '%')
    sendUpdateMessage('download-progress', progressObj, isManualCheck)
  })

  // 更新下载完成
  autoUpdater.on('update-downloaded', (info) => {
    console.log('更新下载完成:', info.version)
    sendUpdateMessage('update-downloaded', info, isManualCheck)
  })
}

// 向渲染进程发送更新消息
function sendUpdateMessage(type: string, data?: unknown, isManual = false): void {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('updater-message', { type, data, isManual })
  }
}

// 检查更新
export function checkForUpdates(): void {
  isManualCheck = false

  if (is.dev && !process.env.DEBUG_UPDATER) {
    console.log('开发环境，跳过更新检查')
    sendUpdateMessage('update-not-available', { version: '开发版本' }, isManualCheck)
    return
  }

  try {
    autoUpdater.checkForUpdates()
  } catch (error) {
    console.error('启动更新检查失败:', error)
    sendUpdateMessage('update-error', getErrorMessage(error as Error), isManualCheck)
  }
}

// 下载更新
export function downloadUpdate(): void {
  if (is.dev && !process.env.DEBUG_UPDATER) {
    console.log('开发环境，无法下载更新')
    return
  }

  try {
    autoUpdater.downloadUpdate()
  } catch (error) {
    console.error('启动下载失败:', error)
    sendUpdateMessage('update-error', getErrorMessage(error as Error))
  }
}

// 安装更新并重启
export function quitAndInstall(): void {
  if (is.dev && !process.env.DEBUG_UPDATER) {
    console.log('开发环境，无法安装更新')
    return
  }

  try {
    autoUpdater.quitAndInstall()
  } catch (error) {
    console.error('启动安装失败:', error)
    sendUpdateMessage('update-error', getErrorMessage(error as Error))
  }
}

// 获取当前版本信息
export function getCurrentVersion(): string {
  try {
    // 使用 electron 的 app.getVersion() 获取版本号
    // 这会自动读取 package.json 中的 version 字段
    return app.getVersion()
  } catch (error) {
    console.error('获取版本号失败:', error)
    return '1.0.0'
  }
}

// 手动检查更新（用于设置页面）
export async function checkForUpdatesManually(): Promise<{
  hasUpdate: boolean
  currentVersion: string
  latestVersion?: string
  releaseNotes?: string
}> {
  isManualCheck = true
  const currentVersion = getCurrentVersion()

  if (is.dev && !process.env.DEBUG_UPDATER) {
    return {
      hasUpdate: false,
      currentVersion: '开发版本',
      latestVersion: '开发版本'
    }
  }

  try {
    const result = await autoUpdater.checkForUpdates()

    if (result?.updateInfo) {
      const latestVersion = result.updateInfo.version
      const hasUpdate = latestVersion !== currentVersion

      return {
        hasUpdate,
        currentVersion,
        latestVersion,
        releaseNotes: result.updateInfo.releaseNotes as string
      }
    }

    return {
      hasUpdate: false,
      currentVersion
    }
  } catch (error) {
    console.error('检查更新失败:', error)
    throw new Error(getErrorMessage(error as Error))
  }
}

// 手动检查更新（用于菜单栏或按钮触发）
export function checkForUpdatesManual(): void {
  isManualCheck = true

  if (is.dev && !process.env.DEBUG_UPDATER) {
    console.log('开发环境，跳过更新检查')
    sendUpdateMessage('update-not-available', { version: '开发版本' }, isManualCheck)
    return
  }

  try {
    autoUpdater.checkForUpdates()
  } catch (error) {
    console.error('启动更新检查失败:', error)
    sendUpdateMessage('update-error', getErrorMessage(error as Error), isManualCheck)
  }
}
