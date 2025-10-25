import { R } from '@praha/byethrow';
import { ErrorFactory } from '@praha/error-factory';
import z from 'zod';
import type { getPrefecturesResponseSuccess } from '../../../libs/generated/clients/prefectures';
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

const fromResponse = (
  response: getPrefecturesResponseSuccess,
): R.Result<Prefecture[], InvalidPrefectureError[]> =>
  R.collect(
    response.data.result
      .map(({ prefCode, prefName }) => ({
        code: prefCode,
        name: prefName,
      }))
      .map(create),
  );

export const Prefecture = {
  schema: PrefectureSchema,
  withoutBrandSchema: PrefectureSchemaWithoutBrand,
  create,
  fromResponse,
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

    describe('fromResponse', () => {
      it('should succeed for valid response with prefecture data', () => {
        fc.assert(
          fc.property(
            fc.array(
              fc.record({
                prefCode: fc.integer(),
                prefName: fc
                  .string({ minLength: 1 })
                  .filter((s) => s.trim().length > 0),
              }),
            ),
            (resultArray) => {
              const response: getPrefecturesResponseSuccess = {
                data: {
                  message: null,
                  result: resultArray,
                },
                status: 200,
                headers: new Headers(),
              };

              const result = Prefecture.fromResponse(response);
              expect(R.isSuccess(result)).toBe(true);
              if (R.isSuccess(result)) {
                expect(result.value).toHaveLength(resultArray.length);
                result.value.forEach((prefecture, index) => {
                  expect(prefecture.code).toBe(resultArray[index]?.prefCode);
                  expect(prefecture.name).toBe(resultArray[index]?.prefName);
                });
              }
            },
          ),
        );
      });

      it('should succeed for empty result array', () => {
        const response: getPrefecturesResponseSuccess = {
          data: {
            message: null,
            result: [],
          },
          status: 200,
          headers: new Headers(),
        };

        const result = Prefecture.fromResponse(response);
        expect(R.isSuccess(result)).toBe(true);
        if (R.isSuccess(result)) {
          expect(result.value).toEqual([]);
        }
      });

      it('should fail when any prefecture has invalid code', () => {
        fc.assert(
          fc.property(
            fc
              .float()
              .filter((n) => !Number.isInteger(n) && Number.isFinite(n)),
            fc.string({ minLength: 1 }).filter((s) => s.trim().length > 0),
            (invalidCode, validName) => {
              const response: getPrefecturesResponseSuccess = {
                data: {
                  message: null,
                  result: [
                    { prefCode: 1, prefName: '北海道' },
                    { prefCode: invalidCode, prefName: validName },
                  ],
                },
                status: 200,
                headers: new Headers(),
              };

              const result = Prefecture.fromResponse(response);
              expect(R.isFailure(result)).toBe(true);
              if (R.isFailure(result)) {
                expect(Array.isArray(result.error)).toBe(true);
                expect(result.error.length).toBeGreaterThan(0);
              }
            },
          ),
        );
      });

      it('should fail when any prefecture has empty name', () => {
        fc.assert(
          fc.property(fc.integer(), (validCode) => {
            const response: getPrefecturesResponseSuccess = {
              data: {
                message: null,
                result: [
                  { prefCode: 1, prefName: '北海道' },
                  { prefCode: validCode, prefName: '' },
                ],
              },
              status: 200,
              headers: new Headers(),
            };

            const result = Prefecture.fromResponse(response);
            expect(R.isFailure(result)).toBe(true);
            if (R.isFailure(result)) {
              expect(Array.isArray(result.error)).toBe(true);
              expect(result.error.length).toBeGreaterThan(0);
            }
          }),
        );
      });

      it('should collect all errors when multiple items are invalid', () => {
        const response: getPrefecturesResponseSuccess = {
          data: {
            message: null,
            result: [
              { prefCode: 1.5, prefName: '北海道' },
              { prefCode: 2, prefName: '' },
              { prefCode: NaN, prefName: '東京都' },
            ],
          },
          status: 200,
          headers: new Headers(),
        };

        const result = Prefecture.fromResponse(response);
        expect(R.isFailure(result)).toBe(true);
        if (R.isFailure(result)) {
          expect(Array.isArray(result.error)).toBe(true);
          expect(result.error.length).toBe(3);
        }
      });
    });
  });
}
