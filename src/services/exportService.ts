/**
 * Export Service
 * Unified service for handling all export formats
 */

import { DecisionSession } from '@/types/sharedModels';
import { ExportFormat, ExportOptions } from '@/components/export/ExportModal';
import { generatePDF } from './exportPDF';
import { generateMarkdown } from './exportMarkdown';

export async function exportSession(
  session: DecisionSession,
  format: ExportFormat,
  options: ExportOptions
): Promise<void> {
  try {
    switch (format) {
      case 'pdf':
        await generatePDF(session, options);
        break;
      case 'markdown':
        await generateMarkdown(session, options);
        break;
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
  } catch (error) {
    console.error('Export failed:', error);
    throw error;
  }
}

/**
 * Validate that a session has sufficient data for export
 */
export function canExportSession(session: DecisionSession | null): boolean {
  if (!session) return false;
  if (!session.decision.question) return false;

  // Should have at least started analysis
  return session.decision.status !== 'framing';
}

/**
 * Get export recommendations based on session data
 */
export function getExportRecommendations(session: DecisionSession): {
  includeConversation: boolean;
  includeDiagnostics: boolean;
} {
  return {
    includeConversation: session.conversation.length > 2, // More than initial greeting
    includeDiagnostics: !!session.diagnostics && session.diagnostics.apiCalls.length > 0,
  };
}
