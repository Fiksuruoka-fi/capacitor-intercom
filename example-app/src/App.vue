<template>
  <div class="min-h-screen bg-gray-950 text-gray-100 font-sans">
    <!-- Header -->
    <header class="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white font-bold text-sm">I</div>
        <div>
          <h1 class="text-sm font-semibold text-white">@foodello/intercom</h1>
          <p class="text-xs text-gray-500">Plugin test harness</p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-xs px-2 py-1 rounded-full font-mono" :class="platform === 'web' ? 'bg-blue-900 text-blue-300' : platform === 'ios' ? 'bg-gray-800 text-gray-300' : 'bg-green-900 text-green-300'">
          {{ platform }}
        </span>
        <span class="w-2 h-2 rounded-full" :class="sdkReady ? 'bg-green-400' : 'bg-gray-600'"></span>
        <span class="text-xs text-gray-500">{{ sdkReady ? 'SDK ready' : 'not loaded' }}</span>
      </div>
    </header>

    <div class="max-w-2xl mx-auto px-4 py-6 space-y-6">

      <!-- Config -->
      <Section title="Configuration" icon="⚙️">
        <div class="space-y-3">
          <div class="grid grid-cols-2 gap-3">
            <Field label="App ID" v-model="config.appId" placeholder="your_app_id" />
            <Select label="API Base (web)" v-model="config.apiBase" :options="apiBaseOptions" />
            <Field label="iOS API Key" v-model="config.iosApiKey" placeholder="ios_sdk-..." />
            <Field label="Android API Key" v-model="config.androidApiKey" placeholder="android_sdk-..." />
          </div>
          <div class="flex gap-2">
            <Button label="load() — Web" color="indigo" @click="loadWeb" />
            <Button
              label="loadWithKeys() — Native"
              color="indigo"
              :disabled="isWeb"
              disabled-reason="Native only — not available on web"
              @click="loadWithKeys"
            />
          </div>
        </div>
      </Section>

      <!-- Auth -->
      <Section title="Authentication" icon="🔐">
        <div class="space-y-3">
          <div class="grid grid-cols-2 gap-3">
            <Field label="User ID" v-model="auth.userId" placeholder="user_123" />
            <Field label="Email" v-model="auth.email" placeholder="user@example.com" />
            <Field label="HMAC (identity verification)" v-model="auth.hmac" placeholder="sha256 hmac..." />
            <Field label="JWT" v-model="auth.jwt" placeholder="eyJ..." />
          </div>
          <div class="flex flex-wrap gap-2">
            <Button label="setUserHash()" color="yellow" @click="setUserHash" />
            <Button
              label="setJWT() ★"
              color="yellow"
              :disabled="isWeb"
              disabled-reason="Native only — not available on web"
              @click="setJWT"
            />
            <Button
              label="loginIdentifiedUser()"
              color="green"
              :disabled="isWeb"
              disabled-reason="Native only — not available on web"
              @click="loginIdentifiedUser"
            />
            <Button
              label="loginUnidentifiedUser()"
              color="green"
              :disabled="isWeb"
              disabled-reason="Native only — not available on web"
              @click="loginUnidentifiedUser"
            />
            <Button
              label="logout()"
              color="red"
              :disabled="isWeb"
              disabled-reason="Native only — not available on web"
              @click="logout"
            />
          </div>
          <div class="flex flex-wrap gap-2">
            <Button label="isUserLoggedIn() ★" color="blue" @click="isUserLoggedIn" />
            <Button
              label="fetchLoggedInUserAttributes() ★"
              color="blue"
              :disabled="isWeb"
              disabled-reason="Native only — not available on web"
              @click="fetchLoggedInUserAttributes"
            />
          </div>
        </div>
      </Section>

      <!-- User -->
      <Section title="User Attributes" icon="👤">
        <div class="space-y-3">
          <div class="grid grid-cols-2 gap-3">
            <Field label="Name" v-model="user.name" placeholder="Jane Doe" />
            <Field label="Phone" v-model="user.phone" placeholder="+1 555 000 0000" />
            <Field label="Language" v-model="user.language" placeholder="en" />
            <Field label="Custom attr key" v-model="user.customKey" placeholder="plan" />
            <Field label="Custom attr value" v-model="user.customValue" placeholder="pro" />
          </div>
          <Button label="updateUser()" color="indigo" @click="updateUser" />
        </div>
      </Section>

      <!-- Messenger -->
      <Section title="Messenger" icon="💬">
        <div class="space-y-3">
          <div class="grid grid-cols-2 gap-3">
            <Select label="Space" v-model="messengerSpace" :options="spaceOptions" />
            <div class="flex items-end">
              <Button label="present(space)" color="indigo" @click="presentSpace" />
            </div>
          </div>
          <div class="flex flex-wrap gap-2">
            <Button label="hideMessenger()" color="red" @click="hideMessenger" />
          </div>
          <div class="flex gap-3 items-end">
            <Field label="Initial message" v-model="composerMessage" placeholder="Hi, I need help with..." class="flex-1" />
            <Button label="Open composer" color="indigo" @click="displayMessageComposer" />
          </div>
        </div>
      </Section>

      <!-- Content -->
      <Section title="Content" icon="📄">
        <div class="grid grid-cols-2 gap-3 mb-3">
          <Field label="Content ID" v-model="content.id" placeholder="12345" />
          <Select label="Content type" v-model="content.type" :options="contentTypeOptions" />
        </div>
        <Button label="presentContent()" color="indigo" @click="presentContent" />
      </Section>

      <!-- Launcher & In-App -->
      <Section title="Launcher & In-App" icon="🚀">
        <div class="flex flex-wrap gap-2">
          <Button
            label="displayLauncher()"
            color="green"
            :disabled="isWeb"
            disabled-reason="Native only — not available on web"
            @click="displayLauncher"
          />
          <Button
            label="hideLauncher()"
            color="red"
            :disabled="isWeb"
            disabled-reason="Native only — not available on web"
            @click="hideLauncher"
          />
          <Button
            label="displayInAppMessages()"
            color="green"
            :disabled="isWeb"
            disabled-reason="Native only — not available on web"
            @click="displayInAppMessages"
          />
          <Button
            label="hideInAppMessages()"
            color="red"
            :disabled="isWeb"
            disabled-reason="Native only — not available on web"
            @click="hideInAppMessages"
          />
        </div>
        <div class="mt-3 flex gap-3 items-end">
          <Field label="Bottom padding (px)" v-model="bottomPadding" placeholder="80" class="w-40" />
          <Button
            label="setBottomPadding()"
            color="gray"
            :disabled="isWeb"
            disabled-reason="Native only — not available on web"
            @click="setBottomPadding"
          />
        </div>
      </Section>

      <!-- Events & Push -->
      <Section title="Events & Push" icon="📡">
        <div class="space-y-3">
          <div class="grid grid-cols-2 gap-3">
            <Field label="Event name" v-model="event.name" placeholder="button_tapped" />
            <Field label="Event data (JSON)" v-model="event.data" placeholder='{"screen":"home"}' />
            <Field label="Push token" v-model="pushToken" placeholder="device-push-token" class="col-span-2" />
          </div>
          <div class="flex flex-wrap gap-2">
            <Button label="logEvent()" color="indigo" @click="logEvent" />
            <Button
              label="sendPushTokenToIntercom()"
              color="indigo"
              :disabled="isWeb"
              disabled-reason="Native only — not available on web"
              @click="sendPushToken"
            />
          </div>
        </div>
      </Section>

      <!-- Unread count -->
      <Section title="Unread Count" icon="🔔">
        <div class="flex flex-wrap gap-2 items-center">
          <Button label="setupUnreadConversationListener()" color="green" @click="setupUnreadListener" />
          <Button label="removeUnreadConversationListener()" color="red" @click="removeUnreadListener" />
          <Button label="getUnreadConversationCount()" color="blue" @click="getUnreadCount" />
          <div v-if="unreadCount !== null" class="ml-auto flex items-center gap-2">
            <span class="text-xs text-gray-400">Unread:</span>
            <span class="bg-indigo-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{{ unreadCount }}</span>
          </div>
        </div>
      </Section>

      <!-- Log -->
      <Section title="Log" icon="📋">
        <div class="bg-gray-900 rounded-lg p-3 h-48 overflow-y-auto font-mono text-xs space-y-1">
          <div v-if="logs.length === 0" class="text-gray-600">No output yet. Tap a button to test.</div>
          <div v-for="(entry, i) in logs" :key="i" class="flex gap-2">
            <span class="text-gray-600 shrink-0">{{ entry.time }}</span>
            <span :class="entry.type === 'error' ? 'text-red-400' : entry.type === 'success' ? 'text-green-400' : 'text-gray-300'">{{ entry.msg }}</span>
          </div>
        </div>
        <div class="mt-2 flex justify-end">
          <button @click="logs = []" class="text-xs text-gray-600 hover:text-gray-400">Clear</button>
        </div>
      </Section>

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

