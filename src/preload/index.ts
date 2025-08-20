import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  getAutoLaunchStatus: (): Promise<boolean> => ipcRenderer.invoke('get-auto-launch-status'),
  setAutoLaunch: (enable: boolean): Promise<boolean> =>
    ipcRenderer.invoke('set-auto-launch', enable),
  // 添加获取MAC地址
  getMacAddress: (): Promise<string[]> => ipcRenderer.invoke('get-mac-address'),
  // 添加全屏设置相关API
  setFullScreenDefault: (enable: boolean): Promise<void> =>
    ipcRenderer.invoke('set-fullscreen-default', enable),
  getFullScreenDefault: (): Promise<boolean> => ipcRenderer.invoke('get-fullscreen-default'),

  // 自动更新相关API
  getAppVersion: (): Promise<string> => ipcRenderer.invoke('get-app-version'),
  checkForUpdates: (): Promise<{
    hasUpdate: boolean
    currentVersion: string
    latestVersion?: string
    releaseNotes?: string
  }> => ipcRenderer.invoke('check-for-updates'),
  startDownloadUpdate: (): Promise<void> => ipcRenderer.invoke('start-download-update'),
  quitAndInstall: (): Promise<void> => ipcRenderer.invoke('quit-and-install'),
  checkForUpdatesAuto: (): Promise<void> => ipcRenderer.invoke('check-for-updates-auto'),
  checkForUpdatesManual: (): Promise<void> => ipcRenderer.invoke('check-for-updates-manual'),

  // 监听更新消息
  onUpdaterMessage: (callback: (message: unknown) => void): void => {
    ipcRenderer.on('updater-message', (_, message) => callback(message))
  },

  // 移除更新消息监听器
  removeUpdaterListener: (): void => {
    ipcRenderer.removeAllListeners('updater-message')
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
