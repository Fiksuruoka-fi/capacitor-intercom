<h2 align="center">Capacitor Intercom plugin</h2>
<p align="center">
  <strong>
    <code>@foodello/intercom</code>
  </strong>
</p>
<p align="center">Capacitor plugin for Intercom — iOS, Android, and Web with a unified API</p>

<p align="center">
  <img src="https://img.shields.io/maintenance/yes/2025?style=flat-square" />
  <a href="https://www.npmjs.com/package/@foodello/intercom"><img src="https://img.shields.io/npm/l/@foodello/intercom?style=flat-square" /></a>
<br>
  <a href="https://www.npmjs.com/package/@foodello/intercom"><img src="https://img.shields.io/npm/dw/@foodello/intercom?style=flat-square" /></a>
  <a href="https://www.npmjs.com/package/@foodello/intercom"><img src="https://img.shields.io/npm/v/@foodello/intercom?style=flat-square" /></a>
  <!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
<a href="#contributors"><img src="https://img.shields.io/badge/all%20contributors-14-orange?style=flat-square" /></a>
<!-- ALL-CONTRIBUTORS-BADGE:END -->
</p>

## Notice 🚀

This version is for Capacitor > v8. If you are looking for plugin for another Capacitor versions use:

- `@foodello/intercom@^4.2.2` for v4
- `@foodello/intercom@^5.0.0` for v5
- `@foodello/intercom@^6.0.0` for v6
- `@foodello/intercom@^7.0.0` for v7
- `@foodello/intercom@^8.0.0` for v8

