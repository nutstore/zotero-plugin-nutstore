import type { ProtocolExtension } from '../src/utils/protocol'
import { assert } from 'chai'
import {
  registerCustomProtocolPath,
  unregisterCustomProtocolPath,
} from '../src/utils/protocol'

function createProtocolExtension(): ProtocolExtension {
  return {
    noContent: true,
    doAction() {},
    newChannel() {},
  }
}

describe('custom protocol registration', () => {
  const path = 'nutstore-protocol-test'
  const uri = `zotero://${path}`

  function getExtension(spec: string) {
    const handler = Services.io
      .getProtocolHandler('zotero')
      .wrappedJSObject as any
    return handler.getExtension(Services.io.newURI(spec, undefined, undefined))
  }

  it('registers both current and legacy Nutstore SSO callback routes', () => {
    for (const callbackURI of [
      'zotero://nutstore-sync?s=legacy',
      'zotero://nutstore-sync/sso?s=current',
    ]) {
      const extension = getExtension(callbackURI)
      assert.isOk(extension)
      assert.isTrue(extension.noContent)
    }
  })

  it('replaces a stale handler when replacing an owned route', () => {
    const stale = createProtocolExtension()
    const replacement = createProtocolExtension()

    try {
      assert.isTrue(registerCustomProtocolPath(path, stale))
      assert.strictEqual(getExtension(uri), stale)

      assert.isTrue(
        registerCustomProtocolPath(path, replacement, { replace: true }),
      )
      assert.strictEqual(getExtension(uri), replacement)
    }
    finally {
      unregisterCustomProtocolPath(path, replacement)
    }
  })
})
