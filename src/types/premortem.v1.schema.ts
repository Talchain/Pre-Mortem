/**
 * Zod Validation Schema for PreMortemDecision.v1
 *
 * Provides runtime validation and type-safe parsing
 *
 * @example
 * import { PreMortemDecisionSchema } from './premortem.v1.schema';
 *
 * const result = PreMortemDecisionSchema.safeParse(data);
 * if (result.success) {
 *   const decision = result.data;
 * } else {
 *   console.error(result.error);
 * }
 */

import { z } from 'zod';
import { VALIDATION_RULES, SCHEMA_VERSION } from './premortem.v1';

// ============================================
// ENUMS
// ============================================

const LikelihoodLevelSchema = z.enum(['low', 'medium', 'high']);
const ImpactLevelSchema = z.enum(['low', 'medium', 'high', 'critical']);
const EffortLevelSchema = z.enum(['low', 'medium', 'high']);
const EffectivenessLevelSchema = z.enum(['low', 'medium', 'high']);
const AIProviderSchema = z.enum(['anthropic', 'openai']);
const EvidenceTypeSchema = z.enum(['research', 'data', 'expert', 'historical', 'assumption']);
const RootCauseTypeSchema = z.enum([
  'assumption',
  'constraint',
  'dependency',
  'capability',
  'external',
  'systemic',
]);
const ScenarioCategorySchema = z.enum([
  'technical',
  'market',
  'organizational',
  'financial',
  'regulatory',
  'operational',
  'strategic',
  'external',
]);

// ============================================
// CORE SCHEMAS
// ============================================

const DecisionSchema = z.object({
  id: z.string().uuid(),
  title: z
    .string()
    .min(VALIDATION_RULES.decision.titleMinLength)
    .max(VALIDATION_RULES.decision.titleMaxLength),
  description: z
    .string()
    .min(VALIDATION_RULES.decision.descriptionMinLength)
    .max(VALIDATION_RULES.decision.descriptionMaxLength),
  context: z.string(),
  goals: z
    .array(z.string())
    .min(VALIDATION_RULES.decision.goalsMinCount)
    .max(VALIDATION_RULES.decision.goalsMaxCount),
  constraints: z.array(z.string()),
  stakeholders: z.array(z.string()),
  timeframe: z.string(),
});

const FailureScenarioSchema = z.object({
  id: z.string().uuid(),
  title: z
    .string()
    .min(VALIDATION_RULES.scenarios.titleMinLength)
    .max(VALIDATION_RULES.scenarios.titleMaxLength),
  description: z
    .string()
    .min(VALIDATION_RULES.scenarios.descriptionMinLength)
    .max(VALIDATION_RULES.scenarios.descriptionMaxLength),
  likelihood: LikelihoodLevelSchema,
  impact: ImpactLevelSchema,
  category: ScenarioCategorySchema,
  rootCauseIds: z.array(z.string().uuid()),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime().optional(),
});

const RootCauseSchema = z.object({
  id: z.string().uuid(),
  scenarioIds: z.array(z.string().uuid()),
  description: z
    .string()
    .min(VALIDATION_RULES.rootCauses.descriptionMinLength)
    .max(VALIDATION_RULES.rootCauses.descriptionMaxLength),
  type: RootCauseTypeSchema,
  addressable: z.boolean(),
  mitigationIds: z.array(z.string().uuid()),
  depth: z.number().int().min(1).max(VALIDATION_RULES.rootCauses.maxDepth),
  parentCauseId: z.string().uuid().optional(),
});

const MitigationSchema = z.object({
  id: z.string().uuid(),
  rootCauseIds: z.array(z.string().uuid()),
  strategy: z
    .string()
    .min(VALIDATION_RULES.mitigations.strategyMinLength)
    .max(VALIDATION_RULES.mitigations.strategyMaxLength),
  effort: EffortLevelSchema,
  effectiveness: EffectivenessLevelSchema,
  implemented: z.boolean(),
  priority: z.number().int().min(1).max(100).optional(),
  owner: z.string().optional(),
  deadline: z.string().datetime().optional(),
});

const ConfidenceAdjustmentSchema = z.object({
  initial: z.number().int().min(0).max(100),
  adjusted: z.number().int().min(0).max(100),
  factors: z.array(z.string()),
  calculatedAt: z.string().datetime(),
});

const AnalysisSchema = z.object({
  scenarios: z
    .array(FailureScenarioSchema)
    .min(VALIDATION_RULES.scenarios.minCount)
    .max(VALIDATION_RULES.scenarios.maxCount),
  rootCauses: z.array(RootCauseSchema).min(VALIDATION_RULES.rootCauses.minCount),
  mitigations: z.array(MitigationSchema).min(VALIDATION_RULES.mitigations.minCount),
  confidenceAdjustment: ConfidenceAdjustmentSchema,
});

const EvidenceSchema = z.object({
  id: z.string().uuid(),
  title: z
    .string()
    .min(VALIDATION_RULES.evidence.titleMinLength)
    .max(VALIDATION_RULES.evidence.titleMaxLength),
  type: EvidenceTypeSchema,
  content: z
    .string()
    .min(VALIDATION_RULES.evidence.contentMinLength)
    .max(VALIDATION_RULES.evidence.contentMaxLength),
  source: z.string().optional(),
  linkedToScenarioIds: z.array(z.string().uuid()),
  linkedToRootCauseIds: z.array(z.string().uuid()),
  linkedToMitigationIds: z.array(z.string().uuid()),
  createdAt: z.string().datetime(),
  tags: z.array(z.string()).optional(),
});

