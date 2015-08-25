var app = require('app');
var BrowserWindow = require('browser-window');
var ipc = require('ipc');
global.app_root = __dirname+'/app';
global.storage = require(app_root+'/lib/storage/storage');
global.i18n = require(app_root+'/lib/i18n');
var environment = storage.get('environment');
require('crash-reporter').start();

var mainWindow = null;

var Menu = require("menu");

app.on('window-all-closed', function(){
  if (process.platform != 'darwin') {
    app.quit();
  }
});
app.on('ready', function(){
  mainWindow = new BrowserWindow({width: 800, height: 600});
  mainWindow.loadUrl('file://'+ app_root +'/views/index.html');

  var template = require(app_root+'/lib/menus/main_menu')(app, BrowserWindow, mainWindow);

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
  mainWindow.on('closed', function() {
    mainWindow = null;
  });
});

