import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      getAutoLaunchStatus: () => Promise<boolean>
      setAutoLaunch: (enable: boolean) => Promise<boolean>
      getMacAddress: () => Promise<string[]>
      setFullScreenDefault: (enable: boolean) => Promise<void>
      getFullScreenDefault: () => Promise<boolean>
    }
  }
}
