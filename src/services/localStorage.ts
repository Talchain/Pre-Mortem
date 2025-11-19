import { PreMortemAnalysis } from '@/types/premortem';

const STORAGE_KEY = 'olumi-premortem-current';
const HISTORY_KEY = 'olumi-premortem-history';

/**
 * Save current analysis to localStorage
 */
export function saveAnalysis(analysis: PreMortemAnalysis): void {
  try {
    const serialized = JSON.stringify({
      ...analysis,
      updatedAt: new Date().toISOString(),
    });
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch (error) {
    console.error('Failed to save analysis to localStorage:', error);
  }
}

/**
 * Load current analysis from localStorage
 */
export function loadAnalysis(): PreMortemAnalysis | null {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (!serialized) return null;

    const parsed = JSON.parse(serialized);

    // Convert ISO strings back to Date objects
    return {
      ...parsed,
      createdAt: new Date(parsed.createdAt),
      updatedAt: new Date(parsed.updatedAt),
      exportedAt: parsed.exportedAt ? new Date(parsed.exportedAt) : undefined,
    };
  } catch (error) {
    console.error('Failed to load analysis from localStorage:', error);
    return null;
  }
}

/**
 * Clear current analysis from localStorage
 */
export function clearCurrentAnalysis(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear analysis from localStorage:', error);
  }
}

/**
 * Archive completed analysis to history
 */
export function archiveAnalysis(analysis: PreMortemAnalysis): void {
  try {
    const history = getAnalysisHistory();
    history.unshift({
      ...analysis,
      completionStatus: 'completed',
      exportedAt: new Date(),
    });

    // Keep only last 10 analyses
    const trimmedHistory = history.slice(0, 10);

    localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmedHistory));
  } catch (error) {
    console.error('Failed to archive analysis:', error);
  }
}

/**
 * Get analysis history
 */
export function getAnalysisHistory(): PreMortemAnalysis[] {
  try {
    const serialized = localStorage.getItem(HISTORY_KEY);
    if (!serialized) return [];

    const parsed = JSON.parse(serialized);

    // Convert ISO strings back to Date objects
    return parsed.map((item: PreMortemAnalysis) => ({
      ...item,
      createdAt: new Date(item.createdAt),
      updatedAt: new Date(item.updatedAt),
      exportedAt: item.exportedAt ? new Date(item.exportedAt) : undefined,
    }));
  } catch (error) {
    console.error('Failed to load analysis history:', error);
    return [];
  }
}

/**
 * Delete analysis from history
 */
export function deleteFromHistory(analysisId: string): void {
  try {
    const history = getAnalysisHistory();
    const filtered = history.filter((item) => item.id !== analysisId);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to delete from history:', error);
  }
}

/**
 * Clear all data (for privacy/reset)
 */
export function clearAllData(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(HISTORY_KEY);
  } catch (error) {
    console.error('Failed to clear all data:', error);
  }
}
