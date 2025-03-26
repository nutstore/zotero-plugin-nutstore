import { config } from '../../package.json'

export interface OAuthResponse {
  username: string
  userid: string
  access_token: string
}

export const getSSOMethod = Zotero.lazy(() => {
  const sso = ChromeUtils.importESModule(`chrome://${config.addonRef}/content/lib/sso/index.js`) as NutstoreSSO

  function launchOAuthUrl() {
    const url = (addon.data.env === 'development' ? (sso as any)._dont_use_in_prod_createOAuthUrl : sso.createOAuthUrl)({ app: 'zotero' })
    Zotero.launchURL(url)
  }

  function decryptToken(token: string) {
    try {
      const result = (addon.data.env === 'development' ? (sso as any)._dont_use_in_prod_decrypt : sso.decrypt)({ app: 'zotero', s: token })
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
}) as () => {
  launchOAuthUrl: () => void
  decryptToken: (token: string) => OAuthResponse | null
}
