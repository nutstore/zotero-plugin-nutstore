declare interface NutstoreSSO {
  createOAuthUrl: (options: { app: string }) => string
  decrypt: (options: { app: string, s: string }) => string
}
