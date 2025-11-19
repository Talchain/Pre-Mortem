/**
 * AI Orchestration Service
 * Implements multi-turn reasoning, multi-agent dialogue, and conversational context extraction
 * Olumi Pre-Mortem Tool v2.0
 */

import { AIModel } from '@/types/premortem';
import { DecisionSession, Message, ExtractedContext } from '@/types/sharedModels';
import * as anthropicAPI from './claudeAPI';
import * as openaiAPI from './openaiAPI';

/* ============================================
   TYPES
   ============================================ */

interface AgentResponse {
  agent: 'optimist' | 'pessimist' | 'realist';
  perspective: string;
  confidence: number; // 0-100
}

interface MultiAgentReasoning {
  agents: AgentResponse[];
  synthesis: string;
  confidence: number; // 0-100
}

interface ConversationIntent {
  type:
    | 'greeting'
    | 'initial_question'
    | 'context_clarification'
    | 'analysis_request'
    | 'question'
    | 'scenario_discussion'
    | 'mitigation_discussion'
    | 'other';
  confidence: number;
  needsMoreContext: boolean;
}

interface OrchestratedResponse {
  content: string;
  reasoning?: string;
  metadata?: {
    model: string;
    confidence: number;
    intent: string;
    extractedContext?: Partial<ExtractedContext>;
  };
}

/* ============================================
   MULTI-AGENT REASONING
   ============================================ */

/**
 * Run internal multi-agent dialogue for enhanced reasoning
 * Uses three perspectives: Optimist, Pessimist, Realist
 */
async function runMultiAgentDialogue(
  prompt: string,
  context: string,
  aiModel: AIModel
): Promise<MultiAgentReasoning> {
  const agentPrompts = {
    optimist: `You are the OPTIMIST agent. Analyze this from a positive, success-focused perspective. What could go right? What opportunities exist? Be constructive but realistic.

CONTEXT: ${context}
USER INPUT: ${prompt}

Provide a 2-3 sentence perspective focusing on positive scenarios and opportunities.`,

    pessimist: `You are the PESSIMIST agent conducting pre-mortem analysis. Analyze this from a critical, risk-focused perspective. What could go wrong? What hidden dangers exist? Be thorough in identifying potential failures.

CONTEXT: ${context}
USER INPUT: ${prompt}

Provide a 2-3 sentence perspective focusing on risks, vulnerabilities, and potential failure modes.`,

    realist: `You are the REALIST agent providing balanced assessment. Consider both opportunities and risks. What's the most likely outcome? What practical considerations matter most?

CONTEXT: ${context}
USER INPUT: ${prompt}

Provide a 2-3 sentence balanced perspective considering both positive and negative aspects.`,
  };

  try {
    // Run all three agents in parallel
    const [optimistResp, pessimistResp, realistResp] = await Promise.all([
      callAI(agentPrompts.optimist, aiModel, 0.7),
      callAI(agentPrompts.pessimist, aiModel, 0.7),
      callAI(agentPrompts.realist, aiModel, 0.6),
    ]);

    const agents: AgentResponse[] = [
      { agent: 'optimist', perspective: optimistResp, confidence: 75 },
      { agent: 'pessimist', perspective: pessimistResp, confidence: 80 },
      { agent: 'realist', perspective: realistResp, confidence: 85 },
    ];

    // Synthesize perspectives into final response
    const synthesisPrompt = `You are synthesizing insights from three analytical perspectives for a pre-mortem analysis.

OPTIMIST PERSPECTIVE:
${optimistResp}

PESSIMIST PERSPECTIVE:
${pessimistResp}

REALIST PERSPECTIVE:
${realistResp}

Create a synthesized response (3-4 sentences) that:
1. Integrates all three perspectives
2. Highlights the most important insights
3. Provides actionable guidance
4. Maintains a balanced but honest tone

Respond with ONLY the synthesized text, no preamble.`;

    const synthesis = await callAI(synthesisPrompt, aiModel, 0.5);

    return {
      agents,
      synthesis,
      confidence: 82, // Average of agent confidences
    };
  } catch (error) {
    console.error('Multi-agent dialogue failed:', error);
    // Fallback to single response
    const fallback = await callAI(prompt, aiModel, 0.7);
    return {
      agents: [{ agent: 'realist', perspective: fallback, confidence: 70 }],
      synthesis: fallback,
      confidence: 70,
    };
  }
}

