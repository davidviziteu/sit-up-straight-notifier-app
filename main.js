/*
	Written by:
		David-Andrei Viziteu		(viziteu.david@gmail.com)
  UAIC, Faculty of Computer Science, APRIL 2020
  
  yes, i use ; in js.
  this app was made after looking at the example app provided here: https://www.electronjs.org/docs/tutorial/first-app#trying-this-example
  and using some nodejs modules
*/

const { app, BrowserWindow, Menu, Tray } = require('electron');
const settings = require('electron-settings');
const autoLaunch = require('auto-launch');
const path = require('path');
let everything = {}; // "main app" object. holds window, tray. ran out of naming ideas

//----------------------i should handle registry entries in the installer, ignore this piece of code ----------------------------
var autoLaunchAtOsStartUp = new autoLaunch({
  name: 'dont break your back',
  path: app.getPath("exe"),
  isHidden: true
});
autoLaunchAtOsStartUp.enable();
// " We add a registry entry under \HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Run. "
//----------------------i should handle registry entries in the installer, ignore this piece of code ----------------------------

app.on('ready', () => {
  let startMinimized = (process.argv || []).indexOf('--hidden') !== -1; //check if registry entry has '--hidden'
  everything.window = new BrowserWindow({
    width: 410,
    height: 510,
    webPreferences: {
      nodeIntegration: true,
    },
    icon: path.join(__dirname, 'eye.ico'),
    show: startMinimized ? false : true
  })

  everything.window.loadFile('index.html');

  everything.window.on('close', function (event) {
    //for skype-like behaviour. keeps app running in the background eve if it's window is closed
    event.preventDefault();
    everything.window.hide();
  });

  let notifSettings = getLastSelectedInterval();

  let contextMenu = generateContextMenu(notifSettings)
  everything.tray = new Tray(path.join(__dirname, 'eye.ico')); //used path.join for electron-packager
  everything.tray.on('double-click', () => everything.window.show());
  everything.tray.setToolTip(`wanna stop that "sit up straight" notification you've been seeing? \n right click -> off   or   right click -> close`);
  everything.tray.setContextMenu(contextMenu);
})


function getLastSelectedInterval() {
  //loads last saved setting. defines one if not avaiavailable. read console.log
  if (settings.has('lastKnownNotificationSetting')) {
    let temp = settings.get('lastKnownNotificationSetting');
    console.log(`last known setting loaded: ${temp}`);
    everything.window.webContents.executeJavaScript(`markIt(${temp}, false);`); //call to update the front end highlited button
    return temp;
  }
  else {
    console.log(`there's no 'last known' setting to load, creating: '0'`);
    settings.set('lastKnownNotificationSetting', '0');
    everything.window.webContents.executeJavaScript(`markIt(0, false);`); //call to update the front end highlited button
    return '0';
  }


}

function generateContextMenu(tickedBox) {
  /*
    creates a tray menu and marks the element number 'tickedBox' as being selected;

    Still no clue about what 'marks the element...' means? 
      launch app, right click the eye icon near the battery / speaker / internet connection icons. see that filled circle?
      its filled because of 'ctMenu.items[tickedBox].checked = true;' 
  */
  let ctMenu = Menu.buildFromTemplate([
    {
      label: 'off', type: 'radio', click: () => {
        everything.window.webContents.executeJavaScript("markIt(0, false);"); //call to front end function to highlight the correct interval
        updateConfigFile('0');
      }
    },
    {
      label: '10 mins', type: 'radio', click: () => {
        everything.window.webContents.executeJavaScript("markIt(1, false);"); //same
        updateConfigFile('1');
      }
    },
    {
      label: '15 mins', type: 'radio', click: () => {
        everything.window.webContents.executeJavaScript("markIt(2, false);"); //same
        updateConfigFile('2');
      }
    },
    {
      label: '30 mins', type: 'radio', click: () => {
        everything.window.webContents.executeJavaScript("markIt(3, false);"); //same
        updateConfigFile('3');
      }
    },
    {
      label: 'exit', type: 'normal', click: () => {
        app.exit();
      }
    },
  ])
  ctMenu.items[tickedBox].checked = true;
  console.log(`made the box no. ${tickedBox} ticked/checked in tray (indexes 0..3)`);
  return ctMenu;
}


function updateConfigFile(nr) {
  //store current setting
  console.log(`updating config file with: '${nr}'`);
  settings.set('lastKnownNotificationSetting', nr);
}


exports.updateSelectedInterval = (x) => {
  //front end calls this to mark as selected the current interval in tray menu
  console.log(`front end call with arg = ${x}`);
  updateConfigFile(x);
  everything.tray.setContextMenu(generateContextMenu(x));
}