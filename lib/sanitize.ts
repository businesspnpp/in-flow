import DOMPurify from 'dompurify';

/**
 * Sanitization utility for removing XSS and malicious HTML/script injections.
 * Uses DOMPurify with strict configuration for maximum security.
 */

const SANITIZE_CONFIG = {
  ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br', 'a'],
  ALLOWED_ATTR: ['href', 'target', 'rel'],
  KEEP_CONTENT: true,
  RETURN_DOM: false,
  RETURN_DOM_FRAGMENT: false,
  FORCE_BODY: false,
  SANITIZE_DOM: true,
  IN_PLACE: false,
};

/**
 * Sanitize HTML content to prevent XSS attacks.
 * Removes all potentially dangerous HTML and scripts.
 */
export function sanitizeHtml(content: string): string {
  if (!content || typeof content !== 'string') {
    return '';
  }

  return DOMPurify.sanitize(content, SANITIZE_CONFIG);
}

/**
 * Sanitize plain text input by removing any HTML/script tags.
 * Preferred for chat messages and user inputs.
 */
export function sanitizeText(content: string): string {
  if (!content || typeof content !== 'string') {
    return '';
  }

  // Remove any HTML tags
  let sanitized = content.replace(/<[^>]*>/g, '');

  // Remove control characters except newlines and tabs
  sanitized = sanitized.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '');

  // Trim and normalize whitespace
  sanitized = sanitized.trim();

  return sanitized;
}

/**
 * Validate and sanitize email addresses.
 * Returns empty string if invalid format.
 */
export function sanitizeEmail(email: string): string {
  if (!email || typeof email !== 'string') {
    return '';
  }

  const sanitized = sanitizeText(email).toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailRegex.test(sanitized) ? sanitized : '';
}

/**
 * Validate and sanitize phone numbers.
 * Removes all non-digit characters.
 */
export function sanitizePhoneNumber(phone: string): string {
  if (!phone || typeof phone !== 'string') {
    return '';
  }

  return phone.replace(/\D/g, '');
}

/**
 * Sanitize URLs to prevent javascript: and data: protocols.
 */
export function sanitizeUrl(url: string): string {
  if (!url || typeof url !== 'string') {
    return '';
  }

  const sanitized = sanitizeText(url);

  // Check for dangerous protocols
  if (
    sanitized.toLowerCase().startsWith('javascript:') ||
    sanitized.toLowerCase().startsWith('data:') ||
    sanitized.toLowerCase().startsWith('vbscript:')
  ) {
    return '';
  }

  return sanitized;
}

/**
 * General purpose sanitization for user inputs.
 * Removes dangerous characters and limits length.
 */
export function sanitizeInput(input: string, maxLength: number = 2048): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  // First sanitize the text
  let sanitized = sanitizeText(input);

  // Enforce maximum length
  sanitized = sanitized.substring(0, maxLength);

  return sanitized;
}

export default {
  sanitizeHtml,
  sanitizeText,
  sanitizeEmail,
  sanitizePhoneNumber,
  sanitizeUrl,
  sanitizeInput,
};
