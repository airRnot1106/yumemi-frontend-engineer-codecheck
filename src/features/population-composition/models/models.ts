import { R } from '@praha/byethrow';
import z from 'zod';
import type { getPopulationCompositionPerYearResponseSuccess } from '../../../libs/generated/clients/population';
import { shouldNeverHappen } from '../../../utils/panic-helper';
import { Prefecture } from '../../prefecture/models';

export const PopulationCompositionType = z.enum([
  'totalPopulation',
  'youthPopulation',
  'workingAgePopulation',
  'elderlyPopulation',
]);
export type PopulationCompositionType = z.infer<
  typeof PopulationCompositionType
>;

export const PopulationCompositionTypeLabel = {
  totalPopulation: '総人口',
  youthPopulation: '年少人口',
  workingAgePopulation: '生産年齢人口',
  elderlyPopulation: '老年人口',
} as const satisfies Record<PopulationCompositionType, string>;

declare const PopulationCompositionBoundaryYearBrand: unique symbol;
export const PopulationCompositionBoundaryYear = z
  .number()
  .brand<typeof PopulationCompositionBoundaryYearBrand>();
export type PopulationCompositionBoundaryYear = z.infer<
  typeof PopulationCompositionBoundaryYear
>;

declare const PopulationCompositionBrand: unique symbol;
export const PopulationComposition = z
  .object({
    prefecture: Prefecture,
    boundaryYear: PopulationCompositionBoundaryYear,
    data: z.record(
      PopulationCompositionType,
      z
        .object({
          year: z.number(),
          value: z.number(),
        })
        .array(),
    ),
  })
  .brand<typeof PopulationCompositionBrand>();
export type PopulationComposition = z.infer<typeof PopulationComposition>;

