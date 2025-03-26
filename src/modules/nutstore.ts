import { config } from '../../package.json'
import { getElementById, hideElement, showElement } from '../utils/dom'
import { clearStoragePasswordInputValue, getNutstoreWebdavUrl, isNutstoreWebdav, reInitZoteroSync } from '../utils/nutstore'
import { getPref, getPrefWin, setPref } from '../utils/prefs'
import { getSSOMethod } from '../utils/sso'

export { onNutstoreSSOProtocolCall, registerNutstoreSSOProtocol } from './protocol'

export function updateNutstorePerfs() {
  const prefWin = getPrefWin()
  if (!prefWin)
    return
  const nutstoreToken = getPref('nutstore-sso-token')

  if (nutstoreToken) {
    const oauthInfo = getSSOMethod().decryptToken(nutstoreToken)

    const usernameLabel = getElementById(`${config.addonRef}-sso-username`, prefWin)

    hideElement(`${config.addonRef}-sso-button-container`, prefWin)
    showElement(`${config.addonRef}-authorized-container`, prefWin)

    if (!oauthInfo || !usernameLabel)
      return
    usernameLabel.dataset.l10nArgs = JSON.stringify({ username: oauthInfo.username })

    updateForceButtonEnabled()
  }
  else {
    showElement(`${config.addonRef}-sso-button-container`, prefWin)
    hideElement(`${config.addonRef}-authorized-container`, prefWin)
  }
}

async function updateForceButtonEnabled() {
  const isNSWebdav = isNutstoreWebdav()
  if (!isNSWebdav) {
    toggleForceFixNutstoreWebdavButton('enabled')
    return
  }

  const token = getPref('nutstore-sso-token')

  if (!token || typeof token !== 'string') {
    toggleForceFixNutstoreWebdavButton('enabled')
    return
  }

  const oauthInfo = getSSOMethod().decryptToken(token)

  if (!oauthInfo) {
    toggleForceFixNutstoreWebdavButton('enabled')
    return
  }

  const currentUsername = Zotero.Prefs.get('sync.storage.username')
  const currentPassword = await Zotero.Sync.Runner.getStorageController('webdav').getPassword()

  if (currentUsername !== oauthInfo.username || currentPassword !== oauthInfo.access_token) {
    toggleForceFixNutstoreWebdavButton('enabled')
  }
  else {
    toggleForceFixNutstoreWebdavButton('disabled')
  }
}

function toggleForceFixNutstoreWebdavButton(status: 'enabled' | 'disabled') {
  const prefWin = getPrefWin()
  if (!prefWin)
    return
  const forceButton = getElementById(`${config.addonRef}-force-fix-nutstore-webdav-button`, prefWin)
  if (!forceButton)
    return;
  (forceButton as HTMLButtonElement).setAttribute('disabled', status === 'disabled' ? 'true' : 'false')
  ztoolkit.log(prefWin.document.getElementById(`${config.addonRef}-current-nutstore-webdav-error-container`))

  if (status === 'disabled') {
    hideElement(`${config.addonRef}-current-nutstore-webdav-error-container`, prefWin)
    showElement(`${config.addonRef}-current-nutstore-webdav-success-container`, prefWin)
  }
  else {
    hideElement(`${config.addonRef}-current-nutstore-webdav-success-container`, prefWin)
    showElement(`${config.addonRef}-current-nutstore-webdav-error-container`, prefWin)
  }
}

export async function setNutstoreWebdavPerfs() {
  const nutstoreToken = getPref('nutstore-sso-token')
  const oauthInfo = getSSOMethod().decryptToken(nutstoreToken)
  if (!oauthInfo)
    return
  Zotero.Prefs.set('sync.storage.enabled', true)
  Zotero.Prefs.set('sync.storage.protocol', 'webdav')
  Zotero.Prefs.set('sync.storage.scheme', 'https')
  Zotero.Prefs.set('sync.storage.username', oauthInfo.username)
  Zotero.Prefs.set('sync.storage.url', getNutstoreWebdavUrl())
  await Zotero.Sync.Runner.getStorageController('webdav').setPassword(oauthInfo.access_token)

  reInitZoteroSync()
}

export async function clearNutstoreWebdavPerfs() {
  const nutstoreToken = getPref('nutstore-sso-token')
  const oauthInfo = getSSOMethod().decryptToken(nutstoreToken)
  if (!oauthInfo)
    return
  const forceSet = getPref('nutstore-webdav-force-set')
  if (!forceSet)
    return

  if (!isNutstoreWebdav())
    return

  Zotero.Prefs.set('sync.storage.username', '')
  Zotero.Prefs.set('sync.storage.url', '')
  await Zotero.Sync.Runner.getStorageController('webdav').setPassword('')

  clearStoragePasswordInputValue()
}

export async function forceSetNutstoreWebdavPerfs() {
  const nutstoreToken = getPref('nutstore-sso-token')
  if (!nutstoreToken)
    return
  const oauthInfo = getSSOMethod().decryptToken(nutstoreToken)
  if (!oauthInfo)
    return

  Zotero.Prefs.set('sync.storage.enabled', true)
  Zotero.Prefs.set('sync.storage.protocol', 'webdav')
  Zotero.Prefs.set('sync.storage.scheme', 'https')
  Zotero.Prefs.set('sync.storage.username', oauthInfo.username)
  Zotero.Prefs.set('sync.storage.url', getNutstoreWebdavUrl())
  await Zotero.Sync.Runner.getStorageController('webdav').setPassword(oauthInfo.access_token)
  reInitZoteroSync()

  setPref('nutstore-webdav-force-set', true)
}

export function syncPerfObserver() {
  updateNutstorePerfs()
}
