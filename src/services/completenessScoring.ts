/**
 * Completeness Scoring Service
 * Evaluates how thorough a pre-mortem analysis is
 * Provides actionable suggestions for improvement
 */

import { DecisionSession } from '@/types/sharedModels';

export interface CompletenessScore {
  overall: number; // 0-100
  categories: {
    decisionFraming: CategoryScore;
    scenarioAnalysis: CategoryScore;
    mitigationPlanning: CategoryScore;
    stakeholderConsideration: CategoryScore;
  };
  suggestions: Suggestion[];
}

export interface CategoryScore {
  score: number; // 0-100
  weight: number; // Contribution to overall score
  items: ScoreItem[];
}

export interface ScoreItem {
  name: string;
  completed: boolean;
  points: number;
  maxPoints: number;
}

export interface Suggestion {
  category: string;
  priority: 'high' | 'medium' | 'low';
  message: string;
  action?: string; // Suggested action
}

/**
 * Calculate comprehensive score for a decision session
 */
export function calculateCompletenessScore(session: DecisionSession | null): CompletenessScore {
  if (!session) {
    return {
      overall: 0,
      categories: {
        decisionFraming: createEmptyCategory(),
        scenarioAnalysis: createEmptyCategory(),
        mitigationPlanning: createEmptyCategory(),
        stakeholderConsideration: createEmptyCategory(),
      },
      suggestions: [
        {
          category: 'Getting Started',
          priority: 'high',
          message: 'Start by framing your decision',
          action: 'Begin a new pre-mortem analysis',
        },
      ],
    };
  }

  const decisionFraming = scoreDecisionFraming(session);
  const scenarioAnalysis = scoreScenarioAnalysis(session);
  const mitigationPlanning = scoreMitigationPlanning(session);
  const stakeholderConsideration = scoreStakeholderConsideration(session);

  // Calculate weighted overall score
  const categories = {
    decisionFraming,
    scenarioAnalysis,
    mitigationPlanning,
    stakeholderConsideration,
  };

  const overall = Object.values(categories).reduce(
    (sum, cat) => sum + cat.score * cat.weight,
    0
  );

  const suggestions = generateSuggestions(session, categories);

  return {
    overall: Math.round(overall),
    categories,
    suggestions,
  };
}

/**
 * Score decision framing completeness
 */
function scoreDecisionFraming(session: DecisionSession): CategoryScore {
  const items: ScoreItem[] = [
    {
      name: 'Decision question defined',
      completed: !!session.decision.question,
      points: session.decision.question ? 15 : 0,
      maxPoints: 15,
    },
    {
      name: 'Context provided',
      completed: !!session.decision.context && session.decision.context.length > 50,
      points: session.decision.context && session.decision.context.length > 50 ? 20 : 0,
      maxPoints: 20,
    },
    {
      name: 'Options identified',
      completed: session.decision.options.length >= 2,
      points: Math.min(session.decision.options.length * 10, 25),
      maxPoints: 25,
    },
    {
      name: 'Key factors listed',
      completed: session.decision.factors.length >= 3,
      points: Math.min(session.decision.factors.length * 5, 25),
      maxPoints: 25,
    },
    {
      name: 'Factor types varied',
      completed: new Set(session.decision.factors.map((f) => f.type)).size >= 2,
      points: new Set(session.decision.factors.map((f) => f.type)).size >= 2 ? 15 : 0,
      maxPoints: 15,
    },
  ];

  const score = items.reduce((sum, item) => sum + item.points, 0);

  return {
    score,
    weight: 0.20, // 20% of overall score
    items,
  };
}

/**
 * Score scenario analysis completeness
 */
