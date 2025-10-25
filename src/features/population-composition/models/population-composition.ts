import { R } from '@praha/byethrow';
import { ErrorFactory } from '@praha/error-factory';
import z from 'zod';
import { Prefecture } from '../../prefecture/models';
import { PopulationCompositionBoundaryYear } from './population-composition-boundary-year';
import { PopulationCompositionType } from './population-composition-type';

declare const PopulationCompositionBrand: unique symbol;

const dataSchema = z.record(
  PopulationCompositionType.schema,
  z
    .object({
      year: z.number().int(),
      value: z.number(),
    })
    .array(),
);

const PopulationCompositionSchemaWithoutBrand = z.object({
  prefecture: Prefecture.withoutBrandSchema,
  boundaryYear: PopulationCompositionBoundaryYear.withoutBrandSchema,
  data: dataSchema,
});
const PopulationCompositionSchema = z
  .object({
    prefecture: Prefecture.schema,
    boundaryYear: PopulationCompositionBoundaryYear.schema,
    data: dataSchema,
  })
  .brand<typeof PopulationCompositionBrand>();

type PopulationCompositionWithoutBrand = z.infer<
  typeof PopulationCompositionSchemaWithoutBrand
>;
export type PopulationComposition = z.infer<typeof PopulationCompositionSchema>;

export class InvalidPopulationCompositionError extends ErrorFactory({
  name: 'InvalidPopulationCompositionError',
  message: 'Invalid PopulationComposition',
}) {}

const create = (
  populationComposition: PopulationCompositionWithoutBrand,
): R.Result<PopulationComposition, InvalidPopulationCompositionError> =>
  R.pipe(
    R.do(),
    R.bind('prefecture', () =>
      Prefecture.create(populationComposition.prefecture),
    ),
    R.bind('boundaryYear', () =>
      PopulationCompositionBoundaryYear.create(
        populationComposition.boundaryYear,
      ),
    ),
    R.bind('data', () => R.succeed(populationComposition.data)),
    R.andThen(R.parse(PopulationCompositionSchema)),
    R.mapError((error) => {
      if (error instanceof Error) {
        return new InvalidPopulationCompositionError({ cause: error });
      }
      return new InvalidPopulationCompositionError();
    }),
  );

