import { _dont_use_in_prod_createOAuthUrl, _dont_use_in_prod_decryptSecret as _dont_use_in_prod_decrypt, createOAuthUrl, decryptSecret as decrypt } from '@nutstore/sso-js'

export interface OAuthResponse {
  username: string
  userid: string
  access_token: string
}

async function launchOAuthUrl() {
  const url = await (addon.data.env === 'development' ? _dont_use_in_prod_createOAuthUrl : createOAuthUrl)({ app: 'zotero' })
  Zotero.launchURL(url)
}

async function decryptToken(token: string) {
  try {
    const result = await (addon.data.env === 'development' ? _dont_use_in_prod_decrypt : decrypt)({ app: 'zotero', s: token })
    return JSON.parse(result) as OAuthResponse
  }
  catch (e) {
    ztoolkit.log('[Nutstore SSO] decrypt error', e)
  }
}

export {
  decryptToken,
  launchOAuthUrl,
}
