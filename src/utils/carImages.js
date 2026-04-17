/**
 * Car image utilities for configurator.
 *
 * Brand logos: filippofilip95/car-logos-dataset on GitHub (via jsDelivr CDN)
 * Car renders: imagin.studio demo API (customer=img)
 */

const LOGO_CDN =
  'https://cdn.jsdelivr.net/gh/filippofilip95/car-logos-dataset@master/logos/optimized';

const IMAGIN_BASE = 'https://cdn.imagin.studio/getimage';

/**
 * Returns the CDN URL for a brand logo (PNG).
 * Brand slugs match the repo filenames exactly
 * (e.g. "volkswagen", "mercedes-benz", "alfa-romeo").
 */
export function getBrandLogoUrl(brandSlug) {
  return `${LOGO_CDN}/${brandSlug}.png`;
}

/**
 * Returns a car render URL from imagin.studio.
 * @param {string} make  — brand name as imagin.studio expects (e.g. "BMW", "Mercedes-Benz")
 * @param {string} modelFamily — model family (e.g. "3 Series", "Golf", "A4")
 */
export function getCarImageUrl(make, modelFamily) {
  const params = new URLSearchParams({
    customer: 'img',
    make,
    modelFamily,
    paintId: 'pspc0040',
    angle: '23',
    width: '800',
  });
  return `${IMAGIN_BASE}?${params.toString()}`;
}

/**
 * Fallback handler for broken images.
 * Hides the image element on error.
 */
export function handleImageError(e) {
  e.target.onerror = null;
  e.target.style.display = 'none';
}
