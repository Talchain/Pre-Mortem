/**
 * Swipe Gesture Utilities
 * Handles swipe-to-dismiss for mobile modals
 */

import { useState, useRef, useCallback, TouchEvent } from 'react';

export interface SwipeState {
  isDragging: boolean;
  currentY: number;
  velocity: number;
}

export interface SwipeHandlers {
  onTouchStart: (e: TouchEvent<HTMLDivElement>) => void;
  onTouchMove: (e: TouchEvent<HTMLDivElement>) => void;
  onTouchEnd: () => void;
}

interface UseSwipeToDismissOptions {
  onDismiss: () => void;
  threshold?: number; // Minimum distance to trigger dismiss (px)
  velocityThreshold?: number; // Minimum velocity for quick swipe (px/ms)
  elasticResistance?: number; // Resistance factor (0-1, lower = more elastic)
}

export function useSwipeToDismiss({
  onDismiss,
  threshold = 100,
  velocityThreshold = 0.5,
  elasticResistance = 0.6,
}: UseSwipeToDismissOptions): SwipeState & { handlers: SwipeHandlers } {
  const [isDragging, setIsDragging] = useState(false);
  const [currentY, setCurrentY] = useState(0);
  const [velocity, setVelocity] = useState(0);

  const startY = useRef(0);
  const lastY = useRef(0);
  const lastTime = useRef(0);
  const dragStartTime = useRef(0);

  const handleTouchStart = useCallback((e: TouchEvent<HTMLDivElement>) => {
    // Only allow swipe from the top portion of the modal
    const target = e.target as HTMLElement;
    const modalContent = target.closest('[data-swipeable]');
    if (!modalContent) return;

    const touch = e.touches[0];
    startY.current = touch.clientY;
    lastY.current = touch.clientY;
    lastTime.current = Date.now();
    dragStartTime.current = Date.now();
    setIsDragging(true);
    setVelocity(0);
  }, []);

  const handleTouchMove = useCallback(
    (e: TouchEvent<HTMLDivElement>) => {
      if (!isDragging) return;

      const touch = e.touches[0];
      const deltaY = touch.clientY - startY.current;

      // Only allow downward swipes
      if (deltaY < 0) {
        setCurrentY(0);
        return;
      }

      // Calculate velocity
      const now = Date.now();
      const timeDelta = now - lastTime.current;
      if (timeDelta > 0) {
        const velocityY = (touch.clientY - lastY.current) / timeDelta;
        setVelocity(velocityY);
      }

      lastY.current = touch.clientY;
      lastTime.current = now;

      // Apply elastic resistance: harder to drag as distance increases
      const elasticY = deltaY * elasticResistance;
      const dampedY = elasticY * (1 - elasticY / 600); // Diminishing returns

      setCurrentY(Math.min(dampedY, 300)); // Cap at 300px

      // Prevent default scroll if dragging enough
      if (deltaY > 10) {
        e.preventDefault();
      }
    },
    [isDragging, elasticResistance]
  );

  const handleTouchEnd = useCallback(() => {
    if (!isDragging) return;

    // Check if should dismiss based on distance OR velocity
    const shouldDismiss =
      currentY > threshold || velocity > velocityThreshold;

    if (shouldDismiss) {
      // Trigger dismiss with animation
      setCurrentY(1000); // Animate off-screen
      setTimeout(onDismiss, 300); // Match animation duration
    } else {
      // Reset to original position
      setCurrentY(0);
    }

    setIsDragging(false);
    setVelocity(0);
    startY.current = 0;
    lastY.current = 0;
    lastTime.current = 0;
  }, [isDragging, currentY, velocity, threshold, velocityThreshold, onDismiss]);

  return {
    isDragging,
    currentY,
    velocity,
    handlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
  };
}

/**
 * Calculate opacity for overlay based on swipe distance
 */
export function getOverlayOpacity(swipeDistance: number, maxDistance = 300): number {
  return Math.max(0, 1 - swipeDistance / maxDistance);
}

/**
 * Get drag handle transform based on drag state
 */
export function getDragHandleTransform(isDragging: boolean): {
  transform: string;
  backgroundColor: string;
} {
  return {
    transform: isDragging ? 'scaleX(1.5)' : 'scaleX(1)',
    backgroundColor: isDragging
      ? 'var(--sun-500)'
      : 'var(--border-default)',
  };
}
