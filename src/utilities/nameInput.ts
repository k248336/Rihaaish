/**
 * For controlled TextInput onChange — only letters (any script) and spaces;
 * numbers/symbols are not accepted as input (AuthSchema nameShape matches).
 */
export function filterNameKeyInput(value: string): string {
  return value.replace(/[^\p{L}\s]/gu, '');
}

/** For FormData / API (collapse spaces, trim) — use with filterNameKeyInput at submit. */
export function sanitizeNameForApi(value: string): string {
  return String(value ?? '')
    .replace(/[^\p{L}\s]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
}
