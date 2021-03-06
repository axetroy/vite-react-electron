# vite-react-electron

![GitHub stars](https://img.shields.io/github/stars/caoxiemeihao/vite-react-electron?color=fa6470&style=flat)
![GitHub issues](https://img.shields.io/github/issues/caoxiemeihao/vite-react-electron?color=d8b22d&style=flat)
![GitHub license](https://img.shields.io/github/license/caoxiemeihao/vite-react-electron?style=flat)
[![Required Node.JS >= v14.17.0](https://img.shields.io/static/v1?label=node&message=%3E=14.17.0&logo=node.js&color=3f893e&style=flat)](https://nodejs.org/about/releases)

**English | [įŽäŊä¸­æ](README.zh-CN.md)**

## Overview

- All config files `Main-process`, `Renderer-process` and `Preload-script` they are in `configs/*.ts`.

- All files are built using `Vite`, is supper fast.

- `scripts/build.mjs` just calls the `Vite` API and uses the `configs/*.ts` config file to build.

- The difference between `scripts/watch.mjs` and `build.mjs` is that the watch option is configured for the Main-process and Preload-script. The Renderer-process uses `require ('vite').createServer`

- Manage projects more through configuration other than scripts. -- **đĨŗ Simple and clearly**

## Run Setup

  ```bash
  # clone the project
  git clone git@github.com:caoxiemeihao/vite-react-electron.git

  # enter the project directory
  cd vite-react-electron

  # install dependency
  npm install

  # develop
  npm run dev
  ```

## Directory

```tree
â
âââ configs
â   âââ vite.main.ts                 Main-process config file, for -> src/main
â   âââ vite.preload.ts              Preload-script config file, for -> src/preload
â   âââ vite.renderer.ts             Renderer-script config file, for -> src/renderer
â
âââ scripts
â   âââ build.mjs                    Build script, for -> npm run build
â   âââ electron-builder.config.mjs
â   âââ watch.mjs                    Develop script, for -> npm run dev
â
âââ src
â   âââ main                         Main-process source code
â   âââ preload                      Preload-script source code
â   âââ renderer                     Renderer-process source code
â
```

#### `dist` and `src`

- Once `npm run dev` or `npm run build` is executed. Will be generated `dist`, it is the same as the `src` structure.

- This ensures the accuracy of path calculation.

```tree
âââ dist
|   âââ main
|   âââ preload
|   âââ renderer
âââ src
|   âââ main
|   âââ preload
|   âââ renderer
|
```

## Shown

<img width="400px" src="https://raw.githubusercontent.com/caoxiemeihao/blog/main/vite-react-electron/react-win.png" />

## Wechat group | | č¯ˇæåæ¯ä¸åčļ đĨŗ

<div style="display:flex;">
  <img width="244px" src="https://raw.githubusercontent.com/caoxiemeihao/blog/main/assets/wechat/group/qrcode.jpg" />
  &nbsp;&nbsp;&nbsp;&nbsp;
  <img width="244px" src="https://raw.githubusercontent.com/caoxiemeihao/blog/main/assets/wechat/%24qrcode/%2419.99.png" />
</div>
