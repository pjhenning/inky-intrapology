const { BaseWindow, WebContentsView } = require('electron');

/**
 * Calculate panel width or height and offset from window width or height and 1/2 border thickness
 * @param {number} windowDimension 
 * @param {number} halfBorderThickness
 */
function calculatePanelLayoutData1D(windowDimension, halfBorderThickness) {
  const baseSize = Math.floor(windowDimension / 2);
  return {
    size: baseSize - halfBorderThickness,
    offset: baseSize + halfBorderThickness
  };
}

/**
 * Calculate panel size and position data from window size and 1/2 border thickness
 * @param {number} windowWidth
 * @param {number} windowHeight  
 * @param {number} halfBorderThickness
 */
function calculatePanelLayoutData(windowWidth, windowHeight, halfBorderThickness) {
  const x = calculatePanelLayoutData1D(windowWidth, halfBorderThickness);
  const y = calculatePanelLayoutData1D(windowHeight, halfBorderThickness);
  return {
    width: x.size,
    height: y.size,
    secondColumnX: x.offset,
    secondRowY: y.offset
  };
}

/*
0.5 check whether project has been created yet
1. export up to date json
1.5. send reset message to firebase
2. launch window
*/

const WIN_BASE_WIDTH = 800;
const WIN_BASE_HEIGHT = 600;

const INTRAPOLOGY_INDEX_LOCATION = '../intrapology-resources/index.html'; // TODO: use project folder instead

const BORDER_THICKNESS = 2;
const HALF_BORDER = BORDER_THICKNESS / 2;

function launchRunnerWindow() {

  const win = new BaseWindow({width: WIN_BASE_WIDTH, height: WIN_BASE_HEIGHT});

  const audienceView = new WebContentsView();
  audienceView.webContents.loadFile(INTRAPOLOGY_INDEX_LOCATION);

  const subtitlesView = new WebContentsView();
  subtitlesView.webContents.loadFile(INTRAPOLOGY_INDEX_LOCATION, {hash: 'subtitles'});

  const actorView = new WebContentsView();
  actorView.webContents.loadFile(INTRAPOLOGY_INDEX_LOCATION, {hash: 'caller'});

  const moderatorView = new WebContentsView();
  moderatorView.webContents.loadFile(INTRAPOLOGY_INDEX_LOCATION, {hash: 'moderator'});

  win.contentView.addChildView(audienceView);
  win.contentView.addChildView(actorView);
  win.contentView.addChildView(subtitlesView);
  win.contentView.addChildView(moderatorView);

  /**
   * @param {number} windowWidth
   * @param {number} windowHeight
   */
  const setPanelLayout = (windowWidth, windowHeight) => {
    const {width, height, secondColumnX, secondRowY} = calculatePanelLayoutData(windowWidth, windowHeight, HALF_BORDER);
    audienceView.setBounds({ x: 0, y: 0, width, height });
    subtitlesView.setBounds({ x: secondColumnX, y: 0, width, height });
    actorView.setBounds({ x: 0, y: secondRowY, width, height });
    moderatorView.setBounds({ x: secondColumnX, y: secondRowY, width, height });
  };

  setPanelLayout(WIN_BASE_WIDTH, WIN_BASE_HEIGHT);

  win.on('resize', () => {
    const {width, height} = win.getBounds();
    setPanelLayout(width, height);
  });

  win.on('closed', () => {
    audienceView.webContents.close();
    subtitlesView.webContents.close();
    actorView.webContents.close();
    moderatorView.webContents.close();
  });
}

exports.launchRunnerWindow = launchRunnerWindow;