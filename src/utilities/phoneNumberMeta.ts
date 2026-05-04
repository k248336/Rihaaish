import { PhoneNumberUtil } from 'google-libphonenumber';

const phoneUtil = PhoneNumberUtil.getInstance();

const DEFAULT_MAX = 15;
const MIN_CAP = 6;

type PhoneNumberDesc = {
  possibleLengthCount?: () => number;
  possibleLengthArray?: () => number[];
};

function collectPossibleLengths(...descs: (PhoneNumberDesc | null | undefined)[]) {
  const out: number[] = [];
  for (const d of descs) {
    if (d && typeof d.possibleLengthCount === 'function' && d.possibleLengthCount() > 0) {
      const arr = d.possibleLengthArray?.() ?? [];
      for (const n of arr) {
        if (typeof n === 'number' && n > 0) {
          out.push(n);
        }
      }
    }
  }
  return out;
}

/**
 * Max digits allowed in the national (local) number field for a 2-letter country code.
 * Based on libphonenumber possible lengths (general, mobile, fixed line).
 */
export function getMaxNationalNumberLength(cca2: string | undefined | null): number {
  if (cca2 == null || cca2 === '') {
    return DEFAULT_MAX;
  }
  const region = String(cca2).toUpperCase();
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const meta: any = phoneUtil.getMetadataForRegion(region);
    if (!meta) {
      return DEFAULT_MAX;
    }
    const lengths = collectPossibleLengths(
      meta.getGeneralDesc?.(),
      meta.getMobile?.(),
      meta.getFixedLine?.(),
    );
    if (lengths.length === 0) {
      return DEFAULT_MAX;
    }
    return Math.max(MIN_CAP, Math.min(19, Math.max(...lengths)));
  } catch {
    return DEFAULT_MAX;
  }
}
