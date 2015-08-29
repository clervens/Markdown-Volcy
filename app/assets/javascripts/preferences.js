var remote = require('remote');
var fs = remote.require('fs');
var ipc = require('ipc');
var app_root = remote.getGlobal('app_root');
var storage = remote.getGlobal('storage');
var i18n = remote.getGlobal('i18n');
window.$ = window.jQuery = require('jquery');

var preferences = storage.get('preferences');

$(function(){
  $('title').text(require(app_root+'/lib/i18n').t('app.preferences'));

  init_form_fields_value();

  $('form').change(function(e){
    form_data = $("form").serializeArray();
    prefs = {};
    for (var i = 0; i < form_data.length; i++) {
      prefs[form_data[i].name] = form_data[i].value;
    };
    storage.set('preferences', prefs);
  });
});

function init_form_fields_value() {
  $("#locale").val(preferences.locale);
  $("#theme").val(preferences.theme);
  $('#latex').prop('checked', (preferences.latex == "true"));
}