/* ============================================
   INTENT CLASSIFICATION
   ============================================ */

/**
 * Classify user intent from their message
 */
async function classifyIntent(
  message: string,
  conversationHistory: Message[],
  currentSession: DecisionSession | null,
  aiModel: AIModel
): Promise<ConversationIntent> {
  const historyContext = conversationHistory
    .slice(-3)
    .map((m) => `${m.role}: ${m.content}`)
    .join('\n');

  const sessionContext = currentSession
    ? `Decision: ${currentSession.decision.question || 'Not yet defined'}
Status: ${currentSession.decision.status}
Has context: ${!!currentSession.decision.context}
Options count: ${currentSession.decision.options.length}
Scenarios count: ${currentSession.premortem?.failure_scenarios.length || 0}`
    : 'No active session';

  const prompt = `Classify the user's intent in this conversation.

RECENT HISTORY:
${historyContext || 'No previous messages'}

CURRENT SESSION:
${sessionContext}

USER MESSAGE: "${message}"

Determine:
1. Intent type: greeting, initial_question, context_clarification, analysis_request, question, scenario_discussion, mitigation_discussion, or other
2. Confidence (0-100)
3. Whether more context is needed before analysis

Respond with ONLY valid JSON:
{
  "type": "string",
  "confidence": number,
  "needsMoreContext": boolean,
  "reasoning": "brief explanation"
}`;

  try {
    const response = await callAI(prompt, aiModel, 0.3, true);
    const parsed = JSON.parse(cleanJSONResponse(response));

    return {
      type: parsed.type || 'other',
      confidence: parsed.confidence || 50,
      needsMoreContext: parsed.needsMoreContext || false,
    };
  } catch (error) {
    console.error('Intent classification failed:', error);
    // Fallback heuristics
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.match(/^(hi|hello|hey|good morning|good afternoon)/)) {
      return { type: 'greeting', confidence: 90, needsMoreContext: false };
    }

    if (
      lowerMessage.includes('should i') ||
      lowerMessage.includes('what if') ||
      lowerMessage.includes('decision')
    ) {
      return { type: 'initial_question', confidence: 70, needsMoreContext: true };
    }

    return { type: 'other', confidence: 50, needsMoreContext: true };
  }
}

/* ============================================
   CONTEXT EXTRACTION
   ============================================ */

/**
 * Extract structured context from conversational input
 */
async function extractContextFromConversation(
  conversationHistory: Message[],
  aiModel: AIModel
): Promise<Partial<ExtractedContext>> {
  const conversationText = conversationHistory
    .filter((m) => m.role === 'user')
    .map((m) => m.content)
    .join('\n\n');

  const prompt = `Extract structured decision context from this conversation.

CONVERSATION:
${conversationText}

Identify:
1. Core decision question
2. Key options being considered
3. Important factors/constraints
4. Stakeholders mentioned
5. Timeline or urgency
6. Success criteria

If information is not present, omit the field rather than guessing.

Respond with ONLY valid JSON:
{
  "question": "string or null",
  "options": [{"title": "string", "confidence": number}],
  "factors": [{"name": "string", "weight": number}],
  "stakeholders": [{"name": "string", "role": "string"}],
  "context": "string summary",
  "successCriteria": "string or null",
  "timeline": "string or null"
}`;

  try {
    const response = await callAI(prompt, aiModel, 0.3, true);
    const parsed = JSON.parse(cleanJSONResponse(response));

    return {
      question: parsed.question || undefined,
      options: parsed.options || [],
      factors: parsed.factors || [],
      stakeholders: parsed.stakeholders || [],
      context: parsed.context || '',
      successCriteria: parsed.successCriteria || undefined,
      timeline: parsed.timeline || undefined,
    };
  } catch (error) {
    console.error('Context extraction failed:', error);
    return {};
  }
}

