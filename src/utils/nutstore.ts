import { getElement } from './dom'
import { getPrefWin } from './prefs'

export function getNutstoreWebdavUrl() {
  return addon.data.env === 'development' ? 'dav-demo.jianguoyun.com/dav' : 'dav.jianguoyun.com/dav'
}

export function isNutstoreWebdav() {
  const currentSyncEnabled = Zotero.Prefs.get('sync.storage.enabled')
  const currentSyncProtocol = Zotero.Prefs.get('sync.storage.protocol')
  const currentSyncScheme = Zotero.Prefs.get('sync.storage.scheme')
  const currentSyncUrl = Zotero.Prefs.get('sync.storage.url')

  return currentSyncEnabled && currentSyncProtocol === 'webdav' && currentSyncScheme === 'https' && currentSyncUrl === getNutstoreWebdavUrl()
}

export function reInitZoteroSync() {
  const win = getPrefWin()
  if (!win)
    return

  if (win.Zotero_Preferences.Sync) {
    win.Zotero_Preferences.Sync.init()
  }
}

export function clearStoragePasswordInputValue() {
  const win = getPrefWin()
  if (!win)
    return
  const passwordInput = getElement(`vbox#zotero-prefpane-sync input#storage-password`, win.document) as HTMLInputElement

  if (passwordInput) {
    passwordInput.value = ''
  }
}
