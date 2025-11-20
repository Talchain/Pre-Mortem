/**
 * Partnership Evaluation Template
 * Pre-mortem template for strategic partnership decisions
 */

import { PreMortemTemplate } from '@/types/premortem.v1';

export const partnershipEvaluationTemplate: PreMortemTemplate = {
  id: 'partnership-evaluation-v1',
  title: 'Strategic Partnership Evaluation',
  description: 'Assess risks when forming strategic partnerships, channel partnerships, technology integrations, or co-marketing relationships. Covers alignment, execution, dependencies, and relationship dynamics.',
  category: 'partnership',
  difficulty: 'intermediate',
  estimatedTime: '40-55 minutes',
  tags: ['partnership', 'alliance', 'integration', 'channel', 'collaboration'],
  author: {
    name: 'Pre-Mortem Tool',
    organization: 'Decision Intelligence Framework',
  },
  version: '1.0.0',

  decisionTemplate: {
    title: 'Form strategic partnership with {{partner_name}}',
    description: 'We are deciding to form a {{partnership_type}} partnership with {{partner_name}}. The partnership will focus on {{partnership_scope}} with the goal of {{primary_objective}}. This involves {{commitment_level}} commitment from our side.',
    context: '{{partner_name}} is a {{partner_description}} with {{partner_size}} and presence in {{partner_markets}}. They bring {{partner_strengths}} while we provide {{our_value_prop}}. Expected benefits include {{expected_benefits}}. The partnership structure is {{structure}} with {{exclusivity_terms}}. Key stakeholders at partner include {{partner_stakeholders}}.',
    goals: [
      'Generate {{revenue_target}} in partnership-driven revenue within {{timeframe}}',
      'Reach {{customer_target}} net new customers through partnership',
      'Expand into {{market_goal}} markets via partner distribution',
      'Launch {{deliverable}} by {{launch_date}}',
    ],
    constraints: [
      'Investment required: {{partnership_investment}}',
      'Cannot compete with partner in {{restricted_areas}}',
      'Must deliver {{partner_requirements}} by {{deadline}}',
      'Limited to {{resource_allocation}} of team resources',
    ],
    stakeholders: [
      'Partnership team',
      'Sales team',
      'Product team',
      'Engineering team (if integration required)',
      'Marketing team',
      'Legal team',
      'Executive leadership',
      'Partner organization',
    ],
    timeframe: '{{negotiation_start}} - {{partnership_review_date}}',
  },

  scenarioTemplates: [
    {
      title: 'Strategic Misalignment and Goal Divergence',
      description: 'Over time, partner priorities shift and no longer align with the partnership goals. They deprioritize joint initiatives, resources are pulled, and momentum stalls. The partnership becomes one-sided or dormant.',
      likelihood: 'high',
      impact: 'high',
      category: 'strategic',
      rationale: 'Strategic priorities change, especially in dynamic companies. Partnerships require continuous alignment that is difficult to maintain.',
    },
    {
      title: 'Integration and Technical Complexity Failure',
      description: 'Technical integration proves far more complex than expected. APIs are inadequate, data formats are incompatible, or performance issues emerge. Launch delays stretch from weeks to months. User experience suffers.',
      likelihood: 'medium',
      impact: 'high',
      category: 'technical',
      rationale: 'Technical integrations between different systems are consistently underestimated. Documentation and APIs often do not match reality.',
    },
    {
      title: 'Partner Performance and Reliability Issues',
      description: 'Partner fails to deliver on commitments: sales targets are missed, marketing support is inadequate, or technical systems have reliability issues. Their problems become your problems. Customer satisfaction drops.',
      likelihood: 'medium',
      impact: 'high',
      category: 'external',
      rationale: 'You cannot control partner execution quality. Dependencies on partners create risk when they under-deliver.',
    },
    {
      title: 'Competitive Conflict and Channel Confusion',
      description: 'Partner launches competing offering or partners with your competitor. Channel conflict emerges where partner sales team competes with your direct sales. Pricing conflicts and customer confusion result.',
      likelihood: 'medium',
      impact: 'high',
      category: 'strategic',
      rationale: 'Partners often have multiple partnerships and may not maintain exclusivity or avoid conflicts as assumed.',
    },
    {
      title: 'Dependency and Loss of Control',
      description: 'Heavy dependence on partner creates vulnerability. They change terms, raise prices, or deprioritize the partnership. Significant revenue or customers are at risk. Switching costs are prohibitive.',
      likelihood: 'medium',
      impact: 'critical',
      category: 'strategic',
      rationale: 'Partnerships create dependencies. Power dynamics can shift, leaving you vulnerable to partner decisions.',
    },
    {
      title: 'Cultural and Communication Breakdown',
      description: 'Different corporate cultures, communication styles, or decision-making processes create friction. Misunderstandings proliferate. Decision cycles are slow. Teams become frustrated. Collaboration becomes burdensome.',
      likelihood: 'high',
      impact: 'high',
      category: 'organizational',
      rationale: 'Corporate culture differences are significant barriers to partnership success. Communication overhead is often underestimated.',
    },
  ],

  rootCauseTemplates: [
    {
      description: 'Insufficient due diligence on partner capability and reliability',
      type: 'assumption',
      rationale: 'Partnerships are often formed based on presentations and promises rather than thorough validation of capabilities.',
    },
    {
      description: 'Lack of clear governance structure and escalation paths',
      type: 'systemic',
      rationale: 'Many partnerships lack formal governance, leading to drift and unresolved conflicts.',
    },
    {
      description: 'Over-optimistic assumptions about partner commitment and prioritization',
      type: 'assumption',
      rationale: 'Partners often have competing priorities. Initial enthusiasm does not always translate to sustained commitment.',
    },
    {
      description: 'Inadequate technical discovery and integration planning',
      type: 'capability',
      rationale: 'Technical integration complexity is regularly underestimated without deep technical due diligence.',
    },
    {
      description: 'Unclear success metrics and accountability',
      type: 'systemic',
      rationale: 'Partnerships often lack clear KPIs and accountability mechanisms to ensure mutual delivery.',
    },
  ],

  mitigationTemplates: [
    {
      strategy: 'Conduct thorough due diligence on partner capabilities and track record',
      effort: 'medium',
      effectiveness: 'high',
      bestPractices: [
        'Reference check with 3-5 of their other partners',
        'Validate technical capabilities with proof-of-concept',
        'Assess their market reputation and customer satisfaction',
        'Understand their strategic priorities and roadmap',
        'Evaluate financial stability and commitment capacity',
      ],
    },
    {
      strategy: 'Establish clear governance structure with executive sponsorship',
      effort: 'low',
      effectiveness: 'high',
      bestPractices: [
        'Assign executive sponsors from both organizations',
        'Create joint steering committee meeting quarterly',
        'Define escalation paths for conflicts',
        'Establish regular business review cadence',
        'Document decision-making authority and processes',
      ],
    },
    {
      strategy: 'Define explicit success metrics and mutual accountability',
      effort: 'low',
      effectiveness: 'medium',
      bestPractices: [
        'Set clear revenue or customer acquisition targets',
        'Define deliverables and timelines for each party',
        'Create shared dashboard for partnership metrics',
        'Include performance clauses in partnership agreement',
        'Review metrics monthly and address underperformance',
      ],
    },
    {
      strategy: 'Plan technical integration with rigorous testing and fallback options',
      effort: 'high',
      effectiveness: 'high',
      bestPractices: [
        'Conduct technical POC before formal agreement',
        'Create detailed integration specification and timeline',
        'Identify integration dependencies and risks',
        'Build integration with loose coupling and fallback modes',
        'Plan for API versioning and backward compatibility',
      ],
    },
    {
      strategy: 'Limit initial commitment and plan for staged expansion',
      effort: 'low',
      effectiveness: 'medium',
      bestPractices: [
        'Start with pilot or limited scope to validate model',
        'Use short initial contract term (12 months) with renewals',
        'Avoid exclusivity until partnership proves valuable',
        'Define clear success criteria for expanding partnership',
        'Maintain alternative options and avoid over-dependency',
      ],
    },
  ],

  guidanceNotes: {
    when_to_use: 'Use this template for strategic partnerships (channel, technology, co-marketing), platform integrations, distribution agreements, or any significant collaborative relationship with external organizations. Critical when partnerships involve dependencies, integrations, or significant resource commitment.',
    common_pitfalls: [
      'Insufficient due diligence on partner capabilities',
      'Over-optimistic assumptions about partner commitment',
      'Lack of clear governance and accountability',
      'Underestimating technical integration complexity',
      'Creating excessive dependency on partner',
      'Poor communication and cultural misalignment',
      'Inadequate contract terms and exit provisions',
      'Treating partnership as "set and forget" vs. requiring active management',
    ],
    success_patterns: [
      'Conduct thorough due diligence including reference checks',
      'Start with limited pilot to validate partnership model',
      'Establish strong governance with executive sponsorship',
      'Define clear success metrics and accountability',
      'Invest in relationship building and communication',
      'Plan technical integration rigorously with testing',
      'Maintain alternative options and limit dependency',
      'Review partnership performance regularly and adjust',
    ],
  },
};
