import { R } from '@praha/byethrow';
import { ErrorFactory } from '@praha/error-factory';
import z from 'zod';
import type { PopulationComposition } from '../../../libs/generated/clients/api.schemas';
import { shouldNeverHappen } from '../../../utils/panic-helper';
import { PopulationCompositionType } from './population-composition-type';

declare const PopulationCompositionDataBrand: unique symbol;

const PopulationCompositionDataWithoutBrandSchema = z.record(
  PopulationCompositionType.schema,
  z
    .object({
      year: z.number().int(),
      value: z.number(),
    })
    .array(),
);
const PopulationCompositionDataSchema =
  PopulationCompositionDataWithoutBrandSchema.brand<
    typeof PopulationCompositionDataBrand
  >();

type PopulationCompositionDataWithoutBrand = z.infer<
  typeof PopulationCompositionDataWithoutBrandSchema
>;
export type PopulationCompositionData = z.infer<
  typeof PopulationCompositionDataSchema
>;

export class InvalidPopulationCompositionDataError extends ErrorFactory({
  name: 'InvalidPopulationCompositionDataError',
  message: ({ data }) =>
    `Invalid PopulationCompositionData: ${JSON.stringify(data)}`,
  fields: ErrorFactory.fields<{
    data: PopulationCompositionDataWithoutBrand;
  }>(),
}) {}

const create = (data: PopulationCompositionDataWithoutBrand) =>
  R.pipe(
    R.succeed(data),
    R.andThen(R.parse(PopulationCompositionDataSchema)),
    R.mapError(() => new InvalidPopulationCompositionDataError({ data })),
  );

const transformSchema = (response: PopulationComposition[]) =>
  R.unwrap(
    R.pipe(
      R.do(),
      R.bind(PopulationCompositionType.schema.enum.totalPopulation, () =>
        R.succeed(
          response.find(
            ({ label }) =>
              label ===
              PopulationCompositionType.label[
                PopulationCompositionType.schema.enum.totalPopulation
              ],
          )?.data ?? shouldNeverHappen(),
        ),
      ),
      R.bind(PopulationCompositionType.schema.enum.youthPopulation, () =>
        R.succeed(
          response.find(
            ({ label }) =>
              label ===
              PopulationCompositionType.label[
                PopulationCompositionType.schema.enum.youthPopulation
              ],
          )?.data ?? shouldNeverHappen(),
        ),
      ),
      R.bind(PopulationCompositionType.schema.enum.workingAgePopulation, () =>
        R.succeed(
          response.find(
            ({ label }) =>
              label ===
              PopulationCompositionType.label[
                PopulationCompositionType.schema.enum.workingAgePopulation
              ],
          )?.data ?? shouldNeverHappen(),
        ),
      ),
      R.bind(PopulationCompositionType.schema.enum.elderlyPopulation, () =>
        R.succeed(
          response.find(
            ({ label }) =>
              label ===
              PopulationCompositionType.label[
                PopulationCompositionType.schema.enum.elderlyPopulation
              ],
          )?.data ?? shouldNeverHappen(),
        ),
      ),
    ),
  );

export const PopulationCompositionData = {
  schema: PopulationCompositionDataSchema,
  withoutBrandSchema: PopulationCompositionDataWithoutBrandSchema,
  create,
  transformSchema,
};
