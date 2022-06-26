// eslint-disable-next-line @typescript-eslint/no-var-requires
const { MSICreator } = require('electron-wix-msi');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

const APP_DIR = path.resolve(__dirname, './Discord-RPC-Maker-win32-x64');
const OUT_DIR = path.resolve(__dirname, './windows_installer');

const msiCreator = new MSICreator({
    appDirectory: APP_DIR,
    outputDirectory: OUT_DIR,

    description: 'Discord RPC Maker - A tool to create Discord Rich Presence',
    exe: 'Discord-RPC-Maker',
    name: 'Discord RPC Maker',
    manufacturer: 'mxgnus',
    version: '1.0.0',

    ui: {
        chooseDirectory: true,
    }
})

msiCreator.create().then(() => {
    msiCreator.compile();
})