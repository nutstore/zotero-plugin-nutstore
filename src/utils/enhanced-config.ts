export interface EnhancedWebdavConfig {
  WebDavServer: {
    Scheme: string
    Url: string
    Credentials: {
      Username: string
      Password: string
    }
  }
}

export async function getEnhancedConfig() {
  const path = getEnhancedConfigPath()
  if (!path)
    return null

  try {
    const config = await IOUtils.readJSON(path)
    return config as EnhancedWebdavConfig
  }
  catch (error) {
    ztoolkit.log('getEnhancedConfig', error)
    return null
  }
}

function getEnhancedConfigPath() {
  const homedir = (OS as any).Constants.Path.homeDir

  if (Zotero.isMac) {
    return PathUtils.join(homedir, 'Library', 'Application Support', 'Nutstore', 'Zotero', 'appsettings.json')
  }
  else if (Zotero.isWin) {
    return PathUtils.join(homedir, 'AppData', 'Roaming', 'Nutstore', 'Zotero', 'appsettings.json')
  }

  return null
}
