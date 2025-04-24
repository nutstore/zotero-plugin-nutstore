import type { EnhancedWebdavConfig } from '../utils/enhanced-config'
import { config } from '../../package.json'
import { hideElement, showElement } from '../utils/dom'
import { getEnhancedConfig } from '../utils/enhanced-config'
import { getString } from '../utils/locale'
import { reInitZoteroSync } from '../utils/nutstore'
import { getPref, getPrefWin } from '../utils/prefs'
import { getSSOMethod } from '../utils/sso'
import { forceSetNutstoreWebdavPerfs } from './nutstore-sso'

export async function handleEnhancedWebdav() {
  const win = getPrefWin()!

  const config = await getEnhancedConfig()!

  if (!config) {
    Zotero.alert(win, getString('enhanced-webdav-config-not-found-title'), getString('enhanced-webdav-config-not-found-message'))
    return
  }

  const token = getPref('nutstore-sso-token')
  const oauthInfo = (await getSSOMethod()).decryptToken(token)

  const tokenUsername = oauthInfo?.username
  const configUsername = config.WebDavServer.Credentials.Username

  if (tokenUsername !== configUsername) {
    Zotero.alert(win, getString('username-not-match-title'), getString('username-not-match-message'))
    return
  }

  setEnhanceWebdav(config)
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
  ztoolkit.log('setEnhanceWebdav', config.WebDavServer.Credentials.Password)

  Zotero.Sync.Runner.getStorageController('webdav').password = config.WebDavServer.Credentials.Password

  reInitZoteroSync()
}

export function restoreWebdavConfig() {
  forceSetNutstoreWebdavPerfs()
}
