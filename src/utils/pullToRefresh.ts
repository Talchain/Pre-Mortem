/**
 * Pull-to-Refresh Utility
 * Handles pull-down gesture to refresh chat history
 */

import { useState, useRef, useCallback, TouchEvent, RefObject } from 'react';

export interface PullToRefreshState {
  pullDistance: number;
  isRefreshing: boolean;
  isReady: boolean; // Threshold reached
}

export interface PullToRefreshHandlers {
  onTouchStart: (e: TouchEvent<HTMLDivElement>) => void;
  onTouchMove: (e: TouchEvent<HTMLDivElement>) => void;
  onTouchEnd: () => void;
}

interface UsePullToRefreshOptions {
  onRefresh: () => Promise<void>;
  threshold?: number; // Distance to trigger refresh (px)
  maxPullDistance?: number; // Maximum pull distance (px)
  elasticFactor?: number; // Elastic resistance (0-1)
  onThresholdReached?: () => void; // Callback when threshold reached
}

export function usePullToRefresh({
  onRefresh,
  threshold = 80,
  maxPullDistance = 120,
  elasticFactor = 0.5,
  onThresholdReached,
}: UsePullToRefreshOptions): PullToRefreshState & {
  handlers: PullToRefreshHandlers;
  containerRef: RefObject<HTMLDivElement>;
} {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const thresholdReachedRef = useRef(false);

  const handleTouchStart = useCallback((e: TouchEvent<HTMLDivElement>) => {
    // Only activate if scrolled to top
    if (containerRef.current && containerRef.current.scrollTop === 0) {
      startY.current = e.touches[0].clientY;
      thresholdReachedRef.current = false;
    }
  }, []);

  const handleTouchMove = useCallback(
    (e: TouchEvent<HTMLDivElement>) => {
      // Don't pull if already refreshing or not at top
      if (
        isRefreshing ||
        startY.current === 0 ||
        (containerRef.current && containerRef.current.scrollTop > 0)
      ) {
        return;
      }

      const deltaY = e.touches[0].clientY - startY.current;

      // Only allow downward pulls
      if (deltaY > 0) {
        // Apply elastic resistance
        const elasticDistance = Math.min(
          deltaY * elasticFactor,
          maxPullDistance
        );
        setPullDistance(elasticDistance);

        // Check if threshold reached
        const ready = elasticDistance >= threshold;
        if (ready && !thresholdReachedRef.current) {
          thresholdReachedRef.current = true;
          setIsReady(true);
          onThresholdReached?.();
        } else if (!ready && thresholdReachedRef.current) {
          thresholdReachedRef.current = false;
          setIsReady(false);
        }

        // Prevent native scroll/bounce if pulling enough
        if (deltaY > 10) {
          e.preventDefault();
        }
      }
    },
    [
      isRefreshing,
      threshold,
      maxPullDistance,
      elasticFactor,
      onThresholdReached,
    ]
  );

  const handleTouchEnd = useCallback(async () => {
    if (pullDistance >= threshold && !isRefreshing) {
      // Trigger refresh
      setIsRefreshing(true);
      setIsReady(false);

      try {
        await onRefresh();
      } catch (error) {
        console.error('Pull-to-refresh error:', error);
      } finally {
        setIsRefreshing(false);
        setPullDistance(0);
      }
    } else {
      // Reset without refreshing
      setPullDistance(0);
      setIsReady(false);
    }

    startY.current = 0;
    thresholdReachedRef.current = false;
  }, [pullDistance, threshold, isRefreshing, onRefresh]);

  return {
    pullDistance,
    isRefreshing,
    isReady,
    containerRef,
    handlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
  };
}

/**
 * Get indicator position based on pull distance
 */
export function getIndicatorTransform(
  pullDistance: number,
  isRefreshing: boolean
): {
  transform: string;
  opacity: number;
} {
  if (isRefreshing) {
    return {
      transform: 'translateY(0px)',
      opacity: 1,
    };
  }

  return {
    transform: `translateY(${Math.max(-40, pullDistance - 40)}px)`,
    opacity: Math.min(pullDistance / 80, 1),
  };
}

/**
 * Get arrow rotation based on ready state
 */
export function getArrowRotation(isReady: boolean): string {
  return isReady ? 'rotate(180deg)' : 'rotate(0deg)';
}
