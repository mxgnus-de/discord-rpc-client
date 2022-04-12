import { Presence } from './types/Presence';
import { app, BrowserWindow, ipcMain } from 'electron';
import { channels } from './settings/constants';
import RPC from 'discord-rpc';
import fs from 'fs';
import { Config } from './types/Config';

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
const isDev = process.env.NODE_ENV !== 'production';

if (require('electron-squirrel-startup')) {
   // eslint-disable-line global-require
   app.quit();
}

let mainWindow: BrowserWindow | null = null;

const createWindow = (): void => {
   mainWindow = new BrowserWindow({
      height: 600,
      width: 800,
      webPreferences: {
         nodeIntegration: true,
         contextIsolation: false,
      },
   });

   mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

   if (isDev) {
      mainWindow.webContents.openDevTools();
   } else {
      mainWindow.removeMenu();
   }
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
   if (process.platform !== 'darwin') {
      app.quit();
   }
});

app.on('activate', () => {
   if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
   }
});

const configDirectory = `${app.getPath('documents')}/status-maker`;
const configPath = `${configDirectory}/config.json`;

const rpcState: {
   ready: boolean;
   rpc: Presence | null;
} = {
   ready: false,
   rpc: null,
};

const rpc = new RPC.Client({
   transport: 'ipc',
});

function updateRPC({
   details,
   state,
   largeImageKey,
   largeImageText,
   smallImageKey,
   smallImageText,
   buttons,
}: Presence) {
   if (!rpcState.ready) {
      return;
   }

   rpcState.rpc = {
      details,
      state,
      largeImageKey,
      largeImageText,
      smallImageKey,
      smallImageText,
      buttons,
   };

   rpc.setActivity({
      details,
      state,
      largeImageKey,
      largeImageText,
      smallImageKey,
      smallImageText,
      buttons,
   }).catch(console.error);
}

ipcMain.handle(channels.SET_PRESENCE, (event, data: Presence) => {
   if (!rpcState.ready) {
      return {
         success: false,
         error: 'App is not ready yet',
      };
   }
   updateRPC(data);

   return {
      success: true,
      presence: data,
      user: rpc.user,
   };
});

ipcMain.handle(channels.STOP_PRESENCE, () => {
   rpc.clearActivity();

   return {
      success: true,
   };
});

ipcMain.handle(channels.GET_USER, () => {
   return {
      user: rpc.user,
   };
});

ipcMain.handle(channels.GET_CONFIG, () => {
   return getConfig();
});

ipcMain.handle(channels.SAVE_CONFIG, (_, config: Config) => {
   saveConfig(config);
   const newConfig = getConfig();
   return {
      success: true,
      config: newConfig,
   };
});

ipcMain.handle(channels.START_PRESENCE, (_, clientId) => {
   return new Promise((resolve) => {
      if (rpcState.ready) {
         return resolve({
            success: true,
            ready: true,
            user: rpc.user,
         });
      }

      rpc.once('ready', () => {
         rpcState.ready = true;
         return resolve({
            success: true,
            ready: true,
            user: rpc.user,
         });
      });

      rpc.login({
         clientId,
      }).catch((err) => {
         return resolve({
            success: false,
            ready: false,
            error: err,
         });
      });
   });
});

function createConfig() {
   if (!fs.existsSync(configDirectory)) {
      fs.mkdirSync(configDirectory);
   }

   if (!fs.existsSync(configPath)) {
      const defautConfig = {
         presences: [],
      };
      fs.writeFileSync(configPath, JSON.stringify(defautConfig));
   }
}

function getConfig() {
   createConfig();

   return JSON.parse(fs.readFileSync(configPath, 'utf8'));
}

function saveConfig(config: Config) {
   createConfig();
   fs.writeFileSync(configPath, JSON.stringify(config));
}
