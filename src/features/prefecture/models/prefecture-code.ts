import { R } from '@praha/byethrow';
import { ErrorFactory } from '@praha/error-factory';
import z from 'zod';

declare const PrefectureCodeBrand: unique symbol;

const PrefectureCodeWithoutBrandSchema = z.number().int();
const PrefectureCodeSchema =
  PrefectureCodeWithoutBrandSchema.brand<typeof PrefectureCodeBrand>();

type PrefectureCodeWithoutBrand = z.infer<
  typeof PrefectureCodeWithoutBrandSchema
>;
export type PrefectureCode = z.infer<typeof PrefectureCodeSchema>;

export class InvalidPrefectureCodeError extends ErrorFactory({
  name: 'InvalidPrefectureCodeError',
  message: ({ prefectureCode }) => `Invalid PrefectureCode: ${prefectureCode}`,
  fields: ErrorFactory.fields<{ prefectureCode: PrefectureCodeWithoutBrand }>(),
}) {}

const create = (prefectureCode: PrefectureCodeWithoutBrand) =>
  R.pipe(
    R.succeed(prefectureCode),
    R.andThen(R.parse(PrefectureCodeSchema)),
    R.mapError(() => new InvalidPrefectureCodeError({ prefectureCode })),
  );

export const PrefectureCode = {
  schema: PrefectureCodeSchema,
  withoutBrandSchema: PrefectureCodeWithoutBrandSchema,
  create,
};

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;
  const fc = await import('fast-check');

  describe('PrefectureCodes', () => {
    describe('create', () => {
      it('should succeed for integers', () => {
        fc.assert(
          fc.property(fc.integer(), (value) => {
            const result = PrefectureCode.create(value);
            expect(R.isSuccess(result)).toBe(true);
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
              const result = PrefectureCode.create(value);
              expect(R.isFailure(result)).toBe(true);
              if (R.isFailure(result)) {
                expect(result.error).toBeInstanceOf(InvalidPrefectureCodeError);
              }
            },
          ),
        );
      });

      it('should fail when given NaN', () => {
        const result = PrefectureCode.create(NaN);
        expect(R.isFailure(result)).toBe(true);
        if (R.isFailure(result)) {
          expect(result.error).toBeInstanceOf(InvalidPrefectureCodeError);
        }
      });

      it('should fail when given Infinity', () => {
        const result = PrefectureCode.create(Infinity);
        expect(R.isFailure(result)).toBe(true);
        if (R.isFailure(result)) {
          expect(result.error).toBeInstanceOf(InvalidPrefectureCodeError);
        }
      });
    });
  });
}
