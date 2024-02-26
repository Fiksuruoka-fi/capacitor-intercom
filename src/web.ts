import { WebPlugin } from '@capacitor/core';

import type {
  IntercomCommand,
  IntercomCommandSignature,
  IntercomPlugin,
  IntercomPushNotificationData,
  IntercomUserUpdateOptions,
  IntercomWebConfig,
  LoadWithKeysOption,
  State,
} from './definitions';
import { IntercomContent, IntercomSpace } from './definitions';

export class IntercomWeb extends WebPlugin implements IntercomPlugin {
  private SCRIPT_ID = 'capacitor-intercom';
  private preCalledMethods: IntercomCommand[][] = [];

  private state: State = {
    booted: false,
    config: {},
    initialized: false,
    isVisible: false,
    unreadCount: 0,
    unreadListenerAttached: false,
  };

  constructor() {
    super();
  }

  async load(config: IntercomWebConfig): Promise<void> {
    this.state.config = config;

    if (typeof window.Intercom === 'function' && window.Intercom.booted) {
      this.initialize();
    } else {
      if (document.readyState === 'complete') {
        this.includeScript(this.state.config.app_id || '', () =>
          this.initialize(),
        );
      } else {
        const listener = () => {
          this.includeScript(this.state.config.app_id || '', () =>
            this.initialize(),
          );
          window.removeEventListener('load', listener);
        };
        window.addEventListener('load', listener, false);
      }
    }
  }

  async loadWithKeys(_options: LoadWithKeysOption): Promise<void> {
    throw this.unimplemented('Not implemented on web.');
  }

  async initialize(): Promise<void> {
    this.state.booted = window.Intercom.booted;
    this.callIntercom('reattach_activator');
    this.updateConfig(this.state.config);
    this.state.initialized = true;

    for (const [command, params] of this.preCalledMethods) {
      this.callIntercom(command, params);
    }

    this.callIntercom('onHide', () => this.setIsVisible(true));
    this.callIntercom('onShow', () => this.setIsVisible(false));
    this.callIntercom('boot', this.state.config);
  }

  async loginIdentifiedUser(_options: {
    userId?: string | undefined;
    email?: string | undefined;
  }): Promise<void> {
    throw this.unimplemented('Not implemented on web.');
  }

  async loginUnidentifiedUser(): Promise<void> {
    throw this.unimplemented('Not implemented on web.');
  }

  async presentContent(options: {
    contentType: IntercomContent;
    contentId: string;
  }): Promise<void> {
    const { contentType, contentId } = options;
    const parsedId = parseInt(contentId);
    if (!contentId) {
      throw this.unavailable('Content ID not defined.');
    }

    switch (contentType) {
      case IntercomContent.Article:
        this.callIntercom('showArticle', parsedId);
        return;
      case IntercomContent.Carousel:
        throw this.unimplemented('Carousel not implemented on web.');
      case IntercomContent.Checklist:
        this.callIntercom('startChecklist', parsedId);
        return;
      case IntercomContent.News:
        this.callIntercom('showNews', parsedId);
        return;
      case IntercomContent.Survey:
        this.callIntercom('startSurvey', parsedId);
        return;
      case IntercomContent.Tour:
        this.callIntercom('startTour', parsedId);
        return;
      default:
        throw this.unimplemented(`${contentType} not implemented on web.`);
    }
  }

  async present(options: { space: IntercomSpace }): Promise<void> {
    const { space } = options;

    switch (space) {
      case IntercomSpace.HelpCenter:
        this.callIntercom('showSpace', IntercomSpace.HelpCenter);
        return;
      case IntercomSpace.Home:
        this.callIntercom('showSpace', IntercomSpace.Home);
        return;
      case IntercomSpace.Messages:
        this.callIntercom('showSpace', IntercomSpace.Messages);
        return;
      case IntercomSpace.News:
        this.callIntercom('showSpace', IntercomSpace.News);
        return;
      case IntercomSpace.Tasks:
        this.callIntercom('showSpace', IntercomSpace.Tasks);
        return;
      default:
        throw this.unimplemented(`${space} not implemented on web.`);
    }
  }

  async registerIdentifiedUser(_options: {
    userId?: string;
    email?: string;
  }): Promise<void> {
    throw this.unimplemented('Not implemented on web.');
  }

  async registerUnidentifiedUser(): Promise<void> {
    throw this.unimplemented('Not implemented on web.');
  }

  async updateUser(options: IntercomUserUpdateOptions): Promise<void> {
    const company = this.constructCompany(options.company);
    const companies = options.companies
      ?.map(this.constructCompany)
      .filter(company => !!company) as Intercom_.IntercomCompany[];

    const configEntries = Object.entries({
      user_id: options.userId,
      language_override: options.languageOverride,
      phone: options.phone,
      name: options.name,
      company,
      companies,
      ...(options.customAttributes || {}),
    }).filter(([_, value]) => value !== undefined);

    const webConfig: IntercomWebConfig = Object.fromEntries(configEntries);
    this.updateConfig(webConfig);
  }

  async logout(): Promise<void> {
    this.callIntercom('shutdown');
    this.resetState();
  }

  async logEvent(options: { name: string; data?: any }): Promise<void> {
    const { name, data } = options;
    if (!name) {
      throw this.unavailable('Event name not found.');
    }

    if (data) {
      this.callIntercom('trackEvent', name, data);
    } else {
      this.callIntercom('trackEvent', name);
    }
  }

  async displayMessenger(): Promise<void> {
    this.callIntercom('showMessages');
  }

