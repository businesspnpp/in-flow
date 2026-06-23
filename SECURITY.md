# Security Hardening Implementation Guide

This document outlines all security features implemented in the inFlow production codebase.

## 1. Authentication & Session Management

### Secure Session Storage
- **HttpOnly Cookies**: Session tokens are stored in HttpOnly cookies, preventing XSS attacks from accessing tokens via JavaScript
- **SameSite=Strict**: CSRF protection enabled - cookies only sent with same-site requests
- **Secure Flag**: HTTPS-only transmission in production (automatically enforced)

### Session Lifecycle
- **Sign Up**: Users create accounts with strong password requirements:
  - Minimum 8 characters
  - Must contain uppercase, lowercase, number, and special character
  - Validated server-side with Zod schemas

- **Sign In**: Credentials validated against Supabase Auth
  - Email format validation with RFC 5322 compliance
  - Password length enforcement (6-255 characters)
  - Rate limiting recommended at reverse proxy level

- **Sign Out**: Complete session destruction
  - JWT token invalidated server-side via Supabase Auth
  - HttpOnly cookies explicitly cleared
  - Secure API endpoint `/api/auth/logout` handles destruction
  - Client-side state reset on sign-out

### Protected Resources
- All authenticated pages and API routes are protected
- Unauthenticated users redirected to login page
- Session validation on every request

## 2. Input Sanitization & XSS Prevention

### Sanitization Utilities (`lib/sanitize.ts`)
- **sanitizeText()**: Removes HTML tags and control characters
  - Strips script tags: `<script>alert('xss')</script>` → removed
  - Removes dangerous protocols: `javascript:`, `data:`, `vbscript:`
  - Cleans control characters (\x00-\x1F except \t and \n)

- **sanitizeEmail()**: Email-specific validation
  - RFC 5322 format validation
  - Lowercase normalization
  - Empty string returned for invalid formats

- **sanitizePhoneNumber()**: Removes non-digit characters
  - Whitespace stripping
  - International format support

- **sanitizeUrl()**: URL protocol validation
  - Blocks dangerous protocols
  - Prevents javascript: and data: injection

- **sanitizeInput()**: General purpose with length enforcement
  - Maximum 2048 characters by default (configurable)
  - Text cleaning + length truncation

### Application Points
1. **Chat Messages**: All message text passed through `sanitizeInput()` before storage
   - Input validated with Zod schema
   - Length limited to 4096 characters
   - Stored XSS prevented by sanitization before database insertion

2. **Forms**: All form inputs validated and sanitized
   - Email fields use `sanitizeEmail()`
   - Text fields use `sanitizeText()`
   - Business names, addresses use `sanitizeInput()`

3. **Webhook Data**: All incoming Meta/WhatsApp webhook data sanitized
   - Contact names sanitized
   - Message bodies sanitized
   - Phone numbers validated and sanitized

## 3. SQL Injection Prevention

### Parameterized Queries
All database operations use Supabase client ORM, which automatically uses parameterized queries:

```typescript
// ✓ SECURE - Parameterized by Supabase client
await supabase
  .from('messages')
  .insert({ chat_id, sender: 'business', body: sanitizedBody });

// ✗ NEVER - String concatenation (NOT IN THIS CODEBASE)
// await supabase.rpc('raw_query', { sql: `SELECT * FROM messages WHERE body = '${body}'` })
```

### Database Access Patterns
- **Read**: Filtered queries with `.eq()`, `.ilike()`, `.in()` methods
- **Write**: `.insert()`, `.update()`, `.upsert()` with parameterized values
- **Delete**: `.delete().eq()` with explicit filters
- No raw SQL execution in production code

### Service Role Key Protection
- Service role key stored only in server-side environment variables
- Never exposed to client-side code
- Used only for admin operations in protected API routes

## 4. Authorization & Access Control

### API Route Protection
All sensitive endpoints protected with authentication middleware:

```typescript
// /api/auth/logout - Signs out user
export async function POST(request: NextRequest) {
  // Gets session from cookies, validates, clears tokens
}

// /api/whatsapp/connect - Requires authentication
// Verifies user.id before allowing WhatsApp connection
```

### Object-Level Access Control (OLAC)
- Users can only access their own chat conversations
- Messages filtered by authenticated user context
- Business accounts validated before token storage

### Webhook Authentication
- Meta webhook signature verification with HMAC-SHA256
- Verify_token validation on subscription handshake
- Optional bypass for Meta review mode via environment flag

