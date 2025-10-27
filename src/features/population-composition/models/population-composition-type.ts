import { parseAsStringLiteral } from 'nuqs/server';
import z from 'zod';

const PopulationCompositionTypeSchema = z.enum([
  'totalPopulation',
  'youthPopulation',
  'workingAgePopulation',
  'elderlyPopulation',
]);

export type PopulationCompositionType = z.infer<
  typeof PopulationCompositionTypeSchema
>;

const PopulationCompositionTypeLabelMap = {
  totalPopulation: '総人口',
  youthPopulation: '年少人口',
  workingAgePopulation: '生産年齢人口',
  elderlyPopulation: '老年人口',
} as const satisfies Record<PopulationCompositionType, string>;

const searchParamsKey = 'type';

const searchParamsParser = parseAsStringLiteral(
  Object.values(PopulationCompositionTypeSchema.enum),
).withDefault(PopulationCompositionTypeSchema.enum.totalPopulation);

export const PopulationCompositionType = {
  schema: PopulationCompositionTypeSchema,
  label: PopulationCompositionTypeLabelMap,
  searchParams: {
    key: searchParamsKey,
    parser: searchParamsParser,
  },
};
