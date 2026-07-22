import { z } from 'zod'

const principalSchema = z
  .object({
    actor_id: z.uuid(),
    app: z.enum(['info', 'knowledge', 'research']),
    surface: z.literal('web'),
    display_name: z.string().max(256).nullable().optional(),
    email: z.email().max(320).nullable().optional(),
    roles: uniqueClaimList(),
    scopes: uniqueClaimList(),
    expires_at: z.iso.datetime(),
  })
  .strict()

export const browserSessionSchema = z
  .object({
    contract_version: z.literal(1),
    authenticated: z.literal(true),
    user: principalSchema,
    csrf_token: z.string().min(32).max(256),
  })
  .strict()

export type BrowserSession = z.infer<typeof browserSessionSchema>

function uniqueClaimList() {
  return z
    .array(z.string().min(1).max(128))
    .refine((items) => new Set(items).size === items.length, 'claims must be unique')
}