## 5. Validation with Zod Schemas

### Strict Input Validation (`lib/validation.ts`)
All user inputs validated against explicit schemas:

```typescript
LoginSchema:
  - email: Valid email format, 1-254 characters
  - password: 6-255 characters

SignUpSchema:
  - email: Valid format, 1-254 characters
  - password: 8+ chars with uppercase, lowercase, number, special char
  - confirmPassword: Must match password

ChatMessageSchema:
  - body: 1-4096 characters, non-empty after trim
  - chat_id: 1-255 characters

BusinessOnboardingSchema:
  - business_name: 2-255 characters
  - email: Valid format
  - categories: Array of 1-10 items
  - address: 5-500 characters
  - whatsapp_number: 10-15 digits (optional)
```

### Validation Flow
1. Input received from client/webhook
2. Parsed with `SafeValidate()` helper
3. Schema validation applied
4. Type-safe data returned or errors thrown
5. Errors logged and reported to user

## 6. Strategic Sandbox Isolation (Meta Review Mode)

### Environment Flag: `NEXT_PUBLIC_META_REVIEW_MODE`
Set to `"true"` on staging URL for Meta reviewer access:

```bash
# .env.staging
NEXT_PUBLIC_META_REVIEW_MODE=true
```

### Bypass Behavior
When enabled:
- Webhook signature verification can be bypassed for Meta inspector
- User-Agent detection: `facebookexternalhit` or `MetaInspector`
- Multi-factor authentication walls remain on production
- All security validations still active

### Production: Always False
- Set to `"false"` (default) in production
- All authentication enforced
- All validations enforced

## 7. Cryptographic Security

### HTTPS & TLS
- Enforced in production via Next.js secure flag
- Session cookies marked `Secure` in production
- API calls to Meta use HTTPS

### JWT Handling
- JWTs issued and validated by Supabase Auth
- Token expiration enforced
- Refresh token rotation supported
- Tokens never stored in localStorage (HttpOnly only)

### Webhook Signatures
- HMAC-SHA256 signature generation
- Prevents token/webhook forgery
- Per-request verification

## 8. Incident Response & Logging

### Security Logging
- Authentication events logged
- Validation failures logged with context
- Database errors logged
- Webhook verification failures logged

### Error Handling
- User-safe error messages (no SQL/internal details leaked)
- Sensitive errors logged server-side only
- Generic "An unexpected error occurred" for clients

### Rate Limiting
- Recommended at reverse proxy (Nginx, Cloudflare)
- Per-IP rate limiting on `/api/auth/*` endpoints
- Webhook rate limiting per WABA ID

## 9. Compliance & Best Practices

### OWASP Top 10 Coverage
- **A1 - Injection**: Parameterized queries, input validation ✓
- **A3 - Authentication**: Secure session management, strong passwords ✓
- **A7 - XSS**: Sanitization, HttpOnly cookies ✓
- **A8 - CSRF**: SameSite=Strict cookies ✓
- **A4 - Insecure Design**: Authentication-first architecture ✓

### Regular Security Tasks
1. **Dependencies**: Run `npm audit` regularly
2. **Secrets**: Rotate access tokens quarterly
3. **Logs**: Review auth failure patterns
4. **Updates**: Apply Supabase SDK updates
5. **Testing**: Run security tests in CI/CD

## 10. Deployment Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Set `NEXT_PUBLIC_META_REVIEW_MODE=false`
- [ ] Enable HTTPS/TLS
- [ ] Configure Supabase Row Level Security (RLS)
- [ ] Set secure database credentials
- [ ] Configure webhook secrets securely
- [ ] Enable reverse proxy rate limiting
- [ ] Set up security logging/monitoring
- [ ] Test all auth flows
- [ ] Verify sanitization with XSS payloads
- [ ] Load test with rate limits

## Emergency Response

### If Credentials Leaked
1. Immediately rotate service role key in Supabase
2. Invalidate all active sessions
3. Force password reset for all users
4. Review access logs for unauthorized activity
5. Update webhook secrets

### If XSS Discovered
1. Identify affected input point
2. Add sanitization and validation
3. Audit similar code paths
4. Invalidate relevant sessions
5. Deploy patch immediately

### If Injection Discovered
1. Review all database queries
2. Verify parameterized query usage
3. Add additional input validation
4. Audit database for unauthorized changes
5. Review access logs

---

**Last Updated**: June 2026
**Version**: 1.0.0
**Maintained By**: Security Team
