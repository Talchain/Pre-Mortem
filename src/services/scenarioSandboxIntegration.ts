/**
 * Scenario Sandbox Integration Service
 * Handles data handoff between Pre-Mortem tool and Scenario Sandbox
 */

import type { DecisionSession } from '@/types/sharedModels';

export interface ScenarioSandboxConfig {
  apiUrl: string;
  enabled: boolean;
  timeout?: number;
}

export interface HandoffPayload {
  type: 'pre-mortem-import';
  version: '2.0';
  decision: {
    question: string;
    context: string;
    options: Array<{
      name: string;
      description: string;
      confidence: number; // 0-1
    }>;
    factors: Array<{
      name: string;
      description: string;
      type: 'risk' | 'opportunity' | 'constraint' | 'assumption';
      importance: 'critical' | 'high' | 'medium' | 'low';
    }>;
    risks: Array<{
      title: string;
      description: string;
      likelihood: number; // 0-1
      impact: 'catastrophic' | 'major' | 'moderate' | 'minor';
      mitigations: string[];
      rootCauses: string[];
      warningSigns: string[];
    }>;
    stakeholders: Array<{
      name: string;
      role: string;
      influence: 'high' | 'medium' | 'low';
    }>;
  };
  metadata: {
    created_at: string;
    pre_mortem_id: string;
    source: 'pre-mortem-tool';
  };
}

export class ScenarioSandboxIntegrationService {
  private config: ScenarioSandboxConfig;

  constructor(config: ScenarioSandboxConfig) {
    this.config = config;
  }

  /**
   * Check if Scenario Sandbox is available
   */
  async checkAvailability(): Promise<{
    available: boolean;
    version?: string;
    error?: string;
  }> {
    if (!this.config.enabled) {
      return { available: false, error: 'Integration disabled' };
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.config.timeout || 5000);

      const response = await fetch(`${this.config.apiUrl}/health`, {
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        return {
          available: true,
          version: data.version || '1.0',
        };
      }

      return { available: false, error: `HTTP ${response.status}` };
    } catch (error) {
      if (error instanceof Error) {
        return { available: false, error: error.message };
      }
      return { available: false, error: 'Unknown error' };
    }
  }

  /**
   * Convert DecisionSession to Scenario Sandbox format
   */
  prepareHandoff(session: DecisionSession): HandoffPayload {
    return {
      type: 'pre-mortem-import',
      version: '2.0',
      decision: {
        question: session.decision.question,
        context: session.decision.context,
        options: session.decision.options.map((opt) => ({
          name: opt.title,
          description: opt.description || '',
          confidence: opt.confidence / 100, // Convert 0-100 to 0-1
        })),
        factors: session.decision.factors.map((factor) => ({
          name: factor.name,
          description: factor.description || '',
          type: factor.type,
          importance: factor.importance,
        })),
        risks:
          session.premortem?.failure_scenarios.map((scenario) => ({
            title: scenario.title,
            description: scenario.description,
            likelihood: scenario.likelihood / 100, // Convert 0-100 to 0-1
            impact: scenario.impact,
            mitigations:
              session.premortem?.mitigations
                .filter((m) => m.scenario_id === scenario.id)
                .map((m) => m.strategy) || [],
            rootCauses: scenario.root_causes,
            warningSigns: scenario.early_warning_signs,
          })) || [],
        stakeholders: session.decision.stakeholders.map((sh) => ({
          name: sh.name,
          role: sh.role,
          influence: sh.influence,
        })),
      },
      metadata: {
        created_at: session.created_at,
        pre_mortem_id: session.id,
        source: 'pre-mortem-tool',
      },
    };
  }

  /**
   * Send pre-mortem data to Scenario Sandbox
   */
  async sendToSandbox(session: DecisionSession): Promise<{
    success: boolean;
    sandboxUrl?: string;
    sessionId?: string;
    error?: string;
  }> {
    if (!this.config.enabled) {
      return { success: false, error: 'Integration disabled' };
    }

    const payload = this.prepareHandoff(session);

    try {
      const response = await fetch(`${this.config.apiUrl}/import`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          sandboxUrl: data.url || `${this.config.apiUrl}/session/${data.sessionId}`,
          sessionId: data.sessionId,
        };
      }

      return {
        success: false,
        error: `HTTP ${response.status}: ${await response.text()}`,
      };
    } catch (error) {
      if (error instanceof Error) {
        return { success: false, error: error.message };
      }
      return { success: false, error: 'Unknown error' };
    }
  }

  /**
   * Retrieve outcome from Scenario Sandbox (for post-mortem)
   */
  async retrieveOutcome(sessionId: string): Promise<{
    success: boolean;
    outcome?: {
      decision_made: string;
      outcome: 'success' | 'failure' | 'mixed';
      description: string;
      date: string;
    };
    error?: string;
  }> {
    if (!this.config.enabled) {
      return { success: false, error: 'Integration disabled' };
    }

    try {
      const response = await fetch(`${this.config.apiUrl}/export/${sessionId}`, {
        headers: {
          Accept: 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          outcome: data.outcome,
        };
      }

      return {
        success: false,
        error: `HTTP ${response.status}`,
      };
    } catch (error) {
      if (error instanceof Error) {
        return { success: false, error: error.message };
      }
      return { success: false, error: 'Unknown error' };
    }
  }
}

// Create singleton instance
export const scenarioSandbox = new ScenarioSandboxIntegrationService({
  apiUrl: import.meta.env.VITE_SCENARIO_SANDBOX_API_URL || 'http://localhost:3000/api',
  enabled: import.meta.env.VITE_ENABLE_SCENARIO_SANDBOX_INTEGRATION === 'true',
  timeout: 5000,
});
