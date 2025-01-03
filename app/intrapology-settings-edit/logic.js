const ColorPicker = require('@thednp/color-picker');
const { init, selector } = ColorPicker;

// TODO: launch from main window
// TODO: settings in and settings out

const namesCommaRegex = /(?<=\S)\s*,\s*(?=\S)/;
/** @param {string} names */
function parseCharacterNames(names) {
  return names.split(namesCommaRegex);
}

/** @type {IntrapologySettings} */
let initialSettings = {};

/** @param {IntrapologySettings} settings  */
function init(settings) {
  initialSettings = settings;

  [...document.querySelectorAll(selector)].forEach(init);

  for (const [propName, propVal] of Object.entries(settings)) {
    if (propName !== 'styles' && propName !== 'callers') {
      document.getElementById(propName).value = propVal;
    }
  }
  
  document.getElementById('callers').value = settings.callers.join(', ');
  
  for (const [styleName, styleVal] of Object.entries(settings.styles)) {
    document.getElementById(styleName).value = styleVal;
  }
}

function getNewSettings() {
  /** @type {IntrapologySettings} */
  let newSettings = {};

  for (const propName of Object.keys(initialSettings)) {
    if (propName !== 'styles' && propName !== 'callers') {
      newSettings[propName] = document.getElementById(propName).value;
    }
  }
  
  newSettings['callers'] = parseCharacterNames(document.getElementById('callers').value);
  
  for (const styleName of Object.keys(initialSettings.styles)) {
    newSettings[styleName] = document.getElementById(styleName).value;
  }

  return newSettings;
}
