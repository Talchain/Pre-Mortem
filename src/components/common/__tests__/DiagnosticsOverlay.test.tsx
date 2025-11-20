/**
 * DiagnosticsOverlay Component Tests
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { DiagnosticsOverlay } from '../DiagnosticsOverlay';
import { Diagnostics } from '@/types/sharedModels';

describe('DiagnosticsOverlay', () => {
  const mockHealthyDiagnostics: Diagnostics = {
    apiCalls: [
      {
        step: 'scenario_generation',
        model: 'claude-3-5-sonnet-20241022',
        durationMs: 2500,
        status: 'success',
        tokensUsed: 1500,
      },
      {
        step: 'root_cause_analysis',
        model: 'claude-3-5-sonnet-20241022',
        durationMs: 3200,
        status: 'success',
        tokensUsed: 2100,
      },
    ],
    totalProcessingTimeMs: 5700,
    degraded: false,
  };

  const mockDegradedDiagnostics: Diagnostics = {
    apiCalls: [
      {
        step: 'scenario_generation',
        model: 'claude-3-5-sonnet-20241022',
        durationMs: 2500,
        status: 'success',
        tokensUsed: 1500,
      },
      {
        step: 'root_cause_analysis',
        model: 'claude-3-5-sonnet-20241022',
        durationMs: 30000,
        status: 'error',
        errorMessage: 'Request timeout after 30s',
      },
    ],
    totalProcessingTimeMs: 32500,
    degraded: true,
    degradedReason: 'AI service timeout - root cause analysis unavailable',
    warnings: ['Response exceeded timeout threshold', 'Partial results only'],
  };

  describe('Toggle Behavior', () => {
    it('should render in collapsed state by default', () => {
      render(<DiagnosticsOverlay diagnostics={mockHealthyDiagnostics} />);

      expect(screen.getByRole('button', { name: /toggle diagnostics/i })).toBeInTheDocument();
      expect(screen.queryByText(/Summary/i)).not.toBeInTheDocument();
    });

    it('should expand when toggle button is clicked', async () => {
      const user = userEvent.setup();
      render(<DiagnosticsOverlay diagnostics={mockHealthyDiagnostics} />);

      const toggleButton = screen.getByRole('button', { name: /toggle diagnostics/i });
      await user.click(toggleButton);

      expect(screen.getByText(/Summary/i)).toBeInTheDocument();
      expect(screen.getByText(/Processing Time/i)).toBeInTheDocument();
    });

    it('should collapse when toggle button is clicked again', async () => {
      const user = userEvent.setup();
      render(<DiagnosticsOverlay diagnostics={mockHealthyDiagnostics} />);

      const toggleButton = screen.getByRole('button', { name: /toggle diagnostics/i });
      await user.click(toggleButton);
      await user.click(toggleButton);

      expect(screen.queryByText(/Summary/i)).not.toBeInTheDocument();
    });
  });

  describe('Health Status Display', () => {
    it('should show healthy badge when not degraded', () => {
      render(<DiagnosticsOverlay diagnostics={mockHealthyDiagnostics} />);

      expect(screen.getByText(/✓ Healthy/i)).toBeInTheDocument();
    });

    it('should show degraded badge when degraded', () => {
      render(<DiagnosticsOverlay diagnostics={mockDegradedDiagnostics} />);

      expect(screen.getByText(/⚠ Degraded/i)).toBeInTheDocument();
    });
  });

  describe('Summary Statistics', () => {
    it('should display total processing time in seconds', async () => {
      const user = userEvent.setup();
      render(<DiagnosticsOverlay diagnostics={mockHealthyDiagnostics} />);

      await user.click(screen.getByRole('button', { name: /toggle diagnostics/i }));

      // 5700ms = 5.70s
      expect(screen.getByText('5.70s')).toBeInTheDocument();
    });

    it('should display API call count with success/failure breakdown', async () => {
      const user = userEvent.setup();
      render(<DiagnosticsOverlay diagnostics={mockDegradedDiagnostics} />);

      await user.click(screen.getByRole('button', { name: /toggle diagnostics/i }));

      expect(screen.getByText(/2 \(1 success, 1 failed\)/i)).toBeInTheDocument();
    });

    it('should display total token usage when available', async () => {
      const user = userEvent.setup();
      render(<DiagnosticsOverlay diagnostics={mockHealthyDiagnostics} />);

      await user.click(screen.getByRole('button', { name: /toggle diagnostics/i }));

      // 1500 + 2100 = 3600
      expect(screen.getByText('3,600')).toBeInTheDocument();
    });

    it('should not display token usage when not available', async () => {
      const user = userEvent.setup();
      const diagnosticsWithoutTokens: Diagnostics = {
        ...mockHealthyDiagnostics,
        apiCalls: mockHealthyDiagnostics.apiCalls.map((call) => ({
          ...call,
          tokensUsed: undefined,
        })),
      };

      render(<DiagnosticsOverlay diagnostics={diagnosticsWithoutTokens} />);

      await user.click(screen.getByRole('button', { name: /toggle diagnostics/i }));

      expect(screen.queryByText(/Total Tokens/i)).not.toBeInTheDocument();
    });
  });

  describe('Degraded Mode Display', () => {
    it('should show degraded section when degraded', async () => {
      const user = userEvent.setup();
      render(<DiagnosticsOverlay diagnostics={mockDegradedDiagnostics} />);

      await user.click(screen.getByRole('button', { name: /toggle diagnostics/i }));

      expect(screen.getByText(/⚠ Degraded Mode/i)).toBeInTheDocument();
      expect(
        screen.getByText(/AI service timeout - root cause analysis unavailable/i)
      ).toBeInTheDocument();
    });

    it('should not show degraded section when healthy', async () => {
      const user = userEvent.setup();
      render(<DiagnosticsOverlay diagnostics={mockHealthyDiagnostics} />);

      await user.click(screen.getByRole('button', { name: /toggle diagnostics/i }));

      expect(screen.queryByText(/⚠ Degraded Mode/i)).not.toBeInTheDocument();
    });
  });

  describe('Warnings Display', () => {
    it('should show warnings when present', async () => {
      const user = userEvent.setup();
      render(<DiagnosticsOverlay diagnostics={mockDegradedDiagnostics} />);

      await user.click(screen.getByRole('button', { name: /toggle diagnostics/i }));

      expect(screen.getByText(/Warnings/i)).toBeInTheDocument();
      expect(screen.getByText(/Response exceeded timeout threshold/i)).toBeInTheDocument();
      expect(screen.getByText(/Partial results only/i)).toBeInTheDocument();
    });

    it('should not show warnings section when no warnings', async () => {
      const user = userEvent.setup();
      render(<DiagnosticsOverlay diagnostics={mockHealthyDiagnostics} />);

      await user.click(screen.getByRole('button', { name: /toggle diagnostics/i }));

      expect(screen.queryByText(/^Warnings$/i)).not.toBeInTheDocument();
    });
  });

  describe('API Call Details', () => {
    it('should display all API calls with details', async () => {
      const user = userEvent.setup();
      render(<DiagnosticsOverlay diagnostics={mockHealthyDiagnostics} />);

      await user.click(screen.getByRole('button', { name: /toggle diagnostics/i }));

      expect(screen.getByText('Step 1')).toBeInTheDocument();
      expect(screen.getByText('Step 2')).toBeInTheDocument();
      expect(screen.getAllByText('claude-3-5-sonnet-20241022')).toHaveLength(2);
    });

    it('should show success status for successful calls', async () => {
      const user = userEvent.setup();
      render(<DiagnosticsOverlay diagnostics={mockHealthyDiagnostics} />);

      await user.click(screen.getByRole('button', { name: /toggle diagnostics/i }));

      const successBadges = screen.getAllByText(/✓ success/i);
      expect(successBadges).toHaveLength(2);
    });

    it('should show error status and message for failed calls', async () => {
      const user = userEvent.setup();
      render(<DiagnosticsOverlay diagnostics={mockDegradedDiagnostics} />);

      await user.click(screen.getByRole('button', { name: /toggle diagnostics/i }));

      expect(screen.getByText(/✗ error/i)).toBeInTheDocument();
      expect(screen.getByText(/Request timeout after 30s/i)).toBeInTheDocument();
    });

    it('should display processing time for each call', async () => {
      const user = userEvent.setup();
      render(<DiagnosticsOverlay diagnostics={mockHealthyDiagnostics} />);

      await user.click(screen.getByRole('button', { name: /toggle diagnostics/i }));

      // 2500ms = 2.50s, 3200ms = 3.20s
      expect(screen.getByText('2.50s')).toBeInTheDocument();
      expect(screen.getByText('3.20s')).toBeInTheDocument();
    });

    it('should display token usage for each call when available', async () => {
      const user = userEvent.setup();
      render(<DiagnosticsOverlay diagnostics={mockHealthyDiagnostics} />);

      await user.click(screen.getByRole('button', { name: /toggle diagnostics/i }));

      expect(screen.getByText('1,500')).toBeInTheDocument();
      expect(screen.getByText('2,100')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(<DiagnosticsOverlay diagnostics={mockHealthyDiagnostics} />);

      const toggleButton = screen.getByRole('button', { name: /toggle diagnostics/i });
      expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
    });

    it('should update aria-expanded when toggled', async () => {
      const user = userEvent.setup();
      render(<DiagnosticsOverlay diagnostics={mockHealthyDiagnostics} />);

      const toggleButton = screen.getByRole('button', { name: /toggle diagnostics/i });
      await user.click(toggleButton);

      expect(toggleButton).toHaveAttribute('aria-expanded', 'true');
    });
  });
});
