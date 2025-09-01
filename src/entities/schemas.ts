// src/entities/schemas.ts — общие Zod-схемы и типы домена
import { z } from 'zod';

export const PestEnum = z.enum([
  'tarakany',
  'klopy',
  'muravi',
  'gryzuny',
  'bleshi',
  'kleshchi',
  'plesen'
]);

export const ObjectEnum = z.enum(['apartment', 'house', 'plot', 'commercial']);

export const InfestationEnum = z.enum(['low', 'medium', 'high']);

export const AiReplySchema = z.object({
  textMessage: z.string(),
  order: z.object({
    name: z.string().min(1).optional(),
    phone: z.string().min(10).optional(),
    pestType: PestEnum.optional(),
    objectType: ObjectEnum.optional(),
    rooms: z.number().int().min(1).max(4).optional(),
    infestation: InfestationEnum.optional(),
    previousTreatment: z.boolean().optional(),
    address: z.string().optional(),
    expectedDate: z.string().optional(),
    clientComment: z.string().optional(),
    partnerId: z.string().optional(),
    source: z.string().optional()
  }),
  isReady: z.boolean()
});
export type AiReply = z.infer<typeof AiReplySchema>;

export const CreateLeadSchema = z.object({
  partnerId: z.string(),
  pestType: PestEnum,
  objectType: ObjectEnum,
  rooms: z.number().int().min(1).max(4).optional(),
  infestation: InfestationEnum,
  previousTreatment: z.boolean(),
  phone: z.string().min(10),
  address: z.string().min(3),
  name: z.string().min(1),
  expectedDate: z.string(),
  clientComment: z.string().optional(),
  approxPrice: z.number().int().min(0),
  source: z.string().default('co')
});
export type CreateLead = z.infer<typeof CreateLeadSchema>;

export type PricingRule = {
  partnerId: string;
  pestType: z.infer<typeof PestEnum>;
  objectType: z.infer<typeof ObjectEnum>;
  variant: '1' | '2' | '3' | '4' | 'default';
  basePrice: number;
};


