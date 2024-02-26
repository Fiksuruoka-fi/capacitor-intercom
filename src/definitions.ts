/// <reference types="@capacitor/cli" />
import type { PluginListenerHandle } from '@capacitor/core';

declare module '@capacitor/cli' {
  export interface PluginsConfig {
    /**
     * On iOS, the keyboard can be configured with the following options:
     */
    Intercom?: {
      /**
       * Configure Intercom iOS API Key.
       *
       * Only available on iOS.
       *
       * @see https://developers.intercom.com/installing-intercom/docs/setup#step-3---initialize-intercom
       * @since 1.0.0
       * @example "ios_sdk-xxx"
       */
      iosApiKey?: string;

      /**
       * Configure Intercom iOS APP ID.
       *
       * Only available on iOS.
       *
       * @see https://developers.intercom.com/installing-intercom/docs/setup#step-3---initialize-intercom
       * @since 1.0.0
       * @example "yyy"
       */
      iosAppId?: string;

      /**
       * Configure Intercom Android Api key.
       *
       * Only available for Android
       *
       * @see https://developers.intercom.com/installing-intercom/docs/setup-android#step-2---initialize-intercom
       * @since 1.0.0
       * @example "android_sdk-xxx"
       */
      androidApiKey?: string;

      /**
       * Configure Intercom Android APP ID.
       *
       * Only available for Android
       *
       * @see https://developers.intercom.com/installing-intercom/docs/setup-android#step-2---initialize-intercom
       * @since 1.0.0
       * @example "yyy"
       */
      androidAppId?: string;
    };
  }
}

declare global {
  interface Window {
    Intercom: IntercomStatic;
  }
}

/**
 * IntercomWebConfig Interface
 *
 * Represent configs that are available on Intercom Web SDK.
 *
 * @see https://developers.intercom.com/installing-intercom/docs/javascript-api-attributes-objects
 * @since 4.2.0
 */
export interface IntercomWebConfig extends Intercom_.IntercomSettings {
  /**
   * Configure Intercom Web APP ID.
   * The APP ID of your Intercom app which will indicate where to store any data.
   *
   * Only available for Web
   *
   * @see https://developers.intercom.com/installing-intercom/docs/javascript-api-attributes-objects#messenger-attributes
   * @since 4.2.0
   * @example "xxx"
   */
  app_id?: string;

  /**
   * Configure Intercom's regional API baseurl.
   * For customers who are using Regional Data Hosting for Intercom, there is an additional parameter to set, to ensure your Messenger is pointing to your Regional workspace.
   *
   * Only available for Web
   *
   * @see https://developers.intercom.com/installing-intercom/docs/basic-javascript
   * @since 4.2.0
   * @example "https://api-iam.intercom.io"
   */
  api_base?: IntercomRegionalApiBase;

  /**
   * Configure Intercom custom launcher selector.
   * The CSS selector of an element to trigger Intercom("show") in order to activate the messenger.
   * To target an element by ID: "#id_of_element". To target elements by class ".classname_of_elements"
   *
   * Only available for Web
   *
   * @see https://docs.intercom.com/configure-intercom-for-your-product-or-site/customize-the-intercom-messenger/customize-the-intercom-messenger-technical
   * @since 4.2.0
   * @example ""
   */
  custom_launcher_selector?: string;

  /**
   * Configure Intercom default launcher alignment.
   * Dictate the alignment of the default launcher icon to be on the left/right.
   * Possible values: "left" or "right" (any other value is treated as right).
   *
   * Only available for Web
   *
   * @see https://docs.intercom.com/configure-intercom-for-your-product-or-site/customize-the-intercom-messenger/customize-the-intercom-messenger-technical
   * @since 4.2.0
   * @default "right"
   * @example "right"
   */
  alignment?: IntercomAlignment;

  /**
   * Configure Intercom default launcher icon's vertical padding.
   * Move the default launcher icon vertically. Padding from bottom of screen. Minimum value: 20.
   *
   * Does not work on mobile.
   * Only available for Web
   *
   * @see https://docs.intercom.com/configure-intercom-for-your-product-or-site/customize-the-intercom-messenger/customize-the-intercom-messenger-technical
   * @since 4.2.0
   * @example 20
   */
  vertical_padding?: number;