// ─── enum options ─────────────────────────────────────────────────────────────
const apiBaseOptions = [
  { value: 'https://api-iam.intercom.io',    label: 'US  — api-iam.intercom.io' },
  { value: 'https://api-iam.eu.intercom.io', label: 'EU  — api-iam.eu.intercom.io' },
  { value: 'https://api-iam.au.intercom.io', label: 'AU  — api-iam.au.intercom.io' },
]

const spaceOptions = computed(() => [
  { value: 'home',     label: 'Home' },
  { value: 'messages', label: 'Messages' },
  { value: 'help',     label: 'Help Center' },
  { value: 'tickets',  label: 'Tickets' },
  { value: 'news',     label: 'News (web only)' },
  { value: 'tasks',    label: 'Tasks (web only)' },
])

const contentTypeOptions = computed(() => [
  { value: 'article',      label: 'Article' },
  { value: 'survey',       label: 'Survey' },
  { value: 'conversation', label: 'Conversation' },
  { value: 'ticket',       label: 'Ticket' },
  { value: 'carousel',     label: 'Carousel (native only)' },
  { value: 'checklist',    label: 'Checklist (web only)' },
  { value: 'news',         label: 'News (web only)' },
  { value: 'tour',         label: 'Tour (web only)' },
])

// ─── logging ─────────────────────────────────────────────────────────────────
function log(msg, type = 'info') {
  const now = new Date()
  const time = `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}:${now.getSeconds().toString().padStart(2,'0')}`
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

async function setJWT() {
  if (!auth.value.jwt) return log('Enter a JWT value first', 'error')
  await run('setJWT() ★', () => Intercom.setJWT({ jwt: auth.value.jwt }))
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
  await run('isUserLoggedIn() ★', () => Intercom.isUserLoggedIn())
}

async function fetchLoggedInUserAttributes() {
  await run('fetchLoggedInUserAttributes() ★', () => Intercom.fetchLoggedInUserAttributes())
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

onUnmounted(() => { if (unreadListener) unreadListener.remove() })
</script>
