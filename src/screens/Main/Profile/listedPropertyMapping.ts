/**
 * Maps API property objects into the shape expected by FavoriteProjectCard.
 */
import { api_urls, images } from '../../../utilities';

export type ListedPropertyCard = {
  id: string;
  image: { uri: string } | number;
  type: string;
  name: string;
  location: string;
  beds: number;
  baths: number;
  size: number;
  price: string;
};

function sqftNumber(size: unknown): number {
  if (typeof size === 'number' && Number.isFinite(size)) {
    return size;
  }
  const digits = String(size ?? '').replace(/\D/g, '');
  const n = parseInt(digits, 10);
  return Number.isFinite(n) ? n : 0;
}

export function resolvePropertyMediaUrl(path: string): string {
  if (!path) {
    return '';
  }
  if (path.startsWith('http')) {
    return path;
  }
  const base = api_urls.base_url.replace(/\/$/, '');
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

/** All image URLs for a property (for edit screen). */
export function listPropertyImageUrls(p: Record<string, unknown>): string[] {
  const list = p.images;
  if (!Array.isArray(list)) {
    return [];
  }
  const out: string[] = [];
  for (const el of list) {
    let path = '';
    if (typeof el === 'string') {
      path = el;
    } else if (el && typeof el === 'object') {
      const o = el as Record<string, unknown>;
      path = String(o.url ?? o.image ?? o.image_url ?? '');
    }
    if (path) {
      out.push(resolvePropertyMediaUrl(path));
    }
  }
  return out;
}

/** First gallery image for the card, or a stock image if none. */
function coverImage(p: Record<string, unknown>): { uri: string } | number {
  const list = p.images;
  if (!Array.isArray(list) || list.length === 0) {
    return images.recentprojects;
  }
  const first = list[0];
  let path = '';
  if (typeof first === 'string') {
    path = first;
  } else if (first && typeof first === 'object') {
    const o = first as Record<string, unknown>;
    path = String(o.url ?? o.image ?? o.image_url ?? '');
  }
  if (!path) {
    return images.recentprojects;
  }
  return { uri: resolvePropertyMediaUrl(path) };
}

export function toListedPropertyCard(
  p: Record<string, unknown>,
): ListedPropertyCard {
  const rawPrice = p.price;
  const num =
    typeof rawPrice === 'number'
      ? rawPrice
      : parseFloat(String(rawPrice ?? '0'));
  const priceText = Number.isFinite(num)
    ? `Rs. ${num.toLocaleString()}`
    : String(rawPrice ?? '');

  const line1 = String(p.address ?? '').trim();
  const line2 = String(p.city ?? '').trim();
  const location = [line1, line2].filter(Boolean).join(', ');

  return {
    id: String(p.id ?? ''),
    image: coverImage(p),
    type: String(p.property_type ?? ''),
    name: String(p.title ?? ''),
    location: location || line2,
    beds: Number(p.bedrooms ?? 0) || 0,
    baths: Number(p.washrooms ?? 0) || 0,
    size: sqftNumber(p.size),
    price: priceText,
  };
}
