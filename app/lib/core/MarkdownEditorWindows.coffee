Storage = require "#{process.env.PWD}/app/lib/storage/storage"
BrowserWindow = require 'browser-window'
Menu = require 'menu'
Dialog = require 'dialog'
fs = require 'fs'

class MarkdownEditorWindows
  constructor: (app) ->
    @browsers = []
    @app = app
    @prefs = null
    @initMenu app
    @newEditor()
  initMenu: (app) ->
    template = require("#{process.env.PWD}/app/lib/core/menus/main_menu")
    Menu.setApplicationMenu(Menu.buildFromTemplate(template(@, BrowserWindow)))
    return
  newEditor: (file) ->
    options = 
      width: 800
      height: 600
    if (@browsers.length > 0)
      options.width = Math.min(options.width, @browsers[@browsers.length-1].getBounds().width)
      options.height = Math.min(options.height, @browsers[@browsers.length-1].getBounds().height)
    browser = new BrowserWindow(options)
    browser.loadUrl "file://#{process.env.PWD}/app/views/index.html"
    browser.on 'closed', =>
      index = @browsers.indexOf(browser)
      if(index isnt -1)
        @browsers.splice index, 1
        console.log index
    browser.webContents.on 'did-finish-load', ->
      browser.webContents.send 'file.open', file
    @browsers.push browser
  menuAction: (event, args) ->
    switch event
      when 'file.new'
        @newEditor()
        break
      when 'file.save'
        browser = BrowserWindow.getFocusedWindow()
        if browser
          browser.webContents.send "file.save", save_as: false
      when 'file.save-as'
        browser = BrowserWindow.getFocusedWindow()
        if browser
          browser.webContents.send "file.save-as", save_as: true
      when 'file.open'
        Dialog.showOpenDialog null,
          title: "Markdown-Volcy Open File",
          filters: [  
            name: 'Markdown'
            extensions: ['markdown','mdown','mkdn','md','mkd','mdwn','mdtxt','mdtext','text']
          ]
          properties: ['openFile']
        , (filePath) =>
            if (filePath)
              @newEditor(filePath[0])
            return
        break
      when 'file.print'
        # if (!options.pdf)
        #   return;
        browser = BrowserWindow.getFocusedWindow()
        if browser
          browser.printToPDF printBackground: true, (error, data) ->
            throw error if error
            Dialog.showSaveDialog browser,
              title: "Print tot PDF"
              filters: [
                name: 'PDF'
                extensions: ['pdf']
              ]
              , (filePath) ->
                fs.writeFile filePath, data, (error) ->
                  throw error if error
                  console.log "Write PDF successfully."
                return
            return
      when 'view.toggle-preview'
        browser = BrowserWindow.getFocusedWindow()
        if browser
          browser.webContents.send('view.toggle-preview')
      when 'file.close'
        browser = BrowserWindow.getFocusedWindow()
        if browser
          browser.close()
        break
      when 'app.preferences'
        console.log @prefs
        return if @prefs isnt null
        @prefs = new BrowserWindow
          width: 400
          height: 300
          resizable: (Storage.get('environment') == 'development')
          frame: true
          "skip-taskbar": true
        @prefs.loadUrl "file://#{process.env.PWD}/app/views/preferences.html"
        if(Storage.get('environment') == 'development')
          @prefs.openDevTools();    
        @prefs.on 'closed', =>
          @prefs = null
      when 'test'
        browser = BrowserWindow.getFocusedWindow()
        if browser
          browser.loadUrl "file://#{process.env.PWD}/app/views/test.html"
    return
module.exports = MarkdownEditorWindows