/**
 * Generate clarifying questions (max 2-3)
 */
async function generateClarifyingQuestions(
  currentContext: Partial<ExtractedContext>,
  conversationHistory: Message[],
  aiModel: AIModel
): Promise<string[]> {
  const hasQuestion = !!currentContext.question;
  const hasOptions = (currentContext.options?.length || 0) > 0;
  const hasContext = !!currentContext.context;

  const contextSummary = `
Current understanding:
- Decision question: ${currentContext.question || 'Unknown'}
- Options identified: ${currentContext.options?.length || 0}
- Context provided: ${hasContext ? 'Yes' : 'No'}
- Timeline: ${currentContext.timeline || 'Unknown'}
`;

  const recentMessages = conversationHistory
    .slice(-4)
    .map((m) => `${m.role}: ${m.content}`)
    .join('\n');

  const prompt = `Generate 1-3 brief clarifying questions to better understand the user's decision.

${contextSummary}

RECENT CONVERSATION:
${recentMessages}

Guidelines:
- Ask ONLY what's essential for pre-mortem analysis
- Maximum 2-3 questions (prefer 2)
- Keep questions brief (one sentence each)
- Focus on: missing context, unclear options, success criteria, or timeline
- Don't ask what we already know

Respond with ONLY valid JSON:
{
  "questions": ["string", "string"]
}`;

  try {
    const response = await callAI(prompt, aiModel, 0.7, true);
    const parsed = JSON.parse(cleanJSONResponse(response));

    return (parsed.questions || []).slice(0, 3); // Max 3 questions
  } catch (error) {
    console.error('Question generation failed:', error);
    return [];
  }
}

/* ============================================
   MAIN ORCHESTRATION
   ============================================ */

/**
 * Process user message with full orchestration
 */
export async function processConversationalMessage(
  userMessage: string,
  session: DecisionSession | null,
  conversationHistory: Message[],
  aiModel: AIModel
): Promise<OrchestratedResponse> {
  try {
    // 1. Classify intent
    const intent = await classifyIntent(userMessage, conversationHistory, session, aiModel);

    // 2. Extract context from conversation
    const extractedContext = await extractContextFromConversation(
      [...conversationHistory, { id: 'temp', role: 'user', content: userMessage, timestamp: '' }],
      aiModel
    );

    // 3. Route based on intent
    let response: OrchestratedResponse;

    switch (intent.type) {
      case 'greeting':
        response = await handleGreeting(userMessage, session, aiModel);
        break;

      case 'initial_question':
        response = await handleInitialQuestion(userMessage, extractedContext, aiModel);
        break;

      case 'context_clarification':
        response = await handleContextClarification(
          userMessage,
          extractedContext,
          conversationHistory,
          aiModel
        );
        break;

      case 'analysis_request':
        response = await handleAnalysisRequest(userMessage, session, extractedContext, aiModel);
        break;

      case 'scenario_discussion':
        response = await handleScenarioDiscussion(userMessage, session, aiModel);
        break;

      default:
        response = await handleGeneral(
          userMessage,
          session,
          extractedContext,
          conversationHistory,
          aiModel
        );
    }

    // Add metadata
    response.metadata = {
      model: aiModel.modelId,
      confidence: intent.confidence,
      intent: intent.type,
      extractedContext,
    };

    return response;
  } catch (error) {
    console.error('Orchestration failed:', error);
    return {
      content:
        "I encountered an error processing your message. Could you rephrase or try again? I'm here to help you analyze your decision.",
      metadata: {
        model: aiModel.modelId,
        confidence: 0,
        intent: 'error',
      },
    };
  }
}

/* ============================================
   INTENT HANDLERS
   ============================================ */

