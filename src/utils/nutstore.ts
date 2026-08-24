import { getElement } from './dom'
import { getPrefWin } from './prefs'
import { getWebdavPassword } from './zotero-compat'

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

/**
 * Refresh the native storage settings UI after a plugin-driven configuration
 * change without rerunning Zotero 10's heavier Account-pane initialization.
 */
export async function reInitZoteroSync() {
  const win = getPrefWin()
  const sync = win?.Zotero_Preferences?.Sync
  if (!win || !sync)
    return

  if (Number.parseInt(Zotero.version, 10) >= 10) {
    await sync.updateStorageSettingsUI?.()
    const passwordInput = getElement('#storage-password', win.document) as HTMLInputElement
    if (passwordInput)
      passwordInput.value = await getWebdavPassword()
    sync.storeLastStorageSettings?.()
    return
  }

  await sync.init?.()
}

export function clearStoragePasswordInputValue() {
  const win = getPrefWin()
  if (!win)
    return
  const passwordInput = getElement('#storage-password', win.document) as HTMLInputElement

  if (passwordInput) {
    passwordInput.value = ''
  }
}
