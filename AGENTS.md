# AGENTS.md

This file provides guidance to AI agents and contributors working on this Capacitor plugin for Intercom (`@foodello/intercom`).

## Quick Start

```bash
npm install
npm run build          # TypeScript + Rollup + docgen
npm run lint           # ESLint + Prettier + SwiftLint (check only)
npm run fmt            # ESLint + Prettier + SwiftLint (auto-fix)
npm run verify         # iOS + Android + Web full build verification
```

## Additional Commands

### Root plugin workspace

```bash
npm run clean          # Remove dist/
npm run docgen         # Regenerate README API docs + dist/docs.json
npm run watch          # TypeScript watch mode
```

### Example app (`example-app/`) UI harness

Run these when you edit anything under `example-app/`:

```bash
npm --prefix example-app install
npm --prefix example-app run dev
npm --prefix example-app run lint
npm --prefix example-app run test
npm --prefix example-app run build
```

## Critical Pre-Flight Checks

**Run these before any PR or commit. Agents must treat failures as blockers.**

### 1. Lint all three linters

```bash
npm run lint
```

This runs ESLint, Prettier, and SwiftLint in sequence. All three must pass with zero violations.

- **ESLint** — The root script is `eslint . --ext ts`, so in practice it checks TypeScript in `src/`. Config: `.eslintrc` (extends `@ionic/eslint-config`). Ignored: `android/`, `dist/`, `ios/`, `node_modules/`, `example/` (see `.eslintignore`). It does **not** lint the Vue example app; run `npm --prefix example-app run lint` separately when editing `example-app/`.
- **Prettier** — TS, JS, Java, CSS, HTML files. Config: `.prettierrc.js` (extends `@ionic/prettier-config`). Ignored: `ios/`, `android/*` (except `android/src/`), `CHANGELOG.md` (see `.prettierignore`). The `prettier-plugin-java` plugin formats Android Java files.
- **SwiftLint** — Swift files in `ios/`. Config: `.swiftlint.yml` (extends `@ionic/swiftlint-config`). **Key limits**: file length ≤ 400 lines, type body ≤ 250 lines, function body ≤ 50 lines, cyclomatic complexity ≤ 10, identifier names 3–40 chars, no trailing commas in collections. SwiftLint autocorrect (`npm run swiftlint -- autocorrect`) does NOT fix structural violations — it only handles whitespace.

**Common SwiftLint traps:**
- `type_body_length`: Split large classes into extensions across separate files (e.g. `IntercomPlugin.swift` + `IntercomPlugin+Extensions.swift`). Extensions in separate files reduce the main class body count.
- `private` methods in extensions in **separate files** are not visible to the main class. Use `internal` (the default) or `fileprivate` instead.
- `identifier_name`: Variable names like `c`, `s`, `e` will fail. Use descriptive names ≥ 3 characters.
- `trailing_comma`: Swift dictionaries must NOT have trailing commas (unlike TypeScript/JavaScript).
- `opening_brace`: Multi-line `if let` conditions must have `{` on the same line as the last condition, not on a new line.

### 2. Build

```bash
npm run build
```

Must complete with **zero warnings**. Watch for:
- Rollup `"this" has been rewritten to "undefined"` — caused by TypeScript `__rest` helper from object rest destructuring. Avoid `const { a, ...rest } = obj` in `web.ts`; use `Object.fromEntries(Object.entries(...).filter(...))` instead.
- Any TypeScript errors.

### 3. iOS build verification

```bash
npm run verify:ios
```

This runs `cd ios && pod install && xcodebuild -workspace Plugin.xcworkspace -scheme Plugin -destination generic/platform=iOS`.

**Deployment target alignment is critical.** Four places must agree on the minimum iOS version:
1. `ios/Podfile` — `platform :ios, '15.0'`
2. `ios/Plugin.xcodeproj/project.pbxproj` — `IPHONEOS_DEPLOYMENT_TARGET = 15.0` (4 occurrences: Debug/Release × Plugin/PluginTests)
3. `FoodelloIntercom.podspec` — `s.ios.deployment_target = '15.0'`
4. `Package.swift` — `platforms: [.iOS(.v15)]`

If any of these disagree, `xcodebuild` will fail with: _"compiling for iOS X.0, but module 'Capacitor' has a minimum deployment target of iOS Y.0"_.

