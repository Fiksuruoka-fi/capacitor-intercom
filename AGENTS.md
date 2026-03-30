# AGENTS.md

This file provides guidance to AI agents and contributors working on this Capacitor plugin for Intercom (`@foodello/intercom`).

## Quick Start

```bash
# Install dependencies
npm install

# Build the plugin (TypeScript + Rollup + docgen)
npm run build

# Full verification (iOS, Android, Web)
npm run verify

# Format code (ESLint + Prettier + SwiftLint)
npm run fmt

# Lint without fixing
npm run lint
```

## Development Workflow

1. **Install** – `npm install`
2. **Build** – `npm run build` compiles TypeScript, generates API docs, and bundles with Rollup. Always run this after touching `src/`.
3. **Verify** – `npm run verify` builds for iOS, Android, and Web. Run before any commit.
4. **Format** – `npm run fmt` auto-fixes ESLint, Prettier, and SwiftLint issues.
5. **Lint** – `npm run lint` checks without modifying files.

### Individual Platform Verification

```bash
npm run verify:ios      # pod install + xcodebuild
npm run verify:android  # ./gradlew clean build test
npm run verify:web      # tsc + rollup
```

### Example App

```bash
cd example
npm install
npx cap sync
```

The example app references the plugin via `file:..`. Sync platforms with `npx cap sync <platform>` after rebuilding.

## Project Structure

```
src/
  definitions.ts    TypeScript interfaces, enums, and JSDoc — source of truth for the public API
  index.ts          Plugin registration via registerPlugin()
  web.ts            Web implementation (uses @intercom/messenger-js-sdk)
ios/
  Plugin/
    IntercomPlugin.swift    iOS native implementation (CAPPlugin subclass)
android/
  src/main/java/com/getcapacitor/community/intercom/
    IntercomPlugin.java     Android native implementation (Plugin subclass)
dist/               Generated output — never edit manually
FoodelloIntercom.podspec   CocoaPods spec
```

## API Contract

`src/definitions.ts` is the canonical API contract. It drives:
- TypeScript types for consumers
- Auto-generated API docs in `README.md` (between `<docgen-index>` and `<docgen-api>` tags)
- `dist/docs.json`

**Never edit the `<docgen-index>` or `<docgen-api>` sections in `README.md` directly.**
Update `src/definitions.ts` JSDoc and run `npm run docgen` (or `npm run build`).

## iOS Native Implementation

- File: `ios/Plugin/IntercomPlugin.swift`
- Class: `IntercomPlugin` — subclasses `CAPPlugin`
- Initialization: `load()` reads `iosApiKey` + `iosAppId` from capacitor config, then calls `setupIntercom()`
- Dynamic init: `loadWithKeys(_ call:)` allows runtime key injection
- Push tokens: forwarded to Intercom via `Notification.Name.capacitorDidRegisterForRemoteNotifications`
- Events: messenger show/hide, new conversation, unread count, unread ticket count — all via `NotificationCenter` → `notifyListeners()`
- All UI work runs on `DispatchQueue.main.async`
- SDK version tracked in `FoodelloIntercom.podspec` → `s.dependency 'Intercom'`
- Supports both **CocoaPods** and **Swift Package Manager** — never break either

### iOS Intercom API surface used

| Capacitor method | Intercom iOS call |
|---|---|
| `loginIdentifiedUser` | `Intercom.loginUser(with: ICMUserAttributes)` |
| `loginUnidentifiedUser` | `Intercom.loginUnidentifiedUser(_:)` |
| `logout` | `Intercom.logout()` |
| `updateUser` | `Intercom.updateUser(with: ICMUserAttributes)` |
| `logEvent` | `Intercom.logEvent(withName:metaData:)` |
| `present` | `Intercom.present(Space)` — spaces: `.home`, `.messages`, `.helpCenter`, `.tickets` |
| `presentContent` | `Intercom.presentContent(Intercom.Content)` — carousel, survey, article, conversation |
| `displayMessageComposer` | `Intercom.presentMessageComposer(_:)` |
| `setUserHash` | `Intercom.setUserHash(_:)` |
| `setBottomPadding` | `Intercom.setBottomPadding(_:)` |
| `displayLauncher` / `hideLauncher` | `Intercom.setLauncherVisible(_:)` |
| `displayInAppMessages` / `hideInAppMessages` | `Intercom.setInAppMessagesVisible(_:)` |
| `sendPushTokenToIntercom` | `Intercom.setDeviceToken(_:)` |
| `getUnreadConversationCount` | `Intercom.unreadConversationCount()` |
| `hideMessenger` | `Intercom.hide()` |

