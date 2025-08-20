import {
  getMacAddress,
  setAutoLaunch,
  getAutoLaunchStatus,
  setFullScreenDefault,
  getFullScreenDefault
} from './utils'
import {
  checkForUpdates,
  checkForUpdatesManual,
  downloadUpdate,
  quitAndInstall,
  getCurrentVersion,
  checkForUpdatesManually
} from './updater'
import { ipcMain } from 'electron'

export function ipcMainSetup(): void {
  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  ipcMain.handle('get-auto-launch-status', () => {
    return getAutoLaunchStatus()
  })

  ipcMain.handle('set-auto-launch', (_, enable) => {
    setAutoLaunch(enable)
    return getAutoLaunchStatus()
  })

  ipcMain.handle('get-mac-address', () => {
    return getMacAddress()
  })

  ipcMain.handle('set-fullscreen-default', (_, enable) => {
    setFullScreenDefault(enable)
  })

  ipcMain.handle('get-fullscreen-default', () => {
    return getFullScreenDefault()
  })

  // 自动更新相关 IPC 处理器
  ipcMain.handle('get-app-version', () => {
    return getCurrentVersion()
  })

  ipcMain.handle('check-for-updates', async () => {
    try {
      return await checkForUpdatesManually()
    } catch (error) {
      console.error('检查更新失败:', error)
      throw error
    }
  })

  ipcMain.handle('start-download-update', () => {
    downloadUpdate()
  })

  ipcMain.handle('quit-and-install', () => {
    quitAndInstall()
  })

  ipcMain.handle('check-for-updates-auto', () => {
    checkForUpdates()
  })

  ipcMain.handle('check-for-updates-manual', () => {
    checkForUpdatesManual()
  })
}
