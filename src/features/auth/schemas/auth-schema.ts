import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

export const registerSchema = loginSchema.extend({
  name: z.string().min(2, "Nome muito curto"),
  nickname: z.string().min(3, "Nickname muito curto").regex(/^[a-z0-9_]+$/, "Use apenas letras minúsculas, números e sublinhados"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
