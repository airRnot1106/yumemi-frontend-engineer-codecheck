import { R } from '@praha/byethrow';
import { ErrorFactory } from '@praha/error-factory';
import z from 'zod';

declare const PrefectureNameBrand: unique symbol;

const PrefectureNameSchemaWithoutBrand = z.string().min(1);
const PrefectureNameSchema =
  PrefectureNameSchemaWithoutBrand.brand<typeof PrefectureNameBrand>();

type PrefectureNameWithoutBrand = z.infer<
  typeof PrefectureNameSchemaWithoutBrand
>;
export type PrefectureName = z.infer<typeof PrefectureNameSchema>;

export class InvalidPrefectureNameError extends ErrorFactory({
  name: 'InvalidPrefectureNameError',
  message: ({ prefectureName }) => `Invalid PrefectureName: ${prefectureName}`,
  fields: ErrorFactory.fields<{ prefectureName: PrefectureNameWithoutBrand }>(),
}) {}

const create = (prefectureName: PrefectureNameWithoutBrand) =>
  R.pipe(
    R.succeed(prefectureName),
    R.andThen(R.parse(PrefectureNameSchema)),
    R.mapError(() => new InvalidPrefectureNameError({ prefectureName })),
  );

export const PrefectureName = {
  schema: PrefectureNameSchema,
  withoutBrandSchema: PrefectureNameSchemaWithoutBrand,
  create,
};

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;
  const fc = await import('fast-check');

  describe('PrefectureName', () => {
    describe('create', () => {
      it('should succeed for non-empty strings', () => {
        fc.assert(
          fc.property(fc.string({ minLength: 1 }), (value) => {
            const result = PrefectureName.create(value);
            expect(R.isSuccess(result)).toBe(true);
            if (R.isSuccess(result)) {
              expect(result.value).toBe(value);
            }
          }),
        );
      });

      it('should fail when given an empty string', () => {
        const result = PrefectureName.create('');
        expect(R.isFailure(result)).toBe(true);
        if (R.isFailure(result)) {
          expect(result.error).toBeInstanceOf(InvalidPrefectureNameError);
        }
      });

      it('should preserve type information for branded type', () => {
        const result = PrefectureName.create('東京都');
        if (R.isSuccess(result)) {
          // This should be type-safe: result.value is PrefectureName
          const prefectureName: PrefectureName = result.value;
          expect(prefectureName).toBe('東京都');
        }
      });
    });
  });
}
