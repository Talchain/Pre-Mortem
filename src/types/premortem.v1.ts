/**
 * Pre-Mortem Decision Schema v1.0
 * Canonical data model for Pre-Mortem Analysis Tool
 *
 * INTEGRATION NOTES:
 * - Compatible with Scenario Sandbox Decision Review (M1)
 * - Evidence schema matches Sandbox R3 specification
 * - Follows camelCase convention for Olumi integration
 * - Supports determinism via responseHash
 * - Diagnostics align with engine patterns
 *
 * @version 1.0.0
 * @date 2025-11-20
 */

// ============================================
// CORE DECISION MODEL
// ============================================

export interface PreMortemDecision {
  // Core decision
  decision: Decision;

  // Analysis outputs (mirrors CEE Decision Review pattern)
  analysis: Analysis;

  // Evidence (compatible with Sandbox R3)
  evidence: Evidence[];

  // Metadata (following engine patterns)
  meta: Metadata;
}

export interface Decision {
  id: string;
  title: string;
  description: string;
  context: string;
  goals: string[];
  constraints: string[];
  stakeholders: string[];
  timeframe: string;
}

export interface Analysis {
  scenarios: FailureScenario[];
  rootCauses: RootCause[];
  mitigations: Mitigation[];
  confidenceAdjustment: ConfidenceAdjustment;
}

// ============================================
// FAILURE SCENARIOS
// ============================================

export type LikelihoodLevel = 'low' | 'medium' | 'high';
export type ImpactLevel = 'low' | 'medium' | 'high' | 'critical';

export interface FailureScenario {
  id: string;
  title: string;
  description: string;
  likelihood: LikelihoodLevel;
  impact: ImpactLevel;
  category: ScenarioCategory;
  rootCauseIds: string[];
  createdAt: string;
  updatedAt?: string;
}

export type ScenarioCategory =
  | 'technical'
  | 'market'
  | 'organizational'
  | 'financial'
  | 'regulatory'
  | 'operational'
  | 'strategic'
  | 'external';

// ============================================
// ROOT CAUSES
// ============================================

export interface RootCause {
  id: string;
  scenarioIds: string[];
  description: string;
  type: RootCauseType;
  addressable: boolean;
  mitigationIds: string[];
  depth: number; // For 5-Whys tracking (1-5)
  parentCauseId?: string; // For causal chains
}

export type RootCauseType =
  | 'assumption'
  | 'constraint'
  | 'dependency'
  | 'capability'
  | 'external'
  | 'systemic';

// ============================================
// MITIGATIONS
// ============================================

export interface Mitigation {
  id: string;
  rootCauseIds: string[];
  strategy: string;
  effort: EffortLevel;
  effectiveness: EffectivenessLevel;
  implemented: boolean;
  priority?: number; // Calculated priority score
  owner?: string;
  deadline?: string;
}

export type EffortLevel = 'low' | 'medium' | 'high';
export type EffectivenessLevel = 'low' | 'medium' | 'high';

// ============================================
// CONFIDENCE ADJUSTMENT
// ============================================

export interface ConfidenceAdjustment {
  initial: number; // 0-100
  adjusted: number; // 0-100
  factors: string[]; // Reasons for adjustment
  calculatedAt: string;
}

// ============================================
// EVIDENCE (Compatible with Sandbox R3)
// ============================================

export interface Evidence {
  id: string;
  title: string;
  type: EvidenceType;
  content: string;
  source?: string;
  linkedToScenarioIds: string[];
  linkedToRootCauseIds: string[];
  linkedToMitigationIds: string[];
  createdAt: string;
  tags?: string[];
}

export type EvidenceType =
  | 'research'
  | 'data'
  | 'expert'
  | 'historical'
  | 'assumption';

// ============================================
// METADATA
// ============================================

export interface Metadata {
  version: string; // Schema version (e.g., "1.0.0")
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
  responseHash?: string; // For determinism support
  aiProvider: AIProvider;
  aiModel: string;
  diagnostics?: Diagnostics;
  conversationHistory?: ConversationTurn[];
}

export type AIProvider = 'anthropic' | 'openai';

export interface Diagnostics {
  totalTokens?: number;
  processingTime?: number; // milliseconds
  warnings?: string[];
  degraded?: boolean;
  degradedReason?: string;
  apiCalls?: APICall[];
}

export interface APICall {
  timestamp: string;
  provider: AIProvider;
  model: string;
  tokens?: number;
  duration?: number; // milliseconds
  success: boolean;
  error?: string;
}

// ============================================
// CONVERSATION HISTORY
// ============================================

export interface ConversationTurn {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  extractedData?: ExtractedData; // Structured data extracted from this turn
}

export interface ExtractedData {
  goals?: string[];
  constraints?: string[];
  stakeholders?: string[];
  scenarios?: Partial<FailureScenario>[];
  rootCauses?: Partial<RootCause>[];
  mitigations?: Partial<Mitigation>[];
  evidence?: Partial<Evidence>[];
}

