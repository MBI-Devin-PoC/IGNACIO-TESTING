import { ITheme } from "../services/app-service";

/**
 * Validates if a string is a valid hex color code.
 * Accepts formats: #RGB, #RRGGBB (case insensitive)
 *
 * @param {string} hex - The hex color string to validate
 * @returns {boolean} True if valid hex color, false otherwise
 */
export function isValidHexColor(hex: string): boolean {
  if (!hex) return false;
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
}

/**
 * Converts a 3-character hex color to 6-character format.
 * @param {string} hex - The hex color string (e.g., "#F00" or "#FF0000")
 * @returns {string} The 6-character hex color (e.g., "#FF0000")
 */
function normalizeHexColor(hex: string): string {
  if (hex.length === 4) {
    return '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
  }
  return hex;
}

/**
 * Generates dim and dimmer variants of a hex color by adjusting lightness.
 * @param {string} hexColor - The base hex color (e.g., "#FF5733")
 * @returns {{ color: string, dim: string, dimmer: string }} Color variants
 */
function generateColorVariants(hexColor: string): { color: string; dim: string; dimmer: string } {
  const normalized = normalizeHexColor(hexColor);
  const r = parseInt(normalized.slice(1, 3), 16);
  const g = parseInt(normalized.slice(3, 5), 16);
  const b = parseInt(normalized.slice(5, 7), 16);

  const lighten = (value: number, factor: number): number => {
    return Math.min(255, Math.round(value + (255 - value) * factor));
  };

  const dimR = lighten(r, 0.4);
  const dimG = lighten(g, 0.4);
  const dimB = lighten(b, 0.4);

  const dimmerR = lighten(r, 0.7);
  const dimmerG = lighten(g, 0.7);
  const dimmerB = lighten(b, 0.7);

  const toHex = (value: number): string => value.toString(16).padStart(2, '0');

  return {
    color: normalized,
    dim: `#${toHex(dimR)}${toHex(dimG)}${toHex(dimB)}`,
    dimmer: `#${toHex(dimmerR)}${toHex(dimmerG)}${toHex(dimmerB)}`
  };
}

/**
 * Returns a set of color values (main, dim, and dimmer) from the theme palette
 * based on the provided color key.
 *
 * @param {string} color - The color key to retrieve from the theme palette.
 *   Supported keys: "contrast", "blue", "green", "pink", "orange", "purple", "yellow", "grey", "black".
 *   Also supports "custom" when a customColor hex value is provided.
 * @param {ITheme} theme - The KIP theme object containing color definitions. ie.: this.theme() from a widget.
 * @param {string} [customColor] - Optional custom hex color value (e.g., "#FF5733") used when color is "custom".
 * @returns {{ color: string, dim: string, dimmer: string }} An object with the main KIP theme color hex value,
 *   a dimmed version, and a dimmer version for the specified color key.
 *
 * palette = { color: '#2196f3', dim: '#90caf9', dimmer: '#e3f2fd' }
 *
 * @example
 * ```typescript
 * // As part of a widget theme signal object. Get the dim value for blue color::
 * const hexColor = getColors('blue', this.theme()).dim;
 * // or get the widget config's primary color hex value:
 * const hexColor = getColors(this.widgetProperties.config.color, this.theme()).color;
 * // or use a custom hex color:
 * const hexColor = getColors('custom', this.theme(), '#FF5733').color;
 * ```
 */
export function getColors(color: string, theme: ITheme, customColor?: string): { color: string; dim: string; dimmer: string } {
  if (color === 'custom' && customColor && isValidHexColor(customColor)) {
    return generateColorVariants(customColor);
  }

  const themePalette = {
    "contrast": { color: theme.contrast, dim: theme.contrastDim, dimmer: theme.contrastDimmer },
    "blue": { color: theme.blue, dim: theme.blueDim, dimmer: theme.blueDimmer },
    "green": { color: theme.green, dim: theme.greenDim, dimmer: theme.greenDimmer },
    "pink": { color: theme.pink, dim: theme.pinkDim, dimmer: theme.pinkDimmer },
    "orange": { color: theme.orange, dim: theme.orangeDim, dimmer: theme.orangeDimmer },
    "purple": { color: theme.purple, dim: theme.purpleDim, dimmer: theme.purpleDimmer },
    "yellow": { color: theme.yellow, dim: theme.yellowDim, dimmer: theme.yellowDimmer },
    "grey": { color: theme.grey, dim: theme.greyDim, dimmer: theme.greyDimmer },
    "black": { color: theme.black, dim: theme.blackDim, dimmer: theme.blackDimmer }
  };
  return themePalette[color];
}
