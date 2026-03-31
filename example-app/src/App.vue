<template>
  <div class="min-h-screen bg-gray-950 text-gray-100 font-sans max-w-full overflow-x-hidden"
    style="padding-left: env(safe-area-inset-left); padding-right: env(safe-area-inset-right); padding-bottom: env(safe-area-inset-bottom);">
    <!-- Header -->
    <header class="border-b border-gray-800 px-6 py-4 flex items-center justify-between"
      style="padding-top: env(safe-area-inset-top);">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white font-bold text-sm">I
        </div>
        <div>
          <h1 class="text-sm font-semibold text-white">@foodello/intercom</h1>
          <p class="text-xs text-gray-500">Plugin test harness</p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-xs px-2 py-1 rounded-full font-mono"
          :class="platform === 'web' ? 'bg-blue-900 text-blue-300' : platform === 'ios' ? 'bg-gray-800 text-gray-300' : 'bg-green-900 text-green-300'">
          {{ platform }}
        </span>
        <span class="w-2 h-2 rounded-full" :class="sdkReady ? 'bg-green-400' : 'bg-gray-600'"></span>
        <span class="text-xs text-gray-500">{{ sdkReady ? 'SDK ready' : 'not loaded' }}</span>
      </div>
    </header>

    <div class="lg:grid lg:grid-cols-[1fr_340px] lg:gap-6 lg:max-w-5xl lg:mx-auto lg:px-6 lg:py-6">

    <!-- Left column: controls -->
    <div class="max-w-2xl mx-auto px-4 py-6 space-y-6 lg:max-w-none lg:mx-0 lg:px-0">

      <!-- Config -->
      <AppSection title="Configuration" icon="⚙️">
        <div class="space-y-3">
          <div class="grid grid-cols-2 gap-3">
            <AppField label="App ID" v-model="config.appId" placeholder="your_app_id" />
            <AppSelect label="API Base (web)" v-model="config.apiBase" :options="apiBaseOptions" />
            <AppField label="iOS API Key" v-model="config.iosApiKey" placeholder="ios_sdk-..." />
            <AppField label="Android API Key" v-model="config.androidApiKey" placeholder="android_sdk-..." />
          </div>
          <div class="flex gap-2">
            <AppButton label="load() — Web" color="indigo" :disabled="isNative"
              disabled-reason="Web only — not available on native" @click="loadWeb" />
            <AppButton label="loadWithKeys() — Native" color="indigo" :disabled="isWeb"
              disabled-reason="Native only — not available on web" @click="loadWithKeys" />
          </div>
        </div>
      </AppSection>

      <!-- Auth -->
      <AppSection title="Authentication" icon="🔐">
        <div class="space-y-3">
          <div class="grid grid-cols-2 gap-3">
            <AppField label="User ID" v-model="auth.userId" placeholder="user_123" />
            <AppField label="Email" v-model="auth.email" placeholder="user@example.com" />
            <AppField label="HMAC (identity verification)" v-model="auth.hmac" placeholder="sha256 hmac..." />
            <AppField label="JWT" v-model="auth.jwt" placeholder="eyJ..." />
          </div>
          <div class="flex flex-wrap gap-2">
            <AppButton label="setUserHash()" color="yellow" @click="setUserHash" />
            <AppButton label="setUserJwt()" color="yellow" @click="setUserJwt" />
            <AppButton label="loginIdentifiedUser()" color="green" @click="loginIdentifiedUser" />
            <AppButton label="loginUnidentifiedUser()" color="green" @click="loginUnidentifiedUser" />
            <AppButton label="logout()" color="red" @click="logout" />
          </div>
          <div class="flex flex-wrap gap-2">
            <AppButton label="isUserLoggedIn()" color="blue" @click="isUserLoggedIn" />
            <AppButton label="fetchLoggedInUserAttributes()" color="blue" @click="fetchLoggedInUserAttributes" />
          </div>
        </div>
      </AppSection>

      <!-- User -->
      <AppSection title="User Attributes" icon="👤">
        <div class="space-y-3">
          <div class="grid grid-cols-2 gap-3">
            <AppField label="Name" v-model="user.name" placeholder="Jane Doe" />
            <AppField label="Phone" v-model="user.phone" placeholder="+1 555 000 0000" />
            <AppField label="Language" v-model="user.language" placeholder="en" />
            <AppField label="Custom attr key" v-model="user.customKey" placeholder="plan" />
            <AppField label="Custom attr value" v-model="user.customValue" placeholder="pro" />
          </div>
          <AppButton label="updateUser()" color="indigo" @click="updateUser" />
        </div>
      </AppSection>

      <!-- Messenger -->
      <AppSection title="Messenger" icon="💬">
        <div class="space-y-3">
          <div class="grid grid-cols-2 gap-3">
            <AppSelect label="Space" v-model="messengerSpace" :options="spaceOptions" />
            <div class="flex items-end">
              <AppButton label="present(space)" color="indigo" @click="presentSpace" />
            </div>
          </div>
          <div class="flex flex-wrap gap-2">
            <AppButton label="hideMessenger()" color="red" @click="hideMessenger" />
          </div>
          <div class="flex gap-3 items-end">
            <AppField label="Initial message" v-model="composerMessage" placeholder="Hi, I need help with..."
              class="flex-1" />
            <AppButton label="Open composer" color="indigo" @click="displayMessageComposer" />
          </div>
        </div>
      </AppSection>

      <!-- Content -->
      <AppSection title="Content" icon="📄">
        <div class="grid grid-cols-2 gap-3 mb-3">
          <AppField label="Content ID" v-model="content.id" placeholder="12345" />
          <AppSelect label="Content type" v-model="content.type" :options="contentTypeOptions" />
        </div>
        <AppButton label="presentContent()" color="indigo" @click="presentContent" />
      </AppSection>

      <!-- Launcher & In-App -->
      <AppSection title="Launcher & In-App" icon="🚀">
        <div class="flex flex-wrap gap-2">
          <AppButton label="displayLauncher()" color="green" @click="displayLauncher" />
          <AppButton label="hideLauncher()" color="red" @click="hideLauncher" />
          <AppButton label="displayInAppMessages()" color="green" :disabled="isWeb"
            disabled-reason="Native only — not available on web" @click="displayInAppMessages" />
          <AppButton label="hideInAppMessages()" color="red" :disabled="isWeb"
            disabled-reason="Native only — not available on web" @click="hideInAppMessages" />
        </div>
        <div class="mt-3 flex gap-3 items-end">
          <AppField label="Bottom padding (px)" v-model="bottomPadding" placeholder="80" class="w-40" />
          <AppButton label="setBottomPadding()" color="gray" :disabled="isWeb"
            disabled-reason="Native only — on web set vertical_padding in load() config instead"
            @click="setBottomPadding" />
        </div>
      </AppSection>

      <!-- Events & Push -->
      <AppSection title="Events & Push" icon="📡">
        <div class="space-y-3">
          <div class="grid grid-cols-2 gap-3">
            <AppField label="Event name" v-model="event.name" placeholder="button_tapped" />
            <AppField label="Event data (JSON)" v-model="event.data" placeholder='{"screen":"home"}' />
            <AppField label="Push token" v-model="pushToken" placeholder="device-push-token" class="col-span-2" />
          </div>
          <div class="flex flex-wrap gap-2">
            <AppButton label="logEvent()" color="indigo" @click="logEvent" />
            <AppButton label="sendPushTokenToIntercom()" color="indigo" :disabled="isWeb"
              disabled-reason="Native only — not available on web" @click="sendPushToken" />
          </div>
        </div>
      </AppSection>

      <!-- Unread count -->
      <AppSection title="Unread Count" icon="🔔">
        <div class="flex flex-wrap gap-2 items-center">
          <AppButton label="setupUnreadConversationListener()" color="green" @click="setupUnreadListener" />
          <AppButton label="removeUnreadConversationListener()" color="red" @click="removeUnreadListener" />
          <AppButton label="getUnreadConversationCount()" color="blue" @click="getUnreadCount" />
          <div v-if="unreadCount !== null" class="ml-auto flex items-center gap-2">
            <span class="text-xs text-gray-400">Unread:</span>
            <span class="bg-indigo-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{{ unreadCount }}</span>
          </div>
        </div>
      </AppSection>

      <!-- Dev Tools -->
      <AppSection title="Dev Tools — Local Token Generator" icon="🔧">
        <div class="bg-amber-950 border border-amber-700 rounded-lg px-3 py-2 mb-4 flex items-start gap-2">
          <span class="text-amber-400 text-base leading-none mt-0.5">⚠️</span>
          <p class="text-xs text-amber-300">
            <strong>Development only.</strong> Never expose secret keys in client-side code in production.
            This tool runs entirely in your browser for local testing convenience.
          </p>
        </div>

        <div class="space-y-4">
          <!-- Shared secret key -->
          <AppField label="Secret key (Identity Verification / Messenger Security)" v-model="devTools.secretKey"
            placeholder="Your Intercom secret key" />

          <!-- HMAC generator -->
          <div class="bg-gray-800/50 rounded-lg p-3 space-y-3">
            <h3 class="text-xs font-semibold text-gray-300">HMAC-SHA256 (Identity Verification)</h3>
            <AppField label="Data (user_id or email)" v-model="devTools.hmacData"
              placeholder="Auto-fills from Auth fields above" />
            <div class="flex gap-2">
              <AppButton label="Generate HMAC" color="yellow" @click="generateHmac" />
              <AppButton label="Apply to HMAC field ↑" color="gray" :disabled="!devTools.hmacResult"
                @click="auth.hmac = devTools.hmacResult" />
            </div>
            <div v-if="devTools.hmacResult"
              class="bg-gray-900 rounded px-3 py-2 font-mono text-xs text-green-400 break-all select-all">
              {{ devTools.hmacResult }}
            </div>
          </div>

          <!-- JWT generator -->
          <div class="bg-gray-800/50 rounded-lg p-3 space-y-3">
            <h3 class="text-xs font-semibold text-gray-300">JWT — HS256 (Messenger Security)</h3>
            <div class="grid grid-cols-2 gap-3">
              <AppField label="user_id (required)" v-model="devTools.jwtUserId"
                placeholder="Auto-fills from Auth fields" />
              <AppField label="email (optional)" v-model="devTools.jwtEmail" placeholder="user@example.com" />
              <AppField label="Expires in (minutes)" v-model="devTools.jwtExpiryMinutes" placeholder="60" />
              <AppField label="Extra claims (JSON)" v-model="devTools.jwtExtra" placeholder='{"company_id":"abc"}' />
            </div>
            <div class="flex gap-2">
              <AppButton label="Generate JWT" color="yellow" @click="generateJwt" />
              <AppButton label="Apply to JWT field ↑" color="gray" :disabled="!devTools.jwtResult"
                @click="auth.jwt = devTools.jwtResult" />
            </div>
            <div v-if="devTools.jwtResult"
              class="bg-gray-900 rounded px-3 py-2 font-mono text-xs text-green-400 break-all select-all">
              {{ devTools.jwtResult }}
            </div>
            <div v-if="devTools.jwtDecoded" class="bg-gray-900 rounded px-3 py-2 text-xs text-gray-400 space-y-1">
              <div><span class="text-gray-500">Header:</span> {{ devTools.jwtDecoded.header }}</div>
              <div><span class="text-gray-500">Payload:</span> {{ devTools.jwtDecoded.payload }}</div>
            </div>
          </div>
        </div>
      </AppSection>

    </div>

    <!-- Right column: log (sticky on desktop, below controls on mobile) -->
    <div class="px-4 pb-6 lg:px-0 lg:py-6">
      <div class="lg:sticky lg:top-4">
        <AppSection title="Log" icon="📋">
          <div class="bg-gray-900 rounded-lg p-3 h-48 lg:h-[calc(100vh-10rem)] overflow-y-auto font-mono text-xs space-y-1">
            <div v-if="logs.length === 0" class="text-gray-600">No output yet. Tap a button to test.</div>
            <div v-for="(entry, i) in logs" :key="i" class="flex gap-2">
              <span class="text-gray-600 shrink-0">{{ entry.time }}</span>
              <span
                :class="entry.type === 'error' ? 'text-red-400' : entry.type === 'success' ? 'text-green-400' : 'text-gray-300'">{{
                  entry.msg }}</span>
            </div>
          </div>
          <div class="mt-2 flex justify-end">
            <button @click="logs = []" class="text-xs text-gray-600 hover:text-gray-400">Clear</button>
          </div>
        </AppSection>
      </div>
    </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'
