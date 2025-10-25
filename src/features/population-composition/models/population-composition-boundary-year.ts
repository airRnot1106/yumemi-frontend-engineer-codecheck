import { R } from '@praha/byethrow';
import { ErrorFactory } from '@praha/error-factory';
import z from 'zod';

declare const PopulationCompositionBoundaryYearBrand: unique symbol;

const PopulationCompositionBoundaryYearSchemaWithoutBrand = z.number().int();
const PopulationCompositionBoundaryYearSchema =
  PopulationCompositionBoundaryYearSchemaWithoutBrand.brand<
    typeof PopulationCompositionBoundaryYearBrand
  >();

type PopulationCompositionBoundaryYearWithoutBrand = z.infer<
  typeof PopulationCompositionBoundaryYearSchemaWithoutBrand
>;
export type PopulationCompositionBoundaryYear = z.infer<
  typeof PopulationCompositionBoundaryYearSchema
>;

export class InvalidPopulationCompositionBoundaryYearError extends ErrorFactory(
  {
    name: 'InvalidPopulationCompositionBoundaryYearError',
    message: ({ boundaryYear }) =>
      `Invalid PopulationCompositionBoundaryYear: ${boundaryYear}`,
    fields: ErrorFactory.fields<{
      boundaryYear: PopulationCompositionBoundaryYearWithoutBrand;
    }>(),
  },
) {}

const create = (boundaryYear: PopulationCompositionBoundaryYearWithoutBrand) =>
  R.pipe(
    R.succeed(boundaryYear),
    R.andThen(R.parse(PopulationCompositionBoundaryYearSchema)),
    R.mapError(
      () => new InvalidPopulationCompositionBoundaryYearError({ boundaryYear }),
    ),
  );

export const PopulationCompositionBoundaryYear = {
  schema: PopulationCompositionBoundaryYearSchema,
  withoutBrandSchema: PopulationCompositionBoundaryYearSchemaWithoutBrand,
  create,
};

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;
  const fc = await import('fast-check');

  describe('PopulationCompositionBoundaryYear', () => {
    describe('create', () => {
      it('should succeed for all integers', () => {
        fc.assert(
          fc.property(fc.integer(), (value) => {
            const result = PopulationCompositionBoundaryYear.create(value);
            expect(R.isSuccess(result)).toBe(true);
            if (R.isSuccess(result)) {
              expect(result.value).toBe(value);
            }
          }),
        );
      });

      it('should fail when given a float number', () => {
        fc.assert(
          fc.property(
            fc
              .float()
              .filter((n) => !Number.isInteger(n) && Number.isFinite(n)),
            (value) => {
              const result = PopulationCompositionBoundaryYear.create(value);
              expect(R.isFailure(result)).toBe(true);
              if (R.isFailure(result)) {
                expect(result.error).toBeInstanceOf(
                  InvalidPopulationCompositionBoundaryYearError,
                );
              }
            },
          ),
        );
      });

      it('should fail when given NaN', () => {
        const result = PopulationCompositionBoundaryYear.create(NaN);
        expect(R.isFailure(result)).toBe(true);
        if (R.isFailure(result)) {
          expect(result.error).toBeInstanceOf(
            InvalidPopulationCompositionBoundaryYearError,
          );
        }
      });

      it('should fail when given Infinity', () => {
        const result = PopulationCompositionBoundaryYear.create(Infinity);
        expect(R.isFailure(result)).toBe(true);
        if (R.isFailure(result)) {
          expect(result.error).toBeInstanceOf(
            InvalidPopulationCompositionBoundaryYearError,
          );
        }
      });

      it('should preserve type information for branded type', () => {
        const result = PopulationCompositionBoundaryYear.create(2020);
        if (R.isSuccess(result)) {
          const boundaryYear: PopulationCompositionBoundaryYear = result.value;
          expect(boundaryYear).toBe(2020);
        }
      });
    });
  });
}
