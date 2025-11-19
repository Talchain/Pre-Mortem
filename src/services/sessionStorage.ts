/**
 * Session Storage Service
 * Handles localStorage persistence for DecisionSession
 * Maintains privacy-first approach (all data stays client-side)
 */

import { DecisionSession } from '@/types/sharedModels';

const SESSION_KEY = 'olumi_decision_session';
const ARCHIVE_KEY = 'olumi_session_archive';
const MAX_ARCHIVE_SIZE = 10;

/**
 * Save current session to localStorage
 */
export function saveSession(session: DecisionSession): void {
  try {
    const serialized = JSON.stringify(session);
    localStorage.setItem(SESSION_KEY, serialized);
  } catch (error) {
    console.error('Failed to save session:', error);
    // Could implement fallback to sessionStorage or IndexedDB
  }
}

/**
 * Load current session from localStorage
 */
export function loadSession(): DecisionSession | null {
  try {
    const serialized = localStorage.getItem(SESSION_KEY);
    if (!serialized) return null;

    const session = JSON.parse(serialized) as DecisionSession;

    // Validate session structure
    if (!session.id || !session.decision || !session.conversation) {
      console.warn('Invalid session structure, clearing');
      clearSession();
      return null;
    }

    return session;
  } catch (error) {
    console.error('Failed to load session:', error);
    clearSession();
    return null;
  }
}

/**
 * Clear current session
 */
export function clearSession(): void {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch (error) {
    console.error('Failed to clear session:', error);
  }
}

/**
 * Archive completed session (for history/learning)
 */
export function archiveSession(session: DecisionSession): void {
  try {
    // Only archive completed sessions
    if (session.decision.status !== 'decided' && session.decision.status !== 'reviewed') {
      return;
    }

    const archive = loadArchive();

    // Add to beginning of archive
    archive.unshift({
      ...session,
      archived_at: new Date().toISOString(),
    });

    // Limit archive size
    if (archive.length > MAX_ARCHIVE_SIZE) {
      archive.length = MAX_ARCHIVE_SIZE;
    }

    localStorage.setItem(ARCHIVE_KEY, JSON.stringify(archive));
  } catch (error) {
    console.error('Failed to archive session:', error);
  }
}

/**
 * Load session archive
 */
export function loadArchive(): Array<DecisionSession & { archived_at: string }> {
  try {
    const serialized = localStorage.getItem(ARCHIVE_KEY);
    if (!serialized) return [];

    return JSON.parse(serialized);
  } catch (error) {
    console.error('Failed to load archive:', error);
    return [];
  }
}

/**
 * Get specific archived session
 */
export function getArchivedSession(
  sessionId: string
): (DecisionSession & { archived_at: string }) | null {
  const archive = loadArchive();
  return archive.find((s) => s.id === sessionId) || null;
}

/**
 * Delete archived session
 */
export function deleteArchivedSession(sessionId: string): void {
  try {
    const archive = loadArchive();
    const filtered = archive.filter((s) => s.id !== sessionId);
    localStorage.setItem(ARCHIVE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to delete archived session:', error);
  }
}

/**
 * Clear entire archive
 */
export function clearArchive(): void {
  try {
    localStorage.removeItem(ARCHIVE_KEY);
  } catch (error) {
    console.error('Failed to clear archive:', error);
  }
}

/**
 * Export session to JSON file
 */
export function exportSessionToFile(session: DecisionSession): void {
  try {
    const json = JSON.stringify(session, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `premortem-${session.id}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to export session:', error);
    throw new Error('Export failed');
  }
}

/**
 * Import session from JSON file
 */
export function importSessionFromFile(file: File): Promise<DecisionSession> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const session = JSON.parse(content) as DecisionSession;

        // Validate structure
        if (!session.id || !session.decision || !session.conversation) {
          throw new Error('Invalid session structure');
        }

        resolve(session);
      } catch (error) {
        reject(new Error('Failed to parse session file'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsText(file);
  });
}

/**
 * Get storage usage statistics
 */
export function getStorageStats(): {
  currentSize: number;
  archiveSize: number;
  totalSize: number;
  percentUsed: number;
} {
  try {
    const current = localStorage.getItem(SESSION_KEY) || '';
    const archive = localStorage.getItem(ARCHIVE_KEY) || '';

    const currentSize = new Blob([current]).size;
    const archiveSize = new Blob([archive]).size;
    const totalSize = currentSize + archiveSize;

    // localStorage typically has 5-10MB limit
    const storageLimit = 5 * 1024 * 1024; // 5MB conservative estimate
    const percentUsed = (totalSize / storageLimit) * 100;

    return {
      currentSize,
      archiveSize,
      totalSize,
      percentUsed,
    };
  } catch (error) {
    console.error('Failed to calculate storage stats:', error);
    return {
      currentSize: 0,
      archiveSize: 0,
      totalSize: 0,
      percentUsed: 0,
    };
  }
}

/**
 * Check if storage is available
 */
export function isStorageAvailable(): boolean {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}
