const ZOTERO_SCHEME = 'zotero'

export function registerCustomProtocolPath(path: string, ext: ProtocolExtension) {
  const protocolHandler = Services.io.getProtocolHandler(ZOTERO_SCHEME)
  ;(protocolHandler as any).wrappedJSObject._extensions[`${ZOTERO_SCHEME}://${path}`] = ext
}

export interface ProtocolExtension {
  noContent: boolean
  doAction: (uri: nsIURI) => Promise<void> | void
  newChannel: (uri: nsIURI) => void
}