  /**
   * Configure Intercom default launcher icon's horizontal padding.
   * Move the default launcher icon horizontally. Padding from right side of screen Minimum value: 20.
   *
   * Does not work on mobile.
   * Only available for Web
   *
   * @see https://docs.intercom.com/configure-intercom-for-your-product-or-site/customize-the-intercom-messenger/customize-the-intercom-messenger-technical
   * @since 4.2.0
   * @example 20
   */
  horizontal_padding?: number;

  /**
   * Configure Intercom default launcher icon's visibility.
   * Hide the default launcher icon. Setting to false will forcefully show the launcher icon.
   *
   * Only available for Web
   *
   * @see https://docs.intercom.com/configure-intercom-for-your-product-or-site/customize-the-intercom-messenger/customize-the-intercom-messenger-technical
   * @since 4.2.0
   * @example false
   */
  hide_default_launcher?: boolean;

  /**
   * Configure Intercom session duration.
   * Time in milliseconds for the Intercom session to be considered active.
   * A value of 5 * 60 * 1000 would set the expiry time to be 5 minutes
   *
   * Only available for Web
   *
   * @see https://developers.intercom.com/installing-intercom/docs/javascript-api-attributes-objects#messenger-attributes
   * @since 4.2.0
   * @example 300000
   */
  session_duration?: number;

  /**
   * Configure action color for Intercom.
   * Used in button links and more to highlight and emphasise.
   *
   * The color string can be any valid CSS Color Name HEX or RGB
   *
   * Only available for Web
   *
   * @see https://developers.intercom.com/installing-intercom/docs/javascript-api-attributes-objects#messenger-attributes
   * @since 4.2.0
   * @example "#000000"
   */
  action_color?: string;

  /**
   * Configure background color for Intercom.
   * Used behind your team profile and other attributes.
   *
   * The color string can be any valid CSS Color Name HEX or RGB
   *
   * Only available for Web
   *
   * @see https://developers.intercom.com/installing-intercom/docs/javascript-api-attributes-objects#messenger-attributes
   * @since 4.2.0
   * @example "#000000"
   */
  background_color?: string;
}

/**
 * IntercomPlugin Interface
 */
export interface IntercomPlugin {
  /**
   * Load Intercom and set configs on Web environment.
   *
   * Only available for Web
   *
   * @since 4.2.0
   */
  load(config: IntercomWebConfig): Promise<void>;

  /**
   * Load Intercom and set configs on Web environment.
   *
   * Only available for iOS and Android
   *
   * @since 4.2.0
   */
  loadWithKeys(options: LoadWithKeysOption): Promise<void>;

  /**
   * @deprecated
   * This method is deprecated. Use `loginIdentifiedUser()` instead.
   *
   * Registers an identified user with Intercom.
   *
   * @since 1.0.0
   */
  registerIdentifiedUser(options: {
    userId?: string;
    email?: string;
  }): Promise<void>;

  /**
   * Login an identified user with Intercom.
   *
   * @since 4.1.0
   */
  loginIdentifiedUser(options: {
    userId?: string;
    email?: string;
  }): Promise<void>;

  /**
   * @deprecated
   * This method is deprecated. Use `loginUnidentifiedUser()` instead.
   *
   *
   * Registers an unidentified user with Intercom.
   *
   * @since 1.0.0
   */
  registerUnidentifiedUser(): Promise<void>;

  /**
   * Login an unidentified user with Intercom.
   *
   * @since 4.1.0
   */
  loginUnidentifiedUser(): Promise<void>;

  /**
   * Updates a user's attributes in Intercom.
   *
   * @since 1.0.0
   */
  updateUser(options: IntercomUserUpdateOptions): Promise<void>;

  /**
   * Logs the user out of Intercom.
   *
   * @since 1.0.0
   */
  logout(): Promise<void>;

  /**
   * Logs an event with optional metadata in Intercom.
   *
   * @since 1.0.0
   */
  logEvent(options: { name: string; data?: any }): Promise<void>;

  /**
   * @deprecated
   * This method is deprecated, use `present()` instead.
   *
   * Displays the Intercom Messenger.
   *
   * @since 1.0.0
   */
  displayMessenger(): Promise<void>;

  /**
   * Displays the Intercom Message Composer with an initial message.
   *
   * @since 1.0.0
   */
  displayMessageComposer(options: { message: string }): Promise<void>;

