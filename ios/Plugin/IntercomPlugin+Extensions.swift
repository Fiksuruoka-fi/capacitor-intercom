import Capacitor
import Foundation
import Intercom

// MARK: - Messenger Display & Content Presentation

extension IntercomPlugin {
    @objc func present(_ call: CAPPluginCall) {
        let spaceMapping: [String: Space] = [
            "help": .helpCenter,
            "messages": .messages,
            "home": .home,
            "tickets": .tickets
        ]
        let spaceString = call.getString("space", "")
        let space = spaceMapping[spaceString] ?? .home
        Intercom.present(space)
        call.resolve()
    }

    @objc func presentContent(_ call: CAPPluginCall) {
        guard let contentId = call.getString("contentId") else {
            call.reject("contentId not defined")
            return
        }

        let contentMapping: [String: Intercom.Content] = [
            "carousel": Intercom.Content.carousel(id: contentId),
            "survey": Intercom.Content.survey(id: contentId),
            "article": Intercom.Content.article(id: contentId),
            "conversation": Intercom.Content.conversation(id: contentId)
        ]
        let contentTypeString = call.getString("contentType", "")
        guard let contentType = contentMapping[contentTypeString] else {
            call.reject("contentType not found")
            return
        }

        Intercom.presentContent(contentType)
        call.resolve()
    }

    @objc func displayMessageComposer(_ call: CAPPluginCall) {
        guard let initialMessage = call.getString("message") else {
            call.reject("Enter an initial message")
            return
        }
        Intercom.presentMessageComposer(initialMessage)
        call.resolve()
    }

    @objc func hideMessenger(_ call: CAPPluginCall) {
        Intercom.hide()
        call.resolve()
    }

    @objc func displayLauncher(_ call: CAPPluginCall) {
        Intercom.setLauncherVisible(true)
        call.resolve()
    }

    @objc func hideLauncher(_ call: CAPPluginCall) {
        Intercom.setLauncherVisible(false)
        call.resolve()
    }

    @objc func displayInAppMessages(_ call: CAPPluginCall) {
        Intercom.setInAppMessagesVisible(true)
        call.resolve()
    }

    @objc func hideInAppMessages(_ call: CAPPluginCall) {
        Intercom.setInAppMessagesVisible(false)
        call.resolve()
    }

    @objc func setBottomPadding(_ call: CAPPluginCall) {
        if let value = call.getString("value"),
            let number = NumberFormatter().number(from: value) {
            Intercom.setBottomPadding(CGFloat(truncating: number))
            call.resolve()
        } else {
            call.reject("enter a value for padding bottom")
        }
    }

    @objc func getUnreadConversationCount(_ call: CAPPluginCall) {
        let unreadCount = Intercom.unreadConversationCount()
        call.resolve(["unreadCount": unreadCount])
    }

    @objc func setupUnreadConversationListener(_ call: CAPPluginCall) {
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(self.handleUpdateUnreadCountListener(notification:)),
            name: NSNotification.Name.IntercomUnreadConversationCountDidChange,
            object: nil
        )
        call.resolve()
    }

    @objc func handleUpdateUnreadCountListener(notification: NSNotification) {
        let unreadCount = Intercom.unreadConversationCount()
        notifyListeners("updateUnreadCount", data: ["unreadCount": unreadCount])
    }
}

// MARK: - Deprecated Methods

extension IntercomPlugin {
    @available(
        *, deprecated, message: "This method is deprecated, use loginIdentifiedUser() instead."
    )
    @objc func registerIdentifiedUser(_ call: CAPPluginCall) {
        loginIdentifiedUser(call)
    }

    @available(
        *, deprecated, message: "This method is deprecated, use loginUnidentifiedUser() instead."
    )
    @objc func registerUnidentifiedUser(_ call: CAPPluginCall) {
        loginUnidentifiedUser(call)
    }

    @available(*, deprecated, message: "This method is deprecated, use present() instead.")
    @objc func displayMessenger(_ call: CAPPluginCall) {
        Intercom.present()
        call.resolve()
    }

    @available(*, deprecated, message: "This method is deprecated, use present() instead.")
    @objc func displayHelpCenter(_ call: CAPPluginCall) {
        Intercom.present(Space.helpCenter)
        call.resolve()
    }

