import { config } from '../../package.json'
import { hideElement, showElement } from '../utils/dom'
import { getString } from '../utils/locale'
import { reInitZoteroSync } from '../utils/nutstore'
import { getPref, getPrefWin, setPref } from '../utils/prefs'
import { getSSOMethod } from '../utils/sso'
import { forceSetNutstoreWebdavPerfs } from './nutstore-sso'

interface EnhancedWebdavConfig {
  WebDavServer: {
    Scheme: string
    Url: string
    Credentials: {
      Username: string
      Password: string
    }
  }
}

export async function handleEnhancedWebdav() {
  const isEnhancedWebdav = getPref('nutstore-enhanced-webdav')
  const storageEnabled = Zotero.Prefs.get('sync.storage.enabled')
  const win = getPrefWin()!

  if (win && !storageEnabled) {
    Zotero.alert(win, getString('storage-not-enabled-title'), getString('storage-not-enabled-message'))
    return
  }

  if (isEnhancedWebdav) {
    hideNutstoreSSOWebdav()
    const homedir = OS.Constants.Path.homeDir
    const config = await IOUtils.readJSON(PathUtils.join(homedir, 'Documents', 'webdav-test.json')) as EnhancedWebdavConfig

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
  else {
    restoreWebdavConfig()
    showNutstoreSSOWebdav()
  }
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
