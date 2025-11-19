import jsPDF from 'jspdf';
import { PreMortemAnalysis } from '@/types/premortem';

// Olumi brand colors
const PRIMARY_COLOR = '#6366F1'; // Indigo
const TEXT_COLOR = '#0F172A'; // Neutral 900
const SECONDARY_TEXT_COLOR = '#64748B'; // Neutral 500

/**
 * Export pre-mortem analysis to PDF
 */
export async function exportToPDF(
  analysis: PreMortemAnalysis,
  summary: string
): Promise<void> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Set document metadata
  doc.setProperties({
    title: `Pre-Mortem Analysis: ${analysis.decision.title}`,
    subject: 'Pre-Mortem Analysis Report',
    author: 'Olumi',
    creator: 'Olumi Pre-Mortem Tool',
  });

  // Helper function to add page header
  const addHeader = () => {
    // Header background
    doc.setFillColor(PRIMARY_COLOR);
    doc.rect(0, 0, 210, 40, 'F');

    // Title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('Pre-Mortem Analysis', 105, 15, { align: 'center' });

    // Decision title
    doc.setFontSize(16);
    doc.setFont('helvetica', 'normal');
    const decisionTitle = doc.splitTextToSize(analysis.decision.title, 180);
    doc.text(decisionTitle, 105, 28, { align: 'center' });

    // Date
    doc.setFontSize(10);
    doc.text(
      `Generated: ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`,
      105,
      35,
      { align: 'center' }
    );
  };

  // Helper function to add page footer
  const addFooter = (pageNum: number, totalPages: number) => {
    doc.setFontSize(8);
    doc.setTextColor(SECONDARY_TEXT_COLOR);
    doc.text(
      `Olumi Pre-Mortem Analysis | Page ${pageNum} of ${totalPages}`,
      105,
      290,
      { align: 'center' }
    );
    doc.text('Olumi.ai', 195, 290, { align: 'right' });
  };

  // Helper function to check if we need a new page
  const checkPageBreak = (yPos: number, spaceNeeded: number): number => {
    if (yPos + spaceNeeded > 270) {
      doc.addPage();
      return 20;
    }
    return yPos;
  };

  // Page 1
  addHeader();

  let yPosition = 50;

  // Executive Summary Section
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(TEXT_COLOR);
  doc.text('Executive Summary', 15, yPosition);
  yPosition += 7;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const summaryLines = doc.splitTextToSize(summary, 180);
  doc.text(summaryLines, 15, yPosition);
  yPosition += summaryLines.length * 5 + 10;

  // Decision Overview
  yPosition = checkPageBreak(yPosition, 40);

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Decision Overview', 15, yPosition);
  yPosition += 7;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');

  // Decision description
  const descLines = doc.splitTextToSize(
    analysis.decision.description,
    170
  );
  doc.text(descLines, 20, yPosition);
  yPosition += descLines.length * 5 + 5;

  // Decision metadata
  doc.setFontSize(9);
  doc.setTextColor(SECONDARY_TEXT_COLOR);
  doc.text(`Type: ${analysis.decision.type}`, 20, yPosition);
  yPosition += 5;
  doc.text(`Timeline: ${analysis.decision.timeline}`, 20, yPosition);
  yPosition += 5;

  if (analysis.decision.stakeholders && analysis.decision.stakeholders.length > 0) {
    doc.text(
      `Stakeholders: ${analysis.decision.stakeholders.join(', ')}`,
      20,
      yPosition
    );
    yPosition += 5;
  }

  yPosition += 5;
  doc.setTextColor(TEXT_COLOR);

  // Confidence Assessment
  yPosition = checkPageBreak(yPosition, 30);

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Confidence Assessment', 15, yPosition);
  yPosition += 7;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(
    `Original Confidence: ${analysis.decision.initialConfidence}/100`,
    20,
    yPosition
  );
  yPosition += 6;

  doc.text(
    `Adjusted Confidence: ${analysis.adjustedConfidence}/100`,
    20,
    yPosition
  );
  yPosition += 6;

  const confidenceDelta =
    analysis.adjustedConfidence - analysis.decision.initialConfidence;
  const deltaText =
    confidenceDelta > 0
      ? `+${confidenceDelta} points (increased)`
      : confidenceDelta < 0
        ? `${confidenceDelta} points (decreased)`
        : 'No change';

  doc.setFont('helvetica', 'bold');
  doc.text(`Change: ${deltaText}`, 20, yPosition);
  yPosition += 10;

  // Top Failure Scenarios
  yPosition = checkPageBreak(yPosition, 40);

  doc.setFontSize(14);
  doc.text('Top Failure Scenarios to Monitor', 15, yPosition);
  yPosition += 7;

  const flaggedScenarios = analysis.scenarios
    .filter((s) => s.flaggedAsConcerning)
    .slice(0, 3);

  if (flaggedScenarios.length === 0) {
    // If no flagged scenarios, show top 3 by impact/likelihood
    const sortedScenarios = [...analysis.scenarios]
      .sort((a, b) => {
        const scoreA = (a.impact === 'High' ? 3 : a.impact === 'Medium' ? 2 : 1) *
                       (a.likelihood === 'High' ? 3 : a.likelihood === 'Medium' ? 2 : 1);
        const scoreB = (b.impact === 'High' ? 3 : b.impact === 'Medium' ? 2 : 1) *
                       (b.likelihood === 'High' ? 3 : b.likelihood === 'Medium' ? 2 : 1);
        return scoreB - scoreA;
      })
      .slice(0, 3);

    flaggedScenarios.push(...sortedScenarios);
  }

  flaggedScenarios.forEach((scenario, index) => {
    yPosition = checkPageBreak(yPosition, 35);

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    const scenarioTitle = doc.splitTextToSize(
      `${index + 1}. ${scenario.title}`,
      170
    );
    doc.text(scenarioTitle, 20, yPosition);
    yPosition += scenarioTitle.length * 5 + 2;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const descLines = doc.splitTextToSize(scenario.description, 165);
    doc.text(descLines, 25, yPosition);
    yPosition += descLines.length * 5 + 2;

    doc.setFontSize(9);
    doc.setTextColor(SECONDARY_TEXT_COLOR);
    doc.text(
      `Likelihood: ${scenario.likelihood} | Impact: ${scenario.impact} | Category: ${scenario.category}`,
      25,
      yPosition
    );
    doc.setTextColor(TEXT_COLOR);
    yPosition += 8;
  });

  // Priority Mitigation Strategies
  yPosition = checkPageBreak(yPosition, 40);

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Priority Mitigation Strategies', 15, yPosition);
  yPosition += 7;

  const priorityStrategies = analysis.mitigationStrategies
    .filter((s) => s.priority)
    .slice(0, 5);

  if (priorityStrategies.length === 0) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.text('No priority strategies identified.', 20, yPosition);
    yPosition += 10;
  } else {
    priorityStrategies.forEach((strategy, index) => {
      yPosition = checkPageBreak(yPosition, 40);

      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      const stratTitle = doc.splitTextToSize(
        `${index + 1}. ${strategy.title}`,
        170
      );
      doc.text(stratTitle, 20, yPosition);
      yPosition += stratTitle.length * 5 + 2;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const stratLines = doc.splitTextToSize(strategy.description, 165);
      doc.text(stratLines, 25, yPosition);
      yPosition += stratLines.length * 5 + 2;

      doc.setFontSize(9);
      doc.setTextColor(SECONDARY_TEXT_COLOR);
      const metadata = `Effort: ${strategy.effort} | Impact: ${strategy.impact} | Timing: ${strategy.timing}${strategy.owner ? ` | Owner: ${strategy.owner}` : ''}`;
      const metaLines = doc.splitTextToSize(metadata, 165);
      doc.text(metaLines, 25, yPosition);
      doc.setTextColor(TEXT_COLOR);
      yPosition += metaLines.length * 5 + 6;
    });
  }

  // Key Insight
  if (analysis.keyInsight) {
    yPosition = checkPageBreak(yPosition, 25);

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Key Insight', 15, yPosition);
    yPosition += 7;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'italic');
    const insightLines = doc.splitTextToSize(
      `"${analysis.keyInsight}"`,
      170
    );
    doc.text(insightLines, 20, yPosition);
  }

  // Add footers to all pages
  const pageCount = doc.internal.pages.length - 1; // -1 because pages array includes a null first element
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    addFooter(i, pageCount);
  }

  // Save the PDF
  const filename = `PreMortem_${analysis.decision.title.replace(/[^a-z0-9]/gi, '_').substring(0, 30)}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(filename);
}