**Podfile.lock staleness:** After bumping SDK versions in the podspec, the local `Podfile.lock` may still reference old versions. Run `cd ios && pod update Intercom` to force a fresh resolve. The `Podfile.lock` is gitignored — each developer resolves locally.

### 4. Android build verification

```bash
npm run verify:android
```

### 5. Web build verification

```bash
npm run verify:web
```

This is the fastest — just TypeScript compilation + Rollup bundling.

## Project Structure

```
src/
  definitions.ts    TypeScript interfaces, enums, and JSDoc — source of truth for the public API
  index.ts          Plugin registration via registerPlugin()
  web.ts            Web implementation (uses @intercom/messenger-js-sdk)
ios/
  Plugin/
    IntercomPlugin.swift              Core plugin — init, auth, user, events, settings
    IntercomPlugin+Extensions.swift   Display, content, deprecated methods, private helpers, notification handlers
  PluginTests/
    IntercomPluginTests.swift
  Podfile                             CocoaPods dependency declaration
  Plugin.xcodeproj/                   Xcode project (deployment target lives here)
android/
  src/main/java/com/getcapacitor/community/intercom/
    IntercomPlugin.java               Android native implementation (Plugin subclass)
  build.gradle                        Android SDK version, Gradle version, compile/target SDK
example-app/
  src/App.vue                         Main Vue 3 test harness screen
  src/components/                     Shared UI primitives for the harness
  src/style.css                       Tailwind CSS v4 entrypoint + tiny global reset
  tests/                              Vitest coverage for browser-only helpers
dist/               Generated output — never edit manually
FoodelloIntercom.podspec   CocoaPods spec (SDK version constraint, deployment target, Swift version)
Package.swift              Swift Package Manager manifest
rollup.config.mjs          Rollup bundling config (external deps, output formats)
```

## Styling Scope

This repository is primarily a Capacitor plugin, not a design system or application UI library.

- The published plugin package has **no shared CSS layer** and no repo-wide component library.
- `src/web.ts` boots the Intercom web SDK; it does not render repo-owned UI.
- iOS and Android messenger/help-center screens come from the Intercom SDKs, not from local styles in this repository.
- The only repo-owned UI is the local test harness in `example-app/`. Styling guidance below applies to that app.

## API Contract

`src/definitions.ts` is the canonical API contract. It drives:
- TypeScript types for consumers
- Auto-generated API docs in `README.md` (between `<docgen-index>` and `<docgen-api>` tags)
- `dist/docs.json`

**Never edit the `<docgen-index>` or `<docgen-api>` sections in `README.md` directly.**
Update `src/definitions.ts` JSDoc and run `npm run docgen` (or `npm run build`).

## SDK Versions and Where They Live

| Platform | SDK | Version constraint | Where defined |
|---|---|---|---|
| iOS (CocoaPods) | Intercom iOS SDK | `~> 19.0` | `FoodelloIntercom.podspec` |
| iOS (SPM) | intercom-ios-sp | `from: "19.0.0"` | `Package.swift` |
| Android | intercom-sdk | `17.4.7` (overridable) | `android/build.gradle` → `intercomSdkVersion` |
| Web | @intercom/messenger-js-sdk | `^0.0.18` | `package.json` → `dependencies` |
| Capacitor | @capacitor/core | `>=8.0.0` | `package.json` → `peerDependencies` |

When bumping SDK versions, update **all** relevant locations. For iOS, that means both the podspec AND `Package.swift`.

## iOS Native Implementation

- Files: `ios/Plugin/IntercomPlugin.swift` + `ios/Plugin/IntercomPlugin+Extensions.swift`
- Class: `IntercomPlugin` — subclasses `CAPPlugin`
- Extensions split across two files to stay under SwiftLint's type body length and file length limits
- Initialization: `load()` reads `iosApiKey` + `iosAppId` from capacitor config, then calls `setupIntercom()`
- Dynamic init: `loadWithKeys(_ call:)` allows runtime key injection
- Push tokens: forwarded to Intercom via `Notification.Name.capacitorDidRegisterForRemoteNotifications`
- Events: messenger show/hide, new conversation, unread count, unread ticket count — all via `NotificationCenter` → `notifyListeners()`
- All UI work runs on `DispatchQueue.main.async`
- Supports both **CocoaPods** and **Swift Package Manager** — never break either

