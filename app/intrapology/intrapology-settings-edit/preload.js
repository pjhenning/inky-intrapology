const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  onSettingsLoad: (settingsHandler) => 
    ipcRenderer.on('intrapology-settings-editor-load', (_event, loadedSettings) => settingsHandler(loadedSettings)),
  signalReady: () => ipcRenderer.send('intrapology-settings-editor-ready'),
  processUpdatedSettings: (updatedSettings) => ipcRenderer.send('intrapology-settings-editor-save', updatedSettings)
})