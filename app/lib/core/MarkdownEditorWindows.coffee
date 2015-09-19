  Storage = require "#{process.cwd()}/app/lib/storage/storage"
  BrowserWindow = require 'browser-window'
  Menu = require 'menu'

  class MarkdownEditorWindows
    constructor: (app) ->
      @browsers = []
      @initMenu app
      @newEditor()
    initMenu: (app) ->
      template = require("#{process.cwd()}/app/lib/core/menus/main_menu")
      Menu.setApplicationMenu(Menu.buildFromTemplate(template(app, BrowserWindow)))
      return
    newEditor: (file) ->
      options = 
        width: 800
        height: 600
      if (@browsers.length > 0)
        options.width = min(options.width, @browsers[@browsers.length-1].getBounds().width)
        options.height = min(options.height, @browsers[@browsers.length-1].getBounds().height)
      browser = new BrowserWindow(options)
      browser.loadUrl "file://#{process.cwd()}/app/views/index.html"
      browser.on 'closed', ->
        if(index = @browsers.indexOf(browser) isnt -1)
          @browsers.splice browser, 1
      @browsers.push browser

  module.exports = MarkdownEditorWindows
