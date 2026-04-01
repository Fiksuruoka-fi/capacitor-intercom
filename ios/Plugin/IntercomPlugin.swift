import Capacitor
import Foundation
import Intercom

/// Please read the Capacitor iOS Plugin Development Guide
/// here: https://capacitorjs.com/docs/plugins/ios
@objc(IntercomPlugin)
public class IntercomPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "IntercomPlugin"
    public let jsName = "Intercom"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "fetchLoggedInUserAttributes", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "registerIdentifiedUser", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "registerUnidentifiedUser", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "loginIdentifiedUser", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "loginUnidentifiedUser", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "updateUser", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "loadWithKeys", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "logout", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "logEvent", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "displayMessenger", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "displayMessageComposer", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "displayHelpCenter", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "hideMessenger", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "displayLauncher", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "hideLauncher", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "displayInAppMessages", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "hideInAppMessages", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "displayCarousel", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "setUserHash", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "setUserJwt", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "setBottomPadding", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "displayArticle", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "present", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "presentContent", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "setupUnreadConversationListener", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "removeUnreadConversationListener", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "getUnreadConversationCount", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "isUserLoggedIn", returnType: CAPPluginReturnPromise)
    ]

    var appId = "NO_APP_ID_PASSED"
    var apiKey = "NO_API_KEY_PASSED"

    public override func load() {
        appId = getConfig().getString("iosAppId") ?? "NO_APP_ID_PASSED"
        apiKey = getConfig().getString("iosApiKey") ?? "NO_API_KEY_PASSED"

        _ = try? setupIntercom()
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

    @objc func loginIdentifiedUser(_ call: CAPPluginCall) {
        let userId = call.getString("userId")
        let email = call.getString("email")
        let attributes = ICMUserAttributes()

        if email == nil && userId == nil {
            call.reject("Email or userId is required")
            return
        }

        attributes.email = email
        attributes.userId = userId

        DispatchQueue.main.async {
            Intercom.loginUser(with: attributes) { result in
                switch result {
                case .success: call.resolve()
                case .failure(let error):
                    call.reject("Error logging in: \(error.localizedDescription)")
                }
            }
        }
    }

    @objc func loginUnidentifiedUser(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            Intercom.loginUnidentifiedUser { result in
                switch result {
                case .success: call.resolve()
                case .failure(let error):
                    call.reject("Error logging in unidentified user: \(error.localizedDescription)")
                }
            }
        }
    }

    @objc func updateUser(_ call: CAPPluginCall) {
        let userAttributes = ICMUserAttributes()
        userAttributes.userId = call.getString("userId")
        userAttributes.email = call.getString("email")
        userAttributes.name = call.getString("name")
        userAttributes.phone = call.getString("phone")
        userAttributes.languageOverride = call.getString("languageOverride")
        userAttributes.customAttributes = call.getObject("customAttributes")

        if let company = constructCompany(call.getObject("company")) {
            userAttributes.companies = [company]
        } else if let companies = call.getArray("companies") as? [JSObject], !companies.isEmpty {
            userAttributes.companies = companies.compactMap { company in
                constructCompany(company)
            }
        }

        DispatchQueue.main.async {
            Intercom.updateUser(with: userAttributes) { result in
                switch result {
                case .success: call.resolve()
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

    @objc func setUserHash(_ call: CAPPluginCall) {
        guard let hmac = call.getString("hmac") else {
            call.reject("hmac is missing or empty. Read intercom docs and generate it.")
            return
        }

        Intercom.setUserHash(hmac)
        call.resolve()
    }

    @objc func setUserJwt(_ call: CAPPluginCall) {
        guard let jwt = call.getString("jwt"), !jwt.isEmpty else {
            call.reject("jwt is required")
            return
        }
        Intercom.setUserJwt(jwt)
        call.resolve()
    }

    @objc func isUserLoggedIn(_ call: CAPPluginCall) {
        call.resolve(["isLoggedIn": Intercom.isUserLoggedIn()])
    }

    @objc func fetchLoggedInUserAttributes(_ call: CAPPluginCall) {
        Intercom.fetchLoggedInUserAttributes { result in
            switch result {
            case .success(let attributes):
                var data: [String: Any] = [:]
                if let userId = attributes.userId { data["userId"] = userId }
                if let email = attributes.email { data["email"] = email }
                if let name = attributes.name { data["name"] = name }
                if let phone = attributes.phone { data["phone"] = phone }
                if let lang = attributes.languageOverride { data["languageOverride"] = lang }
                if let custom = attributes.customAttributes { data["customAttributes"] = custom }
                call.resolve(data)
            case .failure(let error):
                call.reject("Error fetching user attributes: \(error.localizedDescription)")
            }
        }
    }
}
