/**
 * Haptic Feedback Manager
 * Provides tactile feedback for mobile interactions
 */

export type HapticType =
  | 'light'
  | 'medium'
  | 'heavy'
  | 'selection'
  | 'success'
  | 'warning'
  | 'error';

const HAPTICS_STORAGE_KEY = 'premortem.haptics.enabled';

/**
 * Haptics Manager Class
 */
class HapticsManager {
  private isSupported: boolean;
  private lastTriggerTime = 0;
  private readonly MIN_TRIGGER_INTERVAL = 50; // Minimum 50ms between haptics

  constructor() {
    // Check for haptic support
    this.isSupported = this.checkSupport();
  }

  private checkSupport(): boolean {
    // Check for various haptic APIs
    return (
      'vibrate' in navigator ||
      'Vibration' in window ||
      'TapticEngine' in window || // iOS
      'Haptics' in window // Some Android devices
    );
  }

  /**
   * Check if haptics are enabled in user preferences
   */
  isEnabled(): boolean {
    try {
      const stored = localStorage.getItem(HAPTICS_STORAGE_KEY);
      return stored !== 'false'; // Enabled by default
    } catch {
      return true;
    }
  }

  /**
   * Set haptics preference
   */
  setEnabled(enabled: boolean): void {
    try {
      localStorage.setItem(HAPTICS_STORAGE_KEY, String(enabled));
    } catch {
      console.warn('Could not save haptics preference');
    }
  }

  /**
   * Trigger a haptic feedback
   */
  trigger(type: HapticType): void {
    if (!this.isSupported || !this.isEnabled()) return;

    // Prevent too-frequent haptics (battery consideration)
    const now = Date.now();
    if (now - this.lastTriggerTime < this.MIN_TRIGGER_INTERVAL) {
      return;
    }
    this.lastTriggerTime = now;

    // Try iOS Taptic Engine first (best experience)
    if (this.triggerTaptic(type)) return;

    // Fall back to Vibration API
    this.triggerVibration(type);
  }

  /**
   * Try to trigger iOS Taptic Engine
   */
  private triggerTaptic(type: HapticType): boolean {
    // @ts-ignore - iOS Taptic Engine API
    if (!window.TapticEngine && !window.Haptics) return false;

    try {
      // iOS 13+ Haptic Feedback API
      if ('Haptics' in window) {
        // @ts-ignore
        const generator = new window.Haptics.Generator();

        const tapticMap: Record<HapticType, string> = {
          light: 'impactLight',
          medium: 'impactMedium',
          heavy: 'impactHeavy',
          selection: 'selection',
          success: 'notificationSuccess',
          warning: 'notificationWarning',
          error: 'notificationError',
        };

        const method = tapticMap[type];
        if (method && typeof generator[method] === 'function') {
          generator[method]();
          return true;
        }
      }

      // Legacy TapticEngine API
      // @ts-ignore
      if (window.TapticEngine) {
        // @ts-ignore
        window.TapticEngine.impact({ style: type });
        return true;
      }
    } catch (error) {
      console.warn('Taptic engine error:', error);
    }

    return false;
  }

  /**
   * Trigger vibration (Android fallback)
   */
  private triggerVibration(type: HapticType): void {
    if (!('vibrate' in navigator)) return;

    const patterns: Record<HapticType, number | number[]> = {
      light: 10,
      medium: 20,
      heavy: 30,
      selection: 5,
      success: [10, 30, 10],
      warning: [20, 50, 20],
      error: [30, 50, 30, 50, 30],
    };

    try {
      navigator.vibrate(patterns[type]);
    } catch (error) {
      console.warn('Vibration error:', error);
    }
  }

  /**
   * Stop any ongoing vibration
   */
  stop(): void {
    if ('vibrate' in navigator) {
      navigator.vibrate(0);
    }
  }
}

// Singleton instance
export const haptics = new HapticsManager();

// Convenience functions
export const triggerHaptic = (type: HapticType) => haptics.trigger(type);
export const isHapticsEnabled = () => haptics.isEnabled();
export const setHapticsEnabled = (enabled: boolean) =>
  haptics.setEnabled(enabled);
export const stopHaptics = () => haptics.stop();