// ============================================
// COMPLETENESS SCORING
// ============================================

export interface CompletenessScore {
  overall: number; // 0-100
  dimensions: {
    contextClarity: CompletnessDimension;
    scenarioDiversity: CompletnessDimension;
    rootCauseDepth: CompletnessDimension;
    mitigationCoverage: CompletnessDimension;
    evidenceQuality: CompletnessDimension;
  };
  calculatedAt: string;
}

export interface CompletnessDimension {
  score: number; // 0-20 (each dimension max 20 points)
  status: 'complete' | 'partial' | 'missing';
  feedback: string;
  improvements: string[];
}

// ============================================
// INTEGRATION HANDOFF
// ============================================

/**
 * Data structure for exporting to Scenario Sandbox
 * Maps Pre-Mortem analysis to Sandbox-compatible format
 */
export interface PreMortemToSandboxHandoff {
  // Decision context → Scenario framing
  decisionTitle: string;
  decisionDescription: string;
  goals: string[];

  // Failure scenarios → Initial scenarios in Sandbox
  scenarios: Array<{
    title: string;
    description: string;
    likelihood: string;
    impact: string;
  }>;

  // Root causes → Potential graph nodes/edges
  rootCauses: Array<{
    description: string;
    type: string;
    affectedScenarios: string[];
  }>;

  // Evidence → Sandbox evidence R3
  evidence: Array<{
    title: string;
    type: string;
    content: string;
    source?: string;
  }>;

  // Metadata
  meta: {
    premortemVersion: string;
    analysisDate: string;
    aiProvider: string;
    aiModel: string;
    premortemSessionId: string;
  };
}

// ============================================
// HELPER TYPES
// ============================================

/**
 * Partial decision for in-progress analysis
 */
export type PartialPreMortemDecision = Partial<PreMortemDecision> & {
  decision: Partial<Decision> & { id: string };
  meta: Partial<Metadata> & { version: string; createdAt: string };
};

/**
 * Risk score calculation
 */
export interface RiskScore {
  scenarioId: string;
  score: number; // 0-9 (likelihood 1-3 × impact 1-3)
  priority: 'critical' | 'high' | 'medium' | 'low';
}

/**
 * Prioritization result
 */
export interface PrioritizationResult {
  scenario: FailureScenario;
  riskScore: RiskScore;
  addressableRootCauses: number;
  effectiveMitigations: number;
  priority: number; // Overall priority score
  reasoning: string;
}

// ============================================
// CONSTANTS
// ============================================

export const SCHEMA_VERSION = '1.0.0';

export const LIKELIHOOD_VALUES: Record<LikelihoodLevel, number> = {
  low: 1,
  medium: 2,
  high: 3,
};

export const IMPACT_VALUES: Record<ImpactLevel, number> = {
  low: 1,
  medium: 2,
  high: 3,
  critical: 4,
};

export const EFFORT_VALUES: Record<EffortLevel, number> = {
  low: 1,
  medium: 2,
  high: 3,
};

export const EFFECTIVENESS_VALUES: Record<EffectivenessLevel, number> = {
  low: 1,
  medium: 2,
  high: 3,
};

// ============================================
// VALIDATION RULES
// ============================================

/**
 * Validation rules for schema compliance
 */
export const VALIDATION_RULES = {
  decision: {
    titleMinLength: 10,
    titleMaxLength: 200,
    descriptionMinLength: 50,
    descriptionMaxLength: 2000,
    goalsMinCount: 1,
    goalsMaxCount: 10,
  },
  scenarios: {
    minCount: 3,
    maxCount: 15,
    titleMinLength: 10,
    titleMaxLength: 100,
    descriptionMinLength: 50,
    descriptionMaxLength: 1000,
  },
  rootCauses: {
    minCount: 1,
    maxDepth: 5, // For 5-Whys
    descriptionMinLength: 20,
    descriptionMaxLength: 500,
  },
  mitigations: {
    minCount: 1,
    strategyMinLength: 20,
    strategyMaxLength: 500,
  },
  evidence: {
    titleMinLength: 10,
    titleMaxLength: 200,
    contentMinLength: 50,
    contentMaxLength: 5000,
  },
};

// ============================================
// TYPE GUARDS
// ============================================

export function isValidLikelihood(value: string): value is LikelihoodLevel {
  return ['low', 'medium', 'high'].includes(value);
}

export function isValidImpact(value: string): value is ImpactLevel {
  return ['low', 'medium', 'high', 'critical'].includes(value);
}

export function isValidEvidenceType(value: string): value is EvidenceType {
  return ['research', 'data', 'expert', 'historical', 'assumption'].includes(value);
}

export function isValidAIProvider(value: string): value is AIProvider {
  return ['anthropic', 'openai'].includes(value);
}

// ============================================
// EXPORTS
// ============================================

export type {
  PreMortemDecision as default,
};
