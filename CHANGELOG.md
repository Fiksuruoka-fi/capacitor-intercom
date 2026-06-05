# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [8.0.2](https://github.com/Fiksuruoka-fi/capacitor-intercom/compare/v8.0.1...v8.0.2) (2026-06-05)


### Miscellaneous Chores

* release 8.0.2 ([131e9e3](https://github.com/Fiksuruoka-fi/capacitor-intercom/commit/131e9e3f40b8c14baa0e5ff113ee2ecd176913db))

## [8.0.1](https://github.com/Fiksuruoka-fi/capacitor-intercom/compare/v8.0.0...v8.0.1) (2026-04-01)


### Bug Fixes

* adds ios support on showing ticket ([ea3ffcf](https://github.com/Fiksuruoka-fi/capacitor-intercom/commit/ea3ffcf0260938094b2cb525de6679cc1ea55af4))
* fixes typo ([03f9849](https://github.com/Fiksuruoka-fi/capacitor-intercom/commit/03f9849422111e827cd6ad4aa69b340aecbb6d38))

## [8.0.0] (2026-04-01)

### ⚠ BREAKING CHANGES

* Requires `@capacitor/core` v8. Update your app's peer dependency before upgrading.

### Features

* **ios:** Intercom SDK 17 → 19 — adds Conversational Fin, dark mode, and JWT auth support
* **ios:** Swift Package Manager support — `Package.swift` added alongside CocoaPods
* **ios:** Fixed SPM build failure — plugin registration migrated from Objective-C to Swift (`CAPBridgedPlugin`), resolving the "mixed language source files" error
* **ios:** Dynamic initialization — `loadWithKeys()` now accepts `iosAppId` as a key alias and registers observers unconditionally
* **android:** Intercom SDK 17.0.0 → 18.0.0
* **android:** `loadWithKeys()` accepts both `appId` and `androidAppId` for consistent key naming
* **web:** Bump `@intercom/messenger-js-sdk` to `^0.0.18`
* **all:** Add `setUserJwt({ jwt })` — set a JWT for Intercom identity verification
* **all:** Add `isUserLoggedIn()` — returns `{ isLoggedIn: boolean }`
* **all:** Add `fetchLoggedInUserAttributes()` — retrieve attributes for the currently logged-in user
* **ios/android:** Add `removeUnreadConversationListener()`

### Bug Fixes

* **web:** Fix `setUserHash()` / `setUserJwt()` timing bug — values are now stashed in config for the next `boot()` call instead of calling `update()` on a live session, which could push credentials to an anonymous session

### Miscellaneous

* Replace old Angular/Ionic example app with a modern Vite + Vue 3 + Tailwind CSS example app covering the full plugin API surface
* Add browser-based HMAC-SHA256 and JWT (HS256) dev tools to the example app for local identity verification testing
* Add GitHub Actions CI pipeline: ESLint + Prettier lint, TypeScript build, example app unit tests and Vite build

## [7.0.0](https://github.com/Fiksuruoka-fi/capacitor-intercom/compare/v6.0.1...v7.0.0) (2025-09-10)


### ⚠ BREAKING CHANGES

* **ios:** lock intercom sdk to > v17
* **android:** remove firebase dependency

### Features

* **android:** adds new methods from intercom sdk ([0d6cbd7](https://github.com/Fiksuruoka-fi/capacitor-intercom/commit/0d6cbd798c118fb0d492c6f67259be12d3390174))
* **ios:** adds new methods from intercom sdk ([8db2b40](https://github.com/Fiksuruoka-fi/capacitor-intercom/commit/8db2b40ed7253fe8fc3824dc759a6d53e2bab9f1))
* **web:** adds new methods from intercom sdk ([0703afa](https://github.com/Fiksuruoka-fi/capacitor-intercom/commit/0703afa6946752b06fb84198168bf71cfd51ed4c))
* **web:** convert to use intercom npm module ([9dfb2fc](https://github.com/Fiksuruoka-fi/capacitor-intercom/commit/9dfb2fc67722d0d1de54b3fbf5483a75ea478c60))


### Bug Fixes

* typo fixes ([bea4729](https://github.com/Fiksuruoka-fi/capacitor-intercom/commit/bea472966d5e7580a71111e5b32d1b05d86c4ee5))


### Miscellaneous Chores

* **ios:** lock intercom sdk to &gt; v17 ([1f10216](https://github.com/Fiksuruoka-fi/capacitor-intercom/commit/1f102163efcb32ec55726837c7e69b133e73c353))


### Code Refactoring

* **android:** remove firebase dependency ([f992828](https://github.com/Fiksuruoka-fi/capacitor-intercom/commit/f9928283a629e8eabc01d13152d285524aa062b7))

## [4.4.1](https://github.com/Fiksuruoka-fi/capacitor-intercom/compare/v4.4.0...v4.4.1) (2023-06-12)


### Bug Fixes

* **intercom:** :bug: fixes building release ([cb9cdd0](https://github.com/Fiksuruoka-fi/capacitor-intercom/commit/cb9cdd04b6c88f9902d2619e427c3853edca1bfd))

## [4.4.0](https://github.com/Fiksuruoka-fi/capacitor-intercom/compare/v4.3.1...v4.4.0) (2023-05-30)


### Features

* **intercom:** add support for dynamic env keys ([caaa80d](https://github.com/Fiksuruoka-fi/capacitor-intercom/commit/caaa80db2aa73f04eafc5ec4bb24c53bff0aa396))


### Bug Fixes

* **intercom:** :bug: fixes null checks on user attributes ([635127f](https://github.com/Fiksuruoka-fi/capacitor-intercom/commit/635127fa0274a1fe8518b048ae0c36632505d60f))

## [4.3.1](https://github.com/Fiksuruoka-fi/capacitor-intercom/compare/v4.3.0...v4.3.1) (2023-05-25)


### Bug Fixes

* **ios:** hmac typo ([20f3cce](https://github.com/Fiksuruoka-fi/capacitor-intercom/commit/20f3cce758a1ff346359d48c2b1cda9e00f4bdc9))

## [4.3.0](https://github.com/Fiksuruoka-fi/capacitor-intercom/compare/v4.2.2...v4.3.0) (2023-05-05)


### Features

* **intercom:** :sparkles: adds support for multiple companies ([c59020e](https://github.com/Fiksuruoka-fi/capacitor-intercom/commit/c59020efecf0e98b33e19b232ecf9ee7aa6b1278))


### Bug Fixes

* **intercom:** :bug: customAttributes might be null ([0ab1531](https://github.com/Fiksuruoka-fi/capacitor-intercom/commit/0ab1531c314fe43a821ea59f8b90bdf99e6febc2))
* **intercom:** :bug: fixes registering ios push notification token ([0dad7b1](https://github.com/Fiksuruoka-fi/capacitor-intercom/commit/0dad7b11e9e55fd23b9e8e522c4eb646728756c2))
* **intercom:** :bug: fixes resolving the unreadConversationListener setup ([e45b3de](https://github.com/Fiksuruoka-fi/capacitor-intercom/commit/e45b3deadd953a9fa7f14840ce8ca1c8e0679625))

## [4.2.2](https://github.com/Fiksuruoka-fi/capacitor-intercom/compare/v4.2.1...v4.2.2) (2023-05-03)


### Bug Fixes

* **ios:** :bug: moved ios methods to main thread ([dc52787](https://github.com/Fiksuruoka-fi/capacitor-intercom/commit/dc5278789098915581a9209266b978a55f423d45))
* **web:** :bug: removed unwanted 'boot' on logout ([eaf9f53](https://github.com/Fiksuruoka-fi/capacitor-intercom/commit/eaf9f53f9fa9eed7a4dc421a27088e6bfbca166b))

## [4.2.1](https://github.com/Fiksuruoka-fi/capacitor-intercom/compare/v4.2.0...v4.2.1) (2023-04-26)


### Bug Fixes

* enforce adding "v" in tag ([39fbf59](https://github.com/Fiksuruoka-fi/capacitor-intercom/commit/39fbf59e577f9beada7cba191872b1081a053ae3))
* **intercom:** :art: unify updateUser method with different platforms ([80c1d40](https://github.com/Fiksuruoka-fi/capacitor-intercom/commit/80c1d4095c8e20b5a7fe17c5b94b28c4dc751bca))


### Miscellaneous Chores

* release 4.2.1 ([6cda093](https://github.com/Fiksuruoka-fi/capacitor-intercom/commit/6cda0939e39a33c559f3c022c77912b66ae0978e))

## [4.2.0](https://github.com/Fiksuruoka-fi/capacitor-intercom/compare/v4.1.0...v4.2.0) (2023-04-26)


### Features

* add web sdk ([c9bdeda](https://github.com/Fiksuruoka-fi/capacitor-intercom/commit/c9bdedae42e155feceefb9dbd6a19a606359d184))


### Bug Fixes

* **intercom:** :art: use same space naming on each platform ([b86743a](https://github.com/Fiksuruoka-fi/capacitor-intercom/commit/b86743a7d2709d6dc339bae949f887c85612e69f))
* **intercom:** :bug: rename ios podspec ([08daf5c](https://github.com/Fiksuruoka-fi/capacitor-intercom/commit/08daf5c53974f551dab13cbb5943d83d5df2249c))

### [4.0.2](https://github.com/capacitor-community/intercom/compare/v4.0.1...v4.0.2) (2022-12-14)

### [4.0.1](https://github.com/capacitor-community/intercom/compare/v4.0.0...v4.0.1) (2022-11-09)


### Bug Fixes

* Cann't resolve io.intercom.android:intercom-sdk ([50f18ff](https://github.com/capacitor-community/intercom/commit/50f18ffc02281a379b6100bccae1c17bd5958e2e))

### [3.0.3](https://github.com/capacitor-community/intercom/compare/v3.0.1...v3.0.3) (2022-05-10)


### Features

* **intercom:** allow sending of push token / receiving push notifs ([50299dc](https://github.com/capacitor-community/intercom/commit/50299dc6c8ea11db480d17ee1550096a6bc934a1))


### Bug Fixes

* **intercom:** fix imports ([20623c7](https://github.com/capacitor-community/intercom/commit/20623c7006098c0a1b477eafc26c3e4b04d8d64d))
* **register user ios:** get email from correct field ([1aea48f](https://github.com/capacitor-community/intercom/commit/1aea48f901accb4fb851d24575c3ef8baf874ed7))
* unlock capacitor version ([45f1703](https://github.com/capacitor-community/intercom/commit/45f170392d47e4f56a54b2b771620196206a49da))

### [3.0.1](https://github.com/capacitor-community/intercom/compare/v3.0.0...v3.0.1) (2021-10-13)


### Bug Fixes

* remove Podfile.lock closes [#44](https://github.com/capacitor-community/intercom/issues/44) ([d2e7374](https://github.com/capacitor-community/intercom/commit/d2e737455a67efe7584dc696bc7ec172b94a74aa))
* typo on README ([dbdc6b6](https://github.com/capacitor-community/intercom/commit/dbdc6b66b77046ddf09cc4ba8bfa6450e985d609))

## [3.0.0](https://github.com/capacitor-community/intercom/compare/v2.0.1...v3.0.0) (2021-10-11)


### Bug Fixes

* android config initialization ([6d5440e](https://github.com/capacitor-community/intercom/commit/6d5440ec9e0508b0a41f54abd199bc07ab7ca54b))
* plugin api ([bdae017](https://github.com/capacitor-community/intercom/commit/bdae017151fd5d1e203e977a56521258a02d3c81))
* ts definitions ([7433dac](https://github.com/capacitor-community/intercom/commit/7433dacbec98819a477e3b79a026f6299f9ffd10))

### [2.0.1](https://github.com/capacitor-community/intercom/compare/v2.0.0...v2.0.1) (2021-10-04)


### Bug Fixes

* displayMessageComposer can sen a message to the messenger ([54428ce](https://github.com/capacitor-community/intercom/commit/54428ce6d1a5a7dd040810b18475bd227ea420ce))

## [2.0.0](https://github.com/capacitor-community/intercom/compare/v1.1.0...v2.0.0) (2021-06-27)

- update intercom dep for ios
- update hide method for ios
- fix example to use capacitor v2

## [1.1.0](https://github.com/capacitor-community/intercom/compare/v1.0.3...v1.1.0) (2020-07-11)

### Features

- extend user update with new properties ([703d63e](https://github.com/capacitor-community/intercom/commit/703d63eef8546b84bccdd44fdb7718d7d0daa520)), closes [#19](https://github.com/capacitor-community/intercom/issues/19)

### Bug Fixes

- lock capacitor core in 2.0 to avoid yarn issues ([6580a12](https://github.com/capacitor-community/intercom/commit/6580a12a8dd8fd1bfec4fc1b9f4dbd653a2ace4f))

### [1.0.3](https://github.com/capacitor-community/intercom/compare/v1.0.2...v1.0.3) (2020-07-01)

### Features

- add example ([fa97e20](https://github.com/capacitor-community/intercom/commit/fa97e20f65682eff2c076fb7a4e598a2ee011277))

### Bug Fixes

- **android:** revamp platform ([9c72418](https://github.com/capacitor-community/intercom/commit/9c72418063fe970c1efe4d810170c17ea12deb0c))

### [1.0.2](https://github.com/capacitor-community/intercom/compare/v1.0.1...v1.0.2) (2020-06-27)

### Bug Fixes

- contributor links ([b40933d](https://github.com/capacitor-community/intercom/commit/b40933d5bddcf26f33849b2e4dbdd4fc4d3d5420))

### [1.0.1](https://github.com/capacitor-community/intercom/compare/v1.0.0...v1.0.1) (2020-06-27)

### Bug Fixes

- rename podspec ([bc9b0c4](https://github.com/capacitor-community/intercom/commit/bc9b0c42e56e6878711e89ec364363d3b68375d8))

## 1.0.0 (2020-06-27)

### Features

- add readme ([63aaee0](https://github.com/capacitor-community/intercom/commit/63aaee0d0fdfd7eab3c588356f5deb8661d9e4b1))
- add setBottomPadding closes [#3](https://github.com/capacitor-community/intercom/issues/3) ([72737df](https://github.com/capacitor-community/intercom/commit/72737dfd355257eb5234093ba2da7c36498cac0d))
- add setUserHash resolves [#2](https://github.com/capacitor-community/intercom/issues/2) ([8614592](https://github.com/capacitor-community/intercom/commit/86145923ddab3b650eaed9d85d3e1b2b2ce22837))
- **android:** add plugin initialization ([4419064](https://github.com/capacitor-community/intercom/commit/44190641f7aab3ee7c72d11d130a73091ae02401))
- **android:** finish initial api ([45b64b6](https://github.com/capacitor-community/intercom/commit/45b64b6e0b31ad1d5d6dbb0ae5d55721e87ea3df))
- **capacitor:** add support for iOS ([beac173](https://github.com/capacitor-community/intercom/commit/beac17371101a0c152e8c52aaec701848bf2ad3a))
- make the official cordova version plugin work on capacitor ([87c6961](https://github.com/capacitor-community/intercom/commit/87c6961e236a5a6ad93fb78642a5ce9eda01c93d))

### Bug Fixes

- **android:** add app compat ([9e2a97c](https://github.com/capacitor-community/intercom/commit/9e2a97c317119b481269a08ecd82202918055540))
- **android:** cap implementation ([081eb00](https://github.com/capacitor-community/intercom/commit/081eb00594acffeaa04a0d01398f3f38a8d4b8cf))
- **README:** add .md extension ([bec5b49](https://github.com/capacitor-community/intercom/commit/bec5b49b5e2fd50c87674d44c9f46885cae627b2))
- **README:** typo ([1898e9e](https://github.com/capacitor-community/intercom/commit/1898e9ed4996dd06153e9920cc04856640efd57a))
