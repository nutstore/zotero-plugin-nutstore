import { updateNutstorePerfs } from '.'
import { config } from '../../package.json'
import { getEnhancedConfig } from '../utils/enhanced-config'
import { getString } from '../utils/locale'
import { clearPref, getPrefWin, setPref } from '../utils/prefs'
import { launchOAuthUrl } from '../utils/sso'
import { handleClickEnhancedWebdavServerFixButton, handleClickEnhancedWebdavServerVerifyButton } from './enhanced-webdav'
import { clearNutstoreWebdavPerfs, forceSetNutstoreWebdavPerfs, updateNutstoreSSOPerfs } from './nutstore-sso'

export function registerPrefs() {
  Zotero.PreferencePanes.register({
    pluginID: addon.data.config.addonID,
    src: `${rootURI}content/preferences.xhtml`,
    label: getString('prefs-title'),
    image: `chrome://${addon.data.config.addonRef}/content/icons/favicon.png`,
  })

  initNutstoreEnvMode()
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
    Zotero.Prefs.registerObserver('sync.storage.enabled', updateNutstoreSSOPerfs),
    Zotero.Prefs.registerObserver('sync.storage.protocol', updateNutstoreSSOPerfs),
    Zotero.Prefs.registerObserver('sync.storage.scheme', updateNutstoreSSOPerfs),
    Zotero.Prefs.registerObserver('sync.storage.username', updateNutstoreSSOPerfs),
    Zotero.Prefs.registerObserver('sync.storage.url', updateNutstoreSSOPerfs),
  ]

  const unregisterNotifier = Zotero.Notifier.registerObserver({
    notify: () => {
      updateNutstorePerfs()
    },
  }, ['api-key'])

  Zotero.addShutdownListener(() => {
    syncPerfIDS.forEach(id => Zotero.Prefs.unregisterObserver(id))
    Zotero.Notifier.unregisterObserver(unregisterNotifier)
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
    launchOAuthUrl()
  })

  window.document.querySelector(
    `#${config.addonRef}-sso-logout`,
  )?.addEventListener('command', () => {
    clearNutstoreWebdavPerfs()

    clearPref('nutstore-sso-token')
    updateNutstoreSSOPerfs()
  })

  window.document.querySelector(
    `#${config.addonRef}-force-fix-nutstore-webdav-button`,
  )?.addEventListener('command', () => {
    forceSetNutstoreWebdavPerfs()
  })

  window.document.querySelector(
    `#${config.addonRef}-enhanced-webdav-server-verify-button`,
  )?.addEventListener('command', () => {
    handleClickEnhancedWebdavServerVerifyButton()
  })

  window.document.querySelector(
    `#${config.addonRef}-enhanced-webdav-server-fix-button`,
  )?.addEventListener('command', () => {
    handleClickEnhancedWebdavServerFixButton()
  })
}

async function initNutstoreEnvMode() {
  if (Zotero.isWin) {
    const enhancedConfig = await getEnhancedConfig()
    if (enhancedConfig) {
      setPref('nutstore-env-mode', 'enhanced')
      return
    }
  }

  setPref('nutstore-env-mode', 'enhanced')
}
