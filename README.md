# Nutstore Zotero SSO Plugin

[![zotero target version](https://img.shields.io/badge/Zotero-7-green?style=flat-square&logo=zotero&logoColor=CC2936)](https://www.zotero.org)
[![Using Zotero Plugin Template](https://img.shields.io/badge/Using-Zotero%20Plugin%20Template-blue?style=flat-square&logo=github)](https://github.com/windingwind/zotero-plugin-template)

This is a Zotero plugin for Nutstore SSO.

<div align=center><img src="./doc/nutstore_logo.svg" width="800px"></img></div>

## 🤔 What can it do?

- One-click login to nutstore no longer requires cumbersome webdav configuration
- Force fix current webdav configuration

## 📦 Install Guide

- Download the plugin (.xpi file) from below.

  - [Latest Version: 1.0.0](https://github.com/nutstore/zotero-plugin-nutstore-sso/releases/download/v1.0.0/zotero-plugin-nutstore-sso.xpi)
  - [Latest Stable](https://github.com/nutstore/zotero-plugin-nutstore-sso/releases/latest)
  - [All Releases](https://github.com/nutstore/zotero-plugin-nutstore-sso/releases)

  _Note_: If you're using Firefox as your browser, right-click the `.xpi` and select "Save As.."

- In Zotero click `Tools` in the top menu bar and then click `Plugins`
- Go to the Extensions page and then click the gear icon in the top right.
- Select `Install Add-on from file`.
- Browse to where you downloaded the `.xpi` file and select it.
- Finish!

## 🛠️ Development

Please see [zotero-plugin-template](https://github.com/windingwind/zotero-plugin-template).

### Directory Structure

This section shows the directory structure of a template.

- All `.js/.ts` code files are in `./src`;
- Addon config files: `./addon/manifest.json`;
- UI files: `./addon/content/*.xhtml`.
- Locale files: `./addon/locale/**/*.flt`;
- Preferences file: `./addon/prefs.js`;

```shell
.
|-- .github/                  # github conf
|-- .vscode/                  # vscode conf
|-- addon                     # static files
|   |-- bootstrap.js
|   |-- content
|   |   |-- icons
|   |   |   |-- favicon.png
|   |   |   `-- favicon@0.5x.png
|   |   |-- preferences.xhtml
|   |   `-- zoteroPane.css
|   |-- locale
|   |   |-- en-US
|   |   |   |-- addon.ftl
|   |   |   |-- mainWindow.ftl
|   |   |   `-- preferences.ftl
|   |   `-- zh-CN
|   |       |-- addon.ftl
|   |       |-- mainWindow.ftl
|   |       `-- preferences.ftl
|   |-- manifest.json
|   `-- prefs.js
|-- build                         # build dir
|-- node_modules
|-- src                           # source code of scripts
|   |-- addon.ts                  # base class
|   |-- hooks.ts                  # lifecycle hooks
|   |-- index.ts                  # main entry
|   |-- modules                   # sub modules
|   |   |-- examples.ts
|   |   `-- preferenceScript.ts
|   `-- utils                 # utilities
|       |-- locale.ts
|       |-- prefs.ts
|       |-- wait.ts
|       |-- window.ts
|       `-- ztoolkit.ts
|-- typings                   # ts typings
|   `-- global.d.ts

|-- .env                      # enviroment config (do not check into repo)
|-- .env.example              # template of enviroment config, https://github.com/northword/zotero-plugin-scaffold
|-- .gitignore                # git conf
|-- .gitattributes            # git conf
|-- eslint.config.mjs         # eslint conf, https://eslint.org/
|-- LICENSE
|-- package-lock.json
|-- package.json
|-- tsconfig.json             # typescript conf, https://code.visualstudio.com/docs/languages/jsconfig
|-- README.md
`-- zotero-plugin.config.ts   # scaffold conf, https://github.com/northword/zotero-plugin-scaffold
```

## Disclaimer

Use this code under AGPL. No warranties are provided. Keep the laws of your locality in mind!

If you want to change the license, please contact me at <>
