var environment = storage.get('environment');
var fs = require('fs');
var path = require('path');
var locales_folder = path.join(app_root, 'config', 'locales');
var locale = storage.get('preferences').locale;
var data;

readLocaleData(locale);

function get_locale() {
  if (environment == 'development') {
    locale = storage.get('preferences').locale;
  }
  return locale;
}

function readLocaleData(loc) {
  data = JSON.parse(fs.readFileSync(path.join(locales_folder, loc+".json"), 'utf-8'));
}

exports.translate = exports.t = function(key, loc) {
  if (!loc)
    loc = get_locale();
  if (environment == 'development')
    readLocaleData(loc);

  val = data[key];

  return (!!val)? val : "missing translation: [" + key + "]";
}