  async hideMessenger(): Promise<void> {
    this.callIntercom('hide');
  }

  async displayMessageComposer(options: { message: string }): Promise<void> {
    const { message } = options;
    this.callIntercom('showNewMessage', message);
  }

  async displayHelpCenter(): Promise<void> {
    this.callIntercom('showSpace', IntercomSpace.HelpCenter);
  }

  async displayLauncher(): Promise<void> {
    this.updateConfig({ hide_default_launcher: false });
  }

  async hideLauncher(): Promise<void> {
    this.updateConfig({ hide_default_launcher: true });
  }

  async displayInAppMessages(): Promise<void> {
    throw this.unimplemented('Not implemented on web.');
  }

  async hideInAppMessages(): Promise<void> {
    throw this.unimplemented('Not implemented on web.');
  }

  async displayCarousel(_options: { carouselId: string }): Promise<void> {
    throw this.unimplemented('Not implemented on web.');
  }

  async setUserHash(options: { hmac: string }): Promise<void> {
    const { hmac } = options;
    if (hmac) {
      this.updateConfig({ user_hash: hmac });
      return;
    }
    throw this.unavailable('HMAC option not found.');
  }

  async setBottomPadding(options: { value: string }): Promise<void> {
    const { value } = options;
    const numberValue = parseInt(value);

    if (!numberValue || numberValue < 20) {
      throw this.unavailable('Invalid value.');
    }

    this.updateConfig({ vertical_padding: numberValue });
  }

  async receivePush(
    _notification: IntercomPushNotificationData,
  ): Promise<void> {
    throw this.unimplemented('Not implemented on web.');
  }

  async sendPushTokenToIntercom(_options: { value: string }): Promise<void> {
    throw this.unimplemented('Not implemented on web.');
  }

  async displayArticle(options: { articleId: string }): Promise<void> {
    const { articleId } = options;
    if (!parseInt(articleId)) {
      throw this.unavailable('Invalid article id');
    }

    this.callIntercom('showArticle', parseInt(articleId));
  }

  async setupUnreadConversationListener(): Promise<void> {
    if (this.state.unreadListenerAttached) return;

    this.callIntercom('onUnreadCountChange', unreadCount =>
      this.unreadListener(unreadCount),
    );
    this.state.unreadListenerAttached = true;
  }

  async removeUnreadConversationListener(): Promise<void> {
    throw this.unimplemented('Method not implemented on web.');
  }

  async getUnreadConversationCount(): Promise<{ unreadCount: number }> {
    await this.setupUnreadConversationListener();
    return {
      unreadCount: this.state.unreadCount,
    };
  }

  private constructCompany(
    company: IntercomUserUpdateOptions['company'],
  ): IntercomWebConfig['company'] {
    if (company) {
      const companyEntries = Object.entries({
        name: company.name,
        company_id: company.companyId,
        created_at: company.createdAt,
        plan: company.plan,
        monthly_spend: company.monthlySpend,
        ...(company.customAttributes || {}),
      }).filter(([_, value]) => value !== undefined);

      if (companyEntries.length) {
        return Object.fromEntries(
          companyEntries,
        ) as IntercomWebConfig['company'];
      }
    }
  }

  /**
   * Resets the state, preserving only the configuration.
   *
   * @private
   */
  private resetState() {
    this.state.config = {};
    this.state.unreadCount = 0;
    this.state.unreadListenerAttached = false;
  }

  /**
   * Includes the Intercom script on the page and calls the done callback when finished.
   *
   * @param appId - The Intercom application ID.
   * @param done - The callback function to be called when the script is loaded.
   * @private
   */
  private includeScript(appId: string, done: () => void) {
    const doc = window.document;
    if (doc.getElementById(this.SCRIPT_ID)) {
      done();
      return;
    }

    const script = doc.createElement('script');
    script.id = this.SCRIPT_ID;
    script.type = 'text/javascript';
    script.async = true;
    script.src = `https://widget.intercom.io/widget/${appId}`;

    const head = doc.getElementsByTagName('head')[0];
    head.appendChild(script);

    script.onload = done;
  }

  /**
   * Updates the unread message count and notifies listeners.
   *
   * @param count - The new unread message count.
   * @private
   */
  private unreadListener(count: number) {
    this.state.unreadCount = count;
    this.notifyListeners('updateUnreadCount', { unreadCount: count });
  }

  /**
   * Calls the Intercom function with the given command and parameters.
   *
   * @param command - The Intercom command to call.
   * @param params - The parameters for the command.
   * @private
   */
  private callIntercom<Command extends IntercomCommand>(
    command: Command,
    ...params: Parameters<IntercomCommandSignature[Command]>
  ) {
    if (typeof window.Intercom === 'function') {
      window.Intercom(command, ...params);
    } else {
      this.preCalledMethods.push([command, ...params]);
    }
  }

  /**
   * Sets the visibility state of the Intercom widget.
   *
   * @param value - The new visibility state (true for visible, false for hidden).
   * @private
   */
  private setIsVisible(value: boolean) {
    this.state.isVisible = !!value;
  }

  /**
   * Updates the Intercom configuration with the given options.
   *
   * @param options - The new configuration options to update.
   * @throws If options are not found or invalid.
   * @private
   */
  private updateConfig(options: IntercomWebConfig) {
    if (!Object.keys(options || {}).length) {
      throw this.unavailable('Update options not found or invalid.');
    }

    this.callIntercom('update', options);
    Object.assign(this.state.config, options);
  }
}

const Intercom = new IntercomWeb();

export { Intercom };