  /**
   * @deprecated
   * This method is deprecated, use `present()` instead.
   *
   * Displays the Intercom Help Center.
   *
   * @since 1.0.0
   */
  displayHelpCenter(): Promise<void>;

  /**
   * Hides the Intercom Messenger.
   *
   * @since 1.0.0
   */
  hideMessenger(): Promise<void>;

  /**
   * Displays the default Intercom Launcher.
   *
   * @since 1.0.0
   */
  displayLauncher(): Promise<void>;

  /**
   * Hides the Intercom Launcher.
   *
   * @since 1.0.0
   */
  hideLauncher(): Promise<void>;

  /**
   * Displays Intercom In-App Messages.
   *
   * @since 1.0.0
   */
  displayInAppMessages(): Promise<void>;

  /**
   * Hides Intercom In-App Messages.
   *
   * @since 1.0.0
   */
  hideInAppMessages(): Promise<void>;

  /**
   * @deprecated
   * This method is deprecated, use `presentContent()` instead.
   *
   * Displays an Intercom Carousel by its ID.
   *
   * @since 1.0.0
   */
  displayCarousel(options: { carouselId: string }): Promise<void>;

  /**
   * Sets the HMAC user hash for Intercom Identity Verification.
   *
   * @see https://www.intercom.com/help/en/articles/183-enable-identity-verification-for-web-and-mobile
   * @since 1.0.0
   */
  setUserHash(options: { hmac: string }): Promise<void>;

  /**
   * Sets the bottom padding for the Intercom Messenger.
   *
   * @since 1.0.0
   */
  setBottomPadding(options: { value: string }): Promise<void>;

  /**
   * Sends a push token to Intercom.
   *
   * @since 1.0.0
   */
  sendPushTokenToIntercom(options: { value: string }): Promise<void>;

  /**
   * Processes a received Intercom push notification.
   *
   * @since 1.0.0
   */
  receivePush(notification: IntercomPushNotificationData): Promise<void>;

  /**
   * @deprecated
   * This method is deprecated, use `presentContent()` instead.
   *
   * Displays an Intercom Article by its ID.
   *
   * @since 1.0.0
   */
  displayArticle(options: { articleId: string }): Promise<void>;

  /**
   * Presents an Intercom content item by its type and ID.
   *
   * @since 4.1.0
   */
  presentContent(options: {
    contentType: IntercomContent;
    contentId: string;
  }): Promise<void>;

  /**
   * Presents the Intercom's space.
   *
   * @since 4.1.0
   */
  present(options: { space: IntercomSpace }): Promise<void>;

  /**
   * Setup listener for unread conversation count updates.
   *
   * @since 4.1.0
   */
  setupUnreadConversationListener(): Promise<void>;

  /**
   * Remove listener for unread conversation count updates.
   *
   * @since 4.1.0
   */
  removeUnreadConversationListener(): Promise<void>;

  /**
   * Get current unread conversation count.
   *
   * @since 4.1.0
   */
  getUnreadConversationCount(): Promise<{ unreadCount: number }>;

  /**
   * Listen for when the unread conversation count is changed.
   *
   * @requires calling `setupUnreadConversationListener()` before getting notifications.
   * @since 4.1.0
   */
  addListener(
    eventName: 'updateUnreadCount',
    listenerFunc: (data: { unreadCount: number }) => void,
  ): Promise<PluginListenerHandle> & PluginListenerHandle;
}

/**
 * IntercomPushNotificationData Interface
 *
 * Represents the structure of a received Intercom push notification.
 *
 * Only available for iOS and Android.
 *
 * @since 1.0.0
 */
export interface IntercomPushNotificationData {
  conversation_id: string;
  message: string;
  body: string;
  author_name: string;
  image_url: string;
  app_name: string;
  receiver: string;
  conversation_part_type: string;
  intercom_push_type: string;
  uri: string;
  push_only_conversation_id: string;
  instance_id: string;
  title: string;
  priority: number;
}

/**
 * IntercomUserUpdateOptions Interface
 *
 * Represents the options for updating a user's attributes in Intercom.
 *
 * Only available for iOS and Android.
 *
 * @since 1.0.0
 */
export interface IntercomUserUpdateOptions {
  userId?: string;
  email?: string;
  name?: string;
  phone?: string;
  languageOverride?: string;
  customAttributes?: Record<string, any>;
  company?: CompanyOption;
  companies?: CompanyOption[];
}

