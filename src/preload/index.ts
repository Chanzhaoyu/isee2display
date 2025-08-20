import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  getAutoLaunchStatus: (): Promise<unknown> => ipcRenderer.invoke('get-auto-launch-status'),
  setAutoLaunch: (enable: boolean): Promise<unknown> =>
    ipcRenderer.invoke('set-auto-launch', enable),
  // 添加获取MAC地址
  getMacAddress: (): Promise<string[]> => ipcRenderer.invoke('get-mac-address'),
  // 添加全屏设置相关API
  setFullScreenDefault: (enable: boolean): Promise<void> =>
    ipcRenderer.invoke('set-fullscreen-default', enable),
  getFullScreenDefault: (): Promise<boolean> => ipcRenderer.invoke('get-fullscreen-default')
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
