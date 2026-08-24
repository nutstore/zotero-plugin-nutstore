const ZOTERO_SCHEME = 'zotero'

type ProtocolExtensions = Record<string, ProtocolExtension>

function getCustomProtocolExtensions(): ProtocolExtensions | undefined {
  try {
    const protocolHandler = Services.io.getProtocolHandler(ZOTERO_SCHEME) as any
    const extensions = protocolHandler.wrappedJSObject?._extensions
    return extensions && typeof extensions === 'object'
      ? extensions as ProtocolExtensions
      : undefined
  }
  catch {
    return undefined
  }
}

export function registerCustomProtocolPath(path: string, ext: ProtocolExtension): boolean {
  const extensions = getCustomProtocolExtensions()
  const uri = `${ZOTERO_SCHEME}://${path}`

  if (!extensions)
    return false

  try {
    if (extensions[uri] && extensions[uri] !== ext)
      return false

    extensions[uri] = ext
    return true
  }
  catch {
    return false
  }
}

export function unregisterCustomProtocolPath(path: string, ext: ProtocolExtension): void {
  const extensions = getCustomProtocolExtensions()
  const uri = `${ZOTERO_SCHEME}://${path}`

  try {
    if (extensions?.[uri] === ext)
      delete extensions[uri]
  }
  catch {
    // Ignore failures from Zotero's private protocol extension registry.
  }
}

export interface ProtocolExtension {
  noContent: boolean
  doAction: (uri: nsIURI) => Promise<void> | void
  newChannel: (uri: nsIURI) => void
}
