const ACCENT_BASE =
  'ÁÀÃÂÄáàãâäÉÈÊËéèêëÍÌÎÏíìîïÓÒÔÕÖóòôõöÚÙÛÜúùûüÇçÑñ';
const ACCENT_ALVO =
  'AAAAAaaaaaEEEEeeeeIIIIiiiiOOOOOoooooUUUUuuuuCcNn';

export default class HelperFunctions {
  static isObject = (value: null) => {
    return value !== null && typeof value === 'object';
  };

  static normalizeForSearch(value: string | null | undefined): string {
    if (!value) {
      return '';
    }

    return value.trim();
  }

  static accentInsensitiveLike(alias: string, paramName: string): string {
    return `lower(translate(${alias}, '${ACCENT_BASE}', '${ACCENT_ALVO}')) LIKE lower(translate(:${paramName}, '${ACCENT_BASE}', '${ACCENT_ALVO}'))`;
  }

  static encodeBase64(text: string): string {
    return Buffer.from(text, 'utf8').toString('base64');
  }

  static decodeBase64(base64: string): string {
    return Buffer.from(base64, 'base64').toString('utf8');
  }


}
