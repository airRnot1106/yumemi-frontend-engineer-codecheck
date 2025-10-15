import { shouldNeverHappen } from './panic-helper';

export const API_KEY =
  process.env.API_KEY ?? shouldNeverHappen('API_KEY is not defined');
