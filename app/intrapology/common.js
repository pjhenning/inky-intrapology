const fs = require('fs');

/**
 * @typedef {Object} IntrapologyStyles
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
 * @typedef {Object} IntrapologySettings
 * @property {string} performanceId
 * @property {string} modPassword
 * @property {string} title
 * @property {Array<string>} callers
 * @property {string} videoCallEmbedLink
 * @property {string} defaultAudienceMessage
 * @property {IntrapologyStyles} styles
 */

/** 
 * @param {string} intrapologyProjectDir - Path to folder for current Intrapology project
 * @returns {Promise<IntrapologySettings>} 
 * */
exports.loadIntrapologyProjectSettings = async function(intrapologyProjectDir) {
  const intrapologySettingsPath = intrapologyProjectDir + '/settings.json';
  return new Promise((resolve, reject) => {
    fs.stat(settingsPath, (statErr, stats) => {
      if (statErr) reject(statErr);
      if (!stats.isFile()) reject("Can't find settings file.");
      if( statErr || !stats.isFile() ) { 
          // TODO: warn if not found
          return;
      }
      fs.readFile(intrapologySettingsPath, "utf8", (readError, fileContent) => {
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
