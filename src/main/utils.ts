import { app } from 'electron'
import os from 'os'

// 开机自启动
export function setAutoLaunch(enable: boolean): void {
  if (process.platform === 'linux') {
    // Linux 平台需要单独处理，这里不做实现
    return
  }

  app.setLoginItemSettings({
    openAtLogin: enable,
    // 在 macOS 上，可以设置是否以隐藏方式启动
    openAsHidden: false,
    // Windows 特有的设置
    path: process.execPath,
    args: []
  })
}

// 获取当前自启动状态
export function getAutoLaunchStatus(): boolean {
  if (process.platform === 'linux') {
    return false
  }
  return app.getLoginItemSettings().openAtLogin
}

// 获取MAC地址
export function getMacAddress(): string[] {
  const networkInterfaces = os.networkInterfaces()
  const macAddresses: string[] = []

  // 遍历所有网络接口
  for (const interfaceName in networkInterfaces) {
    const interfaces = networkInterfaces[interfaceName]
    if (interfaces) {
      // 筛选有效的网络接口（排除内部接口和虚拟接口）
      for (const iface of interfaces) {
        // 确保有MAC地址且不是内部地址
        if (iface.mac && iface.mac !== '00:00:00:00:00:00' && !iface.internal) {
          macAddresses.push(`${interfaceName}: ${iface.mac}`)
        }
      }
    }
  }

  return macAddresses
}
