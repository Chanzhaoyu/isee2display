import { app } from 'electron'
import os from 'os'
import path from 'path'
import fs from 'fs'

// 配置文件路径
const CONFIG_FILE_PATH = path.join(app.getPath('userData'), 'config.json')

// 默认配置
interface AppConfig {
  fullScreenDefault: boolean
}

const defaultConfig: AppConfig = {
  fullScreenDefault: false
}

// 读取配置文件
function readConfig(): AppConfig {
  try {
    if (fs.existsSync(CONFIG_FILE_PATH)) {
      const configData = fs.readFileSync(CONFIG_FILE_PATH, 'utf8')
      return { ...defaultConfig, ...JSON.parse(configData) }
    }
  } catch (error) {
    console.error('读取配置文件失败:', error)
  }
  return defaultConfig
}

// 写入配置文件
function writeConfig(config: AppConfig): void {
  try {
    const configDir = path.dirname(CONFIG_FILE_PATH)
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true })
    }
    fs.writeFileSync(CONFIG_FILE_PATH, JSON.stringify(config, null, 2))
  } catch (error) {
    console.error('写入配置文件失败:', error)
  }
}

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

// 设置默认全屏状态
export function setFullScreenDefault(enable: boolean): void {
  const config = readConfig()
  config.fullScreenDefault = enable
  writeConfig(config)
}

// 获取默认全屏状态
export function getFullScreenDefault(): boolean {
  const config = readConfig()
  return config.fullScreenDefault
}