function scoreScenarioAnalysis(session: DecisionSession): CategoryScore {
  const scenarios = session.premortem?.failure_scenarios || [];
  const hasScenarios = scenarios.length > 0;

  const scenariosWithDetails = scenarios.filter(
    (s) => s.root_causes && s.root_causes.length > 0 && s.early_warning_signs && s.early_warning_signs.length > 0
  ).length;

  const hasHighRiskScenarios = scenarios.some((s) => s.impact === 'catastrophic' || s.impact === 'major');
  const hasVariedLikelihood = new Set(scenarios.map((s) => Math.floor(s.likelihood / 34))).size >= 2;

  const items: ScoreItem[] = [
    {
      name: 'Failure scenarios generated',
      completed: scenarios.length >= 3,
      points: Math.min(scenarios.length * 8, 25),
      maxPoints: 25,
    },
    {
      name: 'Root causes identified',
      completed: scenariosWithDetails >= 2,
      points: scenariosWithDetails * 10,
      maxPoints: 30,
    },
    {
      name: 'Early warning signs defined',
      completed: scenariosWithDetails >= 2,
      points: scenariosWithDetails * 8,
      maxPoints: 25,
    },
    {
      name: 'High-impact scenarios considered',
      completed: hasHighRiskScenarios,
      points: hasHighRiskScenarios ? 10 : 0,
      maxPoints: 10,
    },
    {
      name: 'Varied likelihood assessment',
      completed: hasVariedLikelihood,
      points: hasVariedLikelihood ? 10 : 0,
      maxPoints: 10,
    },
  ];

  const score = items.reduce((sum, item) => sum + item.points, 0);

  return {
    score,
    weight: 0.40, // 40% of overall score (most important)
    items,
  };
}

/**
 * Score mitigation planning completeness
 */
function scoreMitigationPlanning(session: DecisionSession): CategoryScore {
  const mitigations = session.premortem?.mitigations || [];
  const hasMitigations = mitigations.length > 0;

  const mitigationsWithActions = mitigations.filter((m) => m.actions && m.actions.length > 0).length;
  const priorityMitigations = mitigations.filter((m) => m.priority).length;
  const assignedMitigations = mitigations.filter((m) => m.owner).length;

  const items: ScoreItem[] = [
    {
      name: 'Mitigation strategies defined',
      completed: mitigations.length >= 3,
      points: Math.min(mitigations.length * 10, 30),
      maxPoints: 30,
    },
    {
      name: 'Action items specified',
      completed: mitigationsWithActions >= 2,
      points: mitigationsWithActions * 10,
      maxPoints: 30,
    },
    {
      name: 'Priorities assigned',
      completed: priorityMitigations >= 2,
      points: priorityMitigations * 10,
      maxPoints: 20,
    },
    {
      name: 'Owners assigned',
      completed: assignedMitigations >= 1,
      points: assignedMitigations * 10,
      maxPoints: 20,
    },
  ];

  const score = items.reduce((sum, item) => sum + item.points, 0);

  return {
    score,
    weight: 0.25, // 25% of overall score
    items,
  };
}

/**
 * Score stakeholder consideration completeness
 */
function scoreStakeholderConsideration(session: DecisionSession): CategoryScore {
  const stakeholders = session.decision.stakeholders;

  const keyStakeholders = stakeholders.filter((s) => s.influence === 'high').length;

  const items: ScoreItem[] = [
    {
      name: 'Stakeholders identified',
      completed: stakeholders.length >= 3,
      points: Math.min(stakeholders.length * 10, 40),
      maxPoints: 40,
    },
    {
      name: 'Key stakeholders prioritized',
      completed: keyStakeholders >= 2,
      points: keyStakeholders * 15,
      maxPoints: 30,
    },
    {
      name: 'Influence levels assessed',
      completed: stakeholders.every((s) => s.influence),
      points: stakeholders.every((s) => s.influence) && stakeholders.length > 0 ? 30 : 0,
      maxPoints: 30,
    },
  ];

  const score = items.reduce((sum, item) => sum + item.points, 0);

  return {
    score,
    weight: 0.15, // 15% of overall score
    items,
  };
}

/**
 * Generate actionable suggestions based on scores
 */
