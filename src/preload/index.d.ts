import { ElectronAPI } from '@electron-toolkit/preload'

interface UpdateInfo {
  hasUpdate: boolean
  currentVersion: string
  latestVersion?: string
  releaseNotes?: string
}

interface UpdateMessage {
  type: string
  data?: unknown
  isManual?: boolean
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      getAutoLaunchStatus: () => Promise<boolean>
      setAutoLaunch: (enable: boolean) => Promise<boolean>
      getMacAddress: () => Promise<string[]>
      setFullScreenDefault: (enable: boolean) => Promise<void>
      getFullScreenDefault: () => Promise<boolean>
      // 自动更新相关 API
      getAppVersion: () => Promise<string>
      checkForUpdates: () => Promise<UpdateInfo>
      startDownloadUpdate: () => Promise<void>
      quitAndInstall: () => Promise<void>
      checkForUpdatesAuto: () => Promise<void>
      checkForUpdatesManual: () => Promise<void>
      onUpdaterMessage: (callback: (message: UpdateMessage) => void) => void
      removeUpdaterListener: () => void
    }
  }
}
