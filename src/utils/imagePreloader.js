/**
 * PJ ESSENCE — IMAGE PRELOADER UTILITY
 * Eliminates blank flashes during automatic luxury carousel transitions.
 */

const preloadedSet = new Set();

export function preloadImage(src) {
  if (!src || preloadedSet.has(src)) return Promise.resolve();

  return new Promise((resolve) => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      preloadedSet.add(src);
      resolve(src);
    };
    img.onerror = () => {
      // Graceful error recovery: resolve anyway so app continues seamlessly
      console.warn(`[PJ Essence Preload] Asset failed to load: ${src}`);
      resolve(src);
    };
  });
}

/**
 * Preload current product, adjacent product, and schedule remaining products.
 */
export function preloadProductAssets(products, currentIndex) {
  if (!products || products.length === 0) return;

  const current = products[currentIndex];
  const next = products[(currentIndex + 1) % products.length];
  const prev = products[(currentIndex - 1 + products.length) % products.length];

  // Highest priority: current and next assets
  if (current) {
    preloadImage(current.image);
    preloadImage(current.pyramidImage);
  }

  if (next) {
    preloadImage(next.image);
    preloadImage(next.pyramidImage);
  }

  if (prev) {
    preloadImage(prev.image);
    preloadImage(prev.pyramidImage);
  }

  // Idle background preloading for remaining products
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    window.requestIdleCallback(() => {
      products.forEach((p) => {
        preloadImage(p.image);
        preloadImage(p.pyramidImage);
      });
    });
  } else {
    setTimeout(() => {
      products.forEach((p) => {
        preloadImage(p.image);
        preloadImage(p.pyramidImage);
      });
    }, 1200);
  }
}
