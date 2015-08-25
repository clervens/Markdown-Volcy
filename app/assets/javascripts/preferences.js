var remote = require('remote');
var fs = remote.require('fs');
var ipc = require('ipc');
var app_root = remote.getGlobal('app_root');
var storage = remote.getGlobal('storage');
var i18n = remote.getGlobal('i18n');
window.$ = window.jQuery = require('jquery');