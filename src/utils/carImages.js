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
    paintId: 'pspc0020',
    angle: '23',
    width: '800',
  });
  return `${IMAGIN_BASE}?${params.toString()}`;
}

/**
 * Fallback handler for broken images.
 * Sets a neutral SVG placeholder on error.
 */
export function handleImageError(e) {
  e.target.onerror = null;
  e.target.src =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' fill='none'%3E%3Crect width='400' height='300' rx='12' fill='%23181c2a'/%3E%3Ctext x='200' y='160' text-anchor='middle' fill='%23555' font-size='14' font-family='sans-serif'%3EImagine indisponibila%3C/text%3E%3C/svg%3E";
}
