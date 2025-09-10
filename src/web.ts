import { WebPlugin } from '@capacitor/core';
import IntercomModule, {
  boot,
  hide,
  onHide,
  onShow,
  onUnreadCountChange,
  onUserEmailSupplied,
  showArticle,
  showConversation,
  showMessages,
  showNewMessage,
  showNews,
  showSpace,
  showTicket,
  shutdown,
  startChecklist,
  startSurvey,
  startTour,
  trackEvent,
  update,
} from '@intercom/messenger-js-sdk';

import type {
  IntercomCompany,
  IntercomPlugin,
  IntercomPushNotificationData,
  IntercomUserUpdateOptions,
  IntercomWebConfig,
  LoadWithKeysOption,
  State,
} from './definitions';
import { IntercomContent, IntercomSpace } from './definitions';

export class IntercomWeb extends WebPlugin implements IntercomPlugin {
  private state: State = {
    booted: false,
    config: { app_id: '' },
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

    IntercomModule(config);
    await this.initialize();
  }

  async loadWithKeys(_options: LoadWithKeysOption): Promise<void> {
    throw this.unimplemented('Not implemented on web.');
  }

  async initialize(): Promise<void> {
    this.state.initialized = true;

    onHide(() => {
      this.notifyListeners('messengerDidHide', {});
      this.setIsVisible(false);
    });
    onShow(() => {
      this.notifyListeners('messengerDidShow', {});
      this.setIsVisible(true);
    });
    onUserEmailSupplied(() => {
      this.notifyListeners('userEmailSupplied', {});
    });

    boot(this.state.config);
    this.state.booted = true;
  }

  async loginIdentifiedUser(_options: { userId?: string; email?: string }): Promise<void> {
    throw this.unimplemented('Not implemented on web.');
  }

  async loginUnidentifiedUser(): Promise<void> {
    throw this.unimplemented('Not implemented on web.');
  }

  async presentContent(options: { contentType: IntercomContent; contentId: string }): Promise<void> {
    const { contentType, contentId } = options;
    const parsedId = contentId;

    if (!contentId) {
      throw this.unavailable('Content ID not defined.');
    }

    const actions: Partial<Record<IntercomContent, (id: string) => void>> = {
      [IntercomContent.Article]: showArticle,
      [IntercomContent.Checklist]: startChecklist,
      [IntercomContent.Conversation]: showConversation,
      [IntercomContent.News]: showNews,
      [IntercomContent.Survey]: startSurvey,
      [IntercomContent.Ticket]: showTicket,
      [IntercomContent.Tour]: startTour,
    };

    const action = actions[contentType];
    if (!action) throw this.unimplemented(`${contentType} not implemented on web.`);

    action(parsedId);
  }

  async present(options: { space: IntercomSpace }): Promise<void> {
    const { space } = options;

    const actions: Record<IntercomSpace, () => void> = {
      [IntercomSpace.HelpCenter]: () => showSpace(IntercomSpace.HelpCenter),
      [IntercomSpace.Home]: () => showSpace(IntercomSpace.Home),
      [IntercomSpace.Messages]: () => showSpace(IntercomSpace.Messages),
      [IntercomSpace.News]: () => showSpace(IntercomSpace.News),
      [IntercomSpace.Tasks]: () => showSpace(IntercomSpace.Tasks),
      [IntercomSpace.Tickets]: () => showSpace(IntercomSpace.Tickets),
    };

    const action = actions[space];
    if (!action) throw this.unimplemented(`${space} not implemented on web.`);

    action();
  }

  async registerIdentifiedUser(_options: { userId?: string; email?: string }): Promise<void> {
    throw this.unimplemented('Not implemented on web.');
  }

  async registerUnidentifiedUser(): Promise<void> {
    throw this.unimplemented('Not implemented on web.');
  }

  async updateUser(options: IntercomUserUpdateOptions): Promise<void> {
    const company = this.constructCompany(options.company);
    const companies = options.companies?.map(this.constructCompany).filter((company) => !!company) as IntercomCompany[];

    const configEntries = Object.entries({
      user_id: options.userId,
      language_override: options.languageOverride,
      phone: options.phone,
      name: options.name,
      company,
      companies,
      ...(options.customAttributes || {}),
    }).filter(([_, value]) => value !== undefined);

    const webConfig: Partial<IntercomWebConfig> = Object.fromEntries(configEntries);
    this.updateConfig(webConfig);
  }

  async logout(): Promise<void> {
    shutdown();
    this.resetState();
  }

  async logEvent(options: { name: string; data?: any }): Promise<void> {
    const { name, data } = options;
    if (!name) {
      throw this.unavailable('Event name not found.');
    }

    if (data) {
      trackEvent(name, data);
    } else {
      trackEvent(name);
    }
  }

  async displayMessenger(): Promise<void> {
    showMessages();
  }

  async hideMessenger(): Promise<void> {
    hide();
  }

  async displayMessageComposer(options: { message: string }): Promise<void> {
    const { message } = options;
    showNewMessage(message);
  }

  async displayHelpCenter(): Promise<void> {
    showSpace(IntercomSpace.HelpCenter);
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

  async receivePush(_notification: IntercomPushNotificationData): Promise<void> {
    throw this.unimplemented('Not implemented on web.');
  }

  async sendPushTokenToIntercom(_options: { value: string }): Promise<void> {
    throw this.unimplemented('Not implemented on web.');
  }

  async displayArticle(options: { articleId: string }): Promise<void> {
    const { articleId } = options;
    if (!articleId) {
      throw this.unavailable('Invalid article id');
    }

    showArticle(articleId);
  }

  async setupUnreadConversationListener(): Promise<void> {
    if (this.state.unreadListenerAttached) return;

    onUnreadCountChange((count: number) => this.onUnreadCountChangeHandler(count));
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

  private constructCompany(company: IntercomUserUpdateOptions['company']): IntercomWebConfig['company'] {
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
        return Object.fromEntries(companyEntries) as IntercomWebConfig['company'];
      }
    }
  }

  /**
   * Resets the state, preserving only the configuration.
   *
   * @private
   */
  private resetState() {
    this.state.config = { app_id: '' };
    this.state.unreadCount = 0;
    this.state.unreadListenerAttached = false;
  }

  /**
   * Updates the unread message count and notifies listeners.
   *
   * @param count - The new unread message count.
   * @private
   */
  private onUnreadCountChangeHandler(count: number) {
    this.state.unreadCount = count;
    this.notifyListeners('updateUnreadCount', { unreadCount: count });
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
  private updateConfig(options: Partial<IntercomWebConfig>) {
    if (!Object.keys(options || {}).length) {
      throw this.unavailable('Update options not found or invalid.');
    }

    update(options);
    Object.assign(this.state.config, options);
  }
}

const Intercom = new IntercomWeb();

export { Intercom };
