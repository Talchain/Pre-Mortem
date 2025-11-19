export type DecisionType =
  | 'Product Strategy'
  | 'Feature Launch'
  | 'Resource Allocation'
  | 'Partnership'
  | 'Hiring'
  | 'Other';

export type Timeline = '3 months' | '6 months' | '12 months' | '18+ months';

export type LikelihoodLevel = 'Low' | 'Medium' | 'High';
export type ImpactLevel = 'Low' | 'Medium' | 'High';
export type EffortLevel = 'Low' | 'Medium' | 'High';

export type ScenarioCategory =
  | 'Technical'
  | 'Market'
  | 'Team'
  | 'Resource'
  | 'External'
  | 'Strategic';

export type MitigationTiming =
  | 'Pre-decision'
  | 'During execution'
  | 'Monitoring';

export type CompletionStatus = 'in-progress' | 'completed';

export interface RootCause {
  id: string;
  cause: string;
  explanation: string;
  userEdited: boolean;
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  likelihood: LikelihoodLevel;
  impact: ImpactLevel;
  category: ScenarioCategory;
  flaggedAsConcerning: boolean;
  userEdited: boolean;
  source: 'ai' | 'user';
  reasoning?: string;
  rootCauses: RootCause[];
}

export interface MitigationStrategy {
  id: string;
  rootCauseIds: string[];
  title: string;
  description: string;
  effort: EffortLevel;
  impact: ImpactLevel;
  timing: MitigationTiming;
  owner?: string;
  priority: boolean;
  userEdited: boolean;
}

export interface Decision {
  title: string;
  description: string;
  type: DecisionType;
  timeline: Timeline;
  initialConfidence: number; // 0-100
  stakeholders?: string[];
  successCriteria?: string;
  context?: string;
}

export interface PreMortemAnalysis {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId?: string;

  decision: Decision;
  userInitialThoughts?: string;
  scenarios: Scenario[];
  mitigationStrategies: MitigationStrategy[];
  adjustedConfidence: number; // 0-100
  keyInsight?: string;

  completionStatus: CompletionStatus;
  currentStep: number; // 1-8
  exportedAt?: Date;
}
