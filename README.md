<p align="center"><br><img src="https://avatars3.githubusercontent.com/u/16580653?v=4" width="128" height="128" /></p>

<h3 align="center">Ionic/Vue SQLite App Starter</h3>
<p align="center"><strong><code>vue-sqlite-app-starter</code></strong></p>
<p align="center">Ionic/Vue application demonstrating the use of the</p>
<p align="center"><strong><code>@capacitor-community/sqlite plugin<code></strong></p>
<p align="center" style="font-size:50px;color:red"><strong>CAPACITOR 4 </strong></p><br>
<br>
<p align="center">
  <img src="https://img.shields.io/maintenance/yes/2023?style=flat-square" />
  <a href="https://github.com/jepiqueau/vue-sqlite-app-starter"><img src="https://img.shields.io/github/license/jepiqueau/vue-sqlite-app-starter?style=flat-square" /></a>
  <a href="https://github.com/jepiqueau/vue-sqlite-app-starter"><img src="https://img.shields.io/github/package-json/v/jepiqueau/vue-sqlite-app-starter/main?style=flat-square" /></a>
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
<a href="#contributors-"><img src="https://img.shields.io/badge/all%20contributors-3-orange?style=flat-square" /></a>
<!-- ALL-CONTRIBUTORS-BADGE:END -->
</p>


## Maintainers

| Maintainer        | GitHub                                    | Social |
| ----------------- | ----------------------------------------- | ------ |
| Quéau Jean Pierre | [jepiqueau](https://github.com/jepiqueau) |        |


## 🚧 To be Updated 🚧

The components `EncryptionTest.vue` and `UpgradeVersionTest.vue`have still to be created

## Installation 

To start clone the project

```bash
git clone https://github.com/jepiqueau/vue-sqlite-app-starter.git
cd ./vue-sqlite-app-starter
git remote remove origin
npm install
npm run electron:install
```

To install the latest release of the ```@capacitor-community/sqlite``` plugin

```bash
npm run update
```

## Running the app

The assets databases should be in the `public/assets/databases`folder

### BROWSER

```
npx run serve
```
or
```
ionic serve
```

### IOS

```
npm run ionic:ios
```

Once Xcode launches, you can build your app through the standard Xcode workflow.

### ANDROID

```
npx cap open android
```
Once Android Studio launches, make sure that you are using 
 - Gradle JDK version 11
 - Android Gradle Plugin Version 7.2.2

and build your app through the standard Android Studio workflow.

### ELECTRON

```
npm run electron:start
```

## Accessing the tests 🚧

Go to the Tab2 of the application


## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<p align="center">
  <a href="https://github.com/jepiqueau" title="jepiqueau"><img src="https://github.com/jepiqueau.png?size=100" width="50" height="50"/></a>
  <a href="https://github.com/codeluggage" title="jepiqueau"><img src="https://github.com/codeluggage.png?size=100" width="50" height="50"/></a>  <a href="https://github.com/RHellenes" title="RHellenes"><img src="https://github.com/RHellenes.png?size=100" width="50" height="50"/></a>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!

