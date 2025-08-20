import { BrowserWindow, Menu, dialog, app } from 'electron'
import { checkForUpdatesManual } from './updater'
import icon from '../../resources/icon.png?asset'

export function createMenu(mainWindow: BrowserWindow): void {
  const menu = Menu.buildFromTemplate([
    {
      label: '视图',
      submenu: [
        {
          label: '切换全屏',
          accelerator: 'F11',
          click: (): void => {
            const win = BrowserWindow.getFocusedWindow()
            if (win) {
              win.setFullScreen(!win.isFullScreen())
            }
          }
        },
        {
          label: '刷新',
          accelerator: 'CommandOrControl+R',
          click: (): void => {
            const win = BrowserWindow.getFocusedWindow()
            if (win) {
              win.reload()
            }
          }
        }
      ]
    },
    {
      label: '窗口',
      submenu: [
        {
          label: '首页',
          accelerator: 'CommandOrControl+H',
          click: (): void => {
            if (mainWindow) {
              mainWindow.webContents.send('navigate-to', '/')
            }
          }
        },
        {
          label: '设置',
          accelerator: 'CommandOrControl+,',
          click: (): void => {
            if (mainWindow) {
              mainWindow.webContents.send('navigate-to', '/settings')
            }
          }
        }
      ]
    },
    {
      label: '编辑',
      submenu: [
        { label: '复制', accelerator: 'CommandOrControl+C', role: 'copy' },
        { label: '粘贴', accelerator: 'CommandOrControl+V', role: 'paste' },
        { label: '全选', accelerator: 'CommandOrControl+A', role: 'selectAll' }
      ]
    },
    {
      label: '帮助',
      submenu: [
        {
          label: '检查更新',
          click: (): void => {
            checkForUpdatesManual()
          }
        },
        {
          label: '关于',
          click: (): void => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: '关于',
              message: 'iSee Display 桌面端',
              detail: `版本：${app.getVersion()}\n\n作者：ChenZhaoYu\n\n© 2025 All Rights Reserved`,
              buttons: ['确定'],
              icon: icon
            })
          }
        }
      ]
    }
  ])

  Menu.setApplicationMenu(menu)
}
