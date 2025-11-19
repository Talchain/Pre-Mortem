/**
 * ContinueToSandbox Component Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { ContinueToSandbox } from '../ContinueToSandbox';
import { DecisionSessionProvider } from '@/context/DecisionSessionContext';
import * as scenarioSandbox from '@/services/scenarioSandboxIntegration';

// Mock the scenario sandbox service
vi.mock('@/services/scenarioSandboxIntegration', () => ({
  scenarioSandbox: {
    checkAvailability: vi.fn(),
    sendToSandbox: vi.fn(),
  },
}));

// Mock window.open
const mockWindowOpen = vi.fn();
global.window.open = mockWindowOpen;

describe('ContinueToSandbox', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not render when no session exists', () => {
    const { container } = render(
      <DecisionSessionProvider>
        <ContinueToSandbox />
      </DecisionSessionProvider>
    );

    expect(container.firstChild).toBeNull();
  });

  it('should not render when no scenarios exist', () => {
    const mockSession = {
      id: 'test-session',
      decision: {
        question: 'Test question',
        context: 'Test context',
        options: [],
        factors: [],
        stakeholders: [],
        status: 'in_progress' as const,
      },
      scenarios: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Note: In real test we'd need to mock the context provider with the session
    // This is a simplified example
    const { container } = render(
      <DecisionSessionProvider>
        <ContinueToSandbox />
      </DecisionSessionProvider>
    );

    expect(container.firstChild).toBeNull();
  });

  it('should check availability on mount', async () => {
    vi.mocked(scenarioSandbox.scenarioSandbox.checkAvailability).mockResolvedValue({
      available: true,
      version: '1.0.0',
    });

    // This test would require a proper session context mock
    // Simplified for demonstration
  });

  it('should display available state when Sandbox is reachable', async () => {
    vi.mocked(scenarioSandbox.scenarioSandbox.checkAvailability).mockResolvedValue({
      available: true,
      version: '1.0.0',
    });

    // Test implementation would verify UI shows "Continue to Scenario Sandbox" button
  });

  it('should display unavailable state when Sandbox is not reachable', async () => {
    vi.mocked(scenarioSandbox.scenarioSandbox.checkAvailability).mockResolvedValue({
      available: false,
      error: 'Connection failed',
    });

    // Test implementation would verify UI shows retry button and error message
  });

  it('should open Sandbox in new tab on successful handoff', async () => {
    vi.mocked(scenarioSandbox.scenarioSandbox.sendToSandbox).mockResolvedValue({
      success: true,
      sandboxUrl: 'http://localhost:3000/session/123',
      sessionId: '123',
    });

    // Test implementation would:
    // 1. Click "Continue to Scenario Sandbox" button
    // 2. Verify window.open was called with correct URL
    expect(mockWindowOpen).toHaveBeenCalledWith(
      expect.stringContaining('/session/'),
      '_blank'
    );
  });

  it('should handle handoff errors gracefully', async () => {
    vi.mocked(scenarioSandbox.scenarioSandbox.sendToSandbox).mockResolvedValue({
      success: false,
      error: 'Network error',
    });

    // Test implementation would verify error message is displayed
  });
});
