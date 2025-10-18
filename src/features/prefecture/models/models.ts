import { R } from '@praha/byethrow';
import z from 'zod';
import type { getPrefecturesResponseSuccess } from '../../../libs/generated/clients/prefectures';

declare const PrefectureCodeBrand: unique symbol;
export const PrefectureCode = z
  .number()
  .int()
  .brand<typeof PrefectureCodeBrand>();
export type PrefectureCode = z.infer<typeof PrefectureCode>;

declare const PrefectureNameBrand: unique symbol;
export const PrefectureName = z
  .string()
  .min(1)
  .brand<typeof PrefectureNameBrand>();
export type PrefectureName = z.infer<typeof PrefectureName>;

declare const PrefectureBrand: unique symbol;
export const Prefecture = z
  .object({
    prefectureCode: PrefectureCode,
    prefectureName: PrefectureName,
  })
  .brand<typeof PrefectureBrand>();
export type Prefecture = z.infer<typeof Prefecture>;

export const fromResponse = (response: getPrefecturesResponseSuccess) =>
  R.collect(
    response.data.result
      .map(({ prefCode, prefName }) => ({
        prefectureCode: prefCode,
        prefectureName: prefName,
      }))
      .map(R.parse(Prefecture)),
  );

export const PREFECTURE_KEY = 'prefecture' as const;

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;
  const fc = await import('fast-check');

  describe('Prefecture models', () => {
    describe('PrefectureCode', () => {
      it('should parse valid integer codes', () => {
        fc.assert(
          fc.property(fc.integer(), (code) => {
            const result = PrefectureCode.safeParse(code);
            expect(result.success).toBe(true);
          }),
        );
      });

      it('should reject non-integer numbers', () => {
        fc.assert(
          fc.property(
            fc.double({ noNaN: true }).filter((n) => !Number.isInteger(n)),
            (code) => {
              const result = PrefectureCode.safeParse(code);
              expect(result.success).toBe(false);
            },
          ),
        );
      });

      it('should reject non-number values', () => {
        fc.assert(
          fc.property(
            fc.oneof(fc.string(), fc.boolean(), fc.constant(null)),
            (value) => {
              const result = PrefectureCode.safeParse(value);
              expect(result.success).toBe(false);
            },
          ),
        );
      });
    });

    describe('PrefectureName', () => {
      it('should parse non-empty strings', () => {
        fc.assert(
          fc.property(fc.string({ minLength: 1 }), (name) => {
            const result = PrefectureName.safeParse(name);
            expect(result.success).toBe(true);
          }),
        );
      });

      it('should reject empty strings', () => {
        const result = PrefectureName.safeParse('');
        expect(result.success).toBe(false);
      });

      it('should reject non-string values', () => {
        fc.assert(
          fc.property(
            fc.oneof(fc.integer(), fc.boolean(), fc.constant(null)),
            (value) => {
              const result = PrefectureName.safeParse(value);
              expect(result.success).toBe(false);
            },
          ),
        );
      });
    });

    describe('Prefecture', () => {
      it('should parse valid prefecture objects', () => {
        fc.assert(
          fc.property(
            fc.integer(),
            fc.string({ minLength: 1 }),
            (code, name) => {
              const result = Prefecture.safeParse({
                prefectureCode: code,
                prefectureName: name,
              });
              expect(result.success).toBe(true);
              if (result.success) {
                expect(result.data.prefectureCode).toBe(code);
                expect(result.data.prefectureName).toBe(name);
              }
            },
          ),
        );
      });

      it('should reject objects with invalid prefectureCode', () => {
        fc.assert(
          fc.property(
            fc.double({ noNaN: true }).filter((n) => !Number.isInteger(n)),
            fc.string({ minLength: 1 }),
            (code, name) => {
              const result = Prefecture.safeParse({
                prefectureCode: code,
                prefectureName: name,
              });
              expect(result.success).toBe(false);
            },
          ),
        );
      });

      it('should reject objects with invalid prefectureName', () => {
        fc.assert(
          fc.property(fc.integer(), fc.constant(''), (code, name) => {
            const result = Prefecture.safeParse({
              prefectureCode: code,
              prefectureName: name,
            });
            expect(result.success).toBe(false);
          }),
        );
      });

      it('should reject objects with missing fields', () => {
        fc.assert(
          fc.property(
            fc.oneof(
              fc.record({ prefectureCode: fc.integer() }),
              fc.record({ prefectureName: fc.string({ minLength: 1 }) }),
              fc.constant({}),
            ),
            (obj) => {
              const result = Prefecture.safeParse(obj);
              expect(result.success).toBe(false);
            },
          ),
        );
      });
    });

    describe('fromResponse', () => {
      it('should successfully parse valid response with all valid prefectures', () => {
        fc.assert(
          fc.property(
            fc.array(
              fc.record({
                prefCode: fc.integer(),
                prefName: fc.string({ minLength: 1 }),
              }),
            ),
            (prefectures) => {
              const response: getPrefecturesResponseSuccess = {
                data: {
                  message: null,
                  result: prefectures,
                },
                status: 200,
                headers: new Headers(),
              };

              const result = fromResponse(response);
              expect(R.isSuccess(result)).toBe(true);
              if (R.isSuccess(result)) {
                expect(result.value.length).toBe(prefectures.length);
              }
            },
          ),
        );
      });

      it('should fail when result contains invalid prefecture codes', () => {
        fc.assert(
          fc.property(
            fc
              .array(
                fc.record({
                  prefCode: fc
                    .double({ noNaN: true })
                    .filter((n) => !Number.isInteger(n)),
                  prefName: fc.string({ minLength: 1 }),
                }),
                { minLength: 1 },
              )
              .filter((arr) => arr.length > 0),
            (prefectures) => {
              const response: getPrefecturesResponseSuccess = {
                data: {
                  message: null,
                  result: prefectures,
                },
                status: 200,
                headers: new Headers(),
              };

              const result = fromResponse(response);
              expect(R.isSuccess(result)).toBe(false);
            },
          ),
        );
      });

      it('should fail when result contains empty prefecture names', () => {
        fc.assert(
          fc.property(
            fc
              .array(
                fc.record({
                  prefCode: fc.integer(),
                  prefName: fc.constant(''),
                }),
                { minLength: 1 },
              )
              .filter((arr) => arr.length > 0),
            (prefectures) => {
              const response: getPrefecturesResponseSuccess = {
                data: {
                  message: null,
                  result: prefectures,
                },
                status: 200,
                headers: new Headers(),
              };

              const result = fromResponse(response);
              expect(R.isSuccess(result)).toBe(false);
            },
          ),
        );
      });

      it('should succeed with empty result array', () => {
        const response: getPrefecturesResponseSuccess = {
          data: {
            message: null,
            result: [],
          },
          status: 200,
          headers: new Headers(),
        };

        const result = fromResponse(response);
        expect(R.isSuccess(result)).toBe(true);
        if (R.isSuccess(result)) {
          expect(result.value).toEqual([]);
        }
      });

      it('should preserve prefecture data in successful parse', () => {
        fc.assert(
          fc.property(
            fc
              .array(
                fc.record({
                  prefCode: fc.integer(),
                  prefName: fc.string({ minLength: 1 }),
                }),
                { minLength: 1 },
              )
              .filter((arr) => arr.length > 0),
            (prefectures) => {
              const response: getPrefecturesResponseSuccess = {
                data: {
                  message: null,
                  result: prefectures,
                },
                status: 200,
                headers: new Headers(),
              };

              const result = fromResponse(response);
              if (R.isSuccess(result)) {
                result.value.forEach((parsed, i) => {
                  expect(parsed.prefectureCode).toBe(prefectures[i]?.prefCode);
                  expect(parsed.prefectureName).toBe(prefectures[i]?.prefName);
                });
              }
            },
          ),
        );
      });
    });
  });
}