export const PopulationComposition = {
  schema: PopulationCompositionSchema,
  withoutBrandSchema: PopulationCompositionSchemaWithoutBrand,
  create,
};

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;
  const fc = await import('fast-check');

  describe('PopulationComposition', () => {
    describe('create', () => {
      it('should succeed for minimal valid data', () => {
        const result = PopulationComposition.create({
          prefecture: { code: 0, name: '!' },
          boundaryYear: 0,
          data: {
            totalPopulation: [],
            youthPopulation: [],
            workingAgePopulation: [],
            elderlyPopulation: [],
          },
        });

        if (R.isFailure(result)) {
          console.log('Minimal test error:', result.error);
        }
        expect(R.isSuccess(result)).toBe(true);
      });

      it('should succeed for valid population composition data', () => {
        fc.assert(
          fc.property(
            fc.integer(),
            fc.string({ minLength: 1 }).filter((s) => s.trim().length > 0),
            fc.integer(),
            fc.array(
              fc.record({
                year: fc.integer(),
                value: fc.float(),
              }),
            ),
            (code, name, boundaryYear, dataArray) => {
              const result = PopulationComposition.create({
                prefecture: { code, name },
                boundaryYear,
                data: {
                  totalPopulation: dataArray,
                  youthPopulation: dataArray,
                  workingAgePopulation: dataArray,
                  elderlyPopulation: dataArray,
                },
              });

              expect(R.isSuccess(result)).toBe(true);
              if (R.isSuccess(result)) {
                expect(result.value.prefecture.code).toBe(code);
                expect(result.value.prefecture.name).toBe(name);
                expect(result.value.boundaryYear).toBe(boundaryYear);
                expect(result.value.data.totalPopulation).toEqual(dataArray);
              }
            },
          ),
        );
      });

      it('should fail when prefecture code is not an integer', () => {
        fc.assert(
          fc.property(
            fc
              .float()
              .filter((n) => !Number.isInteger(n) && Number.isFinite(n)),
            fc.string({ minLength: 1 }).filter((s) => s.trim().length > 0),
            fc.integer(),
            (invalidCode, name, boundaryYear) => {
              const result = PopulationComposition.create({
                prefecture: { code: invalidCode, name },
                boundaryYear,
                data: {
                  totalPopulation: [],
                  youthPopulation: [],
                  workingAgePopulation: [],
                  elderlyPopulation: [],
                },
              });

              expect(R.isFailure(result)).toBe(true);
              if (R.isFailure(result)) {
                expect(result.error).toBeInstanceOf(
                  InvalidPopulationCompositionError,
                );
              }
            },
          ),
        );
      });

      it('should fail when prefecture name is empty', () => {
        fc.assert(
          fc.property(fc.integer(), fc.integer(), (code, boundaryYear) => {
            const result = PopulationComposition.create({
              prefecture: { code, name: '' },
              boundaryYear,
              data: {
                totalPopulation: [],
                youthPopulation: [],
                workingAgePopulation: [],
                elderlyPopulation: [],
              },
            });

            expect(R.isFailure(result)).toBe(true);
            if (R.isFailure(result)) {
              expect(result.error).toBeInstanceOf(
                InvalidPopulationCompositionError,
              );
            }
          }),
        );
      });

      it('should fail when boundaryYear is not an integer', () => {
        fc.assert(
          fc.property(
            fc.integer(),
            fc.string({ minLength: 1 }).filter((s) => s.trim().length > 0),
            fc
              .float()
              .filter((n) => !Number.isInteger(n) && Number.isFinite(n)),
            (code, name, invalidBoundaryYear) => {
              const result = PopulationComposition.create({
                prefecture: { code, name },
                boundaryYear: invalidBoundaryYear,
                data: {
                  totalPopulation: [],
                  youthPopulation: [],
                  workingAgePopulation: [],
                  elderlyPopulation: [],
                },
              });

              expect(R.isFailure(result)).toBe(true);
              if (R.isFailure(result)) {
                expect(result.error).toBeInstanceOf(
                  InvalidPopulationCompositionError,
                );
              }
            },
          ),
        );
      });

      it('should fail when data year is not an integer', () => {
        fc.assert(
          fc.property(
            fc.integer(),
            fc.string({ minLength: 1 }).filter((s) => s.trim().length > 0),
            fc.integer(),
            fc
              .float()
              .filter((n) => !Number.isInteger(n) && Number.isFinite(n)),
            (code, name, boundaryYear, invalidYear) => {
              const result = PopulationComposition.create({
                prefecture: { code, name },
                boundaryYear,
                data: {
                  totalPopulation: [{ year: invalidYear, value: 1000 }],
                  youthPopulation: [],
                  workingAgePopulation: [],
                  elderlyPopulation: [],
                },
              });

              expect(R.isFailure(result)).toBe(true);
              if (R.isFailure(result)) {
                expect(result.error).toBeInstanceOf(
                  InvalidPopulationCompositionError,
                );
              }
            },
          ),
        );
      });

      it('should preserve type information for branded type', () => {
        const result = PopulationComposition.create({
          prefecture: { code: 13, name: '東京都' },
          boundaryYear: 2020,
          data: {
            totalPopulation: [
              { year: 2020, value: 14000000 },
              { year: 2021, value: 14100000 },
            ],
            youthPopulation: [],
            workingAgePopulation: [],
            elderlyPopulation: [],
          },
        });

        if (R.isSuccess(result)) {
          const composition: PopulationComposition = result.value;
          expect(composition.prefecture.code).toBe(13);
          expect(composition.prefecture.name).toBe('東京都');
          expect(composition.boundaryYear).toBe(2020);
          expect(composition.data.totalPopulation).toHaveLength(2);
        }
      });
    });
  });
}
