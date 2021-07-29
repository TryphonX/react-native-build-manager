# Introduction

This package delivers a CLI command `manage-build` which handles the whole building process for you. Currently, it only works for release builds (signed).

More specifically, it takes care of versioning, bundling and building the actual release APK.

> Android only (for now)

> SoonTM: debugBuilds, release bundles (aab)

# Contents

- [Introduction](#introduction)
- [Contents](#contents)
- [Installation](#installation)
- [Use](#use)
	- [Getting started](#getting-started)
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
npx manage-build
```
On the first run, a configuration file will be created in `./build-manager`. It currently only stores whether you are using it in an (ejected) expo project or not. This is used to update the `app.json` -in the case of an expo project- to ensure consistency.

> **Output:** The APK will be found in `./android/app/build/outputs/apk/release`

## Versioning

You will be asked about the **versioning**. You are given the choice to increment as you think (major, minor, patch) or not increment the **_version name_**\* at all. You will also be asked about whether or not to increment the **_version code_**\*.

> **Version Name:** This is the version the user will see. The package only supports the most widely used versioning convention. [Semantic Versioning 2.0.0](https://semver.org/).

> **Version Code:** This is the version _Google Play Console_ uses to determine whether a new version is uploaded and if the user needs to update their application. It is not possible to upload to APK/AAB files with the same version code.

> \> For more detailed information: https://developer.android.com/studio/publish/versioning