/**
 * IntercomCommandSignature Interface
 *
 * Represents available methods in Web implementation
 *
 * Only available for Web.
 */
export interface IntercomCommandSignature
  extends Intercom_.IntercomCommandSignature {
  showNews: (newsItemId: number) => void;
  startChecklist: (checklistId: number) => void;
  showSpace: (spaceName: IntercomSpace) => void;
}

/**
 * IntercomCommand Type
 *
 * Represents available method names in Web implementation
 *
 * Only available for Web.
 */
export type IntercomCommand = keyof IntercomCommandSignature;

/**
 * State Interface
 *
 * Represents the state of the current Web SDK.
 *
 * Only available for Web
 * @since 4.2.0
 */
export interface State {
  /**
   * Mirrors booted value from Intercom.
   */
  booted: boolean;

  /**
   * Configuration for Intercom messenger.
   */
  config: IntercomWebConfig;

  /**
   * Status if Intercom has been initialized.
   */
  initialized: boolean;

  /**
   * Number of unread conversations.
   */
  unreadCount: number;

  /**
   * Status of if Intercom messenger is currently visible.
   */
  isVisible: boolean;

  /**
   * Status if listener for unread messages has been set.
   */
  unreadListenerAttached: boolean;
}

/**
 * IntercomStatic Interface
 *
 * Represents web Intercom SDK's API method caller.
 *
 * Only available for Web.
 * @since 4.2.0
 */
export interface IntercomStatic {
  <Command extends IntercomCommand>(
    command: Command,
    ...params: Parameters<IntercomCommandSignature[Command]>
  ): ReturnType<IntercomCommandSignature[Command]>;
  booted: boolean;
}

/**
 * LoadWithKeysOption Interface.
 *
 * Represents options required for dynamic load of native Intercom SDK.
 *
 * Only available for iOS and Android.
 * @since 4.3.2
 */
export interface LoadWithKeysOption {
  appId: string;

  /**
   * Required for iOS
   */
  iosApiKey?: string;

  /**
   * Required for Android
   */
  androidApiKey?: string;
}

/**
 * CompanyOption Interface.
 *
 * Represents Intercom option to include company details.
 *
 * @since 4.2.2
 */
export interface CompanyOption {
  /**
   * Required for Web
   */
  name: string;

  /**
   * Required for Native platforms
   */
  companyId: string;

  /**
   * Unix timestamp
   */
  createdAt?: number;

  monthlySpend?: number;
  plan?: string;
  customAttributes?: Record<string, any>;
}

/**
 * IntercomSpace Enum
 *
 * Represents the different spaces available for
 * presentation within the Intercom Messenger.
 *
 * @since 4.1.0
 */
export enum IntercomSpace {
  Home = 'home',
  Messages = 'messages',
  HelpCenter = 'help',

  /**
   * Only available on web.
   *
   * @since 4.2.0
   */
  News = 'news',

  /**
   * Only available on web.
   *
   * @since 4.2.0
   */
  Tasks = 'tasks',
}

/**
 * IntercomContent Enum
 * Represents the different content types that can be presented within the Intercom Messenger.
 */
export enum IntercomContent {
  Article = 'article',
  Survey = 'survey',

  /**
   * Only available for iOS and Android
   *
   * @since 4.1.0
   */
  Carousel = 'carousel',

  /**
   * Only available for Web
   *
   * @since 4.2.0
   */
  Checklist = 'checklist',

  /**
   * Only available for Web
   *
   * @since 4.2.0
   */
  News = 'news',

  /**
   * Only available for Web
   *
   * @since 4.2.0
   */
  Tour = 'tour',
}

/**
 * IntercomAlignment enum
 *
 * Represents the options of Intercom alignment in Web SDK.
 *
 * Only available for Web
 *
 * @since 4.2.0
 */
export enum IntercomAlignment {
  Left = 'left',
  Right = 'right',
}

/**
 * IntercomRegionalApiBase enum
 *
 * Represents the options of Intercom API baseurl in Web SDK.
 *
 * Only available for Web
 *
 * @since 4.2.0
 */
export enum IntercomRegionalApiBase {
  Us = 'https://api-iam.intercom.io',
  Eu = 'https://api-iam.eu.intercom.io',
  Au = 'https://api-iam.au.intercom.io',
}