### iOS Intercom SDK 19.x API surface

| Capacitor method | Intercom iOS call |
|---|---|
| `loginIdentifiedUser` | `Intercom.loginUser(with: ICMUserAttributes)` |
| `loginUnidentifiedUser` | `Intercom.loginUnidentifiedUser(_:)` |
| `logout` | `Intercom.logout()` |
| `updateUser` | `Intercom.updateUser(with: ICMUserAttributes)` |
| `logEvent` | `Intercom.logEvent(withName:metaData:)` |
| `present` | `Intercom.presentIntercom(Space)` ⚠️ renamed from `present()` in SDK 19.x |
| `presentContent` | `Intercom.presentContent(Intercom.Content)` — carousel, survey, article, conversation |
| `displayMessenger` (deprecated) | `Intercom.presentIntercom()` ⚠️ renamed from `present()` |
| `displayHelpCenter` (deprecated) | `Intercom.presentIntercom(Space.helpCenter)` |
| `displayMessageComposer` | `Intercom.presentMessageComposer(_:)` |
| `setUserHash` | `Intercom.setUserHash(_:)` |
| `setUserJwt` | `Intercom.setUserJwt(_:)` |
| `isUserLoggedIn` | `Intercom.isUserLoggedIn()` → `Bool` |
| `fetchLoggedInUserAttributes` | `Intercom.fetchLoggedInUserAttributes()` → `ICMUserAttributes?` (synchronous in 19.x) |
| `setBottomPadding` | `Intercom.setBottomPadding(_:)` |
| `displayLauncher` / `hideLauncher` | `Intercom.setLauncherVisible(_:)` |
| `displayInAppMessages` / `hideInAppMessages` | `Intercom.setInAppMessagesVisible(_:)` |
| `sendPushTokenToIntercom` | `Intercom.setDeviceToken(_:failure:)` (deprecated) or `Intercom.setDeviceToken(_:success:failure:)` |
| `getUnreadConversationCount` | `Intercom.unreadConversationCount()` |
| `hideMessenger` | `Intercom.hideIntercom()` ⚠️ renamed from `hide()` in SDK 19.x |

**⚠️ API renames in Intercom iOS SDK 19.x:**
- `Intercom.present()` → `Intercom.presentIntercom()`
- `Intercom.present(Space)` → `Intercom.presentIntercom(Space)`
- `Intercom.hide()` → `Intercom.hideIntercom()`
- `fetchLoggedInUserAttributes` is now **synchronous** (returns `ICMUserAttributes?` directly, no callback)

## Android Native Implementation

- File: `android/src/main/java/com/getcapacitor/community/intercom/IntercomPlugin.java`
- Class: `IntercomPlugin` — extends `Plugin`, implements `UnreadConversationCountListener`
- Initialization: `load()` reads `androidApiKey` + `androidAppId` from CapConfig
- Dynamic init: `loadWithKeys` plugin method
- Java version: **Java 21** only — do not use Java 8 or 11 syntax
- Push: uses `IntercomPushClient` for token registration
- Android SDK version in `android/build.gradle` → `intercomSdkVersion` (can be overridden by consuming app via `rootProject.ext.intercomSdkVersion`)

## Web Implementation

- File: `src/web.ts`
- Class: `IntercomWeb` — extends `WebPlugin`
- Backed by `@intercom/messenger-js-sdk`
- Maintains local `State` object (booted, config, initialized, isVisible, unreadCount, unreadListenerAttached, isUserLoggedIn)
- `load(config)` boots the SDK and attaches show/hide/userEmailSupplied listeners

### Web-specific gotchas

- **No object rest destructuring** — `const { a, ...rest } = obj` emits a TypeScript `__rest` helper that references top-level `this`, which Rollup rewrites to `undefined`. Use `Object.fromEntries(Object.entries(...).filter(...))` instead.
- **`setUserHash()` and `setUserJwt()` must NOT call `update()`** — pushing `user_hash` or `intercom_user_jwt` to a live anonymous session via the Intercom SDK's `update()` triggers _"Missing user_hash or intercom_user_jwt"_ when Messenger Security is enforced. These methods should only stash credentials in `this.state.config` for the next `boot()` call.
- **`loginIdentifiedUser` does `shutdown()` + `boot()`** — it rebuilds the boot config from `this.state.config` (which includes any stashed hash/JWT) and boots a fresh session with both identity and credentials together.

