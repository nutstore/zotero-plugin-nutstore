import { BasicTool } from 'zotero-plugin-toolkit'
import { config } from '../package.json'
import Addon from './addon'

const basicTool = new BasicTool()

// @ts-ignore - Plugin instance is not typed
if (!basicTool.getGlobal('Zotero')[config.addonInstance]) {
  _globalThis.addon = new Addon()
  _globalThis.console = basicTool.getGlobal('window').console
  _globalThis.OS = ChromeUtils.importESModule('chrome://zotero/content/osfile.mjs').OS

  defineGlobal('ztoolkit', () => {
    return _globalThis.addon.data.ztoolkit
  })
  // @ts-ignore - Plugin instance is not typed
  Zotero[config.addonInstance] = addon
}

function defineGlobal(name: Parameters<BasicTool['getGlobal']>[0]): void
function defineGlobal(name: string, getter: () => any): void
function defineGlobal(name: string, getter?: () => any) {
  Object.defineProperty(_globalThis, name, {
    get() {
      return getter ? getter() : basicTool.getGlobal(name)
    },
  })
}
