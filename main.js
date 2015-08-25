var app = require('app');
var BrowserWindow = require('browser-window');
var ipc = require('ipc');
global.storage = require(__dirname+'/lib/storage/storage');
global.i18n = require(__dirname+'/lib/i18n');
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
  mainWindow.loadUrl('file://'+ __dirname + '/index.html');
  if (environment == 'development')
    mainWindow.openDevTools();

  var template = require(__dirname+'/lib/menus/main_menu')(app, BrowserWindow, mainWindow);

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
  mainWindow.on('closed', function() {
    mainWindow = null;
  });
});

