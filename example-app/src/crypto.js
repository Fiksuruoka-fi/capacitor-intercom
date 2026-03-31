/**
 * Dev-tools crypto helpers for generating Intercom HMAC and JWT tokens.
 *
 * ⚠️ These run in the browser and are for LOCAL DEVELOPMENT ONLY.
 * Never use client-side secret signing in production.
 */

/**
 * Base64url-encode a buffer (ArrayBuffer or Uint8Array).
 * @param {ArrayBuffer|Uint8Array} buffer
 * @returns {string}
 */
export function base64url(buffer) {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer)
  let binary = ''
  for (const b of bytes) binary += String.fromCharCode(b)
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

/**
 * Encode a string to a Uint8Array via UTF-8.
 * @param {string} str
 * @returns {Uint8Array}
 */
export function textToBytes(str) {
  return new TextEncoder().encode(str)
}

/**
 * Compute HMAC-SHA256 of a message using Web Crypto API.
 * @param {string} secret - The secret key
 * @param {string} message - The message to sign
 * @returns {Promise<{hex: string, raw: ArrayBuffer}>}
 */
export async function hmacSha256(secret, message) {
  const key = await crypto.subtle.importKey(
    'raw', textToBytes(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  )
  const sig = await crypto.subtle.sign('HMAC', key, textToBytes(message))
  return {
    hex: Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join(''),
    raw: sig,
  }
}

/**
 * Generate a JWT signed with HS256.
 * @param {object} params
 * @param {string} params.secret - Signing secret
 * @param {string} params.userId - user_id claim (required)
 * @param {string} [params.email] - email claim
 * @param {number} [params.expiryMinutes=60] - Token lifetime in minutes
 * @param {object} [params.extraClaims] - Additional JWT payload claims
 * @returns {Promise<{token: string, header: object, payload: object}>}
 */
export async function generateJwtToken({ secret, userId, expiryMinutes = 60, email, extraClaims }) {
  const header = { alg: 'HS256', typ: 'JWT' }
  const payload = { user_id: userId }

  if (email) payload.email = email

  payload.iat = Math.floor(Date.now() / 1000)
  payload.exp = payload.iat + expiryMinutes * 60

  if (extraClaims) Object.assign(payload, extraClaims)

  const headerB64 = base64url(textToBytes(JSON.stringify(header)))
  const payloadB64 = base64url(textToBytes(JSON.stringify(payload)))
  const signingInput = `${headerB64}.${payloadB64}`

  const { raw } = await hmacSha256(secret, signingInput)
  const sigB64 = base64url(raw)

  return {
    token: `${signingInput}.${sigB64}`,
    header,
    payload,
  }
}
