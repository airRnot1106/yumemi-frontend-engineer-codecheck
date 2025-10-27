import { R } from '@praha/byethrow';
import { ErrorFactory } from '@praha/error-factory';
import z from 'zod';
import type { getPopulationCompositionPerYearResponseSuccess } from '../../../libs/generated/clients/population';
import { Prefecture } from '../../prefecture/models';
import { PopulationCompositionBoundaryYear } from './population-composition-boundary-year';
import { PopulationCompositionData } from './population-composition-data';
import { PopulationCompositionType } from './population-composition-type';

declare const PopulationCompositionBrand: unique symbol;

const PopulationCompositionWithoutBrandSchema = z.object({
  prefecture: Prefecture.withoutBrandSchema,
  boundaryYear: PopulationCompositionBoundaryYear.withoutBrandSchema,
  data: PopulationCompositionData.withoutBrandSchema,
});
const PopulationCompositionSchema = z
  .object({
    prefecture: Prefecture.schema,
    boundaryYear: PopulationCompositionBoundaryYear.schema,
    data: PopulationCompositionData.schema,
  })
  .brand<typeof PopulationCompositionBrand>();

type PopulationCompositionWithoutBrand = z.infer<
  typeof PopulationCompositionWithoutBrandSchema
>;
export type PopulationComposition = z.infer<typeof PopulationCompositionSchema>;

export class InvalidPopulationCompositionError extends ErrorFactory({
  name: 'InvalidPopulationCompositionError',
  message: 'Invalid PopulationComposition',
}) {}

