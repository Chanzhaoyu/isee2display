import {
  getMacAddress,
  setAutoLaunch,
  getAutoLaunchStatus,
  setFullScreenDefault,
  getFullScreenDefault
} from './utils'
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
}
