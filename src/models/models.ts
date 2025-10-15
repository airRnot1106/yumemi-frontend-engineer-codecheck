import z from 'zod';

export const Size = z.enum(['xs', 'sm', 'md', 'lg', 'xl']);
export type Size = z.infer<typeof Size>;
