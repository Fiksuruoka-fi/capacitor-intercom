import Foundation
import Capacitor
import Intercom

/**
 * Please read the Capacitor iOS Plugin Development Guide
 * here: https://capacitorjs.com/docs/plugins/ios
 */
@objc(IntercomPlugin)
public class IntercomPlugin: CAPPlugin {
    private var appId = "NO_APP_ID_PASSED"
    private var apiKey = "NO_API_KEY_PASSED"

    public override func load() {
        appId = getConfig().getString("iosAppId") ?? "NO_APP_ID_PASSED"
        apiKey = getConfig().getString("iosApiKey") ?? "NO_API_KEY_PASSED"
            
        let _ = try? setupIntercom()
    }

    @objc func loadWithKeys(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            do {
                self.appId = call.getString("appId", "NO_APP_ID_PASSED")
                self.apiKey = call.getString("iosApiKey", "NO_API_KEY_PASSED")
                try self.setupIntercom()
                call.resolve()
            } catch let error as NSError {
                call.reject(error.localizedDescription)
            }
        }
    }
    
    
    @objc func didRegisterWithToken(notification: NSNotification) {
        guard let deviceToken = notification.object as? Data else {
            return
        }
        
        DispatchQueue.main.async {
            Intercom.setDeviceToken(deviceToken)
        }
    }
    
    @objc func setupUnreadConversationListener(_ call: CAPPluginCall) {
        NotificationCenter.default.addObserver(self,
           selector: #selector(self.updateUnreadCount(notification:)),
               name: NSNotification.Name.IntercomUnreadConversationCountDidChange,
             object: nil)
        call.resolve()
    }
    
    @objc func updateUnreadCount(notification: NSNotification) {
        let unreadCount = Intercom.unreadConversationCount()
        notifyListeners("updateUnreadCount", data: ["unreadCount": unreadCount])
    }
    
    @available(*, deprecated, message: "This method is deprecated, use loginIdentifiedUser() instead.")
    @objc func registerIdentifiedUser(_ call: CAPPluginCall) {
        let userId = call.getString("userId")
        let email = call.getString("email")
        let attributes = ICMUserAttributes()
        
        if ((email) != nil) {
            attributes.email = email
            DispatchQueue.main.async {
                Intercom.loginUser(with: attributes) { result in
                    switch result {
                    case .success: call.resolve()
                    case .failure(let error): call.reject("Error logging in: \(error.localizedDescription)")
                    }
                }
            }
        }
        
        if ((userId) != nil) {
            attributes.userId = userId
            DispatchQueue.main.async {
                Intercom.loginUser(with: attributes) { result in
                    switch result {
                    case .success: call.resolve()
                    case .failure(let error): call.reject("Error logging in: \(error.localizedDescription)")
                    }
                }
            }
        }
    }
    
    @objc func loginIdentifiedUser(_ call: CAPPluginCall) {
        let userId = call.getString("userId")
        let email = call.getString("email")
        let attributes = ICMUserAttributes()
        
        if ((email) != nil) {
            attributes.email = email
            DispatchQueue.main.async {
                Intercom.loginUser(with: attributes) { result in
                    switch result {
                    case .success: call.resolve()
                    case .failure(let error): call.reject("Error logging in: \(error.localizedDescription)")
                    }
                }
            }
        }
        
        if ((userId) != nil) {
            attributes.userId = userId
            DispatchQueue.main.async {
                Intercom.loginUser(with: attributes) { result in
                    switch result {
                    case .success: call.resolve()
                    case .failure(let error): call.reject("Error logging in: \(error.localizedDescription)")
                    }
                }
            }
        }
    }
    
    @available(*, deprecated, message: "This method is deprecated, use loginIdentifiedUser() instead.")
    @objc func registerUnidentifiedUser(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            Intercom.loginUnidentifiedUser { result in
                switch result {
                case .success: call.resolve()
                case .failure(let error): call.reject("Error loggin in unidentified user: \(error.localizedDescription)")
                }
            }
        }
    }
    
    @objc func loginUnidentifiedUser(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            Intercom.loginUnidentifiedUser { result in
                switch result {
                case .success: call.resolve()
                case .failure(let error): call.reject("Error loggin in unidentified user: \(error.localizedDescription)")
                }
            }
        }
    }
    
    @objc func updateUser(_ call: CAPPluginCall) {
        let userAttributes = ICMUserAttributes()
        let userId = call.getString("userId")
        if (userId != nil) {
            userAttributes.userId = userId
        }
        let email = call.getString("email")
        if (email != nil) {
            userAttributes.email = email
        }
        let name = call.getString("name")
        if (name != nil) {
            userAttributes.name = name
        }
        let phone = call.getString("phone")
        if (phone != nil) {
            userAttributes.phone = phone
        }
        let languageOverride = call.getString("languageOverride")
        if (languageOverride != nil) {
            userAttributes.languageOverride = languageOverride
        }
        let customAttributes = call.getObject("customAttributes")
        if (customAttributes != nil) {
            userAttributes.customAttributes = customAttributes
        }
        
        if let company = constructCompany(call.getObject("company")) {
            userAttributes.companies = [company]
        } else {
            if let companies = call.getArray("companies") as? [JSObject] {
                if (!companies.isEmpty) {
                    let companyArray = companies.compactMap { c in
                        constructCompany(c)
                    }
                    userAttributes.companies = companyArray
                }
            }
        }
        
        DispatchQueue.main.async {
            Intercom.updateUser(with: userAttributes) { result in
                switch result {
                case .success:
                    call.resolve()
                case .failure(let error):
                    call.reject("Error updating user: \(error.localizedDescription)")
                }
            }
        }
    }
    
    @objc func logout(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            Intercom.logout()
            call.resolve()
        }
    }
    
    @objc func logEvent(_ call: CAPPluginCall) {
        guard let eventName = call.getString("name") else {
            call.reject("name is missing or empty")
            return
        }
        
        DispatchQueue.main.async {
            if let metaData = call.getObject("data") {
                Intercom.logEvent(withName: eventName, metaData: metaData)
            } else {
                Intercom.logEvent(withName: eventName)
            }
            call.resolve()
        }
    }
    
    @objc func present(_ call: CAPPluginCall) {
        let spaceMapping: [String: Space] = [
            "help": .helpCenter,
            "messages": .messages,
            "home": .home
        ]
        let spaceString = call.getString("space", "")
        let space = spaceMapping[spaceString] ?? .home
        Intercom.present(space)
        call.resolve()
    }
    
    @available(*, deprecated, message: "This method is deprecated, use present() instead.")
    @objc func displayMessenger(_ call: CAPPluginCall) {
        Intercom.present()
        call.resolve()
    }
    
    @objc func displayMessageComposer(_ call: CAPPluginCall) {
        guard let initialMessage = call.getString("message") else {
            call.reject("Enter an initial message")
            return
        }
        Intercom.presentMessageComposer(initialMessage);
        call.resolve()
    }
    
    @available(*, deprecated, message: "This method is deprecated, use present() instead.")
    @objc func displayHelpCenter(_ call: CAPPluginCall) {
        Intercom.present(Space.helpCenter)
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
    
    @objc func setUserHash(_ call: CAPPluginCall) {
        guard let hmac = call.getString("hmac") else {
            call.reject("hmac is missing or empty. Read intercom docs and generate it.")
            return
        }
        
        Intercom.setUserHash(hmac)
        call.resolve()
        print("hmac sent to intercom")
    }
    
    @objc func setBottomPadding(_ call: CAPPluginCall) {
        if let value = call.getString("value"),
           let number = NumberFormatter().number(from: value) {
            Intercom.setBottomPadding(CGFloat(truncating: number))
            call.resolve()
            print("set bottom padding")
        } else {
            call.reject("enter a value for padding bottom")
        }
    }
    
    @objc func presentContent(_ call: CAPPluginCall) {
        guard let contentId = call.getString("contentId") else {
            call.reject("contentId not defined")
            return
        }

        let contentMapping: [String: Intercom.Content] = [
            "carousel": Intercom.Content.carousel(id: contentId),
            "survey": Intercom.Content.survey(id: contentId),
            "article": Intercom.Content.article(id: contentId)
        ]
        let contentTypeString = call.getString("contentType", "")
        guard let contentType = contentMapping[contentTypeString] else {
            call.reject("contentType not found")
            return
        }

        Intercom.presentContent(contentType)
        call.resolve()
    }
    
    @available(*, deprecated, message: "This method is deprecated, use presentContent() instead.")
    @objc func displayCarousel(_ call: CAPPluginCall) {
        if let carouselId = call.getString("carouselId") {
            Intercom.presentContent(Intercom.Content.carousel(id: carouselId))
            call.resolve()
        } else{
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
    
    @objc func getUnreadConversationCount(_ call: CAPPluginCall) {
        let unreadCount = Intercom.unreadConversationCount()
        call.resolve(["unreadCount": unreadCount])
    }
    
    private func constructCompany(_ companyData: JSObject?) -> ICMCompany? {
        guard let company = companyData else { return nil }
        
        let companyAttributes = ICMCompany()
        
        companyAttributes.companyId = company["companyId"] as? String ?? ""
            
        let name = company["name"] as? String ?? nil
        if (name != nil) {
            companyAttributes.name = name
        }
            
        let createdAt = company["createdAt"] as? TimeInterval ?? 0
        if (createdAt != 0) {
            companyAttributes.createdAt = Date(timeIntervalSince1970: TimeInterval(createdAt))
        }
        
        let monthlySpend = company["monthlySpend"] as? NSNumber ?? nil
        if (monthlySpend != nil) {
            companyAttributes.monthlySpend = monthlySpend
        }
        
        let plan = company["plan"] as? String ?? nil
        if (plan != nil) {
            companyAttributes.plan = plan
        }
        
        let customAttributes = company["customAttributes"] as? [String: Any] ?? nil
        if (customAttributes != nil) {
            companyAttributes.customAttributes = customAttributes
        }
        
        return companyAttributes
    }
    
    private func setupIntercom() throws {
        guard appId != "NO_APP_ID_PASSED" else {
            throw NSError(domain: "Intercom", code: 0, userInfo: [NSLocalizedDescriptionKey: "App ID missing"])
        }

        guard apiKey != "NO_API_KEY_PASSED" else {
            throw NSError(domain: "Intercom", code: 0, userInfo: [NSLocalizedDescriptionKey: "API Key missing"])
        }

        Intercom.setApiKey(apiKey, forAppId: appId)
        
        #if DEBUG
            Intercom.enableLogging()
        #endif
        
        NotificationCenter.default.addObserver(self, selector: #selector(self.didRegisterWithToken(notification:)), name: Notification.Name.capacitorDidRegisterForRemoteNotifications, object: nil)
    }
}

