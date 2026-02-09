/**
 * Compatibility layer for Zotero 7 and 8
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
 * Get WebDAV password with compatibility for both Zotero 7 and 8
 * Zotero 7: Uses synchronous property controller.password
 * Zotero 8: Uses async method controller.getPassword()
 */
export async function getWebdavPassword(): Promise<string> {
  const controller = Zotero.Sync.Runner.getStorageController('webdav')

  // Check if Zotero 8 (has getPassword method)
  if ('getPassword' in controller && typeof controller.getPassword === 'function') {
    return await (controller as WebDavControllerModern).getPassword()
  }

  // Zotero 7 (password property)
  return (controller as WebDavControllerLegacy).password
}

/**
 * Set WebDAV password with compatibility for both Zotero 7 and 8
 * Zotero 7: Uses synchronous property controller.password = value
 * Zotero 8: Uses async method controller.setPassword(value)
 */
export async function setWebdavPassword(password: string): Promise<void> {
  const controller = Zotero.Sync.Runner.getStorageController('webdav')

  // Check if Zotero 8 (has setPassword method)
  if ('setPassword' in controller && typeof controller.setPassword === 'function') {
    await (controller as WebDavControllerModern).setPassword(password)
  }
  else {
    // Zotero 7 (password property)
    (controller as WebDavControllerLegacy).password = password
  }
}
