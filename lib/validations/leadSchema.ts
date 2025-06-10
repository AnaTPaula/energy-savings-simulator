import { z } from 'zod';

export const consumptionSchema = z.object({
  monthlyBill: z.number().min(0, 'O valor da conta deve ser maior que zero'),
  city: z.string().min(2, 'Cidade inválida'),
  state: z.string().length(2, 'Estado deve ser uma sigla de 2 letras'),
  supplyType: z.enum(['Monofásico', 'Bifásico', 'Trifásico'], {
    errorMap: () => ({ message: 'Tipo de fornecimento inválido' })
  })
});

export const leadSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('E-mail inválido'),
  phone: z.string().min(10, 'Telefone inválido'),
  cpf: z.string().length(11, 'CPF deve ter 11 dígitos'),
  consumption: consumptionSchema
});

export type LeadData = z.infer<typeof leadSchema>;
export type ConsumptionData = z.infer<typeof consumptionSchema>; 