Original work based on the [`@capacitor-community/intercom`](https://github.com/capacitor-community/intercom). So, we want to thank and acknowledge all the contributors and authors of their hard work in [`@capacitor-community/intercom`](https://github.com/capacitor-community/intercom). We needed unified API with all Capacitor.js supported platforms (Android, iOS, and Web), so we decided to serve the these capabilities with this seperate Capacitor.js plugin.

**This plugin is built for the Capacitor v4 upwards.**

## Features

- **Unified API across iOS, Android, and Web** — write your Intercom integration once and run it on all three platforms with the same method calls
- **Full Intercom Messenger** — display the messenger, help center, news, tickets, and all Intercom spaces
- **User authentication** — identified and unidentified user login, HMAC identity verification, and JWT authentication
- **Rich content** — present articles, surveys, conversations, carousels, checklists, tours, tickets, and news items
- **Push notifications** — register tokens, receive and process Intercom push messages on iOS and Android
- **Event tracking** — log custom events with metadata for Intercom campaigns and automation
- **User management** — update user attributes, custom attributes, and company data
- **Unread conversations** — listen for real-time unread count changes across all platforms
- **Messenger lifecycle events** — listen for show, hide, new conversation, and email-supplied events
- **Capacitor 4, 5, 6, 7, and 8** — maintained across major Capacitor versions

### Intercom SDK versions

| Platform | SDK | Version |
| -------- | --- | ------- |
| iOS | [Intercom iOS SDK](https://github.com/intercom/intercom-ios) | `~> 17.0` |
| Android | [Intercom Android SDK](https://github.com/intercom/intercom-android) | `17.x` |
| Web | [`@intercom/messenger-js-sdk`](https://www.npmjs.com/package/@intercom/messenger-js-sdk) | `^0.0.18` |

### Platform support matrix

| Method | iOS | Android | Web |
| ------ | :-: | :-----: | :-: |
| `load()` | — | — | ✅ |
| `loadWithKeys()` | ✅ | ✅ | — |
| `loginIdentifiedUser()` | ✅ | ✅ | ✅ |
| `loginUnidentifiedUser()` | ✅ | ✅ | ✅ |
| `logout()` | ✅ | ✅ | ✅ |
| `updateUser()` | ✅ | ✅ | ✅ |
| `logEvent()` | ✅ | ✅ | ✅ |
| `present()` | ✅ | ✅ | ✅ |
| `presentContent()` | ✅ | ✅ | ✅ |
| `displayMessenger()` | ✅ | ✅ | ✅ |
| `displayMessageComposer()` | ✅ | ✅ | ✅ |
| `displayHelpCenter()` | ✅ | ✅ | ✅ |
| `hideMessenger()` | ✅ | ✅ | ✅ |
| `displayLauncher()` | ✅ | ✅ | ✅ |
| `hideLauncher()` | ✅ | ✅ | ✅ |
| `displayInAppMessages()` | ✅ | ✅ | — |
| `hideInAppMessages()` | ✅ | ✅ | — |
| `setUserHash()` | ✅ | ✅ | ✅ |
| `setUserJwt()` | ✅ | ✅ | ✅ |
| `isUserLoggedIn()` | ✅ | ✅ | ✅ |
| `fetchLoggedInUserAttributes()` | ✅ | ✅ | ✅ |
| `setBottomPadding()` | ✅ | ✅ | ✅ |
| `setupUnreadConversationListener()` | ✅ | ✅ | ✅ |
| `removeUnreadConversationListener()` | — | ✅ | — |
| `getUnreadConversationCount()` | ✅ | ✅ | ✅ |
| `sendPushTokenToIntercom()` | — | ✅ | — |
| `receivePush()` | — | ✅ | — |
| `displayArticle()` | ✅ | ✅ | ✅ |
| `displayCarousel()` | ✅ | ✅ | — |

**Event listeners:**

| Event | iOS | Android | Web |
| ----- | :-: | :-----: | :-: |
| `updateUnreadCount` | ✅ | ✅ | ✅ |
| `userEmailSupplied` | — | — | ✅ |
| `messengerWillShow` | ✅ | — | — |
| `messengerDidShow` | ✅ | — | ✅ |
| `messengerWillHide` | ✅ | — | — |
| `messengerDidHide` | ✅ | — | ✅ |
| `newConversationStarted` | ✅ | — | — |
| `unreadTicketCountChanged` | ✅ | — | — |

## Installation

```bash
npm install @foodello/intercom
npx cap sync
```

## Usage

### Importing

```typescript
import { Capacitor } from '@capacitor/core';
import { Intercom } from '@foodello/intercom';
```

### Initialization

iOS and Android initialize automatically from your Capacitor config. Web requires an explicit `load()` call:

```typescript
if (!Capacitor.isNativePlatform()) {
  await Intercom.load({
    app_id: 'your_app_id',
    // Optional: regional data hosting
    // api_base: 'https://api-iam.eu.intercom.io',
  });
}
```

#### Runtime initialization (iOS and Android)

If you need to initialize Intercom at runtime instead of from the Capacitor config (for example, when the app ID comes from a remote config):

```typescript
await Intercom.loadWithKeys({
  appId: 'your_app_id',
  iosApiKey: 'ios_sdk-xxx',       // required on iOS
  androidApiKey: 'android_sdk-xxx', // required on Android
});
```

### User authentication

```typescript
// Login with user ID, email, or both
await Intercom.loginIdentifiedUser({ userId: '12345' });
await Intercom.loginIdentifiedUser({ email: 'user@example.com' });
await Intercom.loginIdentifiedUser({ userId: '12345', email: 'user@example.com' });

// Login as anonymous visitor
await Intercom.loginUnidentifiedUser();

// Check login status
const { isLoggedIn } = await Intercom.isUserLoggedIn();

// Fetch current user attributes (returns userId, email, name, etc.)
const attrs = await Intercom.fetchLoggedInUserAttributes();

// Logout
await Intercom.logout();
```

### Identity verification

If you have [Messenger Security](https://www.intercom.com/help/en/articles/183-enable-identity-verification-for-web-and-mobile) enabled, set the user hash or JWT **before** calling `loginIdentifiedUser()`:

```typescript
// HMAC-based identity verification
await Intercom.setUserHash({ hmac: 'your_hmac_hash' });
await Intercom.loginIdentifiedUser({ userId: '12345' });

// JWT-based identity verification
await Intercom.setUserJwt({ jwt: 'your_jwt_token' });
await Intercom.loginIdentifiedUser({ userId: '12345' });
```

### Updating user attributes

```typescript
await Intercom.updateUser({
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+1234567890',
  languageOverride: 'en',
  customAttributes: {
    plan: 'premium',
    signup_date: '2025-01-01',
  },
  company: {
    companyId: 'company_123',
    name: 'Acme Inc',
    plan: 'enterprise',
    monthlySpend: 499,
  },
});
```

### Displaying the Messenger

```typescript
// Open a specific space
import { IntercomSpace } from '@foodello/intercom';

await Intercom.present({ space: IntercomSpace.Home });
await Intercom.present({ space: IntercomSpace.Messages });
await Intercom.present({ space: IntercomSpace.HelpCenter });
await Intercom.present({ space: IntercomSpace.Tickets });

// Web-only spaces
await Intercom.present({ space: IntercomSpace.News });
await Intercom.present({ space: IntercomSpace.Tasks });

// Open with a pre-filled message
await Intercom.displayMessageComposer({ message: 'I need help with...' });

// Show or hide the Messenger
await Intercom.displayMessenger();
await Intercom.hideMessenger();

// Show or hide the launcher button
await Intercom.displayLauncher();
await Intercom.hideLauncher();
```

### Presenting content

```typescript
import { IntercomContent } from '@foodello/intercom';

// Articles (iOS, Android, Web)
await Intercom.presentContent({ contentType: IntercomContent.Article, contentId: '123' });

// Surveys (iOS, Android, Web)
await Intercom.presentContent({ contentType: IntercomContent.Survey, contentId: '456' });

// Conversations (iOS, Android, Web)
await Intercom.presentContent({ contentType: IntercomContent.Conversation, contentId: '789' });

// Tickets (Android, Web)
await Intercom.presentContent({ contentType: IntercomContent.Ticket, contentId: '321' });

// Carousels (iOS, Android)
await Intercom.presentContent({ contentType: IntercomContent.Carousel, contentId: '654' });

// Web-only content types
await Intercom.presentContent({ contentType: IntercomContent.Checklist, contentId: '111' });
await Intercom.presentContent({ contentType: IntercomContent.News, contentId: '222' });
await Intercom.presentContent({ contentType: IntercomContent.Tour, contentId: '333' });
```

### Event tracking

```typescript
// Simple event
await Intercom.logEvent({ name: 'completed_onboarding' });

// Event with metadata
await Intercom.logEvent({
  name: 'purchased_item',
  data: {
    item_name: 'Premium Plan',
    price: 49.99,
    currency: 'USD',
  },
});
```

### Unread conversation count

```typescript
// Set up the listener first
await Intercom.setupUnreadConversationListener();

// Listen for count changes
Intercom.addListener('updateUnreadCount', ({ unreadCount }) => {
  console.log('Unread conversations:', unreadCount);
});

// Get the current count
const { unreadCount } = await Intercom.getUnreadConversationCount();
```

### Messenger lifecycle events

```typescript
// Messenger visibility (iOS and Web)
Intercom.addListener('messengerDidShow', () => {
  console.log('Messenger is now visible');
});

Intercom.addListener('messengerDidHide', () => {
  console.log('Messenger was closed');
});

// iOS-only events
Intercom.addListener('messengerWillShow', () => {});
Intercom.addListener('messengerWillHide', () => {});
Intercom.addListener('newConversationStarted', () => {});
Intercom.addListener('unreadTicketCountChanged', () => {});

// Web-only events
Intercom.addListener('userEmailSupplied', () => {
  console.log('Visitor entered their email');
});
```

### Push notifications (iOS and Android)

On iOS, Intercom automatically registers for push notifications when the Capacitor push notification delegate fires. On Android, you need to forward the token manually:

```typescript
import { PushNotifications } from '@capacitor/push-notifications';

// Request permission and register
await PushNotifications.requestPermissions();
await PushNotifications.register();

// Forward token to Intercom (Android only)
PushNotifications.addListener('registration', async ({ value: token }) => {
  if (Capacitor.getPlatform() === 'android') {
    await Intercom.sendPushTokenToIntercom({ value: token });
  }
});

// Handle incoming Intercom push notifications (Android only)
PushNotifications.addListener('pushNotificationReceived', async (notification) => {
  if (Capacitor.getPlatform() === 'android') {
    await Intercom.receivePush(notification.data);
  }
});
```

### Customization

```typescript
// Adjust the bottom padding of the Messenger (minimum value: 20)
await Intercom.setBottomPadding({ value: '80' });
```

Web-specific configuration options can be passed to `load()`:

```typescript
await Intercom.load({
  app_id: 'your_app_id',
  custom_launcher_selector: '#my-intercom-button',
  alignment: 'left',          // 'left' or 'right'
  vertical_padding: 40,
  horizontal_padding: 20,
  hide_default_launcher: true, // use your own button with custom_launcher_selector
  session_duration: 300000,    // 5 minutes in ms
  action_color: '#FF5733',
  background_color: '#1A1A2E',
});
```

## API

<docgen-index>

* [`load(...)`](#load)
* [`loadWithKeys(...)`](#loadwithkeys)
* [`registerIdentifiedUser(...)`](#registeridentifieduser)
* [`loginIdentifiedUser(...)`](#loginidentifieduser)
* [`registerUnidentifiedUser()`](#registerunidentifieduser)
* [`loginUnidentifiedUser()`](#loginunidentifieduser)
* [`updateUser(...)`](#updateuser)
* [`logout()`](#logout)
* [`logEvent(...)`](#logevent)
* [`displayMessenger()`](#displaymessenger)
* [`displayMessageComposer(...)`](#displaymessagecomposer)
* [`displayHelpCenter()`](#displayhelpcenter)
* [`hideMessenger()`](#hidemessenger)
* [`displayLauncher()`](#displaylauncher)
* [`hideLauncher()`](#hidelauncher)
* [`displayInAppMessages()`](#displayinappmessages)
* [`hideInAppMessages()`](#hideinappmessages)
* [`displayCarousel(...)`](#displaycarousel)
* [`setUserHash(...)`](#setuserhash)
* [`setUserJwt(...)`](#setuserjwt)
* [`isUserLoggedIn()`](#isuserloggedin)
* [`fetchLoggedInUserAttributes()`](#fetchloggedinuserattributes)
* [`setBottomPadding(...)`](#setbottompadding)
* [`sendPushTokenToIntercom(...)`](#sendpushtokentointercom)
* [`receivePush(...)`](#receivepush)
* [`displayArticle(...)`](#displayarticle)
* [`presentContent(...)`](#presentcontent)
* [`present(...)`](#present)
* [`setupUnreadConversationListener()`](#setupunreadconversationlistener)
* [`removeUnreadConversationListener()`](#removeunreadconversationlistener)
* [`getUnreadConversationCount()`](#getunreadconversationcount)
* [`addListener('updateUnreadCount', ...)`](#addlistenerupdateunreadcount-)
* [`addListener('userEmailSupplied', ...)`](#addlisteneruseremailsupplied-)
* [`addListener('messengerWillShow', ...)`](#addlistenermessengerwillshow-)
* [`addListener('messengerDidShow', ...)`](#addlistenermessengerdidshow-)
* [`addListener('messengerWillHide', ...)`](#addlistenermessengerwillhide-)
* [`addListener('messengerDidHide', ...)`](#addlistenermessengerdidhide-)
* [`addListener('newConversationStarted', ...)`](#addlistenernewconversationstarted-)
* [`addListener('unreadTicketCountChanged', ...)`](#addlistenerunreadticketcountchanged-)
* [Interfaces](#interfaces)
* [Type Aliases](#type-aliases)
* [Enums](#enums)

</docgen-index>

<docgen-api>
<!--Update the source file JSDoc comments and rerun docgen to update the docs below-->

IntercomPlugin Interface

### load(...)

```typescript
load(config: IntercomWebConfig) => Promise<void>
```

Load Intercom and set configs on Web environment.

Only available for Web

| Param        | Type                                                            |
| ------------ | --------------------------------------------------------------- |
| **`config`** | <code><a href="#intercomwebconfig">IntercomWebConfig</a></code> |

**Since:** 4.2.0

--------------------


### loadWithKeys(...)

```typescript
loadWithKeys(options: LoadWithKeysOption) => Promise<void>
```

Load Intercom and set configs on Web environment.

Only available for iOS and Android

| Param         | Type                                                              |
| ------------- | ----------------------------------------------------------------- |
| **`options`** | <code><a href="#loadwithkeysoption">LoadWithKeysOption</a></code> |

**Since:** 4.2.0

--------------------


### registerIdentifiedUser(...)

```typescript
registerIdentifiedUser(options: { userId?: string; email?: string; }) => Promise<void>
```

| Param         | Type                                              |
| ------------- | ------------------------------------------------- |
| **`options`** | <code>{ userId?: string; email?: string; }</code> |

**Since:** 1.0.0

--------------------


### loginIdentifiedUser(...)

```typescript
loginIdentifiedUser(options: { userId?: string; email?: string; }) => Promise<void>
```

Login an identified user with Intercom.

| Param         | Type                                              |
| ------------- | ------------------------------------------------- |
| **`options`** | <code>{ userId?: string; email?: string; }</code> |

**Since:** 4.1.0

--------------------


### registerUnidentifiedUser()

```typescript
registerUnidentifiedUser() => Promise<void>
```

**Since:** 1.0.0

--------------------


### loginUnidentifiedUser()

```typescript
loginUnidentifiedUser() => Promise<void>
```

Login an unidentified user with Intercom.

**Since:** 4.1.0

--------------------


### updateUser(...)

```typescript
updateUser(options: IntercomUserUpdateOptions) => Promise<void>
```

Updates a user's attributes in Intercom.

| Param         | Type                                                                            |
| ------------- | ------------------------------------------------------------------------------- |
| **`options`** | <code><a href="#intercomuserupdateoptions">IntercomUserUpdateOptions</a></code> |

**Since:** 1.0.0

--------------------


### logout()

```typescript
logout() => Promise<void>
```

Logs the user out of Intercom.

**Since:** 1.0.0

--------------------


### logEvent(...)

```typescript
logEvent(options: { name: string; data?: any; }) => Promise<void>
```

Logs an event with optional metadata in Intercom.

| Param         | Type                                       |
| ------------- | ------------------------------------------ |
| **`options`** | <code>{ name: string; data?: any; }</code> |

**Since:** 1.0.0

--------------------


### displayMessenger()

```typescript
displayMessenger() => Promise<void>
```

**Since:** 1.0.0

--------------------


### displayMessageComposer(...)

```typescript
displayMessageComposer(options: { message: string; }) => Promise<void>
```

Displays the Intercom Message Composer with an initial message.

| Param         | Type                              |
| ------------- | --------------------------------- |
| **`options`** | <code>{ message: string; }</code> |

**Since:** 1.0.0

--------------------


### displayHelpCenter()

```typescript
displayHelpCenter() => Promise<void>
```

**Since:** 1.0.0

--------------------


### hideMessenger()

```typescript
hideMessenger() => Promise<void>
```

Hides the Intercom Messenger.

**Since:** 1.0.0

--------------------


### displayLauncher()

```typescript
displayLauncher() => Promise<void>
```

Displays the default Intercom Launcher.

**Since:** 1.0.0

--------------------


### hideLauncher()

```typescript
hideLauncher() => Promise<void>
```

Hides the Intercom Launcher.

**Since:** 1.0.0

--------------------


### displayInAppMessages()

```typescript
displayInAppMessages() => Promise<void>
```

Displays Intercom In-App Messages.

**Since:** 1.0.0

--------------------


### hideInAppMessages()

```typescript
hideInAppMessages() => Promise<void>
```

Hides Intercom In-App Messages.

**Since:** 1.0.0

--------------------


### displayCarousel(...)

```typescript
displayCarousel(options: { carouselId: string; }) => Promise<void>
```

| Param         | Type                                 |
| ------------- | ------------------------------------ |
| **`options`** | <code>{ carouselId: string; }</code> |

**Since:** 1.0.0

--------------------


### setUserHash(...)

```typescript
setUserHash(options: { hmac: string; }) => Promise<void>
```

Sets the HMAC user hash for Intercom Identity Verification.

| Param         | Type                           |
| ------------- | ------------------------------ |
| **`options`** | <code>{ hmac: string; }</code> |

**Since:** 1.0.0

--------------------


### setUserJwt(...)

```typescript
setUserJwt(options: { jwt: string; }) => Promise<void>
```

Sets a JSON Web Token (JWT) for user authentication in the Messenger.
Must be called before `loginIdentifiedUser()` or `loginUnidentifiedUser()`.

| Param         | Type                          |
| ------------- | ----------------------------- |
| **`options`** | <code>{ jwt: string; }</code> |

**Since:** 8.0.0

--------------------


### isUserLoggedIn()

```typescript
isUserLoggedIn() => Promise<{ isLoggedIn: boolean; }>
```

Returns whether a user is currently logged in to Intercom.

**Returns:** <code>Promise&lt;{ isLoggedIn: boolean; }&gt;</code>

**Since:** 8.0.0

--------------------


### fetchLoggedInUserAttributes()

```typescript
fetchLoggedInUserAttributes() => Promise<IntercomUserAttributes | Record<string, string> | undefined>
```

Fetches the attributes of the currently logged-in Intercom user.

**Returns:** <code>Promise&lt;<a href="#intercomuserattributes">IntercomUserAttributes</a> | <a href="#record">Record</a>&lt;string, string&gt;&gt;</code>

**Since:** 8.0.0

--------------------


### setBottomPadding(...)

```typescript
setBottomPadding(options: { value: string; }) => Promise<void>
```

Sets the bottom padding for the Intercom Messenger.

| Param         | Type                            |
| ------------- | ------------------------------- |
| **`options`** | <code>{ value: string; }</code> |

**Since:** 1.0.0

--------------------


### sendPushTokenToIntercom(...)

```typescript
sendPushTokenToIntercom(options: { value: string; }) => Promise<void>
```

Sends a push token to Intercom.

| Param         | Type                            |
| ------------- | ------------------------------- |
| **`options`** | <code>{ value: string; }</code> |

**Since:** 1.0.0

--------------------


### receivePush(...)

```typescript
receivePush(notification: IntercomPushNotificationData) => Promise<void>
```

Processes a received Intercom push notification.

| Param              | Type                                                                                  |
| ------------------ | ------------------------------------------------------------------------------------- |
| **`notification`** | <code><a href="#intercompushnotificationdata">IntercomPushNotificationData</a></code> |

**Since:** 1.0.0

--------------------


### displayArticle(...)

```typescript
displayArticle(options: { articleId: string; }) => Promise<void>
```

| Param         | Type                                |
| ------------- | ----------------------------------- |
| **`options`** | <code>{ articleId: string; }</code> |

**Since:** 1.0.0

--------------------


### presentContent(...)

```typescript
presentContent(options: { contentType: IntercomContent; contentId: string; }) => Promise<void>
```

Presents an Intercom content item by its type and ID.

| Param         | Type                                                                                             |
| ------------- | ------------------------------------------------------------------------------------------------ |
| **`options`** | <code>{ contentType: <a href="#intercomcontent">IntercomContent</a>; contentId: string; }</code> |

**Since:** 4.1.0

--------------------


### present(...)

```typescript
present(options: { space: IntercomSpace; }) => Promise<void>
```

Presents the Intercom's space.

| Param         | Type                                                                |
| ------------- | ------------------------------------------------------------------- |
| **`options`** | <code>{ space: <a href="#intercomspace">IntercomSpace</a>; }</code> |

**Since:** 4.1.0

--------------------


### setupUnreadConversationListener()

```typescript
setupUnreadConversationListener() => Promise<void>
```

Setup listener for unread conversation count updates.

**Since:** 4.1.0

--------------------


### removeUnreadConversationListener()

```typescript
removeUnreadConversationListener() => Promise<void>
```

Remove listener for unread conversation count updates.

**Since:** 4.1.0

--------------------


### getUnreadConversationCount()

```typescript
getUnreadConversationCount() => Promise<{ unreadCount: number; }>
```

Get current unread conversation count.

**Returns:** <code>Promise&lt;{ unreadCount: number; }&gt;</code>

**Since:** 4.1.0

--------------------


### addListener('updateUnreadCount', ...)

```typescript
addListener(eventName: 'updateUnreadCount', listenerFunc: (data: { unreadCount: number; }) => void) => Promise<PluginListenerHandle>
```

Listen for when the unread conversation count is changed.

| Param              | Type                                                     |
| ------------------ | -------------------------------------------------------- |
| **`eventName`**    | <code>'updateUnreadCount'</code>                         |
| **`listenerFunc`** | <code>(data: { unreadCount: number; }) =&gt; void</code> |

**Returns:** <code>Promise&lt;<a href="#pluginlistenerhandle">PluginListenerHandle</a>&gt;</code>

**Since:** 4.1.0

--------------------


### addListener('userEmailSupplied', ...)

```typescript
addListener(eventName: 'userEmailSupplied', listenerFunc: () => void) => Promise<PluginListenerHandle>
```

Listen for when a visitor enters their email into the Messenger.

Only available for Web

| Param              | Type                             |
| ------------------ | -------------------------------- |
| **`eventName`**    | <code>'userEmailSupplied'</code> |
| **`listenerFunc`** | <code>() =&gt; void</code>       |

**Returns:** <code>Promise&lt;<a href="#pluginlistenerhandle">PluginListenerHandle</a>&gt;</code>

**Since:** 7.0.0

--------------------


### addListener('messengerWillShow', ...)

```typescript
addListener(eventName: 'messengerWillShow', listenerFunc: () => void) => Promise<PluginListenerHandle>
```

Listen for when the Messenger is about to be shown.

Only available for iOS

| Param              | Type                             |
| ------------------ | -------------------------------- |
| **`eventName`**    | <code>'messengerWillShow'</code> |
| **`listenerFunc`** | <code>() =&gt; void</code>       |

**Returns:** <code>Promise&lt;<a href="#pluginlistenerhandle">PluginListenerHandle</a>&gt;</code>

**Since:** 7.0.0

--------------------


### addListener('messengerDidShow', ...)

```typescript
addListener(eventName: 'messengerDidShow', listenerFunc: () => void) => Promise<PluginListenerHandle>
```

Listen for when the Messenger is shown.

Only available for iOS and Web

| Param              | Type                            |
| ------------------ | ------------------------------- |
| **`eventName`**    | <code>'messengerDidShow'</code> |
| **`listenerFunc`** | <code>() =&gt; void</code>      |

**Returns:** <code>Promise&lt;<a href="#pluginlistenerhandle">PluginListenerHandle</a>&gt;</code>

**Since:** 7.0.0

--------------------


### addListener('messengerWillHide', ...)

```typescript
addListener(eventName: 'messengerWillHide', listenerFunc: () => void) => Promise<PluginListenerHandle>
```

Listen for when the Messenger is about to be hidden.

Only available for iOS

| Param              | Type                             |
| ------------------ | -------------------------------- |
| **`eventName`**    | <code>'messengerWillHide'</code> |
| **`listenerFunc`** | <code>() =&gt; void</code>       |

**Returns:** <code>Promise&lt;<a href="#pluginlistenerhandle">PluginListenerHandle</a>&gt;</code>

**Since:** 7.0.0

--------------------


### addListener('messengerDidHide', ...)

```typescript
addListener(eventName: 'messengerDidHide', listenerFunc: () => void) => Promise<PluginListenerHandle>
```

Listen for when the Messenger is hidden.

Only available for iOS and Web

| Param              | Type                            |
| ------------------ | ------------------------------- |
| **`eventName`**    | <code>'messengerDidHide'</code> |
| **`listenerFunc`** | <code>() =&gt; void</code>      |

**Returns:** <code>Promise&lt;<a href="#pluginlistenerhandle">PluginListenerHandle</a>&gt;</code>

**Since:** 7.0.0

--------------------


### addListener('newConversationStarted', ...)

```typescript
addListener(eventName: 'newConversationStarted', listenerFunc: () => void) => Promise<PluginListenerHandle>
```

Listen for when new conversation is started.

Only available for iOS

| Param              | Type                                  |
| ------------------ | ------------------------------------- |
| **`eventName`**    | <code>'newConversationStarted'</code> |
| **`listenerFunc`** | <code>() =&gt; void</code>            |

**Returns:** <code>Promise&lt;<a href="#pluginlistenerhandle">PluginListenerHandle</a>&gt;</code>

**Since:** 7.0.0

--------------------


### addListener('unreadTicketCountChanged', ...)

```typescript
addListener(eventName: 'unreadTicketCountChanged', listenerFunc: () => void) => Promise<PluginListenerHandle>
```

Listen for when unread ticket count changes.

Only available for iOS

| Param              | Type                                    |
| ------------------ | --------------------------------------- |
| **`eventName`**    | <code>'unreadTicketCountChanged'</code> |
| **`listenerFunc`** | <code>() =&gt; void</code>              |

**Returns:** <code>Promise&lt;<a href="#pluginlistenerhandle">PluginListenerHandle</a>&gt;</code>

**Since:** 7.0.0

--------------------


### Interfaces


#### IntercomWebConfig

<a href="#intercomwebconfig">IntercomWebConfig</a> Interface

Represent configs that are available on Intercom Web SDK.

| Prop                           | Type                                                                        | Description                                                                                                                                                                                                                                                           | Default              | Since |
| ------------------------------ | --------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- | ----- |
| **`app_id`**                   | <code>string</code>                                                         | Configure Intercom Web APP ID. The APP ID of your Intercom app which will indicate where to store any data. Only available for Web                                                                                                                                    |                      | 4.2.0 |
| **`api_base`**                 | <code><a href="#intercomregionalapibase">IntercomRegionalApiBase</a></code> | Configure Intercom's regional API baseurl. For customers who are using Regional Data Hosting for Intercom, there is an additional parameter to set, to ensure your Messenger is pointing to your Regional workspace. Only available for Web                           |                      | 4.2.0 |
| **`custom_launcher_selector`** | <code>string</code>                                                         | Configure Intercom custom launcher selector. The CSS selector of an element to trigger Intercom("show") in order to activate the messenger. To target an element by ID: "#id_of_element". To target elements by class ".classname_of_elements" Only available for Web |                      | 4.2.0 |
| **`alignment`**                | <code><a href="#intercomalignment">IntercomAlignment</a></code>             | Configure Intercom default launcher alignment. Dictate the alignment of the default launcher icon to be on the left/right. Possible values: "left" or "right" (any other value is treated as right). Only available for Web                                           | <code>"right"</code> | 4.2.0 |
| **`vertical_padding`**         | <code>number</code>                                                         | Configure Intercom default launcher icon's vertical padding. Move the default launcher icon vertically. Padding from bottom of screen. Minimum value: 20. Does not work on mobile. Only available for Web                                                             |                      | 4.2.0 |
| **`horizontal_padding`**       | <code>number</code>                                                         | Configure Intercom default launcher icon's horizontal padding. Move the default launcher icon horizontally. Padding from right side of screen Minimum value: 20. Does not work on mobile. Only available for Web                                                      |                      | 4.2.0 |
| **`hide_default_launcher`**    | <code>boolean</code>                                                        | Configure Intercom default launcher icon's visibility. Hide the default launcher icon. Setting to false will forcefully show the launcher icon. Only available for Web                                                                                                |                      | 4.2.0 |
| **`session_duration`**         | <code>number</code>                                                         | Configure Intercom session duration. Time in milliseconds for the Intercom session to be considered active. A value of 5 * 60 * 1000 would set the expiry time to be 5 minutes Only available for Web                                                                 |                      | 4.2.0 |
| **`action_color`**             | <code>string</code>                                                         | Configure action color for Intercom. Used in button links and more to highlight and emphasise. The color string can be any valid CSS Color Name HEX or RGB Only available for Web                                                                                     |                      | 4.2.0 |
| **`background_color`**         | <code>string</code>                                                         | Configure background color for Intercom. Used behind your team profile and other attributes. The color string can be any valid CSS Color Name HEX or RGB Only available for Web                                                                                       |                      | 4.2.0 |


#### LoadWithKeysOption

<a href="#loadwithkeysoption">LoadWithKeysOption</a> Interface.

Represents options required for dynamic load of native Intercom SDK.

Only available for iOS and Android.

| Prop                | Type                | Description          |
| ------------------- | ------------------- | -------------------- |
| **`appId`**         | <code>string</code> |                      |
| **`iosApiKey`**     | <code>string</code> | Required for iOS     |
| **`androidApiKey`** | <code>string</code> | Required for Android |


#### IntercomUserUpdateOptions

<a href="#intercomuserupdateoptions">IntercomUserUpdateOptions</a> Interface

Represents the options for updating a user's attributes in Intercom.

Only available for iOS and Android.

| Prop                   | Type                                                         |
| ---------------------- | ------------------------------------------------------------ |
| **`userId`**           | <code>string</code>                                          |
| **`email`**            | <code>string</code>                                          |
| **`name`**             | <code>string</code>                                          |
| **`phone`**            | <code>string</code>                                          |
| **`languageOverride`** | <code>string</code>                                          |
| **`customAttributes`** | <code><a href="#record">Record</a>&lt;string, any&gt;</code> |
| **`company`**          | <code><a href="#companyoption">CompanyOption</a></code>      |
| **`companies`**        | <code>CompanyOption[]</code>                                 |


#### CompanyOption

<a href="#companyoption">CompanyOption</a> Interface.

Represents Intercom option to include company details.

| Prop                   | Type                                                         | Description                   |
| ---------------------- | ------------------------------------------------------------ | ----------------------------- |
| **`name`**             | <code>string</code>                                          | Required for Web              |
| **`companyId`**        | <code>string</code>                                          | Required for Native platforms |
| **`createdAt`**        | <code>number</code>                                          | Unix timestamp                |
| **`monthlySpend`**     | <code>number</code>                                          |                               |
| **`plan`**             | <code>string</code>                                          |                               |
| **`customAttributes`** | <code><a href="#record">Record</a>&lt;string, any&gt;</code> |                               |


#### IntercomUserAttributes

<a href="#intercomuserattributes">IntercomUserAttributes</a> Interface

Attributes returned by `fetchLoggedInUserAttributes()`.

Only available for iOS and Android.

| Prop                   | Type                                                         |
| ---------------------- | ------------------------------------------------------------ |
| **`userId`**           | <code>string</code>                                          |
| **`email`**            | <code>string</code>                                          |
| **`name`**             | <code>string</code>                                          |
| **`phone`**            | <code>string</code>                                          |
| **`languageOverride`** | <code>string</code>                                          |
| **`customAttributes`** | <code><a href="#record">Record</a>&lt;string, any&gt;</code> |


#### IntercomPushNotificationData

<a href="#intercompushnotificationdata">IntercomPushNotificationData</a> Interface

Represents the structure of a received Intercom push notification.

Only available for iOS and Android.

| Prop                            | Type                |
| ------------------------------- | ------------------- |
| **`conversation_id`**           | <code>string</code> |
| **`message`**                   | <code>string</code> |
| **`body`**                      | <code>string</code> |
| **`author_name`**               | <code>string</code> |
| **`image_url`**                 | <code>string</code> |
| **`app_name`**                  | <code>string</code> |
| **`receiver`**                  | <code>string</code> |
| **`conversation_part_type`**    | <code>string</code> |
| **`intercom_push_type`**        | <code>string</code> |
| **`uri`**                       | <code>string</code> |
| **`push_only_conversation_id`** | <code>string</code> |
| **`instance_id`**               | <code>string</code> |
| **`title`**                     | <code>string</code> |
| **`priority`**                  | <code>number</code> |


#### PluginListenerHandle

| Prop         | Type                                      |
| ------------ | ----------------------------------------- |
| **`remove`** | <code>() =&gt; Promise&lt;void&gt;</code> |


### Type Aliases


#### Record

Construct a type with a set of properties K of type T

<code>{
 [P in K]: T;
 }</code>


### Enums


#### IntercomRegionalApiBase

| Members  | Value                                         |
| -------- | --------------------------------------------- |
| **`Us`** | <code>'https://api-iam.intercom.io'</code>    |
| **`Eu`** | <code>'https://api-iam.eu.intercom.io'</code> |
| **`Au`** | <code>'https://api-iam.au.intercom.io'</code> |


#### IntercomAlignment

| Members     | Value                |
| ----------- | -------------------- |
| **`Left`**  | <code>'left'</code>  |
| **`Right`** | <code>'right'</code> |


#### IntercomContent

| Members            | Value                       | Description                        | Since |
| ------------------ | --------------------------- | ---------------------------------- | ----- |
| **`Article`**      | <code>'article'</code>      |                                    |       |
| **`Survey`**       | <code>'survey'</code>       |                                    |       |
| **`Carousel`**     | <code>'carousel'</code>     | Only available for iOS and Android | 4.1.0 |
| **`Checklist`**    | <code>'checklist'</code>    | Only available for Web             | 4.2.0 |
| **`News`**         | <code>'news'</code>         | Only available for Web             | 4.2.0 |
| **`Tour`**         | <code>'tour'</code>         | Only available for Web             | 4.2.0 |
| **`Ticket`**       | <code>'ticket'</code>       | Only available for Web             | 7.0.0 |
| **`Conversation`** | <code>'conversation'</code> |                                    | 7.0.0 |


#### IntercomSpace

| Members          | Value                   | Description            | Since |
| ---------------- | ----------------------- | ---------------------- | ----- |
| **`Home`**       | <code>'home'</code>     |                        |       |
| **`Messages`**   | <code>'messages'</code> |                        |       |
| **`HelpCenter`** | <code>'help'</code>     |                        |       |
| **`News`**       | <code>'news'</code>     | Only available on web. | 4.2.0 |
| **`Tasks`**      | <code>'tasks'</code>    | Only available on web. | 4.2.0 |
| **`Tickets`**    | <code>'tickets'</code>  |                        | 7.0.0 |

</docgen-api>

## Platform configuration

### iOS

Add your Intercom credentials to `capacitor.config.ts` (or `capacitor.config.json`):

```json
{
  "plugins": {
    "Intercom": {
      "iosApiKey": "ios_sdk-xxx",
      "iosAppId": "yyy"
    }
  }
}
```

Then run:

```bash
npx cap sync ios
npx cap open ios
```

Sign your app in Xcode under the General tab.

> **Tip:** After changing native code, clean the build cache (Product > Clean Build Folder) before running again.

### Android

Add your Intercom credentials to `capacitor.config.ts` (or `capacitor.config.json`):

```json
{
  "plugins": {
    "Intercom": {
      "androidApiKey": "android_sdk-xxx",
      "androidAppId": "yyy"
    }
  }
}
```

Then run:

```bash
npx cap sync android
npx cap open android
```

> **Tip:** After changing native code, clean the build cache (Build > Clean Project) before running again.

### Web

No native configuration needed. Call `Intercom.load()` with your `app_id` in your application code. See the [Usage](#usage) section above.

## License

MIT

## Original repository's maintainers and sponsors

This repository is based on the wonderful work of the official `@capacitor-community/intercom` -plugin. Here we want to acknowledge the mastermind and sponsors behind that work.

### Sponsors

<table>
  <tr>
    <td align="center">
      <a href="https://intenseloop.com">
        <img src="https://static.intenseloop.com/assets/logo-512x512.png" width="40" />
      </a>
    </td>
    <td>
      <a href="https://intenseloop.com">Intenseloop</a>
    </td>
  </tr>
</table>

### Maintainers

| Maintainer   | GitHub                                  | Social                                    |
| ------------ | --------------------------------------- | ----------------------------------------- |
| Stewan Silva | [stewones](https://github.com/stewones) | [@stewones](https://twitter.com/stewones) |

## Future plans

If you have any ideas what we should include, please open a new issue for it.

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://twitter.com/stewones"><img src="https://avatars1.githubusercontent.com/u/719763?v=4?s=75" width="75px;" alt=""/><br /><sub><b>Stew</b></sub></a><br /><a href="https://github.com/capacitor-community/intercom/commits?author=stewones" title="Code">💻</a> <a href="https://github.com/capacitor-community/intercom/commits?author=stewones" title="Documentation">📖</a></td>
    <td align="center"><a href="https://davidseek.com/"><img src="https://avatars2.githubusercontent.com/u/17073950?v=4?s=75" width="75px;" alt=""/><br /><sub><b>David Seek</b></sub></a><br /><a href="https://github.com/capacitor-community/intercom/commits?author=davidseek" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/rnikitin"><img src="https://avatars3.githubusercontent.com/u/1829318?v=4?s=75" width="75px;" alt=""/><br /><sub><b>Roman Nikitin</b></sub></a><br /><a href="https://github.com/capacitor-community/intercom/commits?author=rnikitin" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/atomassoni"><img src="https://avatars1.githubusercontent.com/u/17362459?v=4?s=75" width="75px;" alt=""/><br /><sub><b>Anne Tomassoni</b></sub></a><br /><a href="https://github.com/capacitor-community/intercom/commits?author=atomassoni" title="Code">💻</a> <a href="https://github.com/capacitor-community/intercom/pulls?q=is%3Apr+reviewed-by%3Aatomassoni" title="Reviewed Pull Requests">👀</a></td>
    <td align="center"><a href="https://github.com/mmodzelewski"><img src="https://avatars2.githubusercontent.com/u/7762633?v=4?s=75" width="75px;" alt=""/><br /><sub><b>Maciej Modzelewski</b></sub></a><br /><a href="https://github.com/capacitor-community/intercom/commits?author=mmodzelewski" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/spaghettiguru"><img src="https://avatars.githubusercontent.com/u/5624009?v=4?s=75" width="75px;" alt=""/><br /><sub><b>Oleg Yuzvik</b></sub></a><br /><a href="#maintenance-spaghettiguru" title="Maintenance">🚧</a></td>
    <td align="center"><a href="https://github.com/gcorreaalves"><img src="https://avatars.githubusercontent.com/u/983426?v=4?s=75" width="75px;" alt=""/><br /><sub><b>Gustavo Corrêa Alves</b></sub></a><br /><a href="https://github.com/capacitor-community/intercom/commits?author=gcorreaalves" title="Documentation">📖</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/Jealvia"><img src="https://avatars.githubusercontent.com/u/28424830?v=4?s=75" width="75px;" alt=""/><br /><sub><b>Jealvia</b></sub></a><br /><a href="#maintenance-Jealvia" title="Maintenance">🚧</a></td>
    <td align="center"><a href="https://adamduren.com/"><img src="https://avatars.githubusercontent.com/u/581097?v=4?s=75" width="75px;" alt=""/><br /><sub><b>Adam Duren</b></sub></a><br /><a href="https://github.com/capacitor-community/intercom/commits?author=adamduren" title="Code">💻</a> <a href="#maintenance-adamduren" title="Maintenance">🚧</a></td>
    <td align="center"><a href="https://github.com/ramikhafagi96"><img src="https://avatars.githubusercontent.com/u/38646828?v=4?s=75" width="75px;" alt=""/><br /><sub><b>Rami Khafagi</b></sub></a><br /><a href="https://github.com/capacitor-community/intercom/commits?author=ramikhafagi96" title="Code">💻</a></td>
    <td align="center"><a href="https://rdlabo.jp/"><img src="https://avatars.githubusercontent.com/u/9690024?v=4?s=75" width="75px;" alt=""/><br /><sub><b>Masahiko Sakakibara</b></sub></a><br /><a href="#maintenance-rdlabo" title="Maintenance">🚧</a></td>
    <td align="center"><a href="https://github.com/camdjn"><img src="https://avatars.githubusercontent.com/u/7116085?v=4?s=75" width="75px;" alt=""/><br /><sub><b>Dejardin Camille</b></sub></a><br /><a href="https://github.com/capacitor-community/intercom/commits?author=camdjn" title="Code">💻</a></td>
    <td align="center"><a href="https://scr2em.github.io/portfolio/"><img src="https://avatars.githubusercontent.com/u/4671486?v=4?s=75" width="75px;" alt=""/><br /><sub><b>Mohamed Abdelgwad</b></sub></a><br /><a href="#maintenance-scr2em" title="Maintenance">🚧</a></td>
    <td align="center"><a href="https://github.com/shark404"><img src="https://avatars.githubusercontent.com/u/4898049?v=4?s=75" width="75px;" alt=""/><br /><sub><b>Nathan</b></sub></a><br /><a href="#maintenance-shark404" title="Maintenance">🚧</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
