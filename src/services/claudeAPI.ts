import Anthropic from '@anthropic-ai/sdk';
import {
  GenerateScenariosParams,
  ScenarioResponse,
  RootCauseResponse,
  MitigationStrategyResponse,
  ExecutiveSummaryParams,
  APIError,
} from '@/types/api';

const client = new Anthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
  // Note: In production, proxy API calls through a backend to protect your API key
});

/**
 * Calculate future date based on timeline
 */
function calculateFutureDate(timeline: string): string {
  const months =
    timeline === '3 months'
      ? 3
      : timeline === '6 months'
        ? 6
        : timeline === '12 months'
          ? 12
          : 18;

  const futureDate = new Date();
  futureDate.setMonth(futureDate.getMonth() + months);

  return futureDate.toLocaleDateString('en-GB', {
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Clean AI response by removing markdown code fences
 */
function cleanJSONResponse(text: string): string {
  return text
    .replace(/```json\n?/g, '')
    .replace(/```\n?/g, '')
    .trim();
}

/**
 * Generate failure scenarios using Claude API
 */
export async function generateScenarios(
  params: GenerateScenariosParams
): Promise<ScenarioResponse[]> {
  const futureDate = calculateFutureDate(params.timeline);

  const prompt = `You are an expert decision analyst conducting a pre-mortem analysis.

CONTEXT:
- Decision: ${params.decisionTitle}
- Description: ${params.decisionDescription}
- Type: ${params.decisionType}
- Timeline: ${params.timeline}
${params.successCriteria ? `- Success criteria: ${params.successCriteria}` : ''}
${params.context ? `- Additional context: ${params.context}` : ''}
${params.userThoughts ? `- User's initial concerns: ${params.userThoughts}` : ''}

TASK:
Generate 5-8 distinct failure scenarios using prospective hindsight. Imagine it's ${futureDate} and this decision has failed completely.

For each scenario:
1. Provide a concise title (8-10 words)
2. Write a description (2-3 sentences) explaining how this failure unfolded
3. Assess likelihood (Low/Medium/High) based on the context
4. Assess impact (Low/Medium/High)
5. Categorize failure type: Technical, Market, Team, Resource, External, or Strategic

CONSTRAINTS:
- Scenarios must be diverse (cover different failure types)
- Be specific to the decision context, not generic
- Use realistic, domain-appropriate language
- Balance obvious risks with non-obvious blind spots

CRITICAL: Your entire response MUST be ONLY a valid JSON object. Do not include markdown code fences, backticks, or any explanatory text. Start with { and end with }.

OUTPUT FORMAT:
{
  "scenarios": [
    {
      "title": "string",
      "description": "string",
      "likelihood": "Low|Medium|High",
      "impact": "Low|Medium|High",
      "category": "Technical|Market|Team|Resource|External|Strategic",
      "reasoning": "string"
    }
  ]
}`;

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      temperature: 0.7,
      messages: [{ role: 'user', content: prompt }],
    });

    const responseText =
      message.content[0].type === 'text' ? message.content[0].text : '';

    const cleanedResponse = cleanJSONResponse(responseText);
    const parsed = JSON.parse(cleanedResponse);

    if (!parsed.scenarios || !Array.isArray(parsed.scenarios)) {
      throw new Error('Invalid response structure from API');
    }

    return parsed.scenarios;
  } catch (error) {
    console.error('Error generating scenarios:', error);
    throw new APIError(
      'Failed to generate scenarios. Please try again.',
      error
    );
  }
}

/**
 * Generate root causes for a specific scenario
 */
export async function generateRootCauses(
  scenarioTitle: string,
  scenarioDescription: string,
  decisionContext: string
): Promise<RootCauseResponse[]> {
  const prompt = `Identify 3-4 root causes that would lead to this failure scenario.

SCENARIO:
Title: ${scenarioTitle}
Description: ${scenarioDescription}
Decision context: ${decisionContext}

CRITICAL: Respond with ONLY valid JSON, no markdown formatting.

OUTPUT FORMAT:
{
  "rootCauses": [
    {
      "cause": "string (concise, 4-6 words)",
      "explanation": "string (1 sentence)"
    }
  ]
}`;

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      temperature: 0.6,
      messages: [{ role: 'user', content: prompt }],
    });

    const responseText =
      message.content[0].type === 'text' ? message.content[0].text : '';

    const cleanedResponse = cleanJSONResponse(responseText);
    const parsed = JSON.parse(cleanedResponse);

    if (!parsed.rootCauses || !Array.isArray(parsed.rootCauses)) {
      throw new Error('Invalid response structure from API');
    }

    return parsed.rootCauses;
  } catch (error) {
    console.error('Error generating root causes:', error);
    throw new APIError('Failed to generate root causes.', error);
  }
}

/**
 * Generate mitigation strategies for a root cause
 */
export async function generateMitigationStrategies(
  rootCause: string,
  rootCauseExplanation: string,
  scenarioContext: string,
  decisionContext: string
): Promise<MitigationStrategyResponse[]> {
  const prompt = `Generate 2-3 mitigation strategies for this root cause.

ROOT CAUSE: ${rootCause}
Explanation: ${rootCauseExplanation}
SCENARIO CONTEXT: ${scenarioContext}
DECISION CONTEXT: ${decisionContext}

Each strategy should be:
- Actionable (specific steps)
- Realistic (achievable with reasonable effort)
- Preventive (addresses root cause, not just symptoms)

CRITICAL: Respond with ONLY valid JSON.

OUTPUT FORMAT:
{
  "strategies": [
    {
      "title": "string (action-oriented, 6-8 words)",
      "description": "string (2-3 sentences with specific actions)",
      "effort": "Low|Medium|High",
      "impact": "Low|Medium|High",
      "timing": "Pre-decision|During execution|Monitoring"
    }
  ]
}`;

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      temperature: 0.7,
      messages: [{ role: 'user', content: prompt }],
    });

    const responseText =
      message.content[0].type === 'text' ? message.content[0].text : '';

    const cleanedResponse = cleanJSONResponse(responseText);
    const parsed = JSON.parse(cleanedResponse);

    if (!parsed.strategies || !Array.isArray(parsed.strategies)) {
      throw new Error('Invalid response structure from API');
    }

    return parsed.strategies;
  } catch (error) {
    console.error('Error generating mitigation strategies:', error);
    throw new APIError('Failed to generate mitigation strategies.', error);
  }
}

/**
 * Generate executive summary of the pre-mortem analysis
 */
export async function generateExecutiveSummary(
  params: ExecutiveSummaryParams
): Promise<string> {
  const prompt = `Create an executive summary of this pre-mortem analysis.

DECISION: ${params.decisionTitle}
Description: ${params.decisionDescription}

ORIGINAL CONFIDENCE: ${params.originalConfidence}/100
ADJUSTED CONFIDENCE: ${params.adjustedConfidence}/100

TOP SCENARIOS:
${params.topScenarios.map((s, i) => `${i + 1}. ${s.title}: ${s.description}`).join('\n')}

PRIORITY ACTIONS:
${params.priorityActions.map((a, i) => `${i + 1}. ${a.title}${a.owner ? ` (Owner: ${a.owner})` : ''}`).join('\n')}

KEY INSIGHT: ${params.keyInsight || 'N/A'}

Generate a professional, action-oriented summary (200-300 words) that:
1. Restates the decision
2. Highlights confidence shift and what drove it
3. Emphasizes top 3 risks to monitor
4. Lists priority actions
5. Ends with the key insight

Tone: Professional but not alarmist. Balanced assessment.

Respond with ONLY the summary text, no additional formatting or preamble.`;

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      temperature: 0.5,
      messages: [{ role: 'user', content: prompt }],
    });

    const summary =
      message.content[0].type === 'text' ? message.content[0].text : '';

    return summary.trim();
  } catch (error) {
    console.error('Error generating summary:', error);
    throw new APIError('Failed to generate executive summary.', error);
  }
}

/**
 * Suggest context expansion questions (optional helper)
 */
export async function suggestContextQuestions(
  decisionType: string,
  briefDescription: string
): Promise<string[]> {
  const prompt = `User is making a ${decisionType} decision described as: "${briefDescription}"

Suggest 3-4 brief questions (one sentence each) that would help them clarify their context and constraints.

Respond with ONLY valid JSON:
{
  "questions": ["string", "string", "string"]
}`;

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 500,
      temperature: 0.7,
      messages: [{ role: 'user', content: prompt }],
    });

    const responseText =
      message.content[0].type === 'text' ? message.content[0].text : '';

    const cleanedResponse = cleanJSONResponse(responseText);
    const parsed = JSON.parse(cleanedResponse);

    return parsed.questions || [];
  } catch (error) {
    console.error('Error generating context questions:', error);
    return []; // Non-critical feature, fail gracefully
  }
}
