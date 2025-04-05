const path = require('path');
const {ipcMain, BrowserWindow} = require('electron');
const {saveIntrinsinkProjectSettings, loadIntrinsinkProjectSettingsSync: loadIntrinsinkProjectSettingsSync} = require('../common');

/**
 * @param {string} intrinsinkProjectDir - Path to folder for current Intrinsink project
 */
exports.launchSettingsEditor = function(intrinsinkProjectDir) {
  const win = new BrowserWindow({webPreferences: {
    preload: path.join(__dirname, 'preload.js')
  }});
  const settings = loadIntrinsinkProjectSettingsSync(intrinsinkProjectDir);

  win.loadFile('../intrinsink/intrinsink-settings-edit/index.html');

  const handleEditorReady = () => {
    console.log('ready, triggering settings load...');
    win.webContents.send('intrinsink-settings-editor-load', settings);
  }
  ipcMain.on('intrinsink-settings-editor-ready', handleEditorReady);
  
  const handleSettingsSave = (_, settings) => {
    console.log('saving intrinsink settings');
    saveIntrinsinkProjectSettings(settings, intrinsinkProjectDir);
  }
  ipcMain.on('intrinsink-settings-editor-save', handleSettingsSave);

  win.on('closed', () => {
    ipcMain.off('intrinsink-settings-editor-ready', handleEditorReady);
    ipcMain.off('intrinsink-settings-editor-save', handleSettingsSave);
  });
}