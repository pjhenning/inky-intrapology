//const ColorPicker = require('@thednp/color-picker');

// TODO: settings in and settings out
const namesCommaRegex = /(?<=\S)\s*,\s*(?=\S)/;
/** @param {string} names */
function parseCharacterNames(names) {
  return names.split(namesCommaRegex);
}


const ignoreProps = ['performanceId', 'callers', 'styles'];

const colorProps = ['mainTextColor', 'taskbarTextColor', 'taskbarHighlightColor', 'buttonTextColor', 'mainHighlightBackground', 'highlightTextColor', 'subtitlesTextColor'];

/** @param {IntrapologySettings} initialSettings  */
function getNewSettings(initialSettings) {
  /** @type {IntrapologySettings} */
  let newSettings = {
    performanceId: initialSettings.performanceId,
    styles: {}
  };

  for (const propName of Object.keys(initialSettings)) {
    if (!ignoreProps.includes(propName)) {
      newSettings[propName] = document.getElementById(propName).value;
    }
  }
  
  newSettings['callers'] = parseCharacterNames(document.getElementById('callers').value);
  
  for (const styleName of Object.keys(initialSettings.styles)) {
    if (colorProps.includes(styleName)) {
      const picker = ColorPicker.getInstance(document.getElementById(styleName));
      newSettings.styles[styleName] = picker.value;
    }
    else {
      newSettings.styles[styleName] = document.getElementById(styleName).value;
    }
  }

  return newSettings;
}

/** @param {IntrapologySettings} initialSettings  */
function initPage(initialSettings) {

  for (const [propName, propVal] of Object.entries(initialSettings)) {
    if (!ignoreProps.includes(propName)) {
      document.getElementById(propName).value = propVal;
    }
  }
  
  document.getElementById('callers').value = initialSettings.callers.join(', ');
  
  for (const [styleName, styleVal] of Object.entries(initialSettings.styles)) {
    if (colorProps.includes(styleName)) {
      const picker = new ColorPicker(`#${styleName}`);
      picker.color = new ColorPicker.Color(styleVal);
      picker.update();
    }
    else {
      document.getElementById(styleName).value = styleVal;
    }
  }

  document.getElementById('save-settings').onclick = (e) => {
    e.preventDefault();
    const newSettings = getNewSettings(initialSettings);
    window.electronAPI.processUpdatedSettings(newSettings);
  }
}

window.electronAPI.onSettingsLoad((loadedSettings) => {
  initPage(loadedSettings);
});
window.electronAPI.signalReady();
