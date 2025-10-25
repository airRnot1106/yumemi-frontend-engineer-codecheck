import { R } from '@praha/byethrow';
import { ErrorFactory } from '@praha/error-factory';
import z from 'zod';
import { PrefectureCode } from './prefecture-code';
import { PrefectureName } from './prefecture-name';

declare const PrefectureBrand: unique symbol;

const PrefectureSchemaWithoutBrand = z.object({
  code: PrefectureCode.withoutBrandSchema,
  name: PrefectureName.withoutBrandSchema,
});
const PrefectureSchema = z
  .object({
    code: PrefectureCode.schema,
    name: PrefectureName.schema,
  })
  .brand<typeof PrefectureBrand>();

type PrefectureWithoutBrand = z.infer<typeof PrefectureSchemaWithoutBrand>;
export type Prefecture = z.infer<typeof PrefectureSchema>;

export class InvalidPrefectureError extends ErrorFactory({
  name: 'InvalidPrefectureError',
  message: 'Invalid Prefecture',
}) {}

const create = (
  prefecture: PrefectureWithoutBrand,
): R.Result<Prefecture, InvalidPrefectureError> =>
  R.pipe(
    R.do(),
    R.bind('code', () => PrefectureCode.create(prefecture.code)),
    R.bind('name', () => PrefectureName.create(prefecture.name)),
    R.andThen(R.parse(PrefectureSchema)),
    R.mapError((error) => {
      if (error instanceof Error) {
        return new InvalidPrefectureError({ cause: error });
      }
      return new InvalidPrefectureError();
    }),
  );

export const Prefecture = {
  schema: PrefectureSchema,
  withoutBrandSchema: PrefectureSchemaWithoutBrand,
  create,
};

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;
  const fc = await import('fast-check');

  describe('Prefecture', () => {
    describe('create', () => {
      it('should succeed for valid prefecture objects', () => {
        fc.assert(
          fc.property(
            fc.integer(),
            fc.string({ minLength: 1 }),
            (code, name) => {
              const result = Prefecture.create({ code, name });
              expect(R.isSuccess(result)).toBe(true);
              if (R.isSuccess(result)) {
                expect(result.value.code).toBe(code);
                expect(result.value.name).toBe(name);
              }
            },
          ),
        );
      });

      it('should fail when code is not an integer', () => {
        fc.assert(
          fc.property(
            fc
              .float()
              .filter((n) => !Number.isInteger(n) && Number.isFinite(n)),
            fc.string({ minLength: 1 }),
            (code, name) => {
              const result = Prefecture.create({ code, name });
              expect(R.isFailure(result)).toBe(true);
              if (R.isFailure(result)) {
                expect(result.error).toBeInstanceOf(InvalidPrefectureError);
              }
            },
          ),
        );
      });

      it('should fail when name is empty', () => {
        fc.assert(
          fc.property(fc.integer(), (code) => {
            const result = Prefecture.create({ code, name: '' });
            expect(R.isFailure(result)).toBe(true);
            if (R.isFailure(result)) {
              expect(result.error).toBeInstanceOf(InvalidPrefectureError);
            }
          }),
        );
      });

      it('should fail when code is NaN', () => {
        const result = Prefecture.create({ code: NaN, name: 'Tokyo' });
        expect(R.isFailure(result)).toBe(true);
        if (R.isFailure(result)) {
          expect(result.error).toBeInstanceOf(InvalidPrefectureError);
        }
      });

      it('should preserve type information for branded type', () => {
        const result = Prefecture.create({ code: 13, name: '東京都' });
        if (R.isSuccess(result)) {
          const prefecture: Prefecture = result.value;
          expect(prefecture.code).toBe(13);
          expect(prefecture.name).toBe('東京都');
        }
      });
    });
  });
}
