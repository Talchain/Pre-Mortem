/**
 * Market Expansion Template
 * Pre-mortem template for entering new markets or geographies
 */

import { PreMortemTemplate } from '@/types/premortem.v1';

export const marketExpansionTemplate: PreMortemTemplate = {
  id: 'market-expansion-v1',
  title: 'Market Expansion Strategy',
  description: 'Analyze risks when expanding to new geographic markets, customer segments, or industry verticals. Covers market validation, localization, regulatory compliance, and go-to-market execution.',
  category: 'market',
  difficulty: 'advanced',
  estimatedTime: '50-75 minutes',
  tags: ['market expansion', 'geographic', 'internationalization', 'growth', 'strategy'],
  author: {
    name: 'Pre-Mortem Tool',
    organization: 'Decision Intelligence Framework',
  },
  version: '1.0.0',

  decisionTemplate: {
    title: 'Expand into {{target_market}}',
    description: 'We are planning to expand our business into {{target_market}}. This represents {{market_opportunity}} in potential revenue and {{strategic_rationale}}. We will enter through {{entry_strategy}} targeting {{customer_segment}}.',
    context: 'Currently, we operate in {{current_markets}} with {{revenue}} in annual revenue. Market research indicates {{market_size}} opportunity in {{target_market}}. Key differences include {{market_differences}}. We plan to invest {{investment}} over {{timeframe}}. Our competitive positioning will be {{positioning}} against local players {{local_competitors}}.',
    goals: [
      'Achieve {{revenue_target}} in revenue from {{target_market}} within {{timeframe}}',
      'Acquire {{customer_target}} customers in first year',
      'Establish {{market_share}}% market share in {{segment}}',
      'Reach profitability in {{target_market}} within {{timeline}}',
    ],
    constraints: [
      'Budget: {{expansion_budget}}',
      'Must comply with {{regulatory_requirements}}',
      'Limited to {{team_size}} dedicated resources',
      'Timeline: Launch by {{launch_date}}',
    ],
    stakeholders: [
      'Current customers in target market',
      'Local team members and partners',
      'Sales and marketing teams',
      'Product and engineering teams',
      'Legal and compliance teams',
      'Executive leadership',
      'Investors/board',
    ],
    timeframe: '{{planning_start}} - {{profitability_target_date}}',
  },

  scenarioTemplates: [
    {
      title: 'Market Need Validation Failure',
      description: 'The product-market fit that works in current markets does not translate to the new market. Customer needs, buying behaviors, or value perceptions are fundamentally different. The assumed demand does not materialize.',
      likelihood: 'high',
      impact: 'critical',
      category: 'market',
      rationale: 'Markets vary significantly in needs, preferences, and purchasing behaviors. Assumptions from one market rarely transfer perfectly.',
    },
    {
      title: 'Regulatory and Compliance Roadblocks',
      description: 'Unexpected regulatory requirements delay or prevent market entry. Data sovereignty, licensing, certifications, or local content requirements prove more complex and expensive than anticipated. Legal risks emerge.',
      likelihood: 'medium',
      impact: 'high',
      category: 'regulatory',
      rationale: 'Regulatory environments differ dramatically across markets, especially for data, financial services, healthcare, and SaaS. Surprises are common.',
    },
    {
      title: 'Localization and Cultural Misalignment',
      description: 'Product, messaging, or business practices fail to resonate due to inadequate localization. Language, cultural norms, payment methods, or support expectations create barriers. Brand is perceived as foreign and irrelevant.',
      likelihood: 'high',
      impact: 'high',
      category: 'market',
      rationale: 'Effective localization goes far beyond translation. Cultural context, norms, and expectations require deep understanding.',
    },
    {
      title: 'Underestimated Local Competition',
      description: 'Local competitors prove more formidable than expected. They have stronger brand recognition, distribution advantages, pricing power, or government relationships. Market is harder to penetrate than projected.',
      likelihood: 'medium',
      impact: 'high',
      category: 'strategic',
      rationale: 'Local players often have advantages that are invisible from outside: relationships, cultural understanding, regulatory knowledge.',
    },
    {
      title: 'Go-to-Market Execution Breakdown',
      description: 'Sales and marketing strategies that work in current markets fail in new market. Channel partnerships fall through, marketing campaigns miss the mark, or sales cycles are longer than expected. Burn rate exceeds plan.',
      likelihood: 'high',
      impact: 'high',
      category: 'market',
      rationale: 'Distribution channels, marketing effectiveness, and sales processes are highly market-specific. Direct transfer rarely works.',
    },
    {
      title: 'Resource Drain on Core Business',
      description: 'The expansion diverts critical resources, attention, and funding from core business. Performance in existing markets suffers. Team morale drops as expansion struggles consume leadership focus. ROI never materializes.',
      likelihood: 'medium',
      impact: 'critical',
      category: 'strategic',
      rationale: 'Market expansion often underestimates resource requirements and distracts from core business that generates current revenue.',
    },
  ],

  rootCauseTemplates: [
    {
      description: 'Insufficient on-the-ground market research and customer discovery',
      type: 'assumption',
      rationale: 'Companies often rely on secondary research and assumptions rather than direct customer engagement in target market.',
    },
    {
      description: 'Underestimating regulatory complexity and compliance requirements',
      type: 'assumption',
      rationale: 'Regulatory landscapes are complex and often opaque to outsiders. Full requirements only become clear through deep engagement.',
    },
    {
      description: 'Lack of local market expertise and cultural understanding',
      type: 'capability',
      rationale: 'Expanding without local team members or advisors who deeply understand the market context.',
    },
    {
      description: 'Aggressive timeline driven by growth targets rather than market reality',
      type: 'constraint',
      rationale: 'Investor pressure or growth goals often push unrealistic expansion timelines.',
    },
    {
      description: 'Inadequate investment relative to market complexity',
      type: 'constraint',
      rationale: 'Companies often under-budget for market expansion, treating it as incremental rather than greenfield.',
    },
  ],

  mitigationTemplates: [
    {
      strategy: 'Conduct extensive market validation with local customer research',
      effort: 'high',
      effectiveness: 'high',
      bestPractices: [
        'Spend 3-6 months in market doing customer discovery before committing',
        'Interview 50+ potential customers to validate need and willingness to pay',
        'Run pilot program with 5-10 early customers before full launch',
        'Validate business model and pricing in local context',
        'Identify market-specific success metrics',
      ],
    },
    {
      strategy: 'Engage local legal and regulatory experts early in planning',
      effort: 'medium',
      effectiveness: 'high',
      bestPractices: [
        'Hire local legal counsel with market-specific expertise',
        'Map all regulatory requirements 6-12 months before launch',
        'Build regulatory compliance into product roadmap',
        'Identify required licenses, certifications, and approvals',
        'Create compliance checklist and timeline',
      ],
    },
    {
      strategy: 'Build local team with market expertise and cultural fluency',
      effort: 'high',
      effectiveness: 'high',
      bestPractices: [
        'Hire local country manager with deep market networks',
        'Build diverse local team representing customer base',
        'Engage local advisors and board members',
        'Partner with local firms for distribution and support',
        'Establish local presence (office) to build credibility',
      ],
    },
    {
      strategy: 'Develop comprehensive localization beyond language translation',
      effort: 'high',
      effectiveness: 'high',
      bestPractices: [
        'Localize product UI, messaging, and support for local norms',
        'Integrate local payment methods and currencies',
        'Adapt pricing and packaging for local market conditions',
        'Create locally relevant case studies and marketing content',
        'Ensure customer support available in local language and timezone',
      ],
    },
    {
      strategy: 'Use staged rollout approach with clear go/no-go decision gates',
      effort: 'medium',
      effectiveness: 'medium',
      bestPractices: [
        'Phase 1: Market research and pilot (6 months)',
        'Phase 2: Limited launch with early adopters (6 months)',
        'Phase 3: Full market launch with local team (12+ months)',
        'Establish decision criteria at each gate',
        'Be willing to pivot or exit if validation fails',
      ],
    },
  ],

  guidanceNotes: {
    when_to_use: 'Use this template for geographic expansion (international or new domestic markets), entering new industry verticals, or targeting significantly different customer segments. Critical for SaaS, marketplace, and eCommerce businesses.',
    common_pitfalls: [
      'Assuming product-market fit transfers across markets',
      'Underestimating regulatory and compliance complexity',
      'Inadequate localization and cultural adaptation',
      'Insufficient local market expertise and relationships',
      'Aggressive timelines that do not account for market learning',
      'Under-budgeting relative to market complexity',
      'Focusing on market size rather than validation and fit',
      'Distracting from core business without clear ROI path',
    ],
    success_patterns: [
      'Spend significant time in market before committing to full expansion',
      'Hire strong local leader with deep market networks and credibility',
      'Invest in comprehensive localization, not just translation',
      'Use phased approach with clear validation gates',
      'Partner with local firms for distribution and market access',
      'Build relationships with local ecosystem and influencers',
      'Adapt product and business model to local market reality',
      'Maintain patience and realistic timeline expectations',
    ],
  },
};
