import type { EnhancedWebdavConfig } from '../utils/enhanced-config'
import { config } from '../../package.json'
import { getElementById, hideElement, showElement } from '../utils/dom'
import { getEnhancedConfig } from '../utils/enhanced-config'
import { getString } from '../utils/locale'
import { reInitZoteroSync } from '../utils/nutstore'
import { getPrefWin } from '../utils/prefs'
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

export function restoreWebdavConfig() {
  forceSetNutstoreWebdavPerfs()
}

export async function handleClickEnhancedWebdavServerVerifyButton() {
  await startupVerifyEnhancedWebdav()
}

export async function handleClickEnhancedWebdavServerFixButton() {
  const win = getPrefWin()!
  const enhancedWebdavConfig = await getEnhancedConfig()

  if (!enhancedWebdavConfig) {
    Zotero.alert(win, getString('enhanced-webdav-config-not-found-title'), getString('enhanced-webdav-config-not-found-message'))
    return
  }

  setEnhanceWebdav(enhancedWebdavConfig)
}

export async function startupVerifyEnhancedWebdav() {
  const win = getPrefWin()!
  const enhancedWebdavConfig = await getEnhancedConfig()

  let success = false
  if (enhancedWebdavConfig) {
    const controller = Zotero.Sync.Runner.getStorageController('webdav')
    try {
      await controller.checkServer()
      success = true
    }
    catch (e: unknown) {
      ztoolkit.log('enhanced-webdav-server-verify-failed', e)
      success = await controller.handleVerificationError(e, win)
    }
  }

  if (!success) {
    Zotero.alert(win, getString('enhanced-webdav-server-verify-failed-title'), getString('enhanced-webdav-server-verify-failed-message'))
  }
}
