import type { ProtocolExtension } from '../utils/protocol'
import { getString } from '../utils/locale'
import { setPref } from '../utils/prefs'
import { registerCustomProtocolPath } from '../utils/protocol'
import { getSSOMethod } from '../utils/sso'
import { setNutstoreWebdavPerfs, updateNutstorePerfs } from './nutstore'

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

export function registerNutstoreSSOProtocol() {
  registerCustomProtocolPath('nutstore-sync', new SSOProtocol())
}

async function onNutstoreSSOProtocolCall(token: string) {
  const { decryptToken } = await getSSOMethod()
  const result = decryptToken(token)

  if (result) {
    ztoolkit.log('[Nutstore SSO] decrypt success', result)
    setPref('nutstore-sso-token', token)
    updateNutstorePerfs()

    const confirm = Zotero.Prompt.confirm({
      window: Zotero.getMainWindow(),
      title: getString('nutstore-webdav'),
      text: getString('auto-write-nutstore-webdav-text'),
      button0: getString('auto-write-nutstore-webdav-text-button0'),
      button1: getString('auto-write-nutstore-webdav-text-button1'),
    })

    if (confirm === 0) {
      setNutstoreWebdavPerfs()
      setPref('nutstore-webdav-force-set', true)
    }
    else {
      updateNutstorePerfs()
    }
  }
}
