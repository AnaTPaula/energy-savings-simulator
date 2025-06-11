import { z } from 'zod';

export const adminLoginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(1, 'Senha obrigatória'),
});

export type AdminLoginData = z.infer<typeof adminLoginSchema>; 