import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Mínimo de 6 caracteres"),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, "Nome muito curto"),
    email: z.string().email("E-mail inválido"),
    password: z.string().min(6, "Mínimo de 6 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export const projectSchema = z.object({
  name: z.string().min(2, "Nome muito curto").max(80),
  description: z.string().max(300).optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ProjectInput = z.infer<typeof projectSchema>;

export type ProjectRole = "owner" | "admin" | "member";

export interface Profile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  theme?: "light" | "dark" | "system";
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  slug: string;
  role: ProjectRole;
  memberCount: number;
  taskCount: number;
  documentCount: number;
  updatedAt: string;
}
