import type { EnhancedWebdavConfig } from '../utils/enhanced-config'
import { config } from '../../package.json'
import { getElementById, hideElement, showElement } from '../utils/dom'
import { getEnhancedConfig } from '../utils/enhanced-config'
import { getString } from '../utils/locale'
import { reInitZoteroSync } from '../utils/nutstore'
import { getPrefWin } from '../utils/prefs'
import { isSyncStorageEnabled } from '../utils/ztoolkit'
import { forceSetNutstoreWebdavPerfs } from './nutstore-sso'

export async function updateEnhancedWebdav() {
  const win = getPrefWin()!

  const enhancedWebdavConfig = await getEnhancedConfig()

  if (!enhancedWebdavConfig) {
    Zotero.alert(win, getString('enhanced-webdav-config-not-found-title'), getString('enhanced-webdav-config-not-found-message'))
    return
  }

  const usernameLabel = getElementById(`${config.addonRef}-enhanced-webdav-username`, win)

  if (usernameLabel) {
    usernameLabel.dataset.l10nArgs = JSON.stringify({ username: enhancedWebdavConfig.WebDavServer.Credentials.Username })
  }

  setEnhanceWebdav(enhancedWebdavConfig)
  hideNutstoreSSOWebdav()
}

export function showEnhancedWebdav() {
  // Enhanced webdav is only supported on Windows now
  if (!Zotero.isWin)
    return

  const prefWin = getPrefWin()
  showElement(`${config.addonRef}-enhanced-webdav-groupbox`, prefWin)
}

export function hideEnhancedWebdav() {
  const prefWin = getPrefWin()
  hideElement(`${config.addonRef}-enhanced-webdav-groupbox`, prefWin)
}

export function hideNutstoreSSOWebdav() {
  const prefWin = getPrefWin()
  hideElement(`${config.addonRef}-nutstore-webdav-setting-container`, prefWin)
}

export function showNutstoreSSOWebdav() {
  const prefWin = getPrefWin()
  showElement(`${config.addonRef}-nutstore-webdav-setting-container`, prefWin)
}

export function setEnhanceWebdav(config: EnhancedWebdavConfig) {
  Zotero.Prefs.set('sync.storage.protocol', 'webdav')
  Zotero.Prefs.set('sync.storage.scheme', config.WebDavServer.Scheme)
  Zotero.Prefs.set('sync.storage.username', config.WebDavServer.Credentials.Username)
  Zotero.Prefs.set('sync.storage.url', config.WebDavServer.Url)

  Zotero.Sync.Runner.getStorageController('webdav').password = config.WebDavServer.Credentials.Password

  reInitZoteroSync()
}

export function ensureEnhancedWebdav(config: EnhancedWebdavConfig) {
  const currentProtocol = Zotero.Prefs.get('sync.storage.protocol')
  const currentScheme = Zotero.Prefs.get('sync.storage.scheme')
  const currentUsername = Zotero.Prefs.get('sync.storage.username')
  const currentUrl = Zotero.Prefs.get('sync.storage.url')

  if (currentProtocol !== config.WebDavServer.Scheme || currentScheme !== config.WebDavServer.Scheme || currentUsername !== config.WebDavServer.Credentials.Username || currentUrl !== config.WebDavServer.Url) {
    setEnhanceWebdav(config)
  }
}

export function restoreWebdavConfig() {
  forceSetNutstoreWebdavPerfs()
}

export async function handleClickEnhancedWebdavServerVerifyButton() {
  const win = getPrefWin()!
  const verifyButton = getElementById(`${config.addonRef}-enhanced-webdav-server-verify-button`, win)!
  const abortButton = getElementById(`${config.addonRef}-enhanced-webdav-server-verify-abort-button`, win)!
  let request: XMLHttpRequest | null = null

  try {
    hideElement(verifyButton, win)
    showElement(abortButton, win)
    const success = await startupVerifyEnhancedWebdav((r) => {
      request = r
    })

    abortButton.onclick = () => {
      if (request) {
        request.onreadystatechange = null
        request.abort()
      }
      hideElement(abortButton, win)
      showElement(verifyButton, win)
    }

    if (success) {
      Zotero.alert(win, getString('enhanced-webdav-server-verify-success-title'), getString('enhanced-webdav-server-verify-success-message'))
    }
  }
  catch {

  }
  finally {
    hideElement(abortButton, win)
    showElement(verifyButton, win)
  }
}

export async function handleClickEnhancedWebdavServerFixButton() {
  const win = getPrefWin()!
  const enhancedWebdavConfig = await getEnhancedConfig()

  if (!enhancedWebdavConfig) {
    Zotero.alert(win, getString('enhanced-webdav-config-not-found-title'), getString('enhanced-webdav-config-not-found-message'))
    return
  }

  setEnhanceWebdav(enhancedWebdavConfig)

  Zotero.alert(win, getString('enhanced-webdav-server-fix-success-title'), getString('enhanced-webdav-server-fix-success-message'))

  updateEnhancedWebdav()
}

export async function startupVerifyEnhancedWebdav(onRequest?: (request: XMLHttpRequest) => void) {
  onRequest = onRequest || (() => { })
  const syncEnabled = await isSyncStorageEnabled()
  if (!syncEnabled)
    return

  const win = getPrefWin()!
  const enhancedWebdavConfig = await getEnhancedConfig()

  let success = false
  if (enhancedWebdavConfig) {
    ensureEnhancedWebdav(enhancedWebdavConfig)
    const controller = Zotero.Sync.Runner.getStorageController('webdav')
    try {
      await controller.checkServer({
        onRequest,
      })
      success = true
    }
    catch {
      Zotero.alert(win, getString('enhanced-webdav-server-verify-failed-title'), getString('enhanced-webdav-server-verify-failed-message'))
    }
  }

  return success
}