## Example App UI Architecture

`example-app/` is a Vite + Vue 3 + Tailwind CSS v4 test harness for exercising the plugin API.

- Tailwind is enabled through `@tailwindcss/vite` in `example-app/vite.config.js`.
- `example-app/src/style.css` is intentionally minimal: it imports Tailwind and applies a tiny global overflow reset. There is no Tailwind config file, CSS module setup, Sass layer, or token file.
- Most styling is done directly in Vue templates with Tailwind utility classes.
- Shared UI primitives already exist and should be reused before introducing new markup patterns:
  - `AppSection.vue` for top-level cards
  - `AppButton.vue` for most actions
  - `AppField.vue` for text inputs
  - `AppSelect.vue` for select controls
- `example-app/src/main.js` registers those components globally.
- `example-app/src/components/HelloWorld.vue` is leftover starter/demo code and is not wired into the app. Do not treat it as the styling reference for new work.

## Required Styling Conventions

Agents editing `example-app/` must match the existing harness, not invent a new visual language.

- Keep the dark neutral shell: page background `bg-gray-950`, section cards `bg-gray-900 border-gray-800`, inputs `bg-gray-800 border-gray-700`.
- Use the existing action color semantics:
  - `indigo` for primary/default actions
  - `green` for positive/show/start actions
  - `red` for destructive/hide/stop actions
  - `yellow` for security/dev-tools actions
  - `blue` for read-only/status/query actions
  - `gray` for secondary/apply/supporting actions
- Keep typography compact:
  - `text-xs` for labels, helper text, badges, and log/meta content
  - `text-sm` for section titles, inputs, and primary copy
  - `font-mono` only for platform badges, log output, and token/code-like values
- Keep radii consistent:
  - `rounded-lg` for buttons, inputs, selects, and secondary panels
  - `rounded-xl` for `AppSection` cards
  - `rounded-full` for status dots and pill badges
- Keep spacing on the current scale:
  - `gap-2` or `gap-3` for action rows and control groups
  - `space-y-3` or `space-y-4` inside sections
  - `p-3` or `p-4` for nested panels and cards
  - `px-4/6` and `py-4/6` for page framing
- Preserve the mobile-first layout. The existing desktop upgrade is:
  - `lg:grid lg:grid-cols-[1fr_340px] lg:gap-6` for the main layout
  - `lg:sticky lg:top-4` for the log panel
- Preserve safe-area handling in `App.vue` via `env(safe-area-inset-*)` inline styles on the root container and header.
- Prefer Tailwind utilities in templates over new CSS rules. Add CSS to `example-app/src/style.css` only for truly global behavior that utilities cannot express cleanly.

## Preferred UI Patterns

When extending the example app, stay within the patterns already established in `example-app/src/App.vue`.

- New top-level feature groups should usually be another `AppSection` with an emoji icon and a short title.
- Labeled data-entry controls usually live in `grid grid-cols-2 gap-3`.
- Action clusters usually live in `flex flex-wrap gap-2`.
- Mixed field + action rows usually use `flex gap-3 items-end`.
- Secondary informational blocks use a darker nested panel such as `bg-gray-800/50 rounded-lg p-3`.
- Warning callouts use a tinted background + border, for example the amber dev-tools warning.
- Read-only output (tokens, logs, payloads) uses `bg-gray-900 rounded px-3 py-2 font-mono text-xs`.
- If several places need the same control treatment, extract or extend a shared primitive instead of copying utility strings into multiple templates.

## What To Avoid When Editing UI

- Do not add a separate component library, CSS framework, or bespoke token system. The repo’s active UI is just Vue + Tailwind utilities.
- Do not switch the harness to a light theme or introduce unrelated gradients, glassmorphism, or decorative styles that clash with the current utilitarian dark console look.
- Do not bypass `AppButton`, `AppField`, `AppSelect`, or `AppSection` for ordinary controls unless the control genuinely needs a new reusable primitive.
- Do not add `scoped` style blocks or one-off selector-heavy CSS for cases Tailwind utilities already cover.
- Do not remove `overflow-x-hidden`, safe-area padding, or the sticky desktop log panel without replacing them with equivalent behavior.
- Do not use `HelloWorld.vue` as the model for new UI. It is unused starter content.
- Do not try to style Intercom’s actual messenger/help-center UI from this repository. Those surfaces belong to the SDK, not the harness.

