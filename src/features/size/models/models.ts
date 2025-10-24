import z from 'zod';

const SizeSchema = z.enum(['xs', 'sm', 'md', 'lg', 'xl']);

export type Size = z.infer<typeof SizeSchema>;

export const Size = {
  schema: SizeSchema,
};
