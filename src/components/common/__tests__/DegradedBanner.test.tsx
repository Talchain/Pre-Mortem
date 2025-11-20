/**
 * DegradedBanner Component Tests
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { DegradedBanner } from '../DegradedBanner';

describe('DegradedBanner', () => {
  const defaultProps = {
    reason: 'AI service is temporarily unavailable due to high demand.',
    affectedFeatures: [
      'Automatic scenario generation',
      'Root cause analysis',
      'Mitigation suggestions',
    ],
  };

  describe('Content Display', () => {
    it('should render the main title', () => {
      render(<DegradedBanner {...defaultProps} />);

      expect(
        screen.getByText(/Analysis incomplete — AI service temporarily unavailable/i)
      ).toBeInTheDocument();
    });

    it('should display the reason message', () => {
      render(<DegradedBanner {...defaultProps} />);

      expect(
        screen.getByText(/AI service is temporarily unavailable due to high demand/i)
      ).toBeInTheDocument();
    });

    it('should list all affected features', () => {
      render(<DegradedBanner {...defaultProps} />);

      expect(screen.getByText(/Automatic scenario generation/i)).toBeInTheDocument();
      expect(screen.getByText(/Root cause analysis/i)).toBeInTheDocument();
      expect(screen.getByText(/Mitigation suggestions/i)).toBeInTheDocument();
    });

    it('should not show affected features section when list is empty', () => {
      render(<DegradedBanner {...defaultProps} affectedFeatures={[]} />);

      expect(screen.queryByText(/Affected features:/i)).not.toBeInTheDocument();
    });

    it('should display help text', () => {
      render(<DegradedBanner {...defaultProps} />);

      expect(
        screen.getByText(/Your progress has been saved/i)
      ).toBeInTheDocument();
    });

    it('should have alert role for accessibility', () => {
      const { container } = render(<DegradedBanner {...defaultProps} />);

      const banner = container.querySelector('[role="alert"]');
      expect(banner).toBeInTheDocument();
    });
  });

  describe('Action Buttons', () => {
    it('should render manual entry button when handler provided', () => {
      const onEnableManualMode = vi.fn();

      render(<DegradedBanner {...defaultProps} onEnableManualMode={onEnableManualMode} />);

      expect(screen.getByText(/Continue with Manual Entry/i)).toBeInTheDocument();
    });

    it('should call onEnableManualMode when manual entry button clicked', async () => {
      const user = userEvent.setup();
      const onEnableManualMode = vi.fn();

      render(<DegradedBanner {...defaultProps} onEnableManualMode={onEnableManualMode} />);

      await user.click(screen.getByText(/Continue with Manual Entry/i));

      expect(onEnableManualMode).toHaveBeenCalledTimes(1);
    });

    it('should not render manual entry button when handler not provided', () => {
      render(<DegradedBanner {...defaultProps} />);

      expect(screen.queryByText(/Continue with Manual Entry/i)).not.toBeInTheDocument();
    });

    it('should render retry button when handler provided', () => {
      const onRetry = vi.fn();

      render(<DegradedBanner {...defaultProps} onRetry={onRetry} />);

      expect(screen.getByText(/Retry AI Analysis/i)).toBeInTheDocument();
    });

    it('should call onRetry when retry button clicked', async () => {
      const user = userEvent.setup();
      const onRetry = vi.fn();

      render(<DegradedBanner {...defaultProps} onRetry={onRetry} />);

      await user.click(screen.getByText(/Retry AI Analysis/i));

      expect(onRetry).toHaveBeenCalledTimes(1);
    });

    it('should not render retry button when handler not provided', () => {
      render(<DegradedBanner {...defaultProps} />);

      expect(screen.queryByText(/Retry AI Analysis/i)).not.toBeInTheDocument();
    });

    it('should render both buttons when both handlers provided', () => {
      const onEnableManualMode = vi.fn();
      const onRetry = vi.fn();

      render(
        <DegradedBanner
          {...defaultProps}
          onEnableManualMode={onEnableManualMode}
          onRetry={onRetry}
        />
      );

      expect(screen.getByText(/Continue with Manual Entry/i)).toBeInTheDocument();
      expect(screen.getByText(/Retry AI Analysis/i)).toBeInTheDocument();
    });
  });

  describe('Dismiss Functionality', () => {
    it('should render dismiss button', () => {
      render(<DegradedBanner {...defaultProps} />);

      expect(screen.getByRole('button', { name: /dismiss banner/i })).toBeInTheDocument();
    });

    it('should remove banner when dismiss button clicked', async () => {
      const user = userEvent.setup();
      render(<DegradedBanner {...defaultProps} />);

      const dismissButton = screen.getByRole('button', { name: /dismiss banner/i });
      await user.click(dismissButton);

      expect(
        screen.queryByText(/Analysis incomplete — AI service temporarily unavailable/i)
      ).not.toBeInTheDocument();
    });

    it('should call onDismiss callback when dismiss button clicked', async () => {
      const user = userEvent.setup();
      const onDismiss = vi.fn();

      render(<DegradedBanner {...defaultProps} onDismiss={onDismiss} />);

      const dismissButton = screen.getByRole('button', { name: /dismiss banner/i });
      await user.click(dismissButton);

      expect(onDismiss).toHaveBeenCalledTimes(1);
    });

    it('should not call onDismiss if not provided', async () => {
      const user = userEvent.setup();

      // Should not throw error
      render(<DegradedBanner {...defaultProps} />);

      const dismissButton = screen.getByRole('button', { name: /dismiss banner/i });
      await user.click(dismissButton);

      // No error expected
    });
  });

  describe('Custom className', () => {
    it('should apply custom className', () => {
      const { container } = render(
        <DegradedBanner {...defaultProps} className="custom-class" />
      );

      const banner = container.querySelector('.custom-class');
      expect(banner).toBeInTheDocument();
    });
  });

  describe('Integration Scenario', () => {
    it('should handle complete user flow: dismiss after reading', async () => {
      const user = userEvent.setup();
      const onDismiss = vi.fn();

      render(<DegradedBanner {...defaultProps} onDismiss={onDismiss} />);

      // User reads the banner
      expect(screen.getByText(/AI service is temporarily unavailable/i)).toBeInTheDocument();

      // User dismisses
      await user.click(screen.getByRole('button', { name: /dismiss banner/i }));

      // Banner removed
      expect(
        screen.queryByText(/Analysis incomplete — AI service temporarily unavailable/i)
      ).not.toBeInTheDocument();

      // Callback invoked
      expect(onDismiss).toHaveBeenCalledTimes(1);
    });

    it('should handle complete user flow: retry after error', async () => {
      const user = userEvent.setup();
      const onRetry = vi.fn();

      render(<DegradedBanner {...defaultProps} onRetry={onRetry} />);

      // User reads the error
      expect(screen.getByText(/AI service is temporarily unavailable/i)).toBeInTheDocument();

      // User clicks retry
      await user.click(screen.getByText(/Retry AI Analysis/i));

      // Callback invoked
      expect(onRetry).toHaveBeenCalledTimes(1);
    });

    it('should handle complete user flow: switch to manual mode', async () => {
      const user = userEvent.setup();
      const onEnableManualMode = vi.fn();

      render(<DegradedBanner {...defaultProps} onEnableManualMode={onEnableManualMode} />);

      // User reads the error
      expect(screen.getByText(/AI service is temporarily unavailable/i)).toBeInTheDocument();

      // User chooses manual entry
      await user.click(screen.getByText(/Continue with Manual Entry/i));

      // Callback invoked
      expect(onEnableManualMode).toHaveBeenCalledTimes(1);
    });
  });
});
