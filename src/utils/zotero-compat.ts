/**
 * Compatibility layer for Zotero 7–10
 * Handles differences in WebDAV password API between versions
 */

interface WebDavControllerLegacy {
  password: string
}

interface WebDavControllerModern {
  getPassword: () => Promise<string>
  setPassword: (password: string) => Promise<void>
}

/**
 * Get WebDAV password with compatibility for Zotero 7–10
 * Zotero 7: Uses synchronous property controller.password
 * Zotero 8/9: Uses async method controller.getPassword()
 */
export async function getWebdavPassword(): Promise<string> {
  const controller = Zotero.Sync.Runner.getStorageController('webdav')

  // Check modern API (Zotero 8+)
  if ('getPassword' in controller && typeof controller.getPassword === 'function') {
    return await (controller as WebDavControllerModern).getPassword()
  }

  // Zotero 7 (password property)
  return (controller as WebDavControllerLegacy).password
}

/**
 * Set WebDAV password with compatibility for Zotero 7–10
 * Zotero 7: Uses synchronous property controller.password = value
 * Zotero 8/9: Uses async method controller.setPassword(value)
 */
export async function setWebdavPassword(password: string): Promise<void> {
  const controller = Zotero.Sync.Runner.getStorageController('webdav')

  // Check modern API (Zotero 8+)
  if ('setPassword' in controller && typeof controller.setPassword === 'function') {
    await (controller as WebDavControllerModern).setPassword(password)
  }
  else {
    // Zotero 7 (password property)
    (controller as WebDavControllerLegacy).password = password
  }
}

/**
 * Discard a cached WebDAV controller before changing its settings.
 *
 * Zotero caches storage controllers. Zotero 10 resets this cache when the
 * WebDAV server settings change, so the next password write uses a controller
 * created from the new preferences. The optional calls preserve the existing
 * behavior on older Zotero versions where either method is unavailable.
 */
export function prepareWebdavConfigurationChange(): void {
  const runner = Zotero.Sync.Runner as typeof Zotero.Sync.Runner & {
    resetStorageController?: (mode: 'webdav') => void
  }
  const controller = runner.getStorageController('webdav')

  controller.clearCachedCredentials?.()
  Zotero.Prefs.set('sync.storage.verified', false)
  runner.resetStorageController?.('webdav')
}
