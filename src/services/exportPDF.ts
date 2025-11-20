/**
 * PDF Export Service
 * Generates professional PDF reports from pre-mortem analysis
 * Uses jsPDF with Olumi branding
 */

import jsPDF from 'jspdf';
import { DecisionSession } from '@/types/sharedModels';
import { ExportOptions } from '@/components/export/ExportModal';

// Olumi brand colors
const COLORS = {
  primary: '#F5C433', // Sun-500
  ink: '#262626',
  inkLight: '#737373',
  paper: '#FEF9F3',
  border: '#E1D8C7',
};

export async function generatePDF(
  session: DecisionSession,
  options: ExportOptions
): Promise<void> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;
  let currentY = margin;

  // Helper function to check if we need a new page
  const checkPageBreak = (requiredSpace: number) => {
    if (currentY + requiredSpace > pageHeight - margin) {
      doc.addPage();
      currentY = margin;
      return true;
    }
    return false;
  };

  // Header with branding
  if (options.includeBranding) {
    doc.setFillColor(COLORS.primary);
    doc.rect(0, 0, pageWidth, 40, 'F');

    doc.setFontSize(24);
    doc.setTextColor(COLORS.ink);
    doc.setFont('helvetica', 'bold');
    doc.text('Olumi Pre-Mortem Analysis', margin, 25);

    currentY = 50;
  }

  // Title
  doc.setFontSize(18);
  doc.setTextColor(COLORS.ink);
  doc.setFont('helvetica', 'bold');
  const titleLines = doc.splitTextToSize(session.decision.question, contentWidth);
  doc.text(titleLines, margin, currentY);
  currentY += titleLines.length * 7 + 10;

  // Metadata
  doc.setFontSize(10);
  doc.setTextColor(COLORS.inkLight);
  doc.setFont('helvetica', 'normal');
  doc.text(
    `Generated: ${new Date(session.created_at).toLocaleDateString()} | Session ID: ${session.id.substring(0, 8)}`,
    margin,
    currentY
  );
  currentY += 15;

  // Context (if available)
  if (session.decision.context) {
    checkPageBreak(30);
    doc.setFontSize(12);
    doc.setTextColor(COLORS.ink);
    doc.setFont('helvetica', 'bold');
    doc.text('Decision Context', margin, currentY);
    currentY += 7;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(COLORS.ink);
    const contextLines = doc.splitTextToSize(session.decision.context, contentWidth);
    doc.text(contextLines, margin, currentY);
    currentY += contextLines.length * 5 + 10;
  }

  // Executive Summary
  checkPageBreak(40);
  doc.setFontSize(14);
  doc.setTextColor(COLORS.ink);
  doc.setFont('helvetica', 'bold');
  doc.text('Executive Summary', margin, currentY);
  currentY += 10;

  // Summary stats
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const stats = [
    `Scenarios Identified: ${session.premortem?.failure_scenarios.length || 0}`,
    `Mitigations Planned: ${session.premortem?.mitigations.length || 0}`,
    `Decision Options: ${session.decision.options.length}`,
    `Confidence Level: ${session.premortem?.confidence_level || 'N/A'}%`,
  ];

  stats.forEach((stat) => {
    doc.text(stat, margin, currentY);
    currentY += 6;
  });
  currentY += 10;

  // Failure Scenarios
  if (session.premortem && session.premortem.failure_scenarios.length > 0) {
    checkPageBreak(40);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(COLORS.ink);
    doc.text('Potential Failure Scenarios', margin, currentY);
    currentY += 10;

    session.premortem.failure_scenarios.forEach((scenario, index) => {
      checkPageBreak(50);

      // Scenario number
      doc.setFillColor(COLORS.primary);
      doc.circle(margin + 3, currentY - 2, 3, 'F');
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(COLORS.ink);
      doc.text(`${index + 1}`, margin + 1.5, currentY + 1);

      // Scenario title
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text(scenario.title, margin + 10, currentY);
      currentY += 7;

      // Scenario description
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      const descLines = doc.splitTextToSize(scenario.description, contentWidth - 10);
      doc.text(descLines, margin + 10, currentY);
      currentY += descLines.length * 5 + 3;

      // Impact and Likelihood
      doc.setFontSize(8);
      doc.setTextColor(COLORS.inkLight);
      doc.text(
        `Impact: ${scenario.impact.toUpperCase()} | Likelihood: ${scenario.likelihood}%`,
        margin + 10,
        currentY
      );
      currentY += 8;

      // Root causes (if available)
      if (scenario.root_causes && scenario.root_causes.length > 0) {
        doc.setFontSize(9);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(COLORS.inkLight);
        doc.text('Root causes:', margin + 10, currentY);
        currentY += 5;

        scenario.root_causes.forEach((cause) => {
          const causeLines = doc.splitTextToSize(`• ${cause}`, contentWidth - 15);
          doc.text(causeLines, margin + 15, currentY);
          currentY += causeLines.length * 4.5;
        });
      }

      currentY += 5;
    });
  }

  // Mitigation Strategies
  if (session.premortem && session.premortem.mitigations.length > 0) {
    checkPageBreak(40);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(COLORS.ink);
    doc.text('Mitigation Strategies', margin, currentY);
    currentY += 10;

    session.premortem.mitigations
      .filter((m) => m.priority)
      .forEach((mitigation, index) => {
        checkPageBreak(40);

        // Priority badge
        if (mitigation.priority) {
          doc.setFillColor('#67C89E'); // Mint-500
          doc.rect(margin, currentY - 5, 3, 5, 'F');
        }

        // Mitigation strategy
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(COLORS.ink);
        const strategyLines = doc.splitTextToSize(mitigation.strategy, contentWidth - 10);
        doc.text(strategyLines, margin + 6, currentY);
        currentY += strategyLines.length * 5 + 3;

        // Actions
        if (mitigation.actions && mitigation.actions.length > 0) {
          doc.setFontSize(9);
          doc.setFont('helvetica', 'normal');
          mitigation.actions.forEach((action) => {
            const actionLines = doc.splitTextToSize(`□ ${action}`, contentWidth - 12);
            doc.text(actionLines, margin + 8, currentY);
            currentY += actionLines.length * 4.5;
          });
        }

        // Metadata
        doc.setFontSize(8);
        doc.setTextColor(COLORS.inkLight);
        doc.text(
          `Effort: ${mitigation.effort.toUpperCase()} | Effectiveness: ${mitigation.effectiveness}% | Timing: ${mitigation.timing}`,
          margin + 6,
          currentY
        );
        currentY += 10;
      });
  }

  // Conversation History (if requested)
  if (options.includeConversation && session.conversation.length > 0) {
    checkPageBreak(40);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(COLORS.ink);
    doc.text('Conversation History', margin, currentY);
    currentY += 10;

    session.conversation.forEach((message) => {
      checkPageBreak(30);

      // Role label
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(message.role === 'user' ? COLORS.ink : COLORS.primary);
      doc.text(
        message.role === 'user' ? 'You' : 'Olumi',
        margin,
        currentY
      );
      currentY += 5;

      // Message content
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(COLORS.ink);
      const messageLines = doc.splitTextToSize(
        message.content,
        contentWidth - 5
      );
      doc.text(messageLines, margin + 5, currentY);
      currentY += messageLines.length * 4.5 + 8;
    });
  }

  // Diagnostics (if requested)
  if (options.includeDiagnostics && session.diagnostics) {
    checkPageBreak(40);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(COLORS.ink);
    doc.text('Diagnostics', margin, currentY);
    currentY += 10;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    const diagnosticsInfo = [
      `Total Processing Time: ${(session.diagnostics.totalProcessingTimeMs / 1000).toFixed(2)}s`,
      `API Calls: ${session.diagnostics.apiCalls.length}`,
      `Status: ${session.diagnostics.degraded ? 'Degraded' : 'Healthy'}`,
    ];

    diagnosticsInfo.forEach((info) => {
      doc.text(info, margin, currentY);
      currentY += 5;
    });
  }

  // Footer with branding
  if (options.includeBranding) {
    const footerY = pageHeight - 15;
    doc.setFontSize(8);
    doc.setTextColor(COLORS.inkLight);
    doc.setFont('helvetica', 'italic');
    doc.text(
      'Generated by Olumi Pre-Mortem Analysis Tool',
      pageWidth / 2,
      footerY,
      { align: 'center' }
    );
  }

  // Save the PDF
  const fileName = options.fileName || getDefaultFileName(session);
  doc.save(`${fileName}.pdf`);
}

function getDefaultFileName(session: DecisionSession): string {
  const timestamp = new Date().toISOString().split('T')[0];
  const sanitizedQuestion = session.decision.question
    .replace(/[^a-z0-9]/gi, '-')
    .toLowerCase()
    .substring(0, 50);
  return `premortem-${sanitizedQuestion}-${timestamp}`;
}
