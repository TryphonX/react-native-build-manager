[![npm](https://img.shields.io/npm/v/react-native-build-manager?logo=npm)](https://www.npmjs.com/package/react-native-build-manager)
[![GitHub](https://img.shields.io/github/license/tryphonx/react-native-build-manager?color=red&logo=github)](./LICENSE.md)

# Introduction

This package delivers a CLI command `manage-build` which handles the whole building process for you. More specifically, it takes care of versioning, bundling and building the APK or AAB.

> 🤖 Android only (for now)

# Contents

- [Introduction](#introduction)
- [Contents](#contents)
- [Installation](#installation)
- [Use](#use)
	- [Getting started](#getting-started)
	- [Flags](#flags)
	- [Configuration](#configuration)
	- [Steps](#steps)
	- [Versioning](#versioning)

# Installation

In order to install the package, simply use:

```powershell
npm install react-native-build-manager
```
or
```powershell
yarn add react-native-build-manager
```

# Use

## Getting started
The process of using the command is pretty straightforward.
```powershell
npx manage-build --[flag(s)]
```
On the first run, a configuration file will be created in `./build-manager`. It currently only stores whether you are using it in an (ejected) expo project or not. This is used to update the `app.json` -in the case of an expo project- to ensure consistency.

> **Output:** The APK will be found in `./android/app/build/outputs/apk/release`

<br/>

## Flags

| Flag         | Alias | Description                                          | Default |
| :----------- | :---: | :--------------------------------------------------- | :-----: |
| help         |  `-`  | Show the command's help                              |   `-`   |
| version      | `-v`  | Show the package's version                           |   `-`   |
| output       | `-o`  | Predefines what kind of build type you are going for |   `-`   |
| same-version |  `-`  | Predefines if the version will stay the same         | `false` |

<br/>

## Configuration
As mentioned earlier, on the first run, you will be asked extra questions to create the right **_configuration_**. Currently, the configuration only requires to know whether you are using the command in an **ejected** (**_bare workflow_**) expo app or not.

> **Note:** The configuration can be manually edited in case of mistake during the setup by editing the `./build-manager/config.json` file.

<br/>

## Steps
![Preview of the script in action](https://i.imgur.com/UQknWPU.gif)  
_Preview of the command's use_  
_\(I was too lazy to set up an example project for it, but I've tested it on my own private project. Have to take my word for it, I guess_ 🤷‍♂️ _\)_

1. You specify if you want to increment your version or not. If you chose to increment it, you have the choice of making your new version a **_major_**, **_minor_** or **_patch_** version. (more info @ [versioning](#versioning))
2. You are asked if you want your **_versionCode_** (more info @ [versioning](#versioning)) incremented.
3. The new versions are printed on the console.
4. You are what kind of build you want:
   - **Debug APK:** An _unsigned_ .apk that can only be used for debugging purposes. This .apk can **_not_** be uploaded to _Google Play Console_.
   - **Release APK:** A _signed_ .apk that can be used for testing your release and be uploaded to _Google Play Console_.
   - **Release AAB:** A _signed_ .aab whose only purpose is to be uploaded to _Google Play Console_.  
   - **Release APK and AAB:** _Self-explanatory._
5. You are asked to confirm your input (not shown above .gif).

<br/>

## Versioning

You will be asked about the **versioning**. You are given the choice to increment as you think (major, minor, patch) or not increment the **_version name_**\* at all. You will also be asked about whether or not to increment the **_version code_**\*.

> **Version Name:** This is the version the user will see. The package only supports the most widely used versioning convention. [Semantic Versioning 2.0.0](https://semver.org/).

> **Version Code:** This is the version _Google Play Console_ uses to determine whether a new version is uploaded and if the user needs to update their application. It is not possible to upload to APK/AAB files with the same version code.

> \> For more detailed information: https://developer.android.com/studio/publish/versioning