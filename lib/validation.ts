import { z } from 'zod';

/**
 * Authentication and form validation schemas using Zod.
 * Provides strict validation for all user inputs with proper error messages.
 */

// ────────────────────────────────────────────────────────────────────────────
// Authentication Schemas
// ────────────────────────────────────────────────────────────────────────────

export const LoginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email format')
    .max(254, 'Email is too long')
    .toLowerCase(),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(255, 'Password is too long'),
});

export type LoginInput = z.infer<typeof LoginSchema>;

export const SignUpSchema = z
  .object({
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Invalid email format')
      .max(254, 'Email is too long')
      .toLowerCase(),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(255, 'Password is too long')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        'Password must contain uppercase, lowercase, number, and special character'
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type SignUpInput = z.infer<typeof SignUpSchema>;

// ────────────────────────────────────────────────────────────────────────────
// Chat and Message Schemas
// ────────────────────────────────────────────────────────────────────────────

export const ChatMessageSchema = z.object({
  body: z
    .string()
    .min(1, 'Message cannot be empty')
    .max(4096, 'Message is too long (max 4096 characters)')
    .trim(),
  chat_id: z
    .string()
    .min(1, 'Chat ID is required')
    .max(255, 'Chat ID is invalid'),
});

export type ChatMessageInput = z.infer<typeof ChatMessageSchema>;

export const ChatSchema = z.object({
  id: z.string().min(1, 'Chat ID is required'),
  name: z.string().nullable().optional(),
  last_message: z.string().nullable().optional(),
  updated_at: z.string().datetime(),
});

export type Chat = z.infer<typeof ChatSchema>;

// ────────────────────────────────────────────────────────────────────────────
// Business Onboarding Schemas
// ────────────────────────────────────────────────────────────────────────────

export const BusinessOnboardingSchema = z.object({
  business_name: z
    .string()
    .min(2, 'Business name must be at least 2 characters')
    .max(255, 'Business name is too long')
    .trim(),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email format')
    .max(254, 'Email is too long')
    .toLowerCase(),
  categories: z
    .array(z.string())
    .min(1, 'At least one category must be selected')
    .max(10, 'Too many categories selected'),
  address: z
    .string()
    .min(5, 'Address must be at least 5 characters')
    .max(500, 'Address is too long')
    .trim(),
  whatsapp_number: z
    .string()
    .min(10, 'WhatsApp number must be at least 10 digits')
    .max(15, 'WhatsApp number is invalid')
    .regex(/^\d+$/, 'WhatsApp number must contain only digits')
    .optional(),
});

export type BusinessOnboardingInput = z.infer<typeof BusinessOnboardingSchema>;

// ────────────────────────────────────────────────────────────────────────────
// WhatsApp Webhook Schemas
// ────────────────────────────────────────────────────────────────────────────

export const WhatsAppWebhookSchema = z.object({
  object: z.string().optional(),
  entry: z
    .array(
      z.object({
        changes: z.array(
          z.object({
            value: z.object({
              messages: z
                .array(
                  z.object({
                    from: z
                      .string()
                      .min(1, 'Sender number is required')
                      .regex(/^\d+$/, 'Invalid phone number format'),
                    type: z.enum(['text', 'image', 'document']),
                    text: z
                      .object({
                        body: z
                          .string()
                          .max(4096, 'Message body is too long'),
                      })
                      .optional(),
                    id: z.string().min(1, 'Message ID is required'),
                    timestamp: z.string().min(1, 'Timestamp is required'),
                  })
                )
                .optional(),
              contacts: z
                .array(
                  z.object({
                    profile: z.object({
                      name: z
                        .string()
                        .max(255, 'Contact name is too long')
                        .optional(),
                    }),
                  })
                )
                .optional(),
            }),
          })
        ),
      })
    )
    .optional(),
});

export const FacebookWebhookSchema = z.object({
  object: z.literal('page'),
  entry: z.array(
    z.object({
      messaging: z.array(
        z.object({
          sender: z.object({ id: z.string().min(1, 'Sender ID is required') }),
          recipient: z.object({ id: z.string().min(1, 'Recipient ID is required') }).optional(),
          timestamp: z.string().min(1, 'Timestamp is required'),
          message: z
            .object({ text: z.string().max(4096, 'Message body is too long').optional() })
            .optional(),
        })
      ),
    })
  ),
});

export const InstagramWebhookSchema = z.object({
  object: z.literal('instagram'),
  entry: z.array(
    z.object({
      changes: z.array(
        z.object({
          value: z.object({
            messages: z.array(
              z.object({
                id: z.string().min(1, 'Message ID is required'),
                from: z.string().min(1, 'Sender ID is required'),
                text: z.string().max(4096, 'Message body is too long').optional(),
                timestamp: z.string().min(1, 'Timestamp is required'),
              })
            ),
          }),
        })
      ),
    })
  ),
});

export type WhatsAppWebhookInput = z.infer<typeof WhatsAppWebhookSchema>;
export type FacebookWebhookInput = z.infer<typeof FacebookWebhookSchema>;
export type InstagramWebhookInput = z.infer<typeof InstagramWebhookSchema>;

// ────────────────────────────────────────────────────────────────────────────
// Utility Functions
// ────────────────────────────────────────────────────────────────────────────

/**
 * Safe validation helper that catches and returns structured errors
 */
export function safeValidate<T>(
  schema: z.ZodSchema,
  data: unknown
): { success: true; data: T } | { success: false; errors: Record<string, string> } {
  const result = schema.safeParse(data);

  if (!result.success) {
    const errors: Record<string, string> = {};
    result.error.errors.forEach((err) => {
      const path = err.path.join('.');
      errors[path || 'root'] = err.message;
    });
    return { success: false, errors };
  }

  return { success: true, data: result.data as T };
}
