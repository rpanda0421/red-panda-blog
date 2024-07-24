import { argbFromHex, argbFromRgb, hexFromArgb, QuantizerCelebi, rgbaFromArgb, Scheme, Score, themeFromSourceColor, TonalPalette } from "@material/material-color-utilities";
import { promise } from "astro/zod";
// import { object, string } from "astro/zod";
import { type NdArray } from "ndarray";
import getPixels from 'get-pixels';
export function getColorFromImage(image: string) {
  return new Promise<number>((resolve, inject) => {
    getPixels(image, function (err, pixel) {
      if (err) {
        inject('Bad image path')
        return
      }
      // Convert Image data to Pixel Array
      const pixels: number[] = [];
      for (let i = 0; i < pixel.data.length; i += 4) {
        const r = pixel.data[i];
        const g = pixel.data[i + 1];
        const b = pixel.data[i + 2];
        const a = pixel.data[i + 3];
        if (a < 255) {
          continue;
        }
        const argb = argbFromRgb(r, g, b);
        pixels.push(argb);
      }
      // Convert Pixels to Material Colors
      const result = QuantizerCelebi.quantize(pixels, 128);
      const ranked = Score.score(result);
      const top = ranked[0];
      resolve(top);
    })
  })

}
export default function generateThemeColor(color: string | string[] | number | number[]) {
  const colors = Array.isArray(color) ? color : [color];
  let result = [];
  for (const color of colors) {
    const { palettes, schemes: { light, dark } } = themeFromSourceColor(typeof color == 'number' ? color : argbFromHex(color));
    const lightPrimary = constructPrimaryThemeData(light, palettes.primary);
    const lightSecondary = constructSecondaryThemeData(light);
    const lightTertiary = getTeriaryData(light);
    const lightError = getErrorData(light);
    const lightSurface = getSurfaceData(light, palettes.neutral);
    const lightOutline = getOutlineData(light);
    const darkPrimary = constructPrimaryThemeData(dark, palettes.primary);
    const darkSecondary = constructSecondaryThemeData(dark);
    const darkTertiary = getTeriaryData(dark);
    const darkError = getErrorData(dark);
    const darkSurface = getSurfaceData(dark, palettes.neutral, true);
    const darkOutline = getOutlineData(dark);

    result.push(styleFormatter(lightPrimary)
      + styleFormatter(lightSecondary)
      + styleFormatter(lightTertiary)
      + styleFormatter(lightError)
      + styleFormatter(lightSurface)
      + styleFormatter(lightOutline)
      + styleFormatter(darkPrimary, true)
      + styleFormatter(darkSecondary, true)
      + styleFormatter(darkTertiary, true)
      + styleFormatter(darkError, true)
      + styleFormatter(darkSurface, true)
      + styleFormatter(darkOutline, true));
  }
  return result;
}

function constructThemeData(css_name: string, color: number) {
  return {
    css_name,
    hex: hexFromArgb(color),
    triple: [rgbaFromArgb(color).r, rgbaFromArgb(color).g, rgbaFromArgb(color).b],
  }
}

function constructPrimaryThemeData(scheme: Scheme, palette: TonalPalette) {
  return {
    own: constructThemeData('primary', scheme.primary),
    on: constructThemeData('on-primary', scheme.onPrimary),
    container: constructThemeData('primary-container', scheme.primaryContainer),
    on_container: constructThemeData('on-primary-container', scheme.onPrimaryContainer),
    inverse: constructThemeData('inverse-primary', scheme.onPrimary),
  }
}

function constructSecondaryThemeData(scheme: Scheme) {
  return {
    own: constructThemeData('secondary', scheme.secondary),
    on: constructThemeData('on-secondary', scheme.onSecondary),
    container: constructThemeData('secondary-container', scheme.secondaryContainer),
    on_container: constructThemeData('on-secondary-container', scheme.onSecondaryContainer),
  }
}

function getTeriaryData(scheme: Scheme) {
  return {
    own: constructThemeData('tertiary', scheme.tertiary),
    on: constructThemeData('on-tertiary', scheme.onTertiary),
    container: constructThemeData('tertiary-container', scheme.tertiaryContainer),
    on_container: constructThemeData('on-tertiary-container', scheme.onTertiaryContainer),
  }
}

function getErrorData(scheme: Scheme) {
  return {
    own: constructThemeData('error', scheme.error),
    on: constructThemeData('on-error', scheme.onError),
    container: constructThemeData('error-container', scheme.errorContainer),
    on_container: constructThemeData('on-error-container', scheme.onErrorContainer),
  }
}

function getSurfaceData(scheme: Scheme, palette: TonalPalette, dark = false) {
  return {
    own: constructThemeData('surface', scheme.surface),
    on: constructThemeData('on-surface', scheme.onSurface),
    container: constructThemeData('surface-container', palette.tone(dark ? 12 : 94)),
    variant: constructThemeData('surface-variant', scheme.surfaceVariant),
    on_variant: constructThemeData('on-surface-variant', scheme.onSurfaceVariant),
    highest: constructThemeData('surface-container-highest', palette.tone(dark ? 22 : 90)),
    high: constructThemeData('surface-container-high', palette.tone(dark ? 17 : 92)),
    low: constructThemeData('surface-container-low', palette.tone(dark ? 10 : 96)),
    lowest: constructThemeData('surface-container-lowest', palette.tone(dark ? 4 : 100)),
    inverse: constructThemeData('inverse-surface', scheme.inverseSurface),
    on_inverse: constructThemeData('inverse-on-surface', scheme.inverseOnSurface),
  }
}


function getOutlineData(scheme: Scheme) {
  return {
    on: constructThemeData('outline', scheme.outline),
    variant: constructThemeData('outline-variant', scheme.outlineVariant),
  }
}

interface ThemeData {
  css_name: string;
  hex: string;
  triple: number[];
}

interface ThemeDatas {
  [key: string]: ThemeData
}

function styleFormatter(data: ThemeDatas, dark = false) {
  let style = '';
  for (const key of Object.keys(data)) {
    style +=
      `--s-color${dark ? '-dark' : ''}-${data[key].css_name}: ${data[key].hex};`
      + `--s-color${dark ? '-dark' : ''}-${data[key].css_name}-rgb: ${data[key].triple.join(', ')};`;
  }
  return style;
} 