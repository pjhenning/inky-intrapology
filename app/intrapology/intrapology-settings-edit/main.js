const path = require('path');
const {ipcMain, BrowserWindow} = require('electron');
const {saveIntrapologyProjectSettings, loadIntrapologyProjectSettingsSync} = require('../common');

/**
 * @param {string} intrapologyProjectDir - Path to folder for current Intrapology project
 */
exports.launchSettingsEditor = function(intrapologyProjectDir) {
  const win = new BrowserWindow({webPreferences: {
    preload: path.join(__dirname, 'preload.js')
  }});
  const settings = loadIntrapologyProjectSettingsSync(intrapologyProjectDir);

  win.loadFile('../intrapology/intrapology-settings-edit/index.html');

  const handleEditorReady = () => {
    console.log('ready, triggering settings load...');
    win.webContents.send('intrapology-settings-editor-load', settings);
  }
  ipcMain.on('intrapology-settings-editor-ready', handleEditorReady);
  
  const handleSettingsSave = (_, settings) => {
    console.log('saving intrapology settings');
    saveIntrapologyProjectSettings(settings, intrapologyProjectDir);
  }
  ipcMain.on('intrapology-settings-editor-save', handleSettingsSave);

  win.on('closed', () => {
    ipcMain.off('intrapology-settings-editor-ready', handleEditorReady);
    ipcMain.off('intrapology-settings-editor-save', handleSettingsSave);
  });
}