import {
  LikelihoodLevel,
  ImpactLevel,
  EffortLevel,
  ScenarioCategory,
  MitigationTiming,
} from './premortem';

export interface GenerateScenariosParams {
  decisionTitle: string;
  decisionDescription: string;
  decisionType: string;
  timeline: string;
  successCriteria?: string;
  context?: string;
  userThoughts?: string;
}

export interface ScenarioResponse {
  title: string;
  description: string;
  likelihood: LikelihoodLevel;
  impact: ImpactLevel;
  category: ScenarioCategory;
  reasoning: string;
}

export interface RootCauseResponse {
  cause: string;
  explanation: string;
}

export interface MitigationStrategyResponse {
  title: string;
  description: string;
  effort: EffortLevel;
  impact: ImpactLevel;
  timing: MitigationTiming;
}

export interface ExecutiveSummaryParams {
  decisionTitle: string;
  decisionDescription: string;
  originalConfidence: number;
  adjustedConfidence: number;
  topScenarios: Array<{ title: string; description: string }>;
  priorityActions: Array<{
    title: string;
    description: string;
    owner?: string;
  }>;
  keyInsight?: string;
}

export class APIError extends Error {
  originalError: unknown;

  constructor(message: string, originalError: unknown) {
    super(message);
    this.name = 'APIError';
    this.originalError = originalError;
  }
}
