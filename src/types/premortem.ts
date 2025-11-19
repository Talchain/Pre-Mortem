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

export type AIProvider = 'anthropic' | 'openai';

export interface AIModel {
  provider: AIProvider;
  modelId: string;
  displayName: string;
}

export const AI_MODELS: Record<AIProvider, AIModel[]> = {
  anthropic: [
    {
      provider: 'anthropic',
      modelId: 'claude-sonnet-4-20250514',
      displayName: 'Claude Sonnet 4',
    },
    {
      provider: 'anthropic',
      modelId: 'claude-3-5-sonnet-20241022',
      displayName: 'Claude 3.5 Sonnet',
    },
  ],
  openai: [
    {
      provider: 'openai',
      modelId: 'gpt-4o',
      displayName: 'GPT-4o',
    },
    {
      provider: 'openai',
      modelId: 'gpt-4-turbo',
      displayName: 'GPT-4 Turbo',
    },
    {
      provider: 'openai',
      modelId: 'gpt-3.5-turbo',
      displayName: 'GPT-3.5 Turbo',
    },
  ],
};

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

  // AI Model Selection
  aiModel?: AIModel; // Selected AI model for this analysis
}
