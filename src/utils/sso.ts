import { once } from './F'

export interface OAuthResponse {
  username: string
  userid: string
  access_token: string
}

const importSSO = once(async () => {
  return import('@nutstore/sso-wasm')
})

export async function getSSOMethod() {
  const sso = await importSSO()
  ztoolkit.log('sso', sso)
  function launchOAuthUrl() {
    const url = (addon.data.env === 'development' ? sso._dont_use_in_prod_createOAuthUrl : sso.createOAuthUrl)({ app: 'zotero' })
    Zotero.launchURL(url)
  }

  function decryptToken(token: string) {
    try {
      const result = (addon.data.env === 'development' ? sso._dont_use_in_prod_decrypt : sso.decrypt)({ app: 'zotero', s: token })
      return JSON.parse(result) as OAuthResponse
    }
    catch (e) {
      ztoolkit.log('[Nutstore SSO] decrypt error', e)
    }
  }

  return {
    launchOAuthUrl,
    decryptToken,
  }
}
