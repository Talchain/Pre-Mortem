import React, { useState, useEffect } from 'react';
import { Download, Mail, Share2, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { PreMortemAnalysis, AI_MODELS } from '@/types/premortem';
import { generateExecutiveSummary } from '@/services/aiService';
import { exportToPDF } from '@/services/pdfExport';

export interface SummaryStepProps {
  analysis: PreMortemAnalysis;
  onMarkExported: () => void;
}

export function SummaryStep({ analysis, onMarkExported }: SummaryStepProps) {
  const [summary, setSummary] = useState<string>('');
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [hasExported, setHasExported] = useState(false);

  const flaggedScenarios = analysis.scenarios.filter(
    (s) => s.flaggedAsConcerning
  );
  const priorityStrategies = analysis.mitigationStrategies.filter(
    (s) => s.priority
  );

  // Generate summary on mount
  useEffect(() => {
    generateSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const generateSummary = async () => {
    setIsGeneratingSummary(true);

    try {
      const topScenarios = flaggedScenarios.length > 0
        ? flaggedScenarios.slice(0, 3)
        : analysis.scenarios
            .sort((a, b) => {
              const scoreA =
                (a.impact === 'High' ? 3 : a.impact === 'Medium' ? 2 : 1) *
                (a.likelihood === 'High' ? 3 : a.likelihood === 'Medium' ? 2 : 1);
              const scoreB =
                (b.impact === 'High' ? 3 : b.impact === 'Medium' ? 2 : 1) *
                (b.likelihood === 'High' ? 3 : b.likelihood === 'Medium' ? 2 : 1);
              return scoreB - scoreA;
            })
            .slice(0, 3);

      const summaryText = await generateExecutiveSummary(
        {
          decisionTitle: analysis.decision.title,
          decisionDescription: analysis.decision.description,
          originalConfidence: analysis.decision.initialConfidence,
          adjustedConfidence: analysis.adjustedConfidence,
          topScenarios: topScenarios.map((s) => ({
            title: s.title,
            description: s.description,
          })),
          priorityActions: priorityStrategies.map((s) => ({
            title: s.title,
            description: s.description,
            owner: s.owner,
          })),
          keyInsight: analysis.keyInsight,
        },
        analysis.aiModel || AI_MODELS.anthropic[0]
      );

      setSummary(summaryText);
    } catch (error) {
      console.error('Error generating summary:', error);
      setSummary(
        'Unable to generate AI summary. Your analysis data is still available below.'
      );
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const handleExportPDF = async () => {
    setIsExporting(true);

    try {
      await exportToPDF(analysis, summary);
      setHasExported(true);
      onMarkExported();
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Failed to export PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const confidenceDelta =
    analysis.adjustedConfidence - analysis.decision.initialConfidence;

  if (isGeneratingSummary) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4">
        <Card variant="elevated" padding="lg">
          <LoadingSpinner
            size="lg"
            message="Generating your executive summary..."
          />
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 animate-fade-in">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-accent-success/10 rounded-full mb-4">
          <CheckCircle className="w-8 h-8 text-accent-success" />
        </div>

        <h2 className="text-3xl font-display font-bold text-neutral-900 mb-2">
          Pre-Mortem Complete!
        </h2>
        <p className="text-neutral-600">
          Here's your comprehensive analysis and action plan
        </p>
      </div>

      {/* Executive Summary */}
      <Card variant="elevated" padding="lg" className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-neutral-900">
            Executive Summary
          </h3>
          <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full">
            AI Generated
          </span>
        </div>

        <div className="prose prose-sm max-w-none text-neutral-700 leading-relaxed whitespace-pre-wrap">
          {summary}
        </div>
      </Card>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <Card variant="outlined" padding="md">
          <div className="text-center">
            <p className="text-sm text-neutral-600 mb-1">Original Confidence</p>
            <p className="text-3xl font-bold text-neutral-900">
              {analysis.decision.initialConfidence}
            </p>
          </div>
        </Card>

        <Card variant="outlined" padding="md">
          <div className="text-center">
            <p className="text-sm text-neutral-600 mb-1">Adjusted Confidence</p>
            <p className="text-3xl font-bold text-primary-600">
              {analysis.adjustedConfidence}
            </p>
          </div>
        </Card>

        <Card variant="outlined" padding="md">
          <div className="text-center">
            <p className="text-sm text-neutral-600 mb-1">Change</p>
            <p
              className={`text-3xl font-bold ${
                confidenceDelta > 0
                  ? 'text-accent-success'
                  : confidenceDelta < 0
                    ? 'text-accent-error'
                    : 'text-neutral-500'
              }`}
            >
              {confidenceDelta > 0 ? '+' : ''}
              {confidenceDelta}
            </p>
          </div>
        </Card>
      </div>

      {/* Key Insight */}
      {analysis.keyInsight && (
        <Card
          variant="elevated"
          padding="lg"
          className="mb-6 bg-gradient-to-br from-primary-50 to-secondary-50 border border-primary-100"
        >
          <h3 className="text-lg font-semibold text-neutral-900 mb-3">
            💡 Key Insight
          </h3>
          <blockquote className="text-lg italic text-neutral-800 border-l-4 border-primary-500 pl-4">
            "{analysis.keyInsight}"
          </blockquote>
        </Card>
      )}

      {/* Top Scenarios */}
      <Card variant="outlined" padding="lg" className="mb-6">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">
          Top Failure Scenarios to Monitor
        </h3>

        <div className="space-y-3">
          {flaggedScenarios.slice(0, 3).map((scenario, index) => (
            <div
              key={scenario.id}
              className="bg-neutral-50 rounded-lg p-4 border border-neutral-200"
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-accent-error text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-neutral-900 mb-1">
                    {scenario.title}
                  </h4>
                  <p className="text-sm text-neutral-600 mb-2">
                    {scenario.description}
                  </p>
                  <div className="flex gap-2">
                    <span className="text-xs bg-neutral-200 text-neutral-700 px-2 py-1 rounded">
                      {scenario.category}
                    </span>
                    <span className="text-xs bg-accent-warning/20 text-accent-warning px-2 py-1 rounded">
                      Likelihood: {scenario.likelihood}
                    </span>
                    <span className="text-xs bg-accent-error/20 text-accent-error px-2 py-1 rounded">
                      Impact: {scenario.impact}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Priority Actions */}
      <Card variant="outlined" padding="lg" className="mb-8">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">
          Priority Mitigation Strategies
        </h3>

        {priorityStrategies.length === 0 ? (
          <p className="text-neutral-600 text-center py-4">
            No strategies marked as priority
          </p>
        ) : (
          <div className="space-y-3">
            {priorityStrategies.map((strategy, index) => (
              <div
                key={strategy.id}
                className="bg-accent-success/5 rounded-lg p-4 border border-accent-success/20"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-accent-success text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-neutral-900 mb-1">
                      {strategy.title}
                    </h4>
                    <p className="text-sm text-neutral-600 mb-2">
                      {strategy.description}
                    </p>
                    <div className="flex gap-2">
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        Effort: {strategy.effort}
                      </span>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                        Impact: {strategy.impact}
                      </span>
                      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                        {strategy.timing}
                      </span>
                      {strategy.owner && (
                        <span className="text-xs bg-neutral-200 text-neutral-700 px-2 py-1 rounded">
                          Owner: {strategy.owner}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Export Options */}
      <Card variant="elevated" padding="lg" className="mb-8">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">
          Export & Share
        </h3>

        <div className="grid md:grid-cols-2 gap-4">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            icon={isExporting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
            onClick={handleExportPDF}
            loading={isExporting}
          >
            {hasExported ? 'Download Again' : 'Download PDF Report'}
          </Button>

          <Button
            variant="secondary"
            size="lg"
            fullWidth
            icon={<Share2 className="w-5 h-5" />}
            onClick={() => {
              // Copy URL to clipboard (in a real app, this would be a shareable link)
              navigator.clipboard.writeText(window.location.href);
              alert('Link copied to clipboard!');
            }}
          >
            Copy Link to Share
          </Button>
        </div>

        {hasExported && (
          <div className="mt-4 p-3 bg-accent-success/10 rounded-lg border border-accent-success/30">
            <p className="text-sm text-accent-success flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              PDF downloaded successfully!
            </p>
          </div>
        )}
      </Card>

      {/* Next Steps */}
      <Card variant="outlined" padding="lg">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">
          📋 Recommended Next Steps
        </h3>

        <ol className="space-y-2 text-sm text-neutral-700">
          <li className="flex items-start gap-2">
            <span className="flex-shrink-0 w-5 h-5 bg-primary-500 text-white rounded-full flex items-center justify-center text-xs">
              1
            </span>
            <span>
              <strong>Review with stakeholders:</strong> Share the PDF report
              with your team to get alignment on risks and mitigation strategies
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="flex-shrink-0 w-5 h-5 bg-primary-500 text-white rounded-full flex items-center justify-center text-xs">
              2
            </span>
            <span>
              <strong>Implement priority actions:</strong> Focus on high-impact,
              low-effort strategies first
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="flex-shrink-0 w-5 h-5 bg-primary-500 text-white rounded-full flex items-center justify-center text-xs">
              3
            </span>
            <span>
              <strong>Set up monitoring:</strong> Create checkpoints to watch for
              early warning signs of the scenarios you identified
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="flex-shrink-0 w-5 h-5 bg-primary-500 text-white rounded-full flex items-center justify-center text-xs">
              4
            </span>
            <span>
              <strong>Schedule a follow-up:</strong> Review this analysis in{' '}
              {analysis.decision.timeline} to see how accurate your predictions
              were
            </span>
          </li>
        </ol>
      </Card>

      {/* Footer */}
      <div className="text-center mt-8 pt-8 border-t border-neutral-200">
        <p className="text-sm text-neutral-500">
          Analysis completed on{' '}
          {new Date().toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })}
        </p>
        <p className="text-xs text-neutral-400 mt-2">
          Powered by Olumi Pre-Mortem Analysis Tool
        </p>
      </div>
    </div>
  );
}
