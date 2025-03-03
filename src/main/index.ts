import { app, shell, BrowserWindow, ipcMain, Menu, dialog } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

// 添加设置开机自启动的函数
function setAutoLaunch(enable: boolean): void {
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

// 添加获取当前自启动状态的函数
function getAutoLaunchStatus(): boolean {
  if (process.platform === 'linux') {
    return false
  }
  return app.getLoginItemSettings().openAtLogin
}

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    title: 'iSee Display',
    width: 1024,
    height: 768,
    fullscreen: true,
    show: false,
    autoHideMenuBar: false,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      webviewTag: true,
      nodeIntegration: true,
      contextIsolation: false,
      sandbox: false
    }
  })

  const menu = Menu.buildFromTemplate([
    {
      label: '视图',
      submenu: [
        {
          label: '切换全屏',
          accelerator: 'F11|CommandOrControl+F',
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
          label: '关于',
          click: (): void => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: '关于',
              message: 'iSee Display 桌面端',
              detail: '版本：1.0.0\n\n作者：ChenZhaoYu\n\n© 2025 All Rights Reserved',
              buttons: ['确定'],
              icon: icon
            })
          }
        }
      ]
    }
  ])

  Menu.setApplicationMenu(menu)

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  ipcMain.handle('get-auto-launch-status', () => {
    return getAutoLaunchStatus()
  })

  ipcMain.handle('set-auto-launch', (_, enable) => {
    setAutoLaunch(enable)
    return getAutoLaunchStatus()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
