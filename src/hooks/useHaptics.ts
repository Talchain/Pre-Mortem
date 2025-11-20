/**
 * useHaptics Hook
 * React hook for haptic feedback
 */

import { useCallback } from 'react';
import { haptics, HapticType } from '../utils/haptics';

export interface HapticsHook {
  light: () => void;
  medium: () => void;
  heavy: () => void;
  selection: () => void;
  success: () => void;
  warning: () => void;
  error: () => void;
  trigger: (type: HapticType) => void;
  isEnabled: () => boolean;
  setEnabled: (enabled: boolean) => void;
}

/**
 * Hook to access haptic feedback functions
 */
export function useHaptics(): HapticsHook {
  const triggerLight = useCallback(() => haptics.trigger('light'), []);
  const triggerMedium = useCallback(() => haptics.trigger('medium'), []);
  const triggerHeavy = useCallback(() => haptics.trigger('heavy'), []);
  const triggerSelection = useCallback(() => haptics.trigger('selection'), []);
  const triggerSuccess = useCallback(() => haptics.trigger('success'), []);
  const triggerWarning = useCallback(() => haptics.trigger('warning'), []);
  const triggerError = useCallback(() => haptics.trigger('error'), []);

  const trigger = useCallback((type: HapticType) => {
    haptics.trigger(type);
  }, []);

  const isEnabled = useCallback(() => {
    return haptics.isEnabled();
  }, []);

  const setEnabled = useCallback((enabled: boolean) => {
    haptics.setEnabled(enabled);
  }, []);

  return {
    light: triggerLight,
    medium: triggerMedium,
    heavy: triggerHeavy,
    selection: triggerSelection,
    success: triggerSuccess,
    warning: triggerWarning,
    error: triggerError,
    trigger,
    isEnabled,
    setEnabled,
  };
}
