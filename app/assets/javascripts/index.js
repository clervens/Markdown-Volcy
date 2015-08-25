var remote = require('remote');
var markdown = remote.require("markdown-js");
var Menu = remote.require('menu');
var MenuItem = remote.require('menu-item');
var dialog = remote.require('dialog');
var BrowserWindow = remote.require('browser-window');
var fs = remote.require('fs');
var ipc = require('ipc');
window.$ = window.jQuery = require('jquery');

function Editor(input, preview) {
  this.update = function () {
    preview[0].innerHTML = markdown.makeHtml(input[0].CodeMirror.getValue());
  };
  // input[0].onkeyup = input[0].onchange = this.update;
  // input[0].CodeMirror.getValue().split(/(?:^|[^\\\\\[])[^~`!¡@#$%^&*()_\-+={}\[\]|\\:;"'<,>.?¿\/\s]+/).length
  input[0].CodeMirror.on('keyup', this.update);
  this.update();
}

$(function(){
  var editor = CodeMirror.fromTextArea($("#input")[0], {lineNumbers: false, lineWrapping: true, mode: 'markdown', autofocus: true});
  var previewFrame = new Editor($("#input + .CodeMirror"), $("#preview .content"));
  $("#preview .content").data('editor', previewFrame);
  var minWidth = 100;

  $(".pane-left").resizable({
    autoHide: false,
    handles: 'e',
    minWidth: minWidth,
    resize: function(e, ui){
      var parentWidth = ui.element.parent().width();
      var remainingSpace = parentWidth - ui.element.outerWidth();
      var minWidth = ui.element.resizable('option', 'minWidth');
      
      if(remainingSpace < minWidth){
        ui.element.width((parentWidth - minWidth)/parentWidth*100+"%");
        remainingSpace = minWidth;
      }
      var divTwo = ui.element.next(),
      divTwoWidth = (remainingSpace - (divTwo.outerWidth() - divTwo.width()))/parentWidth*100+"%";
      divTwo.width(divTwoWidth);
    },
    stop: function(e, ui){
      var parentWidth = ui.element.parent().width();
      ui.element.css({
        width: ui.element.width()/parentWidth*100+"%"
      });
    }
  });

  function resizePane(widthInPercents) {
    $(".pane-left").width(widthInPercents+"%");
    $(".pane-right").width(100-widthInPercents+"%");
  }

  function saveFile(args) {
    this.save = function(filePath, old){
      if(filePath){
        fs.writeFile(filePath, $("#input + .CodeMirror")[0].CodeMirror.getValue(), function(err) {
          (!err)? console.log('Saved!') : console.log('Error!!!');
        });
        if (!old)
          initFileNameFromPath(filePath);
      }
    };

    var file = sessionStorage.getItem('file');
    if(!file || args.save_as) {
      dialog.showSaveDialog(remote.getCurrentWindow(), {
        title: "save markdown",
        filters: [
          { name: 'Markdown', extensions: ['md'] }
        ]
      }, this.save);
    } else {
      this.save(file.path, true);
    }
  }

  function initFileNameFromPath(filePath) {
    filename = filePath.split("/");
    filename = filename[filename.length-1];
    remote.getCurrentWindow().setRepresentedFilename(filePath);
    remote.getCurrentWindow().setTitle(filename);
    sessionStorage.setItem('file', JSON.stringify({path: filePath}));
  }

  ipc.on('file-save', saveFile)
  .on('file-save-as', saveFile)
  .on('file-new', function(){tbw = new BrowserWindow({width: 800, height: 600});tbw.loadUrl('file://'+ __dirname + '/index.html');})
  .on('file-open', function(){ dialog.showOpenDialog(remote.getCurrentWindow(), {
    title: "Markdown-Volcy Open File",
    filters: [ { name: 'Markdown', extensions: ['markdown','mdown','mkdn','md','mkd','mdwn','mdtxt','mdtext','text'] } ],
    properties: ['openFile']
  }, function(filePath){
    if (filePath) {
      fs.readFile(filePath[0], {encoding: 'utf-8'}, function(err, data){
        console.log(filePath[0]);
        if (!err) {
          editor.setValue(data);
          previewFrame.update();
          initFileNameFromPath(filePath[0]);
        } else {
          console.log(err);
        }
      });
    }
  })})
  .on('file-close', function(){remote.getCurrentWindow().close()})
  .on('view-toggle-preview', function(){
    resizePane(($(".pane-right").width() > 0)? 100 : 50);
  })
  .on('test', function(){remote.getCurrentWindow().loadUrl('file://'+ __dirname + '/test.html');})
});