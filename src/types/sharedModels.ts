/**
 * Shared Data Models - Olumi Pre-Mortem Tool v2.0
 * Compatible with Scenario Sandbox integration
 *
 * This is the canonical data structure for all Olumi decision tools.
 * Designed for:
 * - Conversational AI interaction
 * - Pre-mortem analysis
 * - Post-mortem learning
 * - Seamless Scenario Sandbox handoff
 */

/* ============================================
   CORE SESSION
   ============================================ */

export type SessionType = 'pre-mortem' | 'scenario' | 'sandbox';
export type SessionStatus = 'framing' | 'active' | 'decided' | 'reviewed';
export type OutcomeType = 'success' | 'failure' | 'mixed';

/**
 * DecisionSession - The complete session state
 * Tracks entire lifecycle from decision framing through post-mortem
 */
export interface DecisionSession {
  id: string;
  type: SessionType;
  created_at: string;
  updated_at: string;

  decision: Decision;
  premortem?: PreMortemAnalysis;
  postmortem?: PostMortemAnalysis;
  conversation: Message[];
  handoff?: HandoffMetadata;
}

/* ============================================
   DECISION CORE
   ============================================ */

export interface Decision {
  question: string;
  context: string;
  status: SessionStatus;

  options: DecisionOption[];
  factors: DecisionFactor[];
  stakeholders: Stakeholder[];
}

export interface DecisionOption {
  id: string;
  title: string;
  description: string;
  confidence: number;
  ai_generated: boolean;
  created_at: string;
}

export type FactorType = 'risk' | 'opportunity' | 'constraint' | 'assumption';
export type ImportanceLevel = 'critical' | 'high' | 'medium' | 'low';

export interface DecisionFactor {
  id: string;
  name: string;
  description: string;
  importance: ImportanceLevel;
  type: FactorType;
  ai_generated: boolean;
  created_at: string;
}

export type InfluenceLevel = 'high' | 'medium' | 'low';

export interface Stakeholder {
  id: string;
  name: string;
  role: string;
  influence: InfluenceLevel;
  ai_generated: boolean;
  created_at: string;
}

/* ============================================
   PRE-MORTEM ANALYSIS
   ============================================ */

export type ImpactLevel = 'catastrophic' | 'major' | 'moderate' | 'minor';

export interface PreMortemAnalysis {
  failure_scenarios: FailureScenario[];
  mitigations: Mitigation[];
  confidence_level: number;
  generated_at: string;
}

export interface FailureScenario {
  id: string;
  title: string;
  description: string;
  likelihood: number;
  impact: ImpactLevel;
  root_causes: string[];
  early_warning_signs: string[];
  related_factors: string[];
  ai_reasoning?: string;
  created_at: string;
}

export type EffortLevel = 'low' | 'medium' | 'high';

export interface Mitigation {
  id: string;
  scenario_id: string;
  strategy: string;
  actions: string[];
  effort: EffortLevel;
  effectiveness: number;
  timing: 'pre-decision' | 'during-execution' | 'monitoring';
  owner?: string;
  priority: boolean;
  created_at: string;
}

/* ============================================
   POST-MORTEM ANALYSIS (NEW)
   ============================================ */

export type LessonCategory = 'assumption' | 'process' | 'external' | 'timing';

export interface PostMortemAnalysis {
  actual_outcome: OutcomeType;
  outcome_description: string;
  lessons_learned: Lesson[];
  accuracy_score: number;
  reviewed_at: string;
}

export interface Lesson {
  id: string;
  category: LessonCategory;
  what_happened: string;
  why_it_matters: string;
  future_application: string;
  created_at: string;
}

/* ============================================
   CONVERSATION
   ============================================ */

export type MessageRole = 'user' | 'olumi' | 'system';

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
  reasoning?: string;
  metadata?: MessageMetadata;
}

export interface MessageMetadata {
  model_used?: string;
  tokens?: number;
  confidence?: number;
  intent?: string;
  extracted_entities?: Record<string, any>;
}

/* ============================================
   INTEGRATION & HANDOFF
   ============================================ */

export type HandoffSource = 'standalone' | 'sandbox' | 'cee';

export interface HandoffMetadata {
  source: HandoffSource;
  target?: HandoffSource;
  data?: Record<string, any>;
  timestamp: string;
}

/* ============================================
   SCENARIO SANDBOX COMPATIBILITY
   ============================================ */

/**
 * Format for exporting to Scenario Sandbox
 */
export interface ScenarioSandboxInput {
  type: 'pre-mortem-import';
  decision: {
    question: string;
    context: string;
    options: Array<{
      name: string;
      description: string;
      confidence: number;
    }>;
    factors: Array<{
      name: string;
      type: string;
      importance: ImportanceLevel;
    }>;
    risks: Array<{
      title: string;
      description: string;
      likelihood: number;
      impact: ImpactLevel;
      mitigations: string[];
    }>;
  };
  metadata: {
    created_at: string;
    source: string;
    version: string;
  };
}

/**
 * Format for importing from Scenario Sandbox
 */
export interface ScenarioSandboxExport {
  session_id: string;
  decision: {
    question: string;
    context?: string;
    chosen_option?: string;
    options: Array<{
      name: string;
      description?: string;
      confidence: number;
    }>;
    factors: Array<{
      name: string;
      description?: string;
      type: string;
      importance: ImportanceLevel;
    }>;
  };
  scenarios_explored: Array<{
    name: string;
    outcome: string;
    probability: number;
  }>;
  final_decision: {
    chosen: string;
    rationale: string;
    timestamp: string;
  };
  metadata: {
    exported_at: string;
    version: string;
  };
}

/* ============================================
   HELPER TYPES
   ============================================ */

/**
 * Partial session for initial creation
 */
export type CreateSessionInput = {
  question: string;
  type?: SessionType;
};

/**
 * Context extraction from AI conversation
 */
export interface ExtractedContext {
  question?: string;
  context?: string;
  options: Partial<DecisionOption>[];
  factors: Partial<DecisionFactor>[];
  stakeholders: Partial<Stakeholder>[];
  successCriteria?: string;
  timeline?: string;
  confidence?: number;
}

/**
 * AI reasoning output structure
 */
export interface AIReasoningOutput {
  content: string;
  reasoning: string;
  confidence: number;
  extracted_data?: ExtractedContext;
}