export class FailedToFetchPopulationCompositionError extends ErrorFactory({
  name: 'FailedToFetchPopulationCompositionError',
  message: 'Failed to fetch population composition data',
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
    R.bind('data', () =>
      PopulationCompositionData.create(populationComposition.data),
    ),
    R.andThen(R.parse(PopulationCompositionSchema)),
    R.mapError((error) => {
      if (error instanceof Error) {
        return new InvalidPopulationCompositionError({ cause: error });
      }
      return new InvalidPopulationCompositionError();
    }),
  );

const fromResponses = (
  responses: (getPopulationCompositionPerYearResponseSuccess & {
    prefecture: Prefecture;
  })[],
): R.Result<PopulationComposition[], InvalidPopulationCompositionError[]> =>
  R.collect(
    responses
      .map((response) => ({
        ...response.data.result,
        prefecture: response.prefecture,
      }))
      .map((response) => ({
        ...response,
        data: PopulationCompositionData.transformSchema(response.data),
      }))
      .map(create),
  );

export const PopulationComposition = {
  schema: PopulationCompositionSchema,
  withoutBrandSchema: PopulationCompositionWithoutBrandSchema,
  create,
  fromResponses,
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
                value: fc.float().filter((n) => Number.isFinite(n)),
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

    describe('fromResponses', () => {
      it('should succeed for valid response data', () => {
        const prefecture = Prefecture.create({ code: 1, name: '北海道' });
        if (R.isFailure(prefecture)) {
          throw new Error('Prefecture creation failed');
        }

        const responses: (getPopulationCompositionPerYearResponseSuccess & {
          prefecture: Prefecture;
        })[] = [
          {
            data: {
              message: null,
              result: {
                boundaryYear: 2020,
                data: [
                  {
                    label: PopulationCompositionType.label.totalPopulation,
                    data: [
                      { year: 2020, value: 5000000 },
                      { year: 2021, value: 5100000 },
                    ],
                  },
                  {
                    label: PopulationCompositionType.label.youthPopulation,
                    data: [{ year: 2020, value: 500000 }],
                  },
                  {
                    label: PopulationCompositionType.label.workingAgePopulation,
                    data: [{ year: 2020, value: 3000000 }],
                  },
                  {
                    label: PopulationCompositionType.label.elderlyPopulation,
                    data: [{ year: 2020, value: 1500000 }],
                  },
                ],
              },
            },
            status: 200,
            headers: new Headers(),
            prefecture: prefecture.value,
          },
        ];

        const result = PopulationComposition.fromResponses(responses);
        expect(R.isSuccess(result)).toBe(true);
        if (R.isSuccess(result)) {
          expect(result.value).toHaveLength(1);
          expect(result.value[0]?.prefecture.code).toBe(1);
          expect(result.value[0]?.prefecture.name).toBe('北海道');
          expect(result.value[0]?.boundaryYear).toBe(2020);
          expect(result.value[0]?.data.totalPopulation).toHaveLength(2);
          expect(result.value[0]?.data.youthPopulation).toHaveLength(1);
        }
      });

      it('should succeed for empty response array', () => {
        const result = PopulationComposition.fromResponses([]);
        expect(R.isSuccess(result)).toBe(true);
        if (R.isSuccess(result)) {
          expect(result.value).toEqual([]);
        }
      });

      it('should succeed for multiple responses', () => {
        const prefecture1 = Prefecture.create({ code: 1, name: '北海道' });
        const prefecture2 = Prefecture.create({ code: 13, name: '東京都' });

        if (R.isFailure(prefecture1) || R.isFailure(prefecture2)) {
          throw new Error('Prefecture creation failed');
        }

        const responses: (getPopulationCompositionPerYearResponseSuccess & {
          prefecture: Prefecture;
        })[] = [
          {
            data: {
              message: null,
              result: {
                boundaryYear: 2020,
                data: [
                  {
                    label: PopulationCompositionType.label.totalPopulation,
                    data: [{ year: 2020, value: 5000000 }],
                  },
                  {
                    label: PopulationCompositionType.label.youthPopulation,
                    data: [{ year: 2020, value: 500000 }],
                  },
                  {
                    label: PopulationCompositionType.label.workingAgePopulation,
                    data: [{ year: 2020, value: 3000000 }],
                  },
                  {
                    label: PopulationCompositionType.label.elderlyPopulation,
                    data: [{ year: 2020, value: 1500000 }],
                  },
                ],
              },
            },
            status: 200,
            headers: new Headers(),
            prefecture: prefecture1.value,
          },
          {
            data: {
              message: null,
              result: {
                boundaryYear: 2021,
                data: [
                  {
                    label: PopulationCompositionType.label.totalPopulation,
                    data: [{ year: 2021, value: 14000000 }],
                  },
                  {
                    label: PopulationCompositionType.label.youthPopulation,
                    data: [{ year: 2021, value: 1400000 }],
                  },
                  {
                    label: PopulationCompositionType.label.workingAgePopulation,
                    data: [{ year: 2021, value: 8400000 }],
                  },
                  {
                    label: PopulationCompositionType.label.elderlyPopulation,
                    data: [{ year: 2021, value: 4200000 }],
                  },
                ],
              },
            },
            status: 200,
            headers: new Headers(),
            prefecture: prefecture2.value,
          },
        ];

        const result = PopulationComposition.fromResponses(responses);
        expect(R.isSuccess(result)).toBe(true);
        if (R.isSuccess(result)) {
          expect(result.value).toHaveLength(2);
          expect(result.value[0]?.prefecture.name).toBe('北海道');
          expect(result.value[1]?.prefecture.name).toBe('東京都');
        }
      });

      it('should fail when boundaryYear is not an integer', () => {
        const prefecture = Prefecture.create({ code: 1, name: '北海道' });
        if (R.isFailure(prefecture)) {
          throw new Error('Prefecture creation failed');
        }

        const responses: (getPopulationCompositionPerYearResponseSuccess & {
          prefecture: Prefecture;
        })[] = [
          {
            data: {
              message: null,
              result: {
                boundaryYear: 2020.5,
                data: [
                  {
                    label: PopulationCompositionType.label.totalPopulation,
                    data: [{ year: 2020, value: 5000000 }],
                  },
                  {
                    label: PopulationCompositionType.label.youthPopulation,
                    data: [{ year: 2020, value: 500000 }],
                  },
                  {
                    label: PopulationCompositionType.label.workingAgePopulation,
                    data: [{ year: 2020, value: 3000000 }],
                  },
                  {
                    label: PopulationCompositionType.label.elderlyPopulation,
                    data: [{ year: 2020, value: 1500000 }],
                  },
                ],
              },
            },
            status: 200,
            headers: new Headers(),
            prefecture: prefecture.value,
          },
        ];

        const result = PopulationComposition.fromResponses(responses);
        expect(R.isFailure(result)).toBe(true);
        if (R.isFailure(result)) {
          expect(Array.isArray(result.error)).toBe(true);
          expect(result.error.length).toBeGreaterThan(0);
        }
      });

      it('should fail when data year is not an integer', () => {
        const prefecture = Prefecture.create({ code: 1, name: '北海道' });
        if (R.isFailure(prefecture)) {
          throw new Error('Prefecture creation failed');
        }

        const responses: (getPopulationCompositionPerYearResponseSuccess & {
          prefecture: Prefecture;
        })[] = [
          {
            data: {
              message: null,
              result: {
                boundaryYear: 2020,
                data: [
                  {
                    label: PopulationCompositionType.label.totalPopulation,
                    data: [{ year: 2020.5, value: 5000000 }],
                  },
                  {
                    label: PopulationCompositionType.label.youthPopulation,
                    data: [{ year: 2020, value: 500000 }],
                  },
                  {
                    label: PopulationCompositionType.label.workingAgePopulation,
                    data: [{ year: 2020, value: 3000000 }],
                  },
                  {
                    label: PopulationCompositionType.label.elderlyPopulation,
                    data: [{ year: 2020, value: 1500000 }],
                  },
                ],
              },
            },
            status: 200,
            headers: new Headers(),
            prefecture: prefecture.value,
          },
        ];

        const result = PopulationComposition.fromResponses(responses);
        expect(R.isFailure(result)).toBe(true);
        if (R.isFailure(result)) {
          expect(Array.isArray(result.error)).toBe(true);
          expect(result.error.length).toBeGreaterThan(0);
        }
      });
    });
  });
}
