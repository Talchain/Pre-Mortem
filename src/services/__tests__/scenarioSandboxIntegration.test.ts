/**
 * ScenarioSandboxIntegrationService Unit Tests
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ScenarioSandboxIntegrationService } from '../scenarioSandboxIntegration';
import { DecisionSession } from '@/types/sharedModels';

describe('ScenarioSandboxIntegrationService', () => {
  let service: ScenarioSandboxIntegrationService;
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    // Mock fetch
    fetchMock = vi.fn();
    global.fetch = fetchMock as any;

    // Create service instance
    service = new ScenarioSandboxIntegrationService({
      apiUrl: 'http://localhost:3000/api',
      enabled: true,
      timeout: 5000,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('checkAvailability', () => {
    it('should return available when Sandbox is reachable', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ version: '1.0.0' }),
      });

      const result = await service.checkAvailability();

      expect(result.available).toBe(true);
      expect(result.version).toBe('1.0.0');
      expect(result.error).toBeUndefined();
    });

    it('should return unavailable when Sandbox is not reachable', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: false,
        status: 503,
      });

      const result = await service.checkAvailability();

      expect(result.available).toBe(false);
      expect(result.error).toBe('HTTP 503');
    });

    it('should return unavailable when integration is disabled', async () => {
      const disabledService = new ScenarioSandboxIntegrationService({
        apiUrl: 'http://localhost:3000/api',
        enabled: false,
        timeout: 5000,
      });

      const result = await disabledService.checkAvailability();

      expect(result.available).toBe(false);
      expect(result.error).toBe('Integration disabled');
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it('should handle network errors', async () => {
      fetchMock.mockRejectedValueOnce(new Error('Network error'));

      const result = await service.checkAvailability();

      expect(result.available).toBe(false);
      expect(result.error).toBe('Network error');
    });

    it('should timeout after configured duration', async () => {
      const slowService = new ScenarioSandboxIntegrationService({
        apiUrl: 'http://localhost:3000/api',
        enabled: true,
        timeout: 100,
      });

      // Mock a request that will be aborted
      fetchMock.mockImplementationOnce(
        (input, init) =>
          new Promise((resolve, reject) => {
            init?.signal?.addEventListener('abort', () => {
              reject(new DOMException('The operation was aborted', 'AbortError'));
            });
            setTimeout(() => resolve({
              ok: true,
              json: async () => ({ version: '1.0.0' })
            }), 200);
          })
      );

      const result = await slowService.checkAvailability();

      expect(result.available).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('prepareHandoff', () => {
    const mockSession: DecisionSession = {
      id: 'test-session-id',
      type: 'pre-mortem',
      created_at: '2025-01-01T00:00:00.000Z',
      updated_at: '2025-01-01T00:00:00.000Z',
      decision: {
        question: 'Should we launch product X?',
        context: 'Market analysis suggests strong demand',
        options: [
          {
            id: 'opt1',
            title: 'Launch now',
            description: 'Go to market immediately',
            confidence: 75,
            ai_generated: true,
            created_at: '2025-01-01T00:00:00.000Z',
          },
          {
            id: 'opt2',
            title: 'Wait 6 months',
            description: 'Delay for more development',
            confidence: 60,
            ai_generated: true,
            created_at: '2025-01-01T00:00:00.000Z',
          },
        ],
        factors: [],
        stakeholders: [],
        status: 'active',
      },
      conversation: [],
      premortem: {
        failure_scenarios: [
          {
            id: 'scenario1',
            title: 'Product fails to gain traction',
            description: 'Low user adoption',
            likelihood: 40,
            impact: 'major',
            root_causes: ['Poor market fit'],
            early_warning_signs: ['Low pre-orders'],
            related_factors: [],
            created_at: '2025-01-01T00:00:00.000Z',
          },
        ],
        mitigations: [
          {
            id: 'mitigation1',
            scenario_id: 'scenario1',
            strategy: 'Market research',
            actions: ['Conduct customer surveys'],
            effort: 'medium',
            effectiveness: 75,
            timing: 'pre-decision',
            priority: true,
            created_at: '2025-01-01T00:00:00.000Z',
          },
        ],
        evidence: [],
        confidence_level: 75,
        generated_at: '2025-01-01T00:00:00.000Z',
      },
    };

    it('should convert DecisionSession to HandoffPayload format', () => {
      const payload = service.prepareHandoff(mockSession);

      expect(payload.type).toBe('pre-mortem-import');
      expect(payload.version).toBe('2.0');
      expect(payload.decision.question).toBe('Should we launch product X?');
      expect(payload.decision.options).toHaveLength(2);
      expect(payload.metadata.pre_mortem_id).toBe('test-session-id');
      expect(payload.metadata.source).toBe('pre-mortem-tool');
    });

    it('should normalize confidence scores from 0-100 to 0-1', () => {
      const payload = service.prepareHandoff(mockSession);

      expect(payload.decision.options[0].confidence).toBe(0.75);
      expect(payload.decision.options[1].confidence).toBe(0.6);
    });

    it('should normalize likelihood scores from 0-100 to 0-1', () => {
      const payload = service.prepareHandoff(mockSession);

      expect(payload.decision.risks[0].likelihood).toBe(0.4);
    });

    it('should map impact levels correctly', () => {
      const payload = service.prepareHandoff(mockSession);

      expect(payload.decision.risks[0].impact).toBe('major');
    });

    it('should include all failure scenarios as risks', () => {
      const payload = service.prepareHandoff(mockSession);

      expect(payload.decision.risks).toHaveLength(1);
      expect(payload.decision.risks[0].title).toBe('Product fails to gain traction');
      expect(payload.decision.risks[0].description).toBe('Low user adoption');
      expect(payload.decision.risks[0].mitigations).toEqual(['Market research']);
      expect(payload.decision.risks[0].rootCauses).toEqual(['Poor market fit']);
      expect(payload.decision.risks[0].warningSigns).toEqual(['Low pre-orders']);
    });
  });

  describe('sendToSandbox', () => {
    const mockSession: DecisionSession = {
      id: 'test-session-id',
      type: 'pre-mortem',
      created_at: '2025-01-01T00:00:00.000Z',
      updated_at: '2025-01-01T00:00:00.000Z',
      decision: {
        question: 'Test decision',
        context: 'Test context',
        options: [],
        factors: [],
        stakeholders: [],
        status: 'active',
      },
      conversation: [],
    };

    it('should successfully send data to Sandbox', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          sessionId: 'sandbox-session-123',
          url: 'http://localhost:3000/session/sandbox-session-123',
        }),
      });

      const result = await service.sendToSandbox(mockSession);

      expect(result.success).toBe(true);
      expect(result.sandboxUrl).toBe('http://localhost:3000/session/sandbox-session-123');
      expect(result.sessionId).toBe('sandbox-session-123');
      expect(result.error).toBeUndefined();
    });

    it('should return error when integration is disabled', async () => {
      const disabledService = new ScenarioSandboxIntegrationService({
        apiUrl: 'http://localhost:3000/api',
        enabled: false,
        timeout: 5000,
      });

      const result = await disabledService.sendToSandbox(mockSession);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Integration disabled');
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it('should handle HTTP errors', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: false,
        status: 400,
        text: async () => 'Bad Request',
      });

      const result = await service.sendToSandbox(mockSession);

      expect(result.success).toBe(false);
      expect(result.error).toContain('HTTP 400');
    });

    it('should handle network errors', async () => {
      fetchMock.mockRejectedValueOnce(new Error('Network failure'));

      const result = await service.sendToSandbox(mockSession);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Network failure');
    });

    it('should send correct payload format', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ sessionId: 'test', url: 'http://test' }),
      });

      await service.sendToSandbox(mockSession);

      expect(fetchMock).toHaveBeenCalledWith(
        'http://localhost:3000/api/import',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: expect.any(String),
        })
      );

      const callArgs = fetchMock.mock.calls[0];
      const body = JSON.parse(callArgs[1].body);

      expect(body.type).toBe('pre-mortem-import');
      expect(body.version).toBe('2.0');
    });
  });

  describe('retrieveOutcome', () => {
    it('should retrieve outcome data from Sandbox', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          sessionId: 'sandbox-123',
          outcome: {
            decision_made: 'Launch now',
            actual_result: 'Success',
            metrics: {
              revenue: 1000000,
              users: 50000,
            },
          },
        }),
      });

      const result = await service.retrieveOutcome('sandbox-123');

      expect(result.success).toBe(true);
      expect(result.outcome).toBeDefined();
      expect(result.outcome?.decision_made).toBe('Launch now');
    });

    it('should return error when integration is disabled', async () => {
      const disabledService = new ScenarioSandboxIntegrationService({
        apiUrl: 'http://localhost:3000/api',
        enabled: false,
        timeout: 5000,
      });

      const result = await disabledService.retrieveOutcome('test-id');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Integration disabled');
    });

    it('should handle not found errors', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: false,
        status: 404,
        text: async () => 'Session not found',
      });

      const result = await service.retrieveOutcome('invalid-id');

      expect(result.success).toBe(false);
      expect(result.error).toContain('HTTP 404');
    });
  });
});