import { Capacitor } from '@capacitor/core'
import { Intercom } from '@foodello/intercom'

// ─── platform ────────────────────────────────────────────────────────────────
const platform = ref(Capacitor.getPlatform())
const isWeb = computed(() => platform.value === 'web')
const isNative = computed(() => !isWeb.value)

// ─── state ───────────────────────────────────────────────────────────────────
const sdkReady = ref(false)
const logs = ref([])
const unreadCount = ref(null)
let unreadListener = null

const config = ref({
  appId: '',
  iosApiKey: '',
  androidApiKey: '',
  apiBase: 'https://api-iam.intercom.io',
})

const auth = ref({ userId: '', email: '', hmac: '', jwt: '' })
const user = ref({ name: '', phone: '', language: '', customKey: '', customValue: '' })
const content = ref({ id: '', type: 'article' })
const event = ref({ name: '', data: '' })
const composerMessage = ref('')
const bottomPadding = ref('80')
const pushToken = ref('')
const messengerSpace = ref('home')

// ─── dev tools ────────────────────────────────────────────────────────────────
const devTools = ref({
  secretKey: '',
  hmacData: '',
  hmacResult: '',
  jwtUserId: '',
  jwtEmail: '',
  jwtExpiryMinutes: '60',
  jwtExtra: '',
  jwtResult: '',
  jwtDecoded: null,
})

