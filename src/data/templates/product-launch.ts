/**
 * Product Launch Template
 * Pre-mortem template for new product launches
 */

import { PreMortemTemplate } from '@/types/premortem.v1';

export const productLaunchTemplate: PreMortemTemplate = {
  id: 'product-launch-v1',
  title: 'Product Launch',
  description: 'Comprehensive pre-mortem analysis for launching a new product or major feature. Covers market reception, technical readiness, go-to-market execution, and competitive positioning.',
  category: 'product',
  difficulty: 'beginner',
  estimatedTime: '30-45 minutes',
  tags: ['product', 'launch', 'go-to-market', 'customer', 'competition'],
  author: {
    name: 'Pre-Mortem Tool',
    organization: 'Decision Intelligence Framework',
  },
  version: '1.0.0',

  decisionTemplate: {
    title: 'Launch {{product_name}} to {{target_market}}',
    description: 'We are planning to launch {{product_name}}, a {{product_description}}. The launch is targeted at {{target_market}} with the goal of {{primary_goal}}.',
    context: 'Our team has been developing {{product_name}} for {{development_duration}}. We believe it addresses {{customer_pain_point}} and differentiates from existing solutions by {{key_differentiator}}. The competitive landscape includes {{main_competitors}}. We plan to launch through {{launch_channels}} with initial pricing of {{pricing_model}}.',
    goals: [
      'Achieve {{user_acquisition_target}} users/customers in first {{timeframe}}',
      'Reach {{revenue_target}} in revenue within {{timeframe}}',
      'Maintain {{retention_rate}}% customer retention rate',
      'Establish {{market_position}} position in {{market_segment}}',
    ],
    constraints: [
      'Budget: {{budget_amount}}',
      'Timeline: Must launch by {{launch_date}}',
      'Team size: {{team_size}} people',
      'Technical infrastructure: {{technical_constraints}}',
    ],
    stakeholders: [
      'Product team',
      'Engineering team',
      'Marketing team',
      'Sales team',
      'Executive leadership',
      'Early customers/beta users',
      'Investors (if applicable)',
    ],
    timeframe: '{{launch_date}} - {{evaluation_date}}',
  },

  scenarioTemplates: [
    {
      title: 'Product-Market Fit Mismatch',
      description: 'The product launches but fails to resonate with the target market. Customer feedback indicates that the product does not adequately solve their problem, or the problem is not as significant as anticipated. Adoption remains low despite marketing efforts.',
      likelihood: 'medium',
      impact: 'critical',
      category: 'market',
      rationale: 'Product-market fit is the most common reason for product failure. Many teams build solutions without validating that customers actually have the problem or would pay to solve it.',
    },
    {
      title: 'Technical Performance Issues at Scale',
      description: 'The product works well in testing and early beta, but experiences severe performance degradation, crashes, or data loss when exposed to production load. Critical bugs emerge that were not caught in QA, damaging early reputation.',
      likelihood: 'medium',
      impact: 'high',
      category: 'technical',
      rationale: 'Scaling issues are extremely common in product launches. Testing environments rarely replicate real-world usage patterns, data volumes, and edge cases.',
    },
    {
      title: 'Go-to-Market Execution Failure',
      description: 'The product is ready but the launch campaign fails to generate awareness or interest. Marketing channels underperform, messaging does not resonate, or the sales team struggles to convert prospects. Launch generates minimal buzz.',
      likelihood: 'high',
      impact: 'high',
      category: 'market',
      rationale: 'Even great products can fail with poor go-to-market execution. Distribution and marketing are often underestimated in launch planning.',
    },
    {
      title: 'Competitive Countermove',
      description: 'A major competitor launches a similar or superior product just before or during your launch, or responds aggressively with price cuts, feature matching, or targeted marketing. Your differentiation becomes unclear.',
      likelihood: 'medium',
      impact: 'high',
      category: 'strategic',
      rationale: 'Competitors often monitor market signals and can time their own launches or responses strategically. This is especially common in fast-moving markets.',
    },
    {
      title: 'Pricing Model Rejection',
      description: 'Customers express strong resistance to the pricing structure. Either the price point is too high for the perceived value, or the pricing model (subscription, freemium, usage-based) does not align with customer preferences or budget cycles.',
      likelihood: 'medium',
      impact: 'high',
      category: 'market',
      rationale: 'Pricing is one of the most difficult aspects to get right and directly impacts adoption. Many launches fail because pricing was not validated with real customers.',
    },
    {
      title: 'Team Burnout and Attrition',
      description: 'The intense pre-launch push causes key team members to burn out. Post-launch, several critical employees leave, taking institutional knowledge with them. The remaining team struggles to support the product and iterate based on feedback.',
      likelihood: 'medium',
      impact: 'high',
      category: 'organizational',
      rationale: 'Product launches often require unsustainable work levels. Post-launch attrition can cripple a product just when it needs the most support.',
    },
  ],

  rootCauseTemplates: [
    {
      description: 'Insufficient customer discovery and validation before building',
      type: 'assumption',
      rationale: 'Teams often build based on internal assumptions rather than validated customer insights. This leads to solutions looking for problems.',
    },
    {
      description: 'Inadequate testing infrastructure and QA processes for production scale',
      type: 'capability',
      rationale: 'Many teams lack the tools, environments, or expertise to properly test at scale before launch.',
    },
    {
      description: 'Underfunded or understaffed marketing and sales functions',
      type: 'constraint',
      rationale: 'Product teams often focus heavily on building while underinvesting in go-to-market capabilities.',
    },
    {
      description: 'Unrealistic launch timeline driven by external pressures',
      type: 'constraint',
      rationale: 'Investor expectations, competitive pressure, or arbitrary deadlines often force premature launches.',
    },
    {
      description: 'Lack of sustainable work practices and team care',
      type: 'systemic',
      rationale: 'Many organizations treat product launches as sprints requiring unsustainable effort, leading to inevitable burnout.',
    },
  ],

  mitigationTemplates: [
    {
      strategy: 'Conduct extensive customer discovery and beta testing with target users',
      effort: 'medium',
      effectiveness: 'high',
      bestPractices: [
        'Run at least 20 customer interviews before finalizing product direction',
        'Launch private beta with 50-100 representative users',
        'Use beta feedback to iterate on core value proposition',
        'Establish clear success metrics and validation criteria',
      ],
    },
    {
      strategy: 'Implement comprehensive load testing and staged rollout plan',
      effort: 'medium',
      effectiveness: 'high',
      bestPractices: [
        'Set up production-like staging environment',
        'Run load tests at 5x expected peak usage',
        'Plan phased rollout (10% → 25% → 50% → 100%)',
        'Establish monitoring and rollback procedures',
        'Conduct pre-launch technical dry run',
      ],
    },
    {
      strategy: 'Develop integrated marketing and sales playbook before launch',
      effort: 'high',
      effectiveness: 'high',
      bestPractices: [
        'Create detailed customer personas and messaging',
        'Test messaging with target audience before launch',
        'Train sales team with recorded demos and FAQs',
        'Build launch campaign timeline with clear ownership',
        'Establish PR relationships 4-6 weeks before launch',
      ],
    },
    {
      strategy: 'Validate pricing through customer conversations and willingness-to-pay studies',
      effort: 'low',
      effectiveness: 'high',
      bestPractices: [
        'Conduct Van Westendorp pricing surveys with target customers',
        'Offer multiple pricing tiers in beta to test elasticity',
        'Study competitor pricing and positioning',
        'Plan for early pricing adjustments based on feedback',
      ],
    },
    {
      strategy: 'Build sustainable launch timeline with team well-being safeguards',
      effort: 'low',
      effectiveness: 'medium',
      bestPractices: [
        'Add 30% buffer to all timeline estimates',
        'Mandate time off before and after launch',
        'Rotate on-call responsibilities',
        'Plan post-launch retrospective and team celebration',
        'Create retention plan for key contributors',
      ],
    },
  ],

  guidanceNotes: {
    when_to_use: 'Use this template when launching a new product, major feature, or entering a new market. Ideal for B2B SaaS, consumer products, or platform launches where market validation and technical readiness are critical.',
    common_pitfalls: [
      'Skipping customer validation in favor of faster development',
      'Underestimating go-to-market effort relative to building',
      'Testing only in idealized conditions rather than realistic load',
      'Treating pricing as an afterthought rather than a strategic decision',
      'Pushing team too hard pre-launch and experiencing post-launch attrition',
      'Ignoring competitive landscape and potential responses',
    ],
    success_patterns: [
      'Launch to progressively larger user cohorts (beta → limited → general availability)',
      'Establish clear success metrics and decision triggers before launch',
      'Allocate equal attention to product, marketing, and sales readiness',
      'Build in feedback loops and rapid iteration cycles post-launch',
      'Maintain team health and motivation through sustainable pacing',
      'Plan competitive positioning and messaging before launch day',
    ],
  },
};
