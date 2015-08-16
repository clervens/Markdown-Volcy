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

  var template = [{
    label: "Application",
    submenu: [
      { label: "Preferences", enabled: false },
      { label: "About Application", selector: "orderFrontStandardAboutPanel:" },
      { type: "separator" },
      { label: "Quit", accelerator: "CmdOrCtrl+Q", click: function() { app.quit(); }}]
    }, {
      label: "File", submenu: [
        { label: "Save", accelerator: "CmdOrCtrl+S", enabled: false, click: function(){
            BrowserWindow.getFocusedWindow().webContents.send('file-save');
        } },
        { type: "separator", sublabel: "Debug" }//,
        // { label: "Debug", enabled: false},
        // { label: "Reload", accelerator: "CmdOrCtrl+R", click: function() { mainWindow.restart();}},
        // { label: "Tests Trigger", accelerator: "CmdOrCtrl+T", click: function() { 
        //   BrowserWindow.getFocusedWindow().webContents.send('test');}}
      ]
    }, {
    label: "Edit",
    submenu: [
      { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
      { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
      { type: "separator" },
      { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
      { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
      { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
      { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }]
    }, {
      label: "View", submenu: []
    }, {
      label: "Actions", submenu: []
    }, {
      label: "Window", submenu: []
    }, {
      label: "Help", submenu: []
  }];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
  mainWindow.on('closed', function() {
    mainWindow = null;
  });
});