## UI Validation

If you change anything under `example-app/`, the root pre-flight checks are not enough. Run the example-app checks too:

```bash
npm --prefix example-app run lint
npm --prefix example-app run test
npm --prefix example-app run build
```

For manual validation, also run:

```bash
npm --prefix example-app run dev
```

Then verify:

- no horizontal scrolling on narrow/mobile widths
- safe-area padding still keeps content clear of device cutouts/home indicators
- new controls visually match adjacent sections in spacing, radius, font size, and palette
- button color meaning still follows the existing semantics
- the desktop `lg` layout still keeps the log column at `340px` and sticky
- disabled buttons still show the existing dimmed treatment and optional `?` tooltip affordance

If you changed both plugin code and the example app, run both the example-app commands above and the root `npm run build` / `npm run verify` commands.

## Versioning

Plugin major version tracks Capacitor major version (plugin v8 = Capacitor 8). **Breaking changes ship only with a new Capacitor major version.** All other changes must be backward compatible.

## Changelog

`CHANGELOG.md` is managed by CI/CD (release-please). Do not edit manually.

## Common Pitfalls

| Pitfall | Why it matters |
|---|---|
| Deployment target mismatch across Podfile/xcodeproj/podspec/Package.swift | iOS build fails with cryptic module compatibility errors |
| Stale `Podfile.lock` after SDK bump | `pod install` uses cached old version; run `pod update Intercom` |
| `setUserHash` called after `loginIdentifiedUser` | Identity verification silently degrades — always call before login |
| Object rest destructuring in `web.ts` | Rollup `this` rewrite warning/error at build time |
| `setUserHash`/`setUserJwt` calling `update()` on web | Intercom rejects auth credentials pushed to anonymous sessions |
| `setupUnreadConversationListener()` not called before `addListener('updateUnreadCount', ...)` | Events never fire on native |
| Forgetting `removeUnreadConversationListener()` | Duplicate events from stale `NotificationCenter` observers |
| Editing `dist/` | Fully regenerated on build — changes are lost |
| Editing `<docgen-index>`/`<docgen-api>` in README | Regenerated by `npm run docgen` — changes are lost |
| `CompanyOption.companyId` missing on native | Required for company association; `name` is required on web |
| Breaking CocoaPods or SPM | Users depend on both — verify both before merging |
| `Carousel`, `receivePush` on web | These are native-only; throw `unimplemented` |
| `private` in Swift extension in separate file | Not visible to main class file — use `internal` or `fileprivate` |
| iOS SDK 19.x `present()` → `presentIntercom()` | Old API names don't exist; build fails if not updated |
| iOS SDK 19.x `fetchLoggedInUserAttributes` is synchronous | No callback — returns `ICMUserAttributes?` directly |
| SwiftLint autocorrect doesn't fix structural violations | identifier_name, type_body_length, file_length, cyclomatic_complexity all require manual refactoring |
| Root `npm run lint` / `npm run verify` do not validate `example-app/` | UI regressions in the harness slip through unless you run the example-app lint/test/build commands too |
| `example-app/src/style.css` is not a theme layer | It should stay minimal; piling custom CSS into it will drift from the Tailwind utility approach |
| `example-app/src/components/HelloWorld.vue` is unused starter code | Copying it will produce UI that does not match the active harness |
| Removing safe-area or overflow guards in `example-app/src/App.vue` | Mobile web/native webviews can clip content or reintroduce horizontal scrolling |
| Trying to restyle Intercom messenger/help-center UI from plugin code | Those visuals come from the Intercom SDKs; local CSS changes will not control them |

## Pull Request Guidelines

Every PR must include:

1. **What** — What does this PR change?
2. **Why** — What is the reason for this change?
3. **How** — How did you approach the implementation?
4. **Testing** — What was tested and how?
5. **Not Tested** — What still needs testing or further validation?

### Rules

- No breaking changes unless aligned with a new Capacitor major release.
- Run `npm run lint` and `npm run verify` before opening a PR.
- AI-generated PRs are welcome — be transparent about it.
- Address feedback from automated code review tools before requesting human review.