function generateSuggestions(
  session: DecisionSession,
  categories: CompletenessScore['categories']
): Suggestion[] {
  const suggestions: Suggestion[] = [];

  // Decision Framing suggestions
  if (categories.decisionFraming.score < 60) {
    if (!session.decision.context || session.decision.context.length < 50) {
      suggestions.push({
        category: 'Decision Framing',
        priority: 'high',
        message: 'Add more context to your decision',
        action: 'Describe the background, goals, and constraints in detail',
      });
    }
    if (session.decision.options.length < 2) {
      suggestions.push({
        category: 'Decision Framing',
        priority: 'high',
        message: 'Identify alternative options',
        action: 'List at least 2-3 different approaches to consider',
      });
    }
    if (session.decision.factors.length < 3) {
      suggestions.push({
        category: 'Decision Framing',
        priority: 'medium',
        message: 'Define key decision factors',
        action: 'What criteria matter most for this decision?',
      });
    }
  }

  // Scenario Analysis suggestions
  if (categories.scenarioAnalysis.score < 60) {
    const scenarios = session.premortem?.failure_scenarios || [];

    if (scenarios.length < 3) {
      suggestions.push({
        category: 'Scenario Analysis',
        priority: 'high',
        message: 'Generate more failure scenarios',
        action: 'Ask Olumi to identify potential failure modes',
      });
    }

    const scenariosWithoutCauses = scenarios.filter((s) => !s.root_causes || s.root_causes.length === 0);
    if (scenariosWithoutCauses.length > 0) {
      suggestions.push({
        category: 'Scenario Analysis',
        priority: 'high',
        message: `${scenariosWithoutCauses.length} scenario(s) missing root cause analysis`,
        action: 'Ask "What are the root causes of [scenario]?"',
      });
    }

    const scenariosWithoutWarnings = scenarios.filter(
      (s) => !s.early_warning_signs || s.early_warning_signs.length === 0
    );
    if (scenariosWithoutWarnings.length > 0) {
      suggestions.push({
        category: 'Scenario Analysis',
        priority: 'medium',
        message: `${scenariosWithoutWarnings.length} scenario(s) missing early warning signs`,
        action: 'Ask "What early signs would indicate this is happening?"',
      });
    }
  }

  // Mitigation Planning suggestions
  if (categories.mitigationPlanning.score < 60) {
    const mitigations = session.premortem?.mitigations || [];

    if (mitigations.length === 0) {
      suggestions.push({
        category: 'Mitigation Planning',
        priority: 'high',
        message: 'Create mitigation strategies',
        action: 'Ask "How can I prevent or reduce the impact of these risks?"',
      });
    } else {
      const mitigationsWithoutActions = mitigations.filter((m) => !m.actions || m.actions.length === 0);
      if (mitigationsWithoutActions.length > 0) {
        suggestions.push({
          category: 'Mitigation Planning',
          priority: 'medium',
          message: `${mitigationsWithoutActions.length} mitigation(s) need action items`,
          action: 'Define specific steps for each mitigation',
        });
      }

      const mitigationsWithoutOwners = mitigations.filter((m) => !m.owner);
      if (mitigationsWithoutOwners.length === mitigations.length) {
        suggestions.push({
          category: 'Mitigation Planning',
          priority: 'low',
          message: 'Assign owners to mitigations',
          action: 'Who will be responsible for each action?',
        });
      }
    }
  }

  // Stakeholder Consideration suggestions
  if (categories.stakeholderConsideration.score < 60) {
    if (session.decision.stakeholders.length < 3) {
      suggestions.push({
        category: 'Stakeholder Consideration',
        priority: 'medium',
        message: 'Identify all stakeholders',
        action: 'Who will be affected by or influence this decision?',
      });
    }

    const keyStakeholders = session.decision.stakeholders.filter(
      (s) => s.influence === 'high'
    );
    if (keyStakeholders.length < 2) {
      suggestions.push({
        category: 'Stakeholder Consideration',
        priority: 'medium',
        message: 'Identify key stakeholders',
        action: 'Who has the most influence or will be most affected?',
      });
    }
  }

  // Sort by priority
  const priorityOrder = { high: 1, medium: 2, low: 3 };
  suggestions.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return suggestions.slice(0, 6); // Return top 6 suggestions
}

/**
 * Helper to create empty category
 */
function createEmptyCategory(): CategoryScore {
  return {
    score: 0,
    weight: 0,
    items: [],
  };
}

/**
 * Get completeness level description
 */
export function getCompletenessLevel(score: number): {
  label: string;
  description: string;
  color: string;
} {
  if (score >= 90) {
    return {
      label: 'Excellent',
      description: 'Comprehensive pre-mortem analysis',
      color: '#67C89E', // mint-500
    };
  } else if (score >= 75) {
    return {
      label: 'Good',
      description: 'Well-developed analysis with minor gaps',
      color: '#63ADCF', // sky-500
    };
  } else if (score >= 50) {
    return {
      label: 'Fair',
      description: 'Basic coverage, needs more depth',
      color: '#F5C433', // sun-500
    };
  } else if (score >= 25) {
    return {
      label: 'Limited',
      description: 'Significant gaps in analysis',
      color: '#EA7B4B', // carrot-500
    };
  } else {
    return {
      label: 'Incomplete',
      description: 'Just getting started',
      color: '#D96A3C', // carrot-600
    };
  }
}
