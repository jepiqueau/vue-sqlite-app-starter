<p align="center"><br><img src="https://avatars3.githubusercontent.com/u/16580653?v=4" width="128" height="128" /></p>

<h3 align="center">Ionic/Vue SQLite App Starter</h3>
<p align="center"><strong><code>vue-sqlite-app-starter</code></strong></p><br>
<p align="center" style="font-size:50px;color:red"><strong>REFACTOR 🚀</strong></p><br>
<p align="center">Ionic/Vue application demonstrating the use of the</p>
<p align="center"><strong><code>@capacitor-community/sqlite@latest plugin<code></strong></p>
<br>
<p align="center">
  <img src="https://img.shields.io/maintenance/yes/2021?style=flat-square" />
  <a href="https://github.com/jepiqueau/vue-sqlite-app-starter"><img src="https://img.shields.io/github/license/jepiqueau/vue-sqlite-app-starter?style=flat-square" /></a>
  <a href="https://github.com/jepiqueau/vue-sqlite-app-starter"><img src="https://img.shields.io/github/package-json/v/jepiqueau/vue-sqlite-app-starter/refactor?style=flat-square" /></a>
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
<a href="#contributors-"><img src="https://img.shields.io/badge/all%20contributors-1-orange?style=flat-square" /></a>
<!-- ALL-CONTRIBUTORS-BADGE:END -->
</p>


## Maintainers

| Maintainer        | GitHub                                    | Social |
| ----------------- | ----------------------------------------- | ------ |
| Quéau Jean Pierre | [jepiqueau](https://github.com/jepiqueau) |        |


## Browser Support

The plugin follows the guidelines from the `Capacitor Team`,

- [Capacitor Browser Support](https://capacitorjs.com/docs/v3/web#browser-support)

meaning that it will not work in IE11 without additional JavaScript transformations, e.g. with [Babel](https://babeljs.io/).


## Installation

To start clone the project

```bash
git clone --branch refactor https://github.com/jepiqueau/vue-sqlite-app-starter.git
cd ./vue-sqlite-app-starter
git remote remove origin
npm install
cd electron
npm install
cd ..
```

To install the latest release of the ```@capacitor-community/sqlite``` plugin

```bash
npm i --save-dev @capacitor-community/sqlite@latest
npm i --save-dev vue-sqlite-hook@latest
npm run build 
npx cap sync
npx cap sync @capacitor-community/electron
npm run build
npx cap copy
npx cap copy web
npx cap copy @capacitor-community/electron
```

## Running the app

### BROWSER

```
npx cap serve
```

### IOS

```
npx cap open ios
```

### ANDROID

```
npx cap open android
```

### ELECTRON

```
npx cap open @capacitor-community/electron
```

## Usage

The @capacitor-community/sqlite tests are accessible in the Tab2 of the Application by clicking on several SQLite test buttons :

- SQLite No Encryption Test
- SQLite Two DBs Tests
- SQLite CopyFomAssets
- SQLite JsonImportExport

After having run the `SQLite Two DBs Tests` another test becomes accessible `SQLite Existing Connection` which is using the existing connections created in SQLite Two DBs Tests.

## Documentation

[@capacitor-community/sqlite@latest](https://github.com/capacitor-community/sqlite/tree/2.9.x)

[vue-sqlite-hook](https://github.com/jepiqueau/vue-sqlite-hook/tree/2.9.x)

[Ionic-Vue-Usage](https://github.com/capacitor-community/sqlite/blob/2.9.x/docs/Ionic-Vue-Usage.md)


## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/jepiqueau"><img src="https://avatars3.githubusercontent.com/u/16580653?v=4" width="100px;" alt=""/><br /><sub><b>Jean Pierre Quéau</b></sub></a><br /><a href="https://github.com/jepiqueau/vue-data-storage-sqlite-app-starter/commits?author=jepiqueau" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!

