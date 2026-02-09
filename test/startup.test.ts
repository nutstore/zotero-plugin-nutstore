import { assert } from 'chai'
import { config } from '../package.json'

describe('startup', () => {
  it('should have plugin instance defined', () => {
    const zotero = Zotero as unknown as Record<string, unknown>
    assert.isNotEmpty(zotero[config.addonInstance])
  })
})
