global.app_root = __dirname+'/app';
global.storage = require(app_root+'/lib/storage/storage');
global.i18n = require(app_root+'/lib/i18n');
global.PWD = process.env.PWD = require('path').dirname(require.main.filename);

var app = require('app');
var ipc = require('ipc');
require('coffee-script/register');
var MarkdownEditorWindows = require(app_root+'/lib/core/MarkdownEditorWindows');
var Menu = require("menu");

require('crash-reporter').start();

app.on('window-all-closed', function(){
  if (process.platform != 'darwin') {
    app.quit();
  }
});
app.on('ready', function(){
  global.markdownEditorWindows = new MarkdownEditorWindows(app);
});

