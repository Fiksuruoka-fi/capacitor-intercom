# Intercom Plugin — Example App

A Vite + Vue 3 + Tailwind CSS test harness for `@foodello/intercom`.

Covers every method group in the plugin API: configuration, authentication (including the new `setJWT`, `isUserLoggedIn`, `fetchLoggedInUserAttributes`), user attributes, messenger spaces, content presentation, launcher, in-app messages, event logging, push tokens, and the unread count listener.

## Setup

```bash
# From this directory
npm install

# Start web dev server
npm run dev
```

Open http://localhost:5173 in your browser.

## Native (iOS / Android)

```bash
# Build the web app first
npm run build

# Sync to native platforms
npm run sync   # npx cap sync

# Open in Xcode / Android Studio
npm run open:ios
npm run open:android
```

## Configuration

Edit `capacitor.config.ts` to set your `iosApiKey`, `iosAppId`, `androidApiKey`, and `androidAppId` for native builds.

On web, enter your `App ID` in the Configuration section and tap **load() — Web**.

On native, tap **loadWithKeys() — Native** after entering keys, or set them in `capacitor.config.ts` for automatic initialization.

## Testing new APIs (★)

Three methods added in `@foodello/intercom` v8 are marked with ★:

| Method | What to test |
|---|---|
| `setJWT()` | Enter a valid JWT and tap before login — verify no error |
| `isUserLoggedIn()` | Tap before and after login — result should flip |
| `fetchLoggedInUserAttributes()` | Tap after login — returns user id, email, etc. |

## Notes

- The plugin itself is referenced via `file:..` — changes to the plugin source are reflected after `npm run build` in the root, then `npm install` here.
- `dist/` is gitignored — run `npm run build` to regenerate.