export const fromResponse = (
  response: getPopulationCompositionPerYearResponseSuccess & {
    prefecture: Prefecture;
  },
) => {
  const { result } = response.data;
  const boundaryYear = result.boundaryYear;
  const data: PopulationComposition['data'] = {
    totalPopulation:
      result.data.find(
        ({ label }) =>
          label ===
          PopulationCompositionTypeLabel[
            PopulationCompositionType.enum.totalPopulation
          ],
      )?.data ?? shouldNeverHappen(),
    youthPopulation:
      result.data.find(
        ({ label }) =>
          label ===
          PopulationCompositionTypeLabel[
            PopulationCompositionType.enum.youthPopulation
          ],
      )?.data ?? shouldNeverHappen(),
    workingAgePopulation:
      result.data.find(
        ({ label }) =>
          label ===
          PopulationCompositionTypeLabel[
            PopulationCompositionType.enum.workingAgePopulation
          ],
      )?.data ?? shouldNeverHappen(),
    elderlyPopulation:
      result.data.find(
        ({ label }) =>
          label ===
          PopulationCompositionTypeLabel[
            PopulationCompositionType.enum.elderlyPopulation
          ],
      )?.data ?? shouldNeverHappen(),
  };
  return R.collect({
    populationComposition: R.parse(PopulationComposition, {
      prefecture: response.prefecture,
      boundaryYear: boundaryYear,
      data,
    }),
  });
};

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;
  const fc = await import('fast-check');

  describe('PopulationComposition models', () => {
    describe('PopulationCompositionType', () => {
      it('should parse valid enum values', () => {
        fc.assert(
          fc.property(
            fc.constantFrom(
              'totalPopulation',
              'youthPopulation',
              'workingAgePopulation',
              'elderlyPopulation',
            ),
            (value) => {
              const result = PopulationCompositionType.safeParse(value);
              expect(result.success).toBe(true);
            },
          ),
        );
      });

      it('should reject invalid enum values', () => {
        fc.assert(
          fc.property(
            fc
              .string()
              .filter(
                (s) =>
                  ![
                    'totalPopulation',
                    'youthPopulation',
                    'workingAgePopulation',
                    'elderlyPopulation',
                  ].includes(s),
              ),
            (value) => {
              const result = PopulationCompositionType.safeParse(value);
              expect(result.success).toBe(false);
            },
          ),
        );
      });
    });

    describe('PopulationCompositionBoundaryYear', () => {
      it('should parse valid numbers', () => {
        fc.assert(
          fc.property(fc.integer(), (year) => {
            const result = PopulationCompositionBoundaryYear.safeParse(year);
            expect(result.success).toBe(true);
            if (result.success) {
              expect(result.data).toBe(year);
            }
          }),
        );
      });

      it('should reject non-number values', () => {
        fc.assert(
          fc.property(
            fc.oneof(fc.string(), fc.boolean(), fc.constant(null)),
            (value) => {
              const result = PopulationCompositionBoundaryYear.safeParse(value);
              expect(result.success).toBe(false);
            },
          ),
        );
      });
    });

    describe('PopulationComposition', () => {
      const validPrefectureArbitrary = fc
        .record({
          prefectureCode: fc.integer(),
          prefectureName: fc.string({ minLength: 1 }),
        })
        .map((pref) => Prefecture.parse(pref));

      const populationDataArbitrary = fc.array(
        fc.record({
          year: fc.integer(),
          value: fc.integer(),
        }),
      );

      it('should parse valid population composition objects', () => {
        fc.assert(
          fc.property(
            validPrefectureArbitrary,
            fc.integer(),
            populationDataArbitrary,
            populationDataArbitrary,
            populationDataArbitrary,
            populationDataArbitrary,
            (
              prefecture,
              boundaryYear,
              totalPop,
              youthPop,
              workingAgePop,
              elderlyPop,
            ) => {
              const result = PopulationComposition.safeParse({
                prefecture,
                boundaryYear,
                data: {
                  totalPopulation: totalPop,
                  youthPopulation: youthPop,
                  workingAgePopulation: workingAgePop,
                  elderlyPopulation: elderlyPop,
                },
              });
              expect(result.success).toBe(true);
            },
          ),
        );
      });

      it('should reject objects with missing population types', () => {
        fc.assert(
          fc.property(
            validPrefectureArbitrary,
            fc.integer(),
            (prefecture, boundaryYear) => {
              const result = PopulationComposition.safeParse({
                prefecture,
                boundaryYear,
                data: {
                  totalPopulation: [],
                },
              });
              expect(result.success).toBe(false);
            },
          ),
        );
      });

      it('should reject objects without prefecture', () => {
        fc.assert(
          fc.property(
            fc.integer(),
            populationDataArbitrary,
            (boundaryYear, data) => {
              const result = PopulationComposition.safeParse({
                boundaryYear,
                data: {
                  totalPopulation: data,
                  youthPopulation: data,
                  workingAgePopulation: data,
                  elderlyPopulation: data,
                },
              });
              expect(result.success).toBe(false);
            },
          ),
        );
      });

      it('should reject invalid data structure', () => {
        fc.assert(
          fc.property(
            validPrefectureArbitrary,
            fc.integer(),
            fc.array(fc.string(), { minLength: 1 }),
            (prefecture, boundaryYear, invalidData) => {
              const result = PopulationComposition.safeParse({
                prefecture,
                boundaryYear,
                data: {
                  totalPopulation: invalidData,
                  youthPopulation: invalidData,
                  workingAgePopulation: invalidData,
                  elderlyPopulation: invalidData,
                },
              });
              expect(result.success).toBe(false);
            },
          ),
        );
      });
    });

    describe('fromResponse', () => {
      const validPrefectureArbitrary = fc
        .record({
          prefectureCode: fc.integer(),
          prefectureName: fc.string({ minLength: 1 }),
        })
        .map((pref) => Prefecture.parse(pref));

      const populationDataArbitrary = fc.array(
        fc.record({
          year: fc.integer(),
          value: fc.integer(),
        }),
      );

      it('should successfully parse valid response with all population types', () => {
        fc.assert(
          fc.property(
            validPrefectureArbitrary,
            fc.integer(),
            populationDataArbitrary,
            populationDataArbitrary,
            populationDataArbitrary,
            populationDataArbitrary,
            (
              prefecture,
              boundaryYear,
              totalData,
              youthData,
              workingAgeData,
              elderlyData,
            ) => {
              const response = {
                data: {
                  message: null,
                  result: {
                    boundaryYear,
                    data: [
                      { label: '総人口' as const, data: totalData },
                      { label: '年少人口' as const, data: youthData },
                      { label: '生産年齢人口' as const, data: workingAgeData },
                      { label: '老年人口' as const, data: elderlyData },
                    ],
                  },
                },
                status: 200 as const,
                headers: new Headers(),
                prefecture,
              };

              const result = fromResponse(response);
              expect(R.isSuccess(result)).toBe(true);
              if (R.isSuccess(result)) {
                expect(result.value.populationComposition.boundaryYear).toBe(
                  boundaryYear,
                );
                expect(result.value.populationComposition.prefecture).toEqual(
                  prefecture,
                );
                expect(
                  result.value.populationComposition.data.totalPopulation,
                ).toEqual(totalData);
                expect(
                  result.value.populationComposition.data.youthPopulation,
                ).toEqual(youthData);
                expect(
                  result.value.populationComposition.data.workingAgePopulation,
                ).toEqual(workingAgeData);
                expect(
                  result.value.populationComposition.data.elderlyPopulation,
                ).toEqual(elderlyData);
              }
            },
          ),
        );
      });

      it('should fail when boundaryYear is not a number', () => {
        fc.assert(
          fc.property(
            validPrefectureArbitrary,
            fc.string(),
            populationDataArbitrary,
            (prefecture, invalidBoundaryYear, data) => {
              const response = {
                data: {
                  message: null,
                  result: {
                    // biome-ignore lint/suspicious/noExplicitAny: due to test
                    boundaryYear: invalidBoundaryYear as any,
                    data: [
                      { label: '総人口' as const, data },
                      { label: '年少人口' as const, data },
                      { label: '生産年齢人口' as const, data },
                      { label: '老年人口' as const, data },
                    ],
                  },
                },
                status: 200 as const,
                headers: new Headers(),
                prefecture,
              };

              const result = fromResponse(response);
              expect(R.isSuccess(result)).toBe(false);
            },
          ),
        );
      });

      it('should preserve data correctly in successful parse', () => {
        fc.assert(
          fc.property(
            validPrefectureArbitrary,
            fc.integer({ min: 1960, max: 2100 }),
            fc.array(
              fc.record({
                year: fc.integer({ min: 1960, max: 2100 }),
                value: fc.integer({ min: 0 }),
              }),
              { minLength: 1 },
            ),
            (prefecture, boundaryYear, data) => {
              const response = {
                data: {
                  message: null,
                  result: {
                    boundaryYear,
                    data: [
                      { label: '総人口' as const, data },
                      { label: '年少人口' as const, data },
                      { label: '生産年齢人口' as const, data },
                      { label: '老年人口' as const, data },
                    ],
                  },
                },
                status: 200 as const,
                headers: new Headers(),
                prefecture,
              };

              const result = fromResponse(response);
              if (R.isSuccess(result)) {
                expect(result.value.populationComposition.boundaryYear).toBe(
                  boundaryYear,
                );
                expect(
                  result.value.populationComposition.prefecture.prefectureCode,
                ).toBe(prefecture.prefectureCode);
                expect(
                  result.value.populationComposition.prefecture.prefectureName,
                ).toBe(prefecture.prefectureName);
              }
            },
          ),
        );
      });
    });
  });
}
