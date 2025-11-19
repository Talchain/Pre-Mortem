/**
 * Unified AI Service
 *
 * This service abstracts away the specific AI provider (Anthropic or OpenAI)
 * and routes requests to the appropriate API based on the selected model.
 */

import { AIModel } from '@/types/premortem';
import {
  GenerateScenariosParams,
  ScenarioResponse,
  RootCauseResponse,
  MitigationStrategyResponse,
  ExecutiveSummaryParams,
} from '@/types/api';

import * as anthropicAPI from './claudeAPI';
import * as openaiAPI from './openaiAPI';

/**
 * Generate failure scenarios using the selected AI model
 */
export async function generateScenarios(
  params: GenerateScenariosParams,
  aiModel: AIModel
): Promise<ScenarioResponse[]> {
  if (aiModel.provider === 'anthropic') {
    return anthropicAPI.generateScenarios(params);
  } else if (aiModel.provider === 'openai') {
    return openaiAPI.generateScenarios(params, aiModel.modelId);
  }

  throw new Error(`Unsupported AI provider: ${aiModel.provider}`);
}

/**
 * Generate root causes for a specific scenario
 */
export async function generateRootCauses(
  scenarioTitle: string,
  scenarioDescription: string,
  decisionContext: string,
  aiModel: AIModel
): Promise<RootCauseResponse[]> {
  if (aiModel.provider === 'anthropic') {
    return anthropicAPI.generateRootCauses(
      scenarioTitle,
      scenarioDescription,
      decisionContext
    );
  } else if (aiModel.provider === 'openai') {
    return openaiAPI.generateRootCauses(
      scenarioTitle,
      scenarioDescription,
      decisionContext,
      aiModel.modelId
    );
  }

  throw new Error(`Unsupported AI provider: ${aiModel.provider}`);
}

/**
 * Generate mitigation strategies for a root cause
 */
export async function generateMitigationStrategies(
  rootCause: string,
  rootCauseExplanation: string,
  scenarioContext: string,
  decisionContext: string,
  aiModel: AIModel
): Promise<MitigationStrategyResponse[]> {
  if (aiModel.provider === 'anthropic') {
    return anthropicAPI.generateMitigationStrategies(
      rootCause,
      rootCauseExplanation,
      scenarioContext,
      decisionContext
    );
  } else if (aiModel.provider === 'openai') {
    return openaiAPI.generateMitigationStrategies(
      rootCause,
      rootCauseExplanation,
      scenarioContext,
      decisionContext,
      aiModel.modelId
    );
  }

  throw new Error(`Unsupported AI provider: ${aiModel.provider}`);
}

/**
 * Generate executive summary of the pre-mortem analysis
 */
export async function generateExecutiveSummary(
  params: ExecutiveSummaryParams,
  aiModel: AIModel
): Promise<string> {
  if (aiModel.provider === 'anthropic') {
    return anthropicAPI.generateExecutiveSummary(params);
  } else if (aiModel.provider === 'openai') {
    return openaiAPI.generateExecutiveSummary(params, aiModel.modelId);
  }

  throw new Error(`Unsupported AI provider: ${aiModel.provider}`);
}

/**
 * Suggest context expansion questions (optional helper)
 */
export async function suggestContextQuestions(
  decisionType: string,
  briefDescription: string,
  aiModel: AIModel
): Promise<string[]> {
  if (aiModel.provider === 'anthropic') {
    return anthropicAPI.suggestContextQuestions(decisionType, briefDescription);
  } else if (aiModel.provider === 'openai') {
    return openaiAPI.suggestContextQuestions(
      decisionType,
      briefDescription,
      aiModel.modelId
    );
  }

  throw new Error(`Unsupported AI provider: ${aiModel.provider}`);
}
