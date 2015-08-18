var app = require('app');
var BrowserWindow = require('browser-window');
var ipc = require('ipc');

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
  mainWindow.openDevTools();

  var template = require(__dirname+'/lib/menus/main_menu')(app, BrowserWindow, mainWindow);

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
  mainWindow.on('closed', function() {
    mainWindow = null;
  });
});

