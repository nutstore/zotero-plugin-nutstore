import type { ProtocolExtension } from '../utils/protocol'
import { getString } from '../utils/locale'
import { setPref } from '../utils/prefs'
import { registerCustomProtocolPath, unregisterCustomProtocolPath } from '../utils/protocol'
import { decryptToken } from '../utils/sso'
import { forceSetNutstoreWebdavPerfs, updateNutstoreSSOPerfs } from './nutstore-sso'

class SSOProtocol implements ProtocolExtension {
  noContent = true
  doAction(uri: nsIURI) {
    const url = new (ztoolkit.getGlobal('URL'))(uri.spec)
    const s = url.searchParams.get('s')
    if (s) {
      onNutstoreSSOProtocolCall(s)
    }
  }

  newChannel(uri: nsIURI) {
    this.doAction(uri)
  }
}

let registeredSSOProtocol: SSOProtocol | undefined

export function registerNutstoreSSOProtocol() {
  if (registeredSSOProtocol)
    return

  const protocol = new SSOProtocol()
  if (registerCustomProtocolPath('nutstore-sync', protocol)) {
    registeredSSOProtocol = protocol
  }
  else {
    ztoolkit.log('[Nutstore SSO] unable to register zotero://nutstore-sync protocol handler')
  }
}

export function unregisterNutstoreSSOProtocol() {
  if (!registeredSSOProtocol)
    return

  unregisterCustomProtocolPath('nutstore-sync', registeredSSOProtocol)
  registeredSSOProtocol = undefined
}

async function onNutstoreSSOProtocolCall(token: string) {
  const result = await decryptToken(token)

  if (result) {
    ztoolkit.log('[Nutstore SSO] decrypt success', result)
    setPref('nutstore-sso-token', token)
    updateNutstoreSSOPerfs()

    const confirm = Zotero.Prompt.confirm({
      window: Zotero.getMainWindow(),
      title: getString('nutstore-webdav'),
      text: getString('auto-write-nutstore-webdav-text'),
      button0: getString('auto-write-nutstore-webdav-text-button0'),
      button1: getString('auto-write-nutstore-webdav-text-button1'),
    })

    if (confirm === 0) {
      forceSetNutstoreWebdavPerfs()
    }
    else {
      updateNutstoreSSOPerfs()
    }
  }
}