const APICallSchema = z.object({
  timestamp: z.string().datetime(),
  provider: AIProviderSchema,
  model: z.string(),
  tokens: z.number().int().positive().optional(),
  duration: z.number().int().positive().optional(),
  success: z.boolean(),
  error: z.string().optional(),
});

const DiagnosticsSchema = z.object({
  totalTokens: z.number().int().positive().optional(),
  processingTime: z.number().int().positive().optional(),
  warnings: z.array(z.string()).optional(),
  degraded: z.boolean().optional(),
  degradedReason: z.string().optional(),
  apiCalls: z.array(APICallSchema).optional(),
});

const ExtractedDataSchema = z.object({
  goals: z.array(z.string()).optional(),
  constraints: z.array(z.string()).optional(),
  stakeholders: z.array(z.string()).optional(),
  scenarios: z.array(FailureScenarioSchema.partial()).optional(),
  rootCauses: z.array(RootCauseSchema.partial()).optional(),
  mitigations: z.array(MitigationSchema.partial()).optional(),
  evidence: z.array(EvidenceSchema.partial()).optional(),
});

const ConversationTurnSchema = z.object({
  id: z.string().uuid(),
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string(),
  timestamp: z.string().datetime(),
  extractedData: ExtractedDataSchema.optional(),
});

const MetadataSchema = z.object({
  version: z.string().regex(/^\d+\.\d+\.\d+$/),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  responseHash: z.string().optional(),
  aiProvider: AIProviderSchema,
  aiModel: z.string(),
  diagnostics: DiagnosticsSchema.optional(),
  conversationHistory: z.array(ConversationTurnSchema).optional(),
});

// ============================================
// MAIN SCHEMA
// ============================================

export const PreMortemDecisionSchema = z.object({
  decision: DecisionSchema,
  analysis: AnalysisSchema,
  evidence: z.array(EvidenceSchema),
  meta: MetadataSchema,
});

// ============================================
// PARTIAL SCHEMAS (for in-progress analysis)
// ============================================

export const PartialPreMortemDecisionSchema = z.object({
  decision: DecisionSchema.partial().required({ id: true }),
  analysis: AnalysisSchema.partial().optional(),
  evidence: z.array(EvidenceSchema).optional(),
  meta: MetadataSchema.partial().required({ version: true, createdAt: true }),
});

// ============================================
// COMPLETENESS SCHEMAS
// ============================================

const CompletenessDimensionSchema = z.object({
  score: z.number().int().min(0).max(20),
  status: z.enum(['complete', 'partial', 'missing']),
  feedback: z.string(),
  improvements: z.array(z.string()),
});

export const CompletenessScoreSchema = z.object({
  overall: z.number().int().min(0).max(100),
  dimensions: z.object({
    contextClarity: CompletenessDimensionSchema,
    scenarioDiversity: CompletenessDimensionSchema,
    rootCauseDepth: CompletenessDimensionSchema,
    mitigationCoverage: CompletenessDimensionSchema,
    evidenceQuality: CompletenessDimensionSchema,
  }),
  calculatedAt: z.string().datetime(),
});

// ============================================
// INTEGRATION SCHEMAS
// ============================================

export const PreMortemToSandboxHandoffSchema = z.object({
  decisionTitle: z.string(),
  decisionDescription: z.string(),
  goals: z.array(z.string()),
  scenarios: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      likelihood: z.string(),
      impact: z.string(),
    })
  ),
  rootCauses: z.array(
    z.object({
      description: z.string(),
      type: z.string(),
      affectedScenarios: z.array(z.string()),
    })
  ),
  evidence: z.array(
    z.object({
      title: z.string(),
      type: z.string(),
      content: z.string(),
      source: z.string().optional(),
    })
  ),
  meta: z.object({
    premortemVersion: z.string(),
    analysisDate: z.string(),
    aiProvider: z.string(),
    aiModel: z.string(),
    premortemSessionId: z.string(),
  }),
});

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Validate a PreMortemDecision object
 */
export function validatePreMortemDecision(data: unknown) {
  return PreMortemDecisionSchema.safeParse(data);
}

/**
 * Validate a partial PreMortemDecision (in-progress)
 */
export function validatePartialPreMortemDecision(data: unknown) {
  return PartialPreMortemDecisionSchema.safeParse(data);
}

/**
 * Validate completeness score
 */
export function validateCompletenessScore(data: unknown) {
  return CompletenessScoreSchema.safeParse(data);
}

/**
 * Validate Sandbox handoff data
 */
export function validateSandboxHandoff(data: unknown) {
  return PreMortemToSandboxHandoffSchema.safeParse(data);
}

// ============================================
// TYPE EXPORTS (inferred from schemas)
// ============================================

export type PreMortemDecisionValidated = z.infer<typeof PreMortemDecisionSchema>;
export type PartialPreMortemDecisionValidated = z.infer<
  typeof PartialPreMortemDecisionSchema
>;
export type CompletenessScoreValidated = z.infer<typeof CompletenessScoreSchema>;
export type PreMortemToSandboxHandoffValidated = z.infer<
  typeof PreMortemToSandboxHandoffSchema
>;