    @available(*, deprecated, message: "This method is deprecated, use presentContent() instead.")
    @objc func displayCarousel(_ call: CAPPluginCall) {
        if let carouselId = call.getString("carouselId") {
            Intercom.presentContent(Intercom.Content.carousel(id: carouselId))
            call.resolve()
        } else {
            call.reject("carouselId not provided.")
        }
    }

    @available(*, deprecated, message: "This method is deprecated, use presentContent() instead.")
    @objc func displayArticle(_ call: CAPPluginCall) {
        if let articleId = call.getString("articleId") {
            Intercom.presentContent(Intercom.Content.article(id: articleId))
            call.resolve()
        } else {
            call.reject("articleId not provided.")
        }
    }
}

// MARK: - Private Helpers & Notification Handlers

extension IntercomPlugin {
    private func constructCompany(_ companyData: JSObject?) -> ICMCompany? {
        guard let company = companyData else { return nil }

        let companyAttributes = ICMCompany()
        companyAttributes.companyId = company["companyId"] as? String ?? ""

        if let name = company["name"] as? String {
            companyAttributes.name = name
        }

        if let createdAt = company["createdAt"] as? TimeInterval, createdAt != 0 {
            companyAttributes.createdAt = Date(timeIntervalSince1970: createdAt)
        }

        if let monthlySpend = company["monthlySpend"] as? NSNumber {
            companyAttributes.monthlySpend = monthlySpend
        }

        if let plan = company["plan"] as? String {
            companyAttributes.plan = plan
        }

        if let customAttributes = company["customAttributes"] as? [String: Any] {
            companyAttributes.customAttributes = customAttributes
        }

        return companyAttributes
    }

    func setupIntercom() throws {
        guard appId != "NO_APP_ID_PASSED" else {
            throw NSError(
                domain: "Intercom", code: 0,
                userInfo: [NSLocalizedDescriptionKey: "App ID missing"])
        }

        guard apiKey != "NO_API_KEY_PASSED" else {
            throw NSError(
                domain: "Intercom", code: 0,
                userInfo: [NSLocalizedDescriptionKey: "API Key missing"])
        }

        Intercom.setApiKey(apiKey, forAppId: appId)

        #if DEBUG
            Intercom.enableLogging()
        #endif

        registerNotificationObservers()
    }

    private func registerNotificationObservers() {
        let center = NotificationCenter.default

        center.addObserver(
            self,
            selector: #selector(self.didRegisterWithToken(notification:)),
            name: Notification.Name.capacitorDidRegisterForRemoteNotifications,
            object: nil
        )

        center.addObserver(
            self,
            selector: #selector(self.handleMessengerWillShowListener(_:)),
            name: NSNotification.Name.IntercomWindowWillShow,
            object: nil
        )

        center.addObserver(
            self,
            selector: #selector(self.handleMessengerDidShow(_:)),
            name: NSNotification.Name.IntercomWindowDidShow,
            object: nil
        )

        center.addObserver(
            self,
            selector: #selector(self.handleMessengerWillHideListener(_:)),
            name: NSNotification.Name.IntercomWindowWillHide,
            object: nil
        )

        center.addObserver(
            self,
            selector: #selector(self.handleMessengerDidHideListener(_:)),
            name: NSNotification.Name.IntercomWindowDidHide,
            object: nil
        )

        center.addObserver(
            self,
            selector: #selector(self.handleNewConversationStartedListener(_:)),
            name: NSNotification.Name.IntercomDidStartNewConversation,
            object: nil
        )

        center.addObserver(
            self,
            selector: #selector(self.unreadTicketCountChanged(_:)),
            name: NSNotification.Name.IntercomUnreadTicketCountDidChange,
            object: nil
        )
    }

    @objc func handleMessengerWillShowListener(_ notification: Notification) {
        self.notifyListeners("messengerWillShow", data: [:])
    }

    @objc func handleMessengerDidShow(_ notification: Notification) {
        self.notifyListeners("messengerDidShow", data: [:])
    }

    @objc func handleMessengerWillHideListener(_ notification: Notification) {
        self.notifyListeners("messengerWillHide", data: [:])
    }

    @objc func handleMessengerDidHideListener(_ notification: Notification) {
        self.notifyListeners("messengerDidHide", data: [:])
    }

    @objc func handleNewConversationStartedListener(_ notification: Notification) {
        self.notifyListeners("newConversationStarted", data: [:])
    }

    @objc func unreadTicketCountChanged(_ notification: Notification) {
        self.notifyListeners("unreadTicketCountChange", data: [:])
    }
}
