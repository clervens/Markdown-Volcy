var template = function(app, BrowserWindow, mainWindow) {
  debugModeOn = true;
  this.send = function(msg, args) { BrowserWindow.getFocusedWindow().webContents.send(msg, args); };
  return [{
    label: "Application",
    submenu: [
      { label: "Preferences", enabled: false },
      { label: "About Application", selector: "orderFrontStandardAboutPanel:" },
      { type: "separator" },
      { label: "Quit", accelerator: "CmdOrCtrl+Q", click: function() { app.quit(); }}]
    }, {
      label: "File", submenu: [
        { label: "New", accelerator: "CmdOrCtrl+N", click: function() {send('file-new');} },
        { label: "Open", accelerator: "CmdOrCtrl+O", click: function() {send('file-open');} },
        { label: "Close", accelerator: "CmdOrCtrl+W", click: function() {send('file-close');} },
        { type: "separator" },
        { label: "Save", accelerator: "CmdOrCtrl+S", enabled: false, click: function(){send('file-save');} },
        { type: "separator" }
        ,{ label: "Debug", enabled: false, visible: debugModeOn},
        { label: "Reload", accelerator: "CmdOrCtrl+R", click: function() { mainWindow.restart();}, visible: debugModeOn},
        { label: "Tests Trigger", accelerator: "CmdOrCtrl+T", click: function() { send('test');}, visible: debugModeOn}]
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
};

module.exports = template;
