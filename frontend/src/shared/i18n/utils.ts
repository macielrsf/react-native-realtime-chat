// frontend/src/shared/i18n/utils.ts
import { TranslationKey } from './types';

/**
 * Safely gets nested object property using dot notation
 * @param obj - The object to traverse
 * @param path - Dot-separated path (e.g., 'errors.invalidCredentials')
 * @param defaultValue - Value to return if path not found
 */
export function getNestedProperty(
  obj: TranslationKey | undefined,
  path: string,
  defaultValue?: string,
): string {
  if (!obj || typeof obj !== 'object') {
    return defaultValue || path;
  }

  const keys = path.split('.');
  let result: any = obj;

  for (const key of keys) {
    if (result && typeof result === 'object' && key in result) {
      result = result[key];
    } else {
      return defaultValue || path;
    }
  }

  return typeof result === 'string' ? result : defaultValue || path;
}

/**
 * Merges translation objects from different modules
 */
export function mergeTranslations(
  ...translations: TranslationKey[]
): TranslationKey {
  return translations.reduce((acc, curr) => ({ ...acc, ...curr }), {});
}
