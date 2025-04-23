import { config } from '../../package.json'
import { getString } from '../utils/locale'
import { clearPref, getPrefWin, setPref } from '../utils/prefs'
import { getSSOMethod } from '../utils/sso'
import { handleEnhancedWebdav } from './enhanced-webdav'
import { clearNutstoreWebdavPerfs, forceSetNutstoreWebdavPerfs, syncPerfObserver, updateNutstorePerfs } from './nutstore-sso'

export function registerPrefs() {
  Zotero.PreferencePanes.register({
    pluginID: addon.data.config.addonID,
    src: `${rootURI}content/preferences.xhtml`,
    label: getString('prefs-title'),
    image: `chrome://${addon.data.config.addonRef}/content/icons/favicon.png`,
  })
}

export async function registerPrefsScripts(_window: Window) {
  // This function is called when the prefs window is opened
  // See addon/content/preferences.xhtml onpaneload
  if (!addon.data.prefs) {
    addon.data.prefs = {
      window: _window,
    }
  }
  else {
    addon.data.prefs.window = _window
  }

  updatePrefsUI()
  bindPrefEvents()
}

export function registerPerfObserver() {
  const syncPerfIDS = [
    Zotero.Prefs.registerObserver('sync.storage.enabled', syncPerfObserver),
    Zotero.Prefs.registerObserver('sync.storage.protocol', syncPerfObserver),
    Zotero.Prefs.registerObserver('sync.storage.scheme', syncPerfObserver),
    Zotero.Prefs.registerObserver('sync.storage.username', syncPerfObserver),
    Zotero.Prefs.registerObserver('sync.storage.url', syncPerfObserver),
  ]

  Zotero.addShutdownListener(() => {
    syncPerfIDS.forEach(id => Zotero.Prefs.unregisterObserver(id))
  })
}

async function updatePrefsUI() {
  // You can initialize some UI elements on prefs window
  // with addon.data.prefs.window.document
  // Or bind some events to the elements
  const renderLock = ztoolkit.getGlobal('Zotero').Promise.defer()
  if (addon.data.prefs?.window == null)
    return
  updateNutstorePerfs()
  await renderLock.promise
  ztoolkit.log('Preference table rendered!')
}

function bindPrefEvents() {
  const window = getPrefWin()
  if (window == null)
    return

  window.document.querySelector(
    `#${config.addonRef}-sso-login`,
  )?.addEventListener('command', async () => {
    const { launchOAuthUrl } = await getSSOMethod()
    launchOAuthUrl()
  })

  window.document.querySelector(
    `#${config.addonRef}-sso-logout`,
  )?.addEventListener('command', () => {
    clearNutstoreWebdavPerfs()

    clearPref('nutstore-sso-token')
    setPref('nutstore-enhanced-webdav', false)
    updateNutstorePerfs()
  })

  window.document.querySelector(
    `#${config.addonRef}-force-fix-nutstore-webdav-button`,
  )?.addEventListener('command', () => {
    forceSetNutstoreWebdavPerfs()
  })

  window.document.querySelector(
    `#${config.addonRef}-enhanced-webdav-checkbox`,
  )?.addEventListener('command', () => {
    handleEnhancedWebdav()
  })
}
