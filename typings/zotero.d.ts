declare namespace Zotero {

  namespace Prompt {
    function confirm({ window: Window, title: string, text: string, button0: string, button1: string }): 0 | 1
  }

  namespace HTTP {
    namespace CookieBlocker {
      function addURL(url: string): void
    }
  }

  namespace Sync {

    namespace Runner {

      function getStorageController(mode: 'webdav'): Zotero.Sync.Storage.Mode.WebDAV
    }

    // 先占个位置，有空再补充
    namespace Storage {
      class Request {

      }

      class Result {

      }

      namespace Mode {
        interface DeletedStorageFileResult {
          deleted: Set<string>
          missing: Set<string>
          errors: Set<string>
        }

        class WebDAV {
          mode: 'webdav'
          name: string

          ERROR_DELAY_INTERVALS: [2500]
          ERROR_DELAY_MAX: 3000

          get verified(): boolean
          set verified(value: boolean)

          _parentURI: nsIURI | null
          _rootURI: nsIURI | null
          _cachedCredentials: boolean

          readonly _loginManagerHost: 'chrome://zotero'
          readonly _loginManagerRealm: 'Zotero Storage Server'

          get defaultError(): string
          get defaultErrorRestart(): string

          get username(): string

          get password(): string

          set password(password: string): void

          get rootURI(): nsIURI | never
          get parentURI(): nsIURI | never

          _init(): Promise<void>

          cacheCredentials: _ZoteroTypes.Promise.Bluebird<void>
          clearCachedCredentials(): void

          downloadFile(request: Zotero.Sync.Storage.Request): Promise<Zotero.Sync.Storage.Result>

          uploadFile(request: Zotero.Sync.Storage.Request): _ZoteroTypes.Promise.Bluebird<Zotero.Sync.Storage.Result>

          checkServer(): _ZoteroTypes.Promise.Bluebird<void>

          handleVerificationError(error: Error, window: Window, skipSuccessMessage?: boolean): _ZoteroTypes.Promise.Bluebird<boolean>

          purgeDeletedStorageFiles(libraryID: number): _ZoteroTypes.Promise.Bluebird<DeletedStorageFileResult>

          purgeOrphanedStorageFiles(): _ZoteroTypes.Promise.Bluebird<DeletedStorageFileResult>

          _getStorageFileMetadata(item: Zotero.Item, request: Zotero.Sync.Storage.Request): _ZoteroTypes.Promise.Bluebird<{
            mtime: number
            md5: boolean
          }>

          _setStorageFileMetadata(item: Zotero.Item): _ZoteroTypes.Promise.Bluebird<void>

          _onUploadComplete(req: XMLHttpRequest, request: Zotero.Sync.Storage.Request, item: Zotero.Item, params: any): _ZoteroTypes.Promise.Bluebird<void>

          _onUploadCancel(httpRequest: XMLHttpRequest, status: number, data: any): _ZoteroTypes.Promise.Bluebird<void>

          _createServerDirectory(): Zotero.HTTP.Request

          _getItemURI(item: Zotero.Item): nsIURI

          _getItemPropertyURI(item: Zotero.Item): nsIURI

          _getPropertyURIFromItemURI(itemURI: nsIURI): nsIURI | false

          _throwFriendlyError(method: string, url: string, status: number): never

          _deleteStorageFiles(file: string[]): _ZoteroTypes.Promise.Bluebird<DeletedStorageFileResult>
        }
      }
    }

    namespace Data {
      namespace Local {
        function getAPIKey(): Promise<string>
        function setAPIKey(apiKey: string): Promise<void>
      }
    }
  }
}
