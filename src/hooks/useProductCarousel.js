import { useState, useEffect, useCallback, useRef } from 'react';
import { preloadProductAssets } from '../utils/imagePreloader';

/**
 * Custom hook orchestrating the automatic PJ Essence luxury perfume sequence.
 * Enforces single source of truth: activeProductId drives bottle, copy, and notes synchronously.
 */
export function useProductCarousel({
  products = [],
  interval = 7000, // 7 seconds per luxury presentation
  autoPlay = true,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward
  const [progress, setProgress] = useState(0);

  const timerRef = useRef(null);
  const progressAnimRef = useRef(null);
  const startTimeRef = useRef(Date.now());
  const pausedTimeElapsedRef = useRef(0);

  const total = products.length;
  const currentProduct = products[currentIndex] || products[0];

  // Check prefers-reduced-motion
  const prefersReducedMotionRef = useRef(false);
  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      prefersReducedMotionRef.current = mediaQuery.matches;
      const handler = (e) => {
        prefersReducedMotionRef.current = e.matches;
      };
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    }
  }, []);

  // Preload assets for current, next, and remaining flacons
  useEffect(() => {
    if (products.length > 0) {
      preloadProductAssets(products, currentIndex);
    }
  }, [products, currentIndex]);

  // Navigate to specific index
  const goToIndex = useCallback((index, newDirection = 1) => {
    if (total === 0) return;
    const safeIndex = (index + total) % total;
    setDirection(newDirection);
    setCurrentIndex(safeIndex);
    setProgress(0);
    startTimeRef.current = Date.now();
    pausedTimeElapsedRef.current = 0;
  }, [total]);

  const nextProduct = useCallback(() => {
    goToIndex(currentIndex + 1, 1);
  }, [currentIndex, goToIndex]);

  const prevProduct = useCallback(() => {
    goToIndex(currentIndex - 1, -1);
  }, [currentIndex, goToIndex]);

  // Pause & Resume handlers for hover/focus
  const pause = useCallback(() => {
    setIsPaused(true);
    pausedTimeElapsedRef.current = Date.now() - startTimeRef.current;
  }, []);

  const resume = useCallback(() => {
    setIsPaused(false);
    startTimeRef.current = Date.now() - pausedTimeElapsedRef.current;
  }, []);

  // Autoplay and Progress tick loop
  useEffect(() => {
    if (!autoPlay || total <= 1 || prefersReducedMotionRef.current) {
      setProgress(100);
      return;
    }

    if (isPaused) {
      if (progressAnimRef.current) cancelAnimationFrame(progressAnimRef.current);
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    startTimeRef.current = Date.now() - pausedTimeElapsedRef.current;

    const tick = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const pct = Math.min((elapsed / interval) * 100, 100);
      setProgress(pct);

      if (elapsed >= interval) {
        pausedTimeElapsedRef.current = 0;
        goToIndex(currentIndex + 1, 1);
      } else {
        progressAnimRef.current = requestAnimationFrame(tick);
      }
    };

    progressAnimRef.current = requestAnimationFrame(tick);

    return () => {
      if (progressAnimRef.current) cancelAnimationFrame(progressAnimRef.current);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [autoPlay, total, interval, isPaused, currentIndex, goToIndex]);

  // Keyboard accessibility
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      nextProduct();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      prevProduct();
    } else if (e.key === ' ' || e.key === 'Spacebar') {
      e.preventDefault();
      setIsPaused((p) => !p);
    }
  }, [nextProduct, prevProduct]);

  // Touch swipe handling for mobile devices
  const touchStartXRef = useRef(0);
  const touchStartYRef = useRef(0);

  const handleTouchStart = (e) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
    const deltaY = e.changedTouches[0].clientY - touchStartYRef.current;

    // Only trigger if horizontal swipe is prominent
    if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
      if (deltaX < 0) {
        nextProduct();
      } else {
        prevProduct();
      }
    }
  };

  return {
    currentIndex,
    currentProduct,
    direction,
    progress,
    isPaused,
    total,
    goToIndex,
    nextProduct,
    prevProduct,
    pause,
    resume,
    handleKeyDown,
    handleTouchStart,
    handleTouchEnd,
  };
}
