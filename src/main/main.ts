/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import fs from 'fs';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import { IDRequest, IDResponse } from '../renderer/types';

type TUploadedFile = {
  base64: string;
  name: string;
  folder: string;
  filetype: string;
};

const uploadsFolder: string = path.join(app.getPath('appData'), 'uploads');

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

// Fail upload
ipcMain.on('upload-file', async (event, arg) => {
  console.log(`Uploading File ${arg?.name}`, typeof arg);
  try {
    const file: TUploadedFile = arg;
    const { base64, name, filetype } = file;
    const base64Data: string = base64.split('base64,')[1];
    const uploadsDir = path.join(__dirname, `uploads`);
    const imagePath = path.join(
      uploadsDir,
      `${name}-${Date.now()}}.${filetype}`,
    );

    console.log('imagePath', imagePath);
    await fs.promises.writeFile(imagePath, base64Data, 'base64');
    event.reply('upload-file-done', imagePath);
  } catch (e: any) {
    console.log(e);
    event.reply('upload-file-failed', e);
  }
});

ipcMain.on('send-to-backend', async (event, arg) => {
  try {
    const reqData: IDRequest = arg;
    const { method, type, data } = reqData;
    let results: IDResponse | any = { code: -1, message: '' };
    if (type === 'USERS') {
      if (method === 'READ') {
        results = {
          code: 0,
          data: {
            users: [
              {
                name: 'Derrick Mugenyi',
                code: 'E001',
                department: 'RnD',
                lastAction: 0,
                lastActionTime: '2024-03-10 10:00',
              },
              {
                name: 'Trevor Suna',
                code: 'E002',
                department: 'RnD',
                lastAction: 0,
                lastActionTime: '2024-03-10 10:00',
              },
            ],
            reasons: [
              {
                value: 1,
                label: 'Sulat',
              },
              {
                value: 2,
                label: 'Lunch',
              },
              {
                value: 3,
                label: 'Meeting',
              },
            ],
          },
          message: 'ok',
        };
      }
    } else if (type === 'ACTIVITY') {
      if (method === 'CREATE') {
        results = {
          code: 0,
          message: 'ok',
        };
      }
    }

    setTimeout(() => {
      event.reply('send-to-backend-done', results);
    }, 1000);
  } catch (e: any) {
    console.log(e);
    event.reply('send-to-backend-failed', {
      code: -99,
      message: `Failed to upload to database: ${e}`,
    });
  }
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

// Ensure the uploads folder exists (optional)
(async () => {
  try {
    await fs.promises.access(uploadsFolder);
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      await fs.promises.mkdir(uploadsFolder);
    } else {
      throw err;
    }
  }
})();

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload,
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
      allowRunningInsecureContent: true,
      autoplayPolicy: 'no-user-gesture-required',
      zoomFactor: 0.7,
    },
  });
  mainWindow.maximize();

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
    mainWindow.webContents.setZoomFactor(
      process.platform === 'win32' ? 0.7 : 1,
    );
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    if (edata.url === 'about:blank') {
      return {
        action: 'allow',
        overrideBrowserWindowOptions: {
          frame: false,
          fullscreenable: false,
          backgroundColor: 'black',
          webPreferences: {
            preload: 'my-child-window-preload-script.js',
          },
        },
      };
    }
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