async function handleGreeting(
  message: string,
  session: DecisionSession | null,
  aiModel: AIModel
): Promise<OrchestratedResponse> {
  const hasActiveSession = session && session.decision.status === 'active';

  const prompt = `Respond warmly to this greeting: "${message}"

Context: ${hasActiveSession ? `User has an active decision session about: ${session.decision.question}` : 'New user, no active session'}

Your response should:
1. Be friendly and brief (2-3 sentences)
2. ${hasActiveSession ? 'Acknowledge their ongoing decision analysis' : 'Invite them to share a decision they\'re considering'}
3. Set a collaborative, supportive tone

Respond with ONLY the greeting message, no preamble.`;

  const content = await callAI(prompt, aiModel, 0.8);

  return { content };
}

async function handleInitialQuestion(
  message: string,
  extractedContext: Partial<ExtractedContext>,
  aiModel: AIModel
): Promise<OrchestratedResponse> {
  // Use multi-agent reasoning for initial assessment
  const reasoning = await runMultiAgentDialogue(
    message,
    `New decision question: ${message}`,
    aiModel
  );

  // Generate clarifying questions
  const questions = await generateClarifyingQuestions(extractedContext, [], aiModel);

  let content = `I understand you're considering: "${extractedContext.question || message}"\n\n`;
  content += `${reasoning.synthesis}\n\n`;

  if (questions.length > 0) {
    content += `To help me provide better analysis, could you clarify:\n`;
    questions.forEach((q, i) => {
      content += `${i + 1}. ${q}\n`;
    });
  } else {
    content += `I'm ready to analyze potential failure scenarios. Would you like me to start the pre-mortem analysis now?`;
  }

  return {
    content,
    reasoning: `Multi-agent analysis:\n${reasoning.agents.map((a) => `${a.agent.toUpperCase()}: ${a.perspective}`).join('\n\n')}`,
  };
}

async function handleContextClarification(
  message: string,
  extractedContext: Partial<ExtractedContext>,
  conversationHistory: Message[],
  aiModel: AIModel
): Promise<OrchestratedResponse> {
  // Check if we have enough context now
  const hasQuestion = !!extractedContext.question;
  const hasMinimalContext = !!extractedContext.context;

  if (hasQuestion && hasMinimalContext) {
    const content = `Thank you for that context! I now have a good understanding of your decision.

Based on our conversation, here's what I understand:
- Decision: ${extractedContext.question}
- Context: ${extractedContext.context}
${extractedContext.options && extractedContext.options.length > 0 ? `- Options: ${extractedContext.options.map((o) => o.title).join(', ')}` : ''}

Would you like me to start the pre-mortem analysis and identify potential failure scenarios?`;

    return { content };
  }

  // Need more context - ask follow-up
  const questions = await generateClarifyingQuestions(
    extractedContext,
    conversationHistory,
    aiModel
  );

  let content = `Thanks for sharing that. `;

  if (questions.length > 0) {
    content += `A few more questions to refine my analysis:\n`;
    questions.forEach((q, i) => {
      content += `${i + 1}. ${q}\n`;
    });
  } else {
    content += `Do you have any other important context about constraints, stakeholders, or success criteria?`;
  }

  return { content };
}

async function handleAnalysisRequest(
  message: string,
  session: DecisionSession | null,
  extractedContext: Partial<ExtractedContext>,
  aiModel: AIModel
): Promise<OrchestratedResponse> {
  if (!session || !session.decision.question) {
    return {
      content: `I'd be happy to run a pre-mortem analysis! First, could you tell me what decision you're considering?`,
    };
  }

  const content = `I'll analyze potential failure scenarios for: "${session.decision.question}"

This will take a moment as I consider different perspectives (optimistic, pessimistic, and realistic viewpoints) to identify risks you might want to mitigate.

I'll generate 5-8 distinct failure scenarios with likelihood and impact assessments. Ready to proceed?`;

  return { content };
}

