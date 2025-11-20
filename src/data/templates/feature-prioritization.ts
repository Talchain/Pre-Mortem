/**
 * Feature Prioritization Template
 * Pre-mortem template for product roadmap and feature decisions
 */

import { PreMortemTemplate } from '@/types/premortem.v1';

export const featurePrioritizationTemplate: PreMortemTemplate = {
  id: 'feature-prioritization-v1',
  title: 'Feature Prioritization Decision',
  description: 'Evaluate risks when choosing which features to build and in what order. Covers opportunity cost, technical debt, resource allocation, and customer impact of roadmap decisions.',
  category: 'product',
  difficulty: 'beginner',
  estimatedTime: '30-40 minutes',
  tags: ['product', 'roadmap', 'features', 'prioritization', 'engineering'],
  author: {
    name: 'Pre-Mortem Tool',
    organization: 'Decision Intelligence Framework',
  },
  version: '1.0.0',

  decisionTemplate: {
    title: 'Prioritize {{feature_name}} over {{alternative_features}}',
    description: 'We are deciding to prioritize building {{feature_name}} and dedicate {{team_allocation}} of engineering resources for {{timeframe}}. This means deprioritizing {{alternative_features}}. The rationale is {{strategic_justification}}.',
    context: 'Our product roadmap has {{backlog_size}} items in the backlog. Key stakeholders are requesting {{stakeholder_requests}}. Customer feedback indicates {{customer_needs}}. Technical debt items include {{tech_debt_items}}. Competitive pressure exists around {{competitive_features}}. Available engineering capacity is {{eng_capacity}} developer-weeks per quarter.',
    goals: [
      'Deliver {{feature_name}} within {{timeline}}',
      'Achieve {{adoption_target}}% user adoption within {{timeframe}}',
      'Improve {{success_metric}} by {{target_improvement}}%',
      'Maintain technical quality and avoid regression',
    ],
    constraints: [
      'Engineering capacity: {{team_size}} engineers for {{duration}}',
      'Must launch by {{deadline}} due to {{deadline_reason}}',
      'Cannot compromise on {{non_negotiable_quality}}',
      'Budget: {{development_budget}}',
    ],
    stakeholders: [
      'Product management',
      'Engineering team',
      'Design team',
      'Customers requesting this feature',
      'Sales team',
      'Customer success team',
      'Executive leadership',
    ],
    timeframe: '{{planning_start}} - {{feature_launch_date}}',
  },

  scenarioTemplates: [
    {
      title: 'Feature Adoption Failure',
      description: 'The feature is built and launched but users do not adopt it. Usage metrics remain low. Customer feedback indicates the implementation does not solve their problem effectively, or the feature is too complex. Engineering effort yields minimal impact.',
      likelihood: 'high',
      impact: 'high',
      category: 'market',
      rationale: 'Many features are built based on assumptions rather than validated needs. Even requested features often go unused if implementation misses the mark.',
    },
    {
      title: 'Massive Scope Creep and Timeline Overrun',
      description: 'What seemed like a straightforward feature reveals hidden complexity. Scope expands as edge cases emerge. Timeline stretches from {{initial_estimate}} to {{actual_timeline}}. Other roadmap items are blocked or delayed.',
      likelihood: 'high',
      impact: 'high',
      category: 'technical',
      rationale: 'Software estimation is notoriously difficult. Features often require refactoring existing systems, handling edge cases, and integrating with multiple systems.',
    },
    {
      title: 'Technical Debt Accumulation and System Degradation',
      description: 'Prioritizing new features over technical debt causes system quality to degrade. Performance slows, bugs increase, and developer velocity drops. Technical team morale suffers. Future feature development becomes increasingly difficult.',
      likelihood: 'medium',
      impact: 'high',
      category: 'technical',
      rationale: 'Technical debt compounds over time. Continually prioritizing features over infrastructure eventually creates a productivity crisis.',
    },
    {
      title: 'Key Customer Churn Due to Unaddressed Needs',
      description: 'While building the new feature, critical customer needs and bug fixes are deprioritized. High-value customers become frustrated with lack of responsiveness to their issues. Several churn, citing unmet expectations.',
      likelihood: 'medium',
      impact: 'high',
      category: 'market',
      rationale: 'Feature-driven roadmaps can neglect maintenance and customer-specific needs. Churn often results from accumulated small frustrations.',
    },
    {
      title: 'Competitive Advantage Loss',
      description: 'While resources focus on {{feature_name}}, competitors ship the features where you had differentiation. Your competitive position weakens. Deals are lost because your product falls behind in key areas.',
      likelihood: 'medium',
      impact: 'high',
      category: 'strategic',
      rationale: 'Prioritization is about trade-offs. Choosing one feature means competitors may outpace you in others.',
    },
    {
      title: 'Team Burnout from Constant Pivoting',
      description: 'Priorities change frequently based on loudest voice or latest request. Engineering team becomes demoralized from constant context switching and incomplete work. Velocity drops and attrition increases.',
      likelihood: 'medium',
      impact: 'high',
      category: 'organizational',
      rationale: 'Unstable priorities and frequent pivots are demoralizing. Teams need focus and the satisfaction of completing work.',
    },
  ],

  rootCauseTemplates: [
    {
      description: 'Insufficient customer validation before committing resources',
      type: 'assumption',
      rationale: 'Teams often build based on requests or intuition rather than validated customer problems and willingness to use.',
    },
    {
      description: 'Poor estimation practices and inadequate technical discovery',
      type: 'capability',
      rationale: 'Teams underestimate complexity and fail to do technical spikes before committing to timelines.',
    },
    {
      description: 'Lack of prioritization framework and objective decision-making',
      type: 'systemic',
      rationale: 'Without clear framework, prioritization becomes political or reactive to loudest voice.',
    },
    {
      description: 'Pressure from sales or leadership to build specific features',
      type: 'external',
      rationale: 'Feature requests from large customers or executives often bypass normal prioritization.',
    },
    {
      description: 'Technical debt not treated as legitimate roadmap item',
      type: 'systemic',
      rationale: 'Many organizations do not allocate dedicated capacity for technical health and debt reduction.',
    },
  ],

  mitigationTemplates: [
    {
      strategy: 'Validate customer need and expected impact before development',
      effort: 'low',
      effectiveness: 'high',
      bestPractices: [
        'Interview 10+ customers about the problem and proposed solution',
        'Create clickable prototype and test with users',
        'Define clear success metrics and adoption targets',
        'Identify customers who will be early adopters',
        'Run small pilot before full build if possible',
      ],
    },
    {
      strategy: 'Conduct technical discovery and detailed estimation',
      effort: 'medium',
      effectiveness: 'high',
      bestPractices: [
        'Run 1-2 week technical spike before committing to timeline',
        'Break feature into small increments for iterative delivery',
        'Identify technical dependencies and risks',
        'Add 50% buffer to engineering estimates',
        'Plan for technical debt in implementation',
      ],
    },
    {
      strategy: 'Implement objective prioritization framework',
      effort: 'low',
      effectiveness: 'medium',
      bestPractices: [
        'Score features on impact, confidence, ease (ICE) or RICE framework',
        'Allocate capacity percentages: 70% features, 20% tech debt, 10% bugs',
        'Review and reprioritize quarterly, not weekly',
        'Document trade-offs and decisions in decision log',
        'Resist ad-hoc priority changes mid-sprint',
      ],
    },
    {
      strategy: 'Create dedicated capacity for technical health and customer support',
      effort: 'low',
      effectiveness: 'high',
      bestPractices: [
        'Reserve 20% of capacity for technical debt and infrastructure',
        'Assign dedicated engineer(s) for customer escalations',
        'Track tech debt and include in roadmap planning',
        'Monitor system health metrics and address degradation',
        'Celebrate technical improvements, not just features',
      ],
    },
    {
      strategy: 'Establish clear decision-making authority and criteria',
      effort: 'low',
      effectiveness: 'medium',
      bestPractices: [
        'Define who makes final prioritization decisions',
        'Create process for evaluating urgent requests',
        'Require business case and success criteria for all features',
        'Communicate roadmap and rationale transparently',
        'Protect team from constant reprioritization',
      ],
    },
  ],

  guidanceNotes: {
    when_to_use: 'Use this template when making significant product roadmap decisions, especially when choosing between competing feature requests, balancing new development with technical debt, or allocating limited engineering resources.',
    common_pitfalls: [
      'Building features based on assumptions rather than validated needs',
      'Underestimating complexity and timeline',
      'Neglecting technical debt in favor of features',
      'Constantly reprioritizing and creating team whiplash',
      'Letting loudest voice or biggest customer drive roadmap',
      'Not validating features will be used before building',
      'Failing to measure and learn from feature success/failure',
      'Not reserving capacity for bugs and customer escalations',
    ],
    success_patterns: [
      'Validate customer need and expected impact before development',
      'Use objective framework (ICE, RICE) for prioritization',
      'Do technical discovery before committing to timeline',
      'Allocate dedicated capacity for tech debt and customer issues',
      'Review roadmap quarterly with stable priorities in between',
      'Measure feature adoption and iterate or kill non-performers',
      'Break large features into small increments for learning',
      'Communicate roadmap and trade-offs transparently',
    ],
  },
};
