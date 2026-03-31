# Contributing

Thank you for your interest in contributing to `@foodello/intercom`!

## Prerequisites

- **Node.js** — check `.nvmrc` for the required version (use `nvm use`)
- **npm** — comes with Node.js
- **Xcode** — for iOS development (macOS only)
- **Android Studio** — for Android development
- **CocoaPods** — `gem install cocoapods` (iOS builds)

## Repository Structure

```
├── src/                  # Plugin TypeScript source (web implementation + type definitions)
├── ios/                  # Native iOS plugin (Swift)
├── android/              # Native Android plugin (Java)
├── example-app/          # Vite + Vue 3 test harness (web + Capacitor)
│   ├── src/              # App source
│   ├── tests/            # Vitest unit tests
│   ├── ios/              # Capacitor iOS project
│   └── android/          # Capacitor Android project
├── dist/                 # Built plugin output
└── .github/workflows/    # CI workflows
```

## Getting Started

### 1. Install dependencies

```bash
# Root plugin
npm install

# Example app
cd example-app
npm install
```

### 2. Build the plugin

```bash
npm run build
```

### 3. Run the example app

**Web (localhost):**
```bash
cd example-app
npm run dev
```

**iOS:**
```bash
cd example-app
npm run test:ios
```

**Android:**
```bash
cd example-app
npm run test:android
```

## Development Workflow

### Plugin changes (`src/`)

1. Make changes in `src/`
2. Run `npm run build` to compile
3. Test in the example app (`cd example-app && npm run dev`)
4. Run linting: `npm run lint`

### Example app changes (`example-app/`)

1. Make changes in `example-app/src/`
2. Run tests: `cd example-app && npm test`
3. Verify build: `cd example-app && npm run build`
4. Test visually: `cd example-app && npm run dev`

### Running Tests

**Example app unit tests:**
```bash
cd example-app
npm test              # Single run
npm run test:watch    # Watch mode
```

Tests are located in `example-app/tests/` and use [Vitest](https://vitest.dev/) with happy-dom for browser API emulation.

**Plugin verification (all platforms):**
```bash
npm run verify           # iOS + Android + Web
npm run verify:web       # Web only (builds the plugin)
npm run verify:ios       # iOS (requires Xcode + CocoaPods)
npm run verify:android   # Android (requires Android Studio)
```

### Linting & Formatting

```bash
# Check
npm run lint

# Auto-fix
npm run fmt
```

This runs ESLint (TypeScript), Prettier (all file types), and SwiftLint (iOS).

## Code Style

- **TypeScript** — follows `@ionic/eslint-config`
- **Swift** — follows `@ionic/swiftlint-config`
- **Java** — formatted by Prettier with `prettier-plugin-java`
- **Commits** — follow [Conventional Commits](https://www.conventionalcommits.org/) (enforced by commitlint via Husky)

Commit examples:
```
feat: add setUserJwt web implementation
fix: handle missing email in loginIdentifiedUser
docs: update CONTRIBUTING with test instructions
```

## Pull Request Process

1. Create a feature branch from `main`: `git checkout -b feat/your-feature`
2. Make your changes with clear, atomic commits
3. Ensure all checks pass:
   - `npm run lint` (root)
   - `npm run build` (root)
   - `cd example-app && npm test` (example app tests)
   - `cd example-app && npm run build` (example app build)
4. Open a pull request against `main`
5. Fill out the PR template with description, test details, and screenshots if applicable

## Project-Specific Notes

### Example App Dev Tools

The example app includes a "Dev Tools" section for generating HMAC and JWT tokens locally in the browser. This is for **development/testing only** — it uses Web Crypto API client-side.

- Crypto helpers live in `example-app/src/crypto.js`
- Tests cover known Intercom test vectors for HMAC-SHA256
- The generated HMAC/JWT values can be applied directly to the Auth section fields

### Platform-Specific Buttons

The example app disables buttons that aren't available on the current platform:
- **Web-only:** `load()`, web-specific spaces/content types
- **Native-only:** `loadWithKeys()`, `displayInAppMessages()`, `hideInAppMessages()`, `setBottomPadding()`, `sendPushTokenToIntercom()`
