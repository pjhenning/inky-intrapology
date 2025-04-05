const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  onSettingsLoad: (settingsHandler) => 
    ipcRenderer.on('intrinsink-settings-editor-load', (_event, loadedSettings) => settingsHandler(loadedSettings)),
  signalReady: () => ipcRenderer.send('intrinsink-settings-editor-ready'),
  processUpdatedSettings: (updatedSettings) => ipcRenderer.send('intrinsink-settings-editor-save', updatedSettings)
})