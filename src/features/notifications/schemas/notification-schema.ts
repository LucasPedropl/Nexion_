import { z } from 'zod'

export const notificationCategorySchema = z.enum(['all', 'unread', 'system', 'projects', 'inventory'])
export const notificationTypeSchema = z.enum(['alert', 'success', 'info', 'warning', 'system', 'project', 'inventory'])

export const notificationSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  type: notificationTypeSchema,
  category: notificationCategorySchema.default('system'),
  is_read: z.boolean().default(false),
  created_at: z.string(),
  link: z.string().nullable().optional(),
})

export type NotificationCategory = z.infer<typeof notificationCategorySchema>
export type NotificationType = z.infer<typeof notificationTypeSchema>
export type Notification = z.infer<typeof notificationSchema>
