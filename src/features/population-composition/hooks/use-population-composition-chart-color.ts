'use client';

import { shouldNeverHappen } from '../../../utils/panic-helper';

const colorMap: Record<number, string> = {
  0: '--colors-love',
  1: '--colors-gold',
  2: '--colors-rose',
  3: '--colors-pine',
  4: '--colors-foam',
  5: '--colors-iris',
};

const getCSSVariable = (variableName: string) => {
  const root = document.documentElement;
  const styles = getComputedStyle(root);
  return styles.getPropertyValue(variableName).trim();
};

export const usePopulationCompositionChartColor = () => {
  const getStaticColors = () => ({
    text: getCSSVariable('--colors-text'),
    grid: getCSSVariable('--colors-muted'),
  });

  const generateDynamicColor = (index: number) => {
    const n = index % Object.keys(colorMap).length;
    return getCSSVariable(colorMap[n] ?? shouldNeverHappen());
  };

  return {
    getStaticColors,
    generateDynamicColor,
  };
};

if (import.meta.vitest) {
  const { describe, it, expect, beforeEach, vi } = import.meta.vitest;
  const { renderHook } = await import('@testing-library/react');

  describe('usePopulationCompositionChartColor', () => {
    const mockGetPropertyValue = vi.fn();

    beforeEach(() => {
      mockGetPropertyValue.mockClear();

      // getComputedStyle のモック
      vi.stubGlobal(
        'getComputedStyle',
        vi.fn(() => ({
          getPropertyValue: mockGetPropertyValue,
        })),
      );

      // document.documentElement のモック
      Object.defineProperty(document, 'documentElement', {
        writable: true,
        value: {},
      });
    });

    describe('getStaticColors', () => {
      it('should return text and grid colors', () => {
        mockGetPropertyValue.mockImplementation((prop: string) => {
          if (prop === '--colors-text') return '  #000000  ';
          if (prop === '--colors-muted') return '  #cccccc  ';
          return '';
        });

        const { result } = renderHook(() =>
          usePopulationCompositionChartColor(),
        );
        const colors = result.current.getStaticColors();

        expect(colors.text).toBe('#000000');
        expect(colors.grid).toBe('#cccccc');
      });

      it('should trim whitespace from color values', () => {
        mockGetPropertyValue.mockImplementation((prop: string) => {
          if (prop === '--colors-text') return '   rgb(0,0,0)   ';
          if (prop === '--colors-muted') return ' rgb(200,200,200) ';
          return '';
        });

        const { result } = renderHook(() =>
          usePopulationCompositionChartColor(),
        );
        const colors = result.current.getStaticColors();

        expect(colors.text).toBe('rgb(0,0,0)');
        expect(colors.grid).toBe('rgb(200,200,200)');
      });
    });

    describe('generateDynamicColor', () => {
      it('should return correct color for index 0', () => {
        mockGetPropertyValue.mockImplementation((prop: string) => {
          if (prop === '--colors-love') return '#ff0000';
          return '';
        });

        const { result } = renderHook(() =>
          usePopulationCompositionChartColor(),
        );
        const color = result.current.generateDynamicColor(0);

        expect(color).toBe('#ff0000');
        expect(mockGetPropertyValue).toHaveBeenCalledWith('--colors-love');
      });

      it('should return correct color for each index', () => {
        const colorValues: Record<string, string> = {
          '--colors-love': '#ff0000',
          '--colors-gold': '#ffd700',
          '--colors-rose': '#ff007f',
          '--colors-pine': '#00ff00',
          '--colors-foam': '#00ffff',
          '--colors-iris': '#0000ff',
        };

        mockGetPropertyValue.mockImplementation(
          (prop: string) => colorValues[prop] ?? '',
        );

        const { result } = renderHook(() =>
          usePopulationCompositionChartColor(),
        );

        expect(result.current.generateDynamicColor(0)).toBe('#ff0000');
        expect(result.current.generateDynamicColor(1)).toBe('#ffd700');
        expect(result.current.generateDynamicColor(2)).toBe('#ff007f');
        expect(result.current.generateDynamicColor(3)).toBe('#00ff00');
        expect(result.current.generateDynamicColor(4)).toBe('#00ffff');
        expect(result.current.generateDynamicColor(5)).toBe('#0000ff');
      });

      it('should wrap around using modulo when index exceeds colorMap length', () => {
        mockGetPropertyValue.mockImplementation((prop: string) => {
          if (prop === '--colors-love') return '#ff0000';
          if (prop === '--colors-gold') return '#ffd700';
          return '';
        });

        const { result } = renderHook(() =>
          usePopulationCompositionChartColor(),
        );

        // index 6 should wrap to 0 (6 % 6 = 0)
        expect(result.current.generateDynamicColor(6)).toBe('#ff0000');

        // index 7 should wrap to 1 (7 % 6 = 1)
        expect(result.current.generateDynamicColor(7)).toBe('#ffd700');

        // index 12 should wrap to 0 (12 % 6 = 0)
        expect(result.current.generateDynamicColor(12)).toBe('#ff0000');
      });

      it('should trim whitespace from dynamic colors', () => {
        mockGetPropertyValue.mockImplementation((prop: string) => {
          if (prop === '--colors-love') return '  #ff0000  ';
          return '';
        });

        const { result } = renderHook(() =>
          usePopulationCompositionChartColor(),
        );
        const color = result.current.generateDynamicColor(0);

        expect(color).toBe('#ff0000');
      });
    });

    describe('edge cases', () => {
      it('should handle missing CSS variables', () => {
        mockGetPropertyValue.mockReturnValue('');

        const { result } = renderHook(() =>
          usePopulationCompositionChartColor(),
        );

        const colors = result.current.getStaticColors();
        expect(colors.text).toBe('');
        expect(colors.grid).toBe('');

        const dynamicColor = result.current.generateDynamicColor(0);
        expect(dynamicColor).toBe('');
      });
    });
  });
}
