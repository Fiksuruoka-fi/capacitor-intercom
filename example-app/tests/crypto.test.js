import { describe, it, expect } from 'vitest'
import { base64url, textToBytes, hmacSha256, generateJwtToken } from '../src/crypto.js'

// Known test vector from Intercom docs / identity-verification-code-samples:
// HMAC-SHA256("secret", "Message") = "aa747c502a898200f9e4fa21bac68136f886a0e27aec70ba06daf2e2a5cb5597"
const KNOWN_SECRET = 'secret'
const KNOWN_MESSAGE = 'Message'
const KNOWN_HMAC = 'aa747c502a898200f9e4fa21bac68136f886a0e27aec70ba06daf2e2a5cb5597'

describe('base64url', () => {
  it('encodes an empty buffer', () => {
    expect(base64url(new Uint8Array([]))).toBe('')
  })

  it('encodes bytes without padding', () => {
    // "Hello" in base64 is "SGVsbG8=", base64url strips the "="
    const bytes = new TextEncoder().encode('Hello')
    expect(base64url(bytes)).toBe('SGVsbG8')
  })

  it('replaces + with - and / with _', () => {
    // Create a buffer that produces + and / in standard base64
    // 0xfb, 0xff, 0xfe → standard base64 = "u//+" → base64url = "u__-"
    const bytes = new Uint8Array([0xfb, 0xff, 0xfe])
    const result = base64url(bytes)
    expect(result).not.toContain('+')
    expect(result).not.toContain('/')
    expect(result).not.toContain('=')
  })

  it('accepts ArrayBuffer input', () => {
    const buf = new Uint8Array([72, 101, 108, 108, 111]).buffer
    expect(base64url(buf)).toBe('SGVsbG8')
  })
})

describe('textToBytes', () => {
  it('encodes ASCII string', () => {
    const bytes = textToBytes('abc')
    expect(bytes).toBeInstanceOf(Uint8Array)
    expect(Array.from(bytes)).toEqual([97, 98, 99])
  })

  it('encodes empty string', () => {
    expect(textToBytes('').length).toBe(0)
  })

  it('encodes UTF-8 characters', () => {
    const bytes = textToBytes('ä')
    // 'ä' in UTF-8 is 0xC3 0xA4
    expect(Array.from(bytes)).toEqual([0xc3, 0xa4])
  })
})

describe('hmacSha256', () => {
  it('produces known Intercom test vector', async () => {
    const { hex } = await hmacSha256(KNOWN_SECRET, KNOWN_MESSAGE)
    expect(hex).toBe(KNOWN_HMAC)
  })

  it('returns lowercase hex', async () => {
    const { hex } = await hmacSha256(KNOWN_SECRET, KNOWN_MESSAGE)
    expect(hex).toBe(hex.toLowerCase())
  })

  it('returns 64-character hex string (256 bits)', async () => {
    const { hex } = await hmacSha256('any-key', 'any-message')
    expect(hex).toHaveLength(64)
    expect(hex).toMatch(/^[0-9a-f]{64}$/)
  })

  it('returns raw ArrayBuffer', async () => {
    const { raw } = await hmacSha256(KNOWN_SECRET, KNOWN_MESSAGE)
    expect(raw).toBeInstanceOf(ArrayBuffer)
    expect(raw.byteLength).toBe(32) // SHA-256 = 32 bytes
  })

  it('produces different output for different messages', async () => {
    const a = await hmacSha256('key', 'message-a')
    const b = await hmacSha256('key', 'message-b')
    expect(a.hex).not.toBe(b.hex)
  })

  it('produces different output for different keys', async () => {
    const a = await hmacSha256('key-a', 'message')
    const b = await hmacSha256('key-b', 'message')
    expect(a.hex).not.toBe(b.hex)
  })

  it('handles user ID as message (Intercom use case)', async () => {
    const { hex } = await hmacSha256('my-intercom-secret', 'user_123')
    expect(hex).toMatch(/^[0-9a-f]{64}$/)
  })

  it('handles email as message (Intercom use case)', async () => {
    const { hex } = await hmacSha256('my-intercom-secret', 'user@example.com')
    expect(hex).toMatch(/^[0-9a-f]{64}$/)
  })
})

describe('generateJwtToken', () => {
  it('produces a three-part JWT', async () => {
    const { token } = await generateJwtToken({
      secret: 'test-secret',
      userId: 'user_123',
    })
    const parts = token.split('.')
    expect(parts).toHaveLength(3)
    // Each part should be non-empty base64url
    for (const part of parts) {
      expect(part.length).toBeGreaterThan(0)
      expect(part).toMatch(/^[A-Za-z0-9_-]+$/)
    }
  })

  it('header is HS256 / JWT', async () => {
    const { token } = await generateJwtToken({
      secret: 'test-secret',
      userId: 'user_123',
    })
    const headerJson = JSON.parse(atob(token.split('.')[0].replace(/-/g, '+').replace(/_/g, '/')))
    expect(headerJson).toEqual({ alg: 'HS256', typ: 'JWT' })
  })

  it('payload contains user_id', async () => {
    const { token } = await generateJwtToken({
      secret: 'test-secret',
      userId: 'user_456',
    })
    const payloadJson = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))
    expect(payloadJson.user_id).toBe('user_456')
  })

  it('payload contains iat and exp', async () => {
    const before = Math.floor(Date.now() / 1000)
    const { payload } = await generateJwtToken({
      secret: 'test-secret',
      userId: 'user_123',
      expiryMinutes: 30,
    })
    const after = Math.floor(Date.now() / 1000)

    expect(payload.iat).toBeGreaterThanOrEqual(before)
    expect(payload.iat).toBeLessThanOrEqual(after)
    expect(payload.exp).toBe(payload.iat + 30 * 60)
  })

  it('defaults to 60 minute expiry', async () => {
    const { payload } = await generateJwtToken({
      secret: 'test-secret',
      userId: 'user_123',
    })
    expect(payload.exp - payload.iat).toBe(60 * 60)
  })

  it('includes email when provided', async () => {
    const { payload } = await generateJwtToken({
      secret: 'test-secret',
      userId: 'user_123',
      email: 'test@example.com',
    })
    expect(payload.email).toBe('test@example.com')
  })

  it('omits email when not provided', async () => {
    const { payload } = await generateJwtToken({
      secret: 'test-secret',
      userId: 'user_123',
    })
    expect(payload.email).toBeUndefined()
  })

  it('merges extra claims', async () => {
    const { payload } = await generateJwtToken({
      secret: 'test-secret',
      userId: 'user_123',
      extraClaims: { company_id: 'acme', role: 'admin' },
    })
    expect(payload.company_id).toBe('acme')
    expect(payload.role).toBe('admin')
    // Standard claims still present
    expect(payload.user_id).toBe('user_123')
    expect(payload.iat).toBeDefined()
  })

  it('signature changes with different secrets', async () => {
    const a = await generateJwtToken({ secret: 'secret-a', userId: 'user_123' })
    const b = await generateJwtToken({ secret: 'secret-b', userId: 'user_123' })
    const sigA = a.token.split('.')[2]
    const sigB = b.token.split('.')[2]
    expect(sigA).not.toBe(sigB)
  })

  it('returns structured header and payload objects', async () => {
    const { header, payload } = await generateJwtToken({
      secret: 'test-secret',
      userId: 'user_123',
    })
    expect(header).toEqual({ alg: 'HS256', typ: 'JWT' })
    expect(payload.user_id).toBe('user_123')
    expect(typeof payload.iat).toBe('number')
    expect(typeof payload.exp).toBe('number')
  })
})