async function handleScenarioDiscussion(
  message: string,
  session: DecisionSession | null,
  aiModel: AIModel
): Promise<OrchestratedResponse> {
  if (!session || !session.premortem) {
    return {
      content: `Let's generate failure scenarios first. Could you tell me what decision you're analyzing?`,
    };
  }

  const scenariosContext = session.premortem.failure_scenarios
    .map((s) => `- ${s.title}: ${s.description}`)
    .join('\n');

  const reasoning = await runMultiAgentDialogue(
    message,
    `Decision: ${session.decision.question}\n\nExisting scenarios:\n${scenariosContext}`,
    aiModel
  );

  return {
    content: reasoning.synthesis,
    reasoning: `Multi-agent perspectives:\n${reasoning.agents.map((a) => `${a.agent.toUpperCase()}: ${a.perspective}`).join('\n\n')}`,
  };
}

async function handleGeneral(
  message: string,
  session: DecisionSession | null,
  extractedContext: Partial<ExtractedContext>,
  conversationHistory: Message[],
  aiModel: AIModel
): Promise<OrchestratedResponse> {
  const sessionContext = session
    ? `Active session: ${session.decision.question}\nStatus: ${session.decision.status}`
    : 'No active session';

  const recentHistory = conversationHistory
    .slice(-4)
    .map((m) => `${m.role}: ${m.content}`)
    .join('\n');

  const prompt = `You are Olumi, an AI assistant helping with pre-mortem decision analysis. Respond helpfully to this message.

CONTEXT:
${sessionContext}

RECENT CONVERSATION:
${recentHistory}

USER MESSAGE: "${message}"

Provide a helpful, concise response (2-4 sentences) that:
1. Addresses their question or comment
2. Relates to pre-mortem analysis when appropriate
3. Keeps the conversation progressing toward analysis
4. Is supportive and collaborative

Respond with ONLY your message, no preamble.`;

  const content = await callAI(prompt, aiModel, 0.7);

  return { content };
}

/* ============================================
   UTILITIES
   ============================================ */

/**
 * Call AI provider with proper error handling
 */
async function callAI(
  prompt: string,
  aiModel: AIModel,
  temperature: number = 0.7,
  jsonMode: boolean = false
): Promise<string> {
  try {
    if (aiModel.provider === 'anthropic') {
      const client = new (await import('@anthropic-ai/sdk')).default({
        apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
      });

      const message = await client.messages.create({
        model: aiModel.modelId,
        max_tokens: 1500,
        temperature,
        messages: [{ role: 'user', content: prompt }],
      });

      return message.content[0].type === 'text' ? message.content[0].text : '';
    } else if (aiModel.provider === 'openai') {
      const { default: OpenAI } = await import('openai');
      const client = new OpenAI({
        apiKey: import.meta.env.VITE_OPENAI_API_KEY,
        dangerouslyAllowBrowser: true,
      });

      const response = await client.chat.completions.create({
        model: aiModel.modelId,
        messages: [{ role: 'user', content: prompt }],
        temperature,
        max_tokens: 1500,
        ...(jsonMode ? { response_format: { type: 'json_object' } } : {}),
      });

      return response.choices[0]?.message?.content || '';
    }

    throw new Error(`Unsupported AI provider: ${aiModel.provider}`);
  } catch (error) {
    console.error('AI call failed:', error);
    throw error;
  }
}

/**
 * Clean JSON response by removing markdown formatting
 */
function cleanJSONResponse(text: string): string {
  return text
    .replace(/```json\n?/g, '')
    .replace(/```\n?/g, '')
    .trim();
}

/**
 * Get conversation summary for context
 */
export function getConversationSummary(messages: Message[]): string {
  const userMessages = messages.filter((m) => m.role === 'user').slice(-5);
  return userMessages.map((m) => m.content).join(' | ');
}

/**
 * Check if session has enough context for analysis
 */
export function hasMinimalContextForAnalysis(session: DecisionSession | null): boolean {
  if (!session) return false;

  return (
    !!session.decision.question &&
    !!session.decision.context &&
    session.decision.question.length > 10
  );
}