// ─── enum options ─────────────────────────────────────────────────────────────
const apiBaseOptions = [
  { value: 'https://api-iam.intercom.io', label: 'US  — api-iam.intercom.io' },
  { value: 'https://api-iam.eu.intercom.io', label: 'EU  — api-iam.eu.intercom.io' },
  { value: 'https://api-iam.au.intercom.io', label: 'AU  — api-iam.au.intercom.io' },
]

const spaceOptions = computed(() => [
  { value: 'home', label: 'Home' },
  { value: 'messages', label: 'Messages' },
  { value: 'help', label: 'Help Center' },
  { value: 'tickets', label: 'Tickets' },
  { value: 'news', label: 'News (web only)' },
  { value: 'tasks', label: 'Tasks (web only)' },
])

const contentTypeOptions = computed(() => [
  { value: 'article', label: 'Article' },
  { value: 'survey', label: 'Survey' },
  { value: 'conversation', label: 'Conversation' },
  { value: 'ticket', label: 'Ticket' },
  { value: 'carousel', label: 'Carousel (native only)' },
  { value: 'checklist', label: 'Checklist (web only)' },
  { value: 'news', label: 'News (web only)' },
  { value: 'tour', label: 'Tour (web only)' },
])

// ─── logging ─────────────────────────────────────────────────────────────────
function log(msg, type = 'info') {
  const now = new Date()
  const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`
  logs.value.unshift({ time, msg, type })
}

async function run(label, fn) {
  try {
    const result = await fn()
    log(`✓ ${label}${result !== undefined ? ' → ' + JSON.stringify(result) : ''}`, 'success')
    return result
  } catch (e) {
    log(`✗ ${label}: ${e?.message ?? e}`, 'error')
  }
}

// ─── config ───────────────────────────────────────────────────────────────────
async function loadWeb() {
  await run('load()', () => Intercom.load({
    app_id: config.value.appId || 'demo',
    api_base: config.value.apiBase,
  }))
  sdkReady.value = true
}

async function loadWithKeys() {
  await run('loadWithKeys()', () => Intercom.loadWithKeys({
    appId: config.value.appId,
    iosApiKey: config.value.iosApiKey || undefined,
    androidApiKey: config.value.androidApiKey || undefined,
  }))
  sdkReady.value = true
}

// ─── auth ─────────────────────────────────────────────────────────────────────
async function setUserHash() {
  if (!auth.value.hmac) return log('Enter an HMAC value first', 'error')
  await run('setUserHash()', () => Intercom.setUserHash({ hmac: auth.value.hmac }))
}

async function setUserJwt() {
  if (!auth.value.jwt) return log('Enter a JWT value first', 'error')
  await run('setUserJwt()', () => Intercom.setUserJwt({ jwt: auth.value.jwt }))
}

async function loginIdentifiedUser() {
  if (!auth.value.userId && !auth.value.email) return log('Enter userId or email', 'error')
  await run('loginIdentifiedUser()', () => Intercom.loginIdentifiedUser({
    userId: auth.value.userId || undefined,
    email: auth.value.email || undefined,
  }))
}

async function loginUnidentifiedUser() {
  await run('loginUnidentifiedUser()', () => Intercom.loginUnidentifiedUser())
}

async function logout() {
  await run('logout()', () => Intercom.logout())
}

async function isUserLoggedIn() {
  await run('isUserLoggedIn()', () => Intercom.isUserLoggedIn())
}

async function fetchLoggedInUserAttributes() {
  await run('fetchLoggedInUserAttributes()', () => Intercom.fetchLoggedInUserAttributes())
}

// ─── user ─────────────────────────────────────────────────────────────────────
async function updateUser() {
  const options = {}
  if (user.value.name) options.name = user.value.name
  if (user.value.phone) options.phone = user.value.phone
  if (user.value.language) options.languageOverride = user.value.language
  if (user.value.customKey && user.value.customValue) {
    options.customAttributes = { [user.value.customKey]: user.value.customValue }
  }
  await run('updateUser()', () => Intercom.updateUser(options))
}

// ─── messenger ────────────────────────────────────────────────────────────────
async function presentSpace() {
  await run(`present(${messengerSpace.value})`, () => Intercom.present({ space: messengerSpace.value }))
}

async function hideMessenger() {
  await run('hideMessenger()', () => Intercom.hideMessenger())
}

async function displayMessageComposer() {
  if (!composerMessage.value) return log('Enter an initial message first', 'error')
  await run('displayMessageComposer()', () => Intercom.displayMessageComposer({ message: composerMessage.value }))
}

// ─── content ──────────────────────────────────────────────────────────────────
async function presentContent() {
  if (!content.value.id) return log('Enter a content ID', 'error')
  await run(`presentContent(${content.value.type}, ${content.value.id})`, () =>
    Intercom.presentContent({ contentType: content.value.type, contentId: content.value.id })
  )
}

// ─── launcher / in-app ────────────────────────────────────────────────────────
async function displayLauncher() { await run('displayLauncher()', () => Intercom.displayLauncher()) }
async function hideLauncher() { await run('hideLauncher()', () => Intercom.hideLauncher()) }
async function displayInAppMessages() { await run('displayInAppMessages()', () => Intercom.displayInAppMessages()) }
async function hideInAppMessages() { await run('hideInAppMessages()', () => Intercom.hideInAppMessages()) }
async function setBottomPadding() {
  await run('setBottomPadding()', () => Intercom.setBottomPadding({ value: bottomPadding.value }))
}

// ─── events ───────────────────────────────────────────────────────────────────
async function logEvent() {
  if (!event.value.name) return log('Enter an event name', 'error')
  let data
  if (event.value.data) {
    try { data = JSON.parse(event.value.data) }
    catch { return log('Event data must be valid JSON', 'error') }
  }
  await run(`logEvent(${event.value.name})`, () => Intercom.logEvent({ name: event.value.name, data }))
}

async function sendPushToken() {
  if (!pushToken.value) return log('Enter a push token', 'error')
  await run('sendPushTokenToIntercom()', () => Intercom.sendPushTokenToIntercom({ value: pushToken.value }))
}

// ─── unread count ─────────────────────────────────────────────────────────────
async function setupUnreadListener() {
  await run('setupUnreadConversationListener()', () => Intercom.setupUnreadConversationListener())
  if (unreadListener) { unreadListener.remove() }
  unreadListener = await Intercom.addListener('updateUnreadCount', (data) => {
    unreadCount.value = data.unreadCount
    log(`updateUnreadCount event → ${data.unreadCount}`)
  })
  log('Unread count listener active', 'success')
}

async function removeUnreadListener() {
  await run('removeUnreadConversationListener()', () => Intercom.removeUnreadConversationListener())
  if (unreadListener) { unreadListener.remove(); unreadListener = null }
}

async function getUnreadCount() {
  const result = await run('getUnreadConversationCount()', () => Intercom.getUnreadConversationCount())
  if (result) unreadCount.value = result.unreadCount
}

// ─── dev tools: crypto helpers ────────────────────────────────────────────────
import { hmacSha256, generateJwtToken } from './crypto.js'

async function generateHmac() {
  const secret = devTools.value.secretKey
  const data = devTools.value.hmacData || auth.value.userId || auth.value.email
  if (!secret) return log('Enter a secret key in Dev Tools', 'error')
  if (!data) return log('Enter data to hash (or fill User ID / Email in Auth section)', 'error')
  // Auto-fill the data field if it was empty
  if (!devTools.value.hmacData) devTools.value.hmacData = data
  try {
    const { hex } = await hmacSha256(secret, data)
    devTools.value.hmacResult = hex
    log(`✓ HMAC generated for "${data.substring(0, 20)}${data.length > 20 ? '…' : ''}"`, 'success')
  } catch (e) {
    log(`✗ HMAC generation failed: ${e.message}`, 'error')
  }
}

async function generateJwt() {
  const secret = devTools.value.secretKey
  const userId = devTools.value.jwtUserId || auth.value.userId || auth.value.email
  if (!secret) return log('Enter a secret key in Dev Tools', 'error')
  if (!userId) return log('Enter a user_id (or fill User ID / Email in Auth section)', 'error')
  // Auto-fill if it was empty
  if (!devTools.value.jwtUserId) devTools.value.jwtUserId = userId

  try {
    let extraClaims
    if (devTools.value.jwtExtra) {
      try {
        extraClaims = JSON.parse(devTools.value.jwtExtra)
      } catch {
        return log('Extra claims must be valid JSON', 'error')
      }
    }

    const emailValue = devTools.value.jwtEmail || auth.value.email || undefined
    const minutes = parseInt(devTools.value.jwtExpiryMinutes) || 60

    const { token, header, payload } = await generateJwtToken({
      secret,
      userId,
      email: emailValue,
      expiryMinutes: minutes,
      extraClaims,
    })

    devTools.value.jwtResult = token
    devTools.value.jwtDecoded = {
      header: JSON.stringify(header),
      payload: JSON.stringify(payload, null, 1),
    }
    log(`✓ JWT generated — expires in ${minutes}min`, 'success')
  } catch (e) {
    log(`✗ JWT generation failed: ${e.message}`, 'error')
  }
}

onUnmounted(() => { if (unreadListener) unreadListener.remove() })
</script>
