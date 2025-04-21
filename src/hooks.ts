import { registerNutstoreSSOProtocol } from './modules/nutstore-sso'
import { registerPerfObserver, registerPrefs, registerPrefsScripts } from './modules/preference'
import { initLocale } from './utils/locale'
import { createZToolkit } from './utils/ztoolkit'

async function onStartup() {
  await Promise.all([
    Zotero.initializationPromise,
    Zotero.unlockPromise,
    Zotero.uiReadyPromise,
  ])

  initLocale()

  registerNutstoreSSOProtocol()

  registerPerfObserver()

  registerPrefs()

  await Promise.all(
    Zotero.getMainWindows().map(win => onMainWindowLoad(win)),
  )
}

async function onMainWindowLoad(win: Window): Promise<void> {
  // Create ztoolkit for every window
  addon.data.ztoolkit = createZToolkit()

  // @ts-ignore This is a moz feature
  win.MozXULElement.insertFTLIfNeeded(
    `${addon.data.config.addonRef}-mainWindow.ftl`,
  )
}

async function onMainWindowUnload(win: Window): Promise<void> {
  ztoolkit.log('onMainWindowUnload', win)
  ztoolkit.unregisterAll()
  addon.data.dialog?.window?.close()
}

function onShutdown(): void {
  ztoolkit.unregisterAll()
  addon.data.dialog?.window?.close()
  // Remove addon object
  addon.data.alive = false
  // @ts-ignore - Plugin instance is not typed
  delete Zotero[addon.data.config.addonInstance]
}

/**
 * This function is just an example of dispatcher for Notify events.
 * Any operations should be placed in a function to keep this funcion clear.
 */
async function onNotify(
) {
}

/**
 * This function is just an example of dispatcher for Preference UI events.
 * Any operations should be placed in a function to keep this funcion clear.
 * @param type event type
 * @param data event data
 */
async function onPrefsEvent(type: string, data: { [key: string]: any }) {
  switch (type) {
    case 'load':
      registerPrefsScripts(data.window)
      break
    default:
  }
}

function onShortcuts() {
}

function onDialogEvents() {
}

// Add your hooks here. For element click, etc.
// Keep in mind hooks only do dispatch. Don't add code that does real jobs in hooks.
// Otherwise the code would be hard to read and maintain.

export default {
  onStartup,
  onShutdown,
  onMainWindowLoad,
  onMainWindowUnload,
  onNotify,
  onPrefsEvent,
  onShortcuts,
  onDialogEvents,
}
