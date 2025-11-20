/**
 * useTemplateApplication Hook
 * Handles applying templates to create new decision sessions
 */

import { useState, useCallback } from 'react';
import { PreMortemTemplate } from '@/types/premortem.v1';
import { DecisionSession } from '@/types/sharedModels';
import { v4 as uuidv4 } from 'uuid';

/**
 * Extract placeholders from template strings
 * Finds all {{placeholder}} patterns
 */
function extractPlaceholders(template: PreMortemTemplate): string[] {
  const placeholders = new Set<string>();
  const regex = /\{\{([^}]+)\}\}/g;

  // Search all template text fields
  const searchInObject = (obj: any) => {
    if (typeof obj === 'string') {
      let match;
      while ((match = regex.exec(obj)) !== null) {
        placeholders.add(match[1]);
      }
    } else if (Array.isArray(obj)) {
      obj.forEach(searchInObject);
    } else if (obj && typeof obj === 'object') {
      Object.values(obj).forEach(searchInObject);
    }
  };

  searchInObject(template.decisionTemplate);
  return Array.from(placeholders).sort();
}

/**
 * Replace placeholders in a string
 */
function replacePlaceholders(text: string, values: Record<string, string>): string {
  let result = text;
  Object.entries(values).forEach(([key, value]) => {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    result = result.replace(regex, value || `[${key}]`);
  });
  return result;
}

/**
 * Replace placeholders in an object recursively
 */
function replacePlaceholdersInObject<T>(obj: T, values: Record<string, string>): T {
  if (typeof obj === 'string') {
    return replacePlaceholders(obj, values) as unknown as T;
  } else if (Array.isArray(obj)) {
    return obj.map((item) => replacePlaceholdersInObject(item, values)) as unknown as T;
  } else if (obj && typeof obj === 'object') {
    const result: any = {};
    Object.entries(obj).forEach(([key, value]) => {
      result[key] = replacePlaceholdersInObject(value, values);
    });
    return result as T;
  }
  return obj;
}

/**
 * Apply template to create a DecisionSession
 */
export function applyTemplate(
  template: PreMortemTemplate,
  placeholderValues: Record<string, string>
): DecisionSession {
  const now = new Date().toISOString();

  // Replace placeholders in decision template
  const decisionTemplate = replacePlaceholdersInObject(
    template.decisionTemplate,
    placeholderValues
  );

  // Create DecisionSession
  const session: DecisionSession = {
    id: uuidv4(),
    type: 'pre-mortem',
    created_at: now,
    updated_at: now,

    decision: {
      question: decisionTemplate.title,
      context: decisionTemplate.context,
      status: 'framing',
      options: [],
      factors: [],
      stakeholders: decisionTemplate.stakeholders.map((name) => ({
        id: uuidv4(),
        name,
        role: '',
        influence: 'medium',
        ai_generated: true,
        created_at: now,
      })),
    },

    conversation: [
      {
        id: uuidv4(),
        role: 'system',
        content: `Starting pre-mortem analysis using "${template.title}" template.`,
        timestamp: now,
      },
      {
        id: uuidv4(),
        role: 'olumi',
        content: `I'll help you conduct a pre-mortem analysis for: ${decisionTemplate.title}\n\n${decisionTemplate.description}\n\nLet's begin by exploring potential failure scenarios and ways to mitigate them.`,
        timestamp: now,
      },
    ],

    // Pre-populate with template scenarios and mitigations
    premortem: {
      failure_scenarios: template.scenarioTemplates.map((scenarioTemplate) => ({
        id: uuidv4(),
        title: scenarioTemplate.title,
        description: scenarioTemplate.description,
        likelihood: mapLikelihood(scenarioTemplate.likelihood),
        impact: mapImpact(scenarioTemplate.impact),
        root_causes: [],
        early_warning_signs: [],
        related_factors: [],
        ai_reasoning: scenarioTemplate.rationale,
        created_at: now,
      })),

      mitigations: template.mitigationTemplates.map((mitigationTemplate) => ({
        id: uuidv4(),
        scenario_id: '', // Will be linked to scenarios later
        strategy: mitigationTemplate.strategy,
        actions: mitigationTemplate.bestPractices,
        effort: mitigationTemplate.effort,
        effectiveness: mapEffectivenessToNumber(mitigationTemplate.effectiveness),
        timing: 'pre-decision' as const,
        priority: mitigationTemplate.effectiveness === 'high',
        created_at: now,
      })),

      evidence: [],
      confidence_level: 75,
      generated_at: now,
    },

    diagnostics: {
      apiCalls: [],
      totalProcessingTimeMs: 0,
      degraded: false,
    },
  };

  return session;
}

/**
 * Map template likelihood to numeric value
 */
function mapLikelihood(level: 'low' | 'medium' | 'high'): number {
  const map = {
    low: 25,
    medium: 50,
    high: 75,
  };
  return map[level];
}

/**
 * Map template impact to app impact level
 */
function mapImpact(
  impact: 'low' | 'medium' | 'high' | 'critical'
): 'catastrophic' | 'major' | 'moderate' | 'minor' {
  const map = {
    critical: 'catastrophic' as const,
    high: 'major' as const,
    medium: 'moderate' as const,
    low: 'minor' as const,
  };
  return map[impact];
}

/**
 * Map effectiveness level to numeric value
 */
function mapEffectivenessToNumber(effectiveness: 'low' | 'medium' | 'high'): number {
  const map = {
    high: 80,
    medium: 60,
    low: 40,
  };
  return map[effectiveness];
}

/**
 * Hook for template application
 */
export function useTemplateApplication() {
  const [placeholders, setPlaceholders] = useState<string[]>([]);
  const [placeholderValues, setPlaceholderValues] = useState<Record<string, string>>({});
  const [currentTemplate, setCurrentTemplate] = useState<PreMortemTemplate | null>(null);

  /**
   * Start template application flow
   */
  const startApplication = useCallback((template: PreMortemTemplate) => {
    const extractedPlaceholders = extractPlaceholders(template);
    setPlaceholders(extractedPlaceholders);
    setPlaceholderValues({});
    setCurrentTemplate(template);
  }, []);

  /**
   * Update placeholder value
   */
  const updatePlaceholder = useCallback((key: string, value: string) => {
    setPlaceholderValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  /**
   * Apply template with current values
   */
  const apply = useCallback((): DecisionSession | null => {
    if (!currentTemplate) return null;
    return applyTemplate(currentTemplate, placeholderValues);
  }, [currentTemplate, placeholderValues]);

  /**
   * Reset state
   */
  const reset = useCallback(() => {
    setPlaceholders([]);
    setPlaceholderValues({});
    setCurrentTemplate(null);
  }, []);

  /**
   * Check if ready to apply
   */
  const isReady = placeholders.length === 0 || placeholders.every((p) => placeholderValues[p]);

  return {
    placeholders,
    placeholderValues,
    currentTemplate,
    startApplication,
    updatePlaceholder,
    apply,
    reset,
    isReady,
  };
}
