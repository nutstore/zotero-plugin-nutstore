import { config } from '../../package.json'
import { hideElement, showElement } from '../utils/dom'
import { getPref, getPrefWin } from '../utils/prefs'
import { isSyncStorageEnabled } from '../utils/ztoolkit'
import { updateEnhancedWebdav } from './enhanced-webdav'
import { updateNutstoreSSOPerfs } from './nutstore-sso'

export async function updateNutstorePerfs() {
  const win = getPrefWin()
  if (!win)
    return

  const isSyncStorage = await isSyncStorageEnabled()
  if (!isSyncStorage) {
    showDisabledStorageWarning()
    return
  }

  hideDisabledStorageWarning()

  const envMode = getPref('nutstore-env-mode')
  if (envMode === 'sso') {
    showNutstoreSSOWebdav()
    updateNutstoreSSOPerfs()
  }
  else if (envMode === 'enhanced') {
    showNutstoreEnhancedWebdav()
    updateEnhancedWebdav()
  }
}

function showDisabledStorageWarning() {
  const prefWin = getPrefWin()
  if (!prefWin)
    return
  showElement(`${config.addonRef}-disabled-storage-warning-groupbox`, prefWin)
  hideElement(`${config.addonRef}-sso-groupbox`, prefWin)
  hideElement(`${config.addonRef}-enhanced-webdav-groupbox`, prefWin)
}

function hideDisabledStorageWarning() {
  const prefWin = getPrefWin()
  if (!prefWin)
    return
  hideElement(`${config.addonRef}-disabled-storage-warning-groupbox`, prefWin)
}

function showNutstoreSSOWebdav() {
  const prefWin = getPrefWin()
  if (!prefWin)
    return
  showElement(`${config.addonRef}-sso-groupbox`, prefWin)
  hideElement(`${config.addonRef}-enhanced-webdav-groupbox`, prefWin)
}

function showNutstoreEnhancedWebdav() {
  const prefWin = getPrefWin()
  if (!prefWin)
    return
  showElement(`${config.addonRef}-enhanced-webdav-groupbox`, prefWin)
  hideElement(`${config.addonRef}-sso-groupbox`, prefWin)
}