## Android Native Implementation

- File: `android/src/main/java/com/getcapacitor/community/intercom/IntercomPlugin.java`
- Class: `IntercomPlugin` — extends `Plugin`, implements `UnreadConversationCountListener`
- Initialization: `load()` reads `androidApiKey` + `androidAppId` from CapConfig
- Dynamic init: `loadWithKeys` plugin method
- Java version: **Java 21** only — do not use Java 8 or 11 syntax
- Push: uses `IntercomPushClient` for token registration
- All UI calls run on `bridge.getActivity().runOnUiThread(_:)`

## Web Implementation

- File: `src/web.ts`
- Class: `IntercomWeb` — extends `WebPlugin`
- Backed by `@intercom/messenger-js-sdk`
- Maintains local `State` object (booted, config, initialized, isVisible, unreadCount, unreadListenerAttached)
- `load(config)` boots the SDK and attaches show/hide/userEmailSupplied listeners
- `loginIdentifiedUser`, `loginUnidentifiedUser`, `receivePush`, `sendPushTokenToIntercom` throw `unimplemented` — web does not support these
- Event names match iOS/Android: `messengerDidShow`, `messengerDidHide`, `userEmailSupplied`, `updateUnreadCount`

## Key Types

| Type | Purpose |
|---|---|
| `IntercomPlugin` | The full plugin interface — implement all methods here |
| `IntercomWebConfig` | Web-only boot config (extends `@intercom/messenger-js-sdk` `IntercomSettings`) |
| `IntercomUserUpdateOptions` | User attribute update payload (userId, email, name, phone, languageOverride, customAttributes, company/companies) |
| `IntercomPushNotificationData` | Push notification payload structure |
| `IntercomSpace` | Enum: `home`, `messages`, `help`, `news`, `tasks`, `tickets` |
| `IntercomContent` | Enum: `article`, `survey`, `carousel`, `checklist`, `news`, `tour`, `ticket`, `conversation` |
| `CompanyOption` | Company data for `updateUser` — native: `companyId` required; web: `name` required |
| `LoadWithKeysOption` | Dynamic key injection for iOS/Android at runtime |

## Versioning

Plugin major version tracks Capacitor major version (plugin v8 = Capacitor 8). **Breaking changes ship only with a new Capacitor major version.** All other changes must be backward compatible.

## Changelog

`CHANGELOG.md` is managed by CI/CD. Do not edit manually.

## Common Pitfalls

- `dist/` is fully regenerated on every build — never edit generated files.
- API doc sections in `README.md` between `<docgen-index>` and `<docgen-api>` are generated — never edit directly.
- Android must use **Java 21**. Do not introduce Java 8 lambdas or records that break the build.
- iOS: all `Intercom.*` calls that affect UI must be dispatched to the main thread.
- The `Space` enum on iOS does not include `news` or `tasks` — those are web-only spaces. Guard accordingly.
- `CompanyOption.companyId` is required on native; `CompanyOption.name` is required on web. The `constructCompany` helper on iOS handles this mapping.
- `setUserHash` (HMAC / identity verification) must be called **before** `loginIdentifiedUser` if identity verification is enabled in the Intercom workspace. Wrong order silently degrades to unverified.
- `setupUnreadConversationListener()` must be called before `addListener('updateUnreadCount', ...)` will fire on native. The web implementation handles this internally.
- `removeUnreadConversationListener()` removes the native `NotificationCenter` observer — forgetting this causes duplicate events.
- Both CocoaPods and Swift Package Manager must remain working. Check `FoodelloIntercom.podspec` whenever you change the iOS source file list.
- `IntercomContent.Carousel` is iOS/Android only — throw `unimplemented` on web.
- `receivePush` is iOS/Android only — throw `unimplemented` on web.

## Pull Request Guidelines

Every PR must include:

1. **What** — What does this PR change?
2. **Why** — What is the reason for this change?
3. **How** — How did you approach the implementation?
4. **Testing** — What was tested and how?
5. **Not Tested** — What still needs testing or further validation?

### Rules

- No breaking changes unless aligned with a new Capacitor major release.
- Run `npm run verify` and `npm run fmt` before opening a PR.
- AI-generated PRs are welcome — be transparent about it.
- Address feedback from automated code review tools before requesting human review.

### PR Template

```
## What
- [Brief description of the change]

## Why
- [Motivation for this change]

## How
- [Implementation approach]

## Testing
- [What was tested and how]

## Not Tested
- [What still needs testing, if anything]
```
