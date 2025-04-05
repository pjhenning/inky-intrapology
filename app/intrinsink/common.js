const fs = require('fs');

/**
 * @typedef {Object} IntrinsinkStyles
 * @property {string} desktopBackground
 * @property {string} interactBackground
 * @property {string} mainFont
 * @property {string} mainTextColor
 * @property {string} taskbarBackground
 * @property {string} taskbarTextColor
 * @property {string} taskbarHighlightColor
 * @property {string} buttonBackground
 * @property {string} buttonBackgroundHover
 * @property {string} buttonTextColor
 * @property {string} mainHighlightBackground
 * @property {string} altHighlightBackground
 * @property {string} highlightTextColor
 * @property {string} subtitlesBackground
 * @property {string} subtitlesTextColor
 */

/**
 * @typedef {Object} IntrinsinkSettings
 * @property {string} performanceId
 * @property {string} modPassword
 * @property {string} title
 * @property {Array<string>} callers
 * @property {string} videoCallEmbedLink
 * @property {string} defaultAudienceMessage
 * @property {IntrinsinkStyles} styles
 */

/** 
 * @param {string} intrinsinkProjectDir - Path to folder for current Intrinsink project
 * @returns {Promise<IntrinsinkSettings>} 
 */
exports.loadIntrinsinkProjectSettings = async function(intrinsinkProjectDir) {
  const intrinsinkSettingsPath = intrinsinkProjectDir + '/settings.json';
  return new Promise((resolve, reject) => {
    fs.stat(intrinsinkSettingsPath, (statErr, stats) => {
      if (statErr) reject(statErr);
      if (!stats.isFile()) reject("Can't find settings file.");
      if( statErr || !stats.isFile() ) { 
          // TODO: warn if not found
          return;
      }
      fs.readFile(intrinsinkSettingsPath, "utf8", (readError, fileContent) => {
        if (readError) reject(readError);
        if (!fileContent) reject("Settings file is empty :/");
    
        try {
          const settings = JSON.parse(fileContent);
          resolve(settings);
        } catch (jsonParseError) {
          reject(jsonParseError);
        }
      });
    })
  });
}

/** 
 * @param {string} intrinsinkProjectDir - Path to folder for current Intrinsink project
 * @returns {IntrinsinkSettings}
 */
exports.loadIntrinsinkProjectSettingsSync = function(intrinsinkProjectDir) {
  const intrinsinkSettingsPath = intrinsinkProjectDir + '/settings.json';
  const stats = fs.statSync(intrinsinkSettingsPath);
  if (!stats.isFile()) return;
  const fileContent = fs.readFileSync(intrinsinkSettingsPath, 'utf-8');
  try {
    const settings = JSON.parse(fileContent);
    return settings
  } catch (jsonParseError) {
    return;
  }
}

/**
 * @param {IntrinsinkSettings} settings
 * @param {string} intrinsinkProjectDir
 * @returns {Promise<void>}
 */
exports.saveIntrinsinkProjectSettings = async function(settings, intrinsinkProjectDir) {
  const intrinsinkSettingsPath = intrinsinkProjectDir + '/settings.json';
  return new Promise((resolve, reject) => {
    const contents = JSON.stringify(settings, null, '\t');
    fs.writeFile(intrinsinkSettingsPath, contents, 'utf-8', (error) => {
      if (error) reject(error);
      else resolve();
    });
  });
}
