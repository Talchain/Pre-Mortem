/**
 * Pricing Change Template
 * Pre-mortem template for pricing strategy changes
 */

import { PreMortemTemplate } from '@/types/premortem.v1';

export const pricingChangeTemplate: PreMortemTemplate = {
  id: 'pricing-change-v1',
  title: 'Pricing Strategy Change',
  description: 'Analyze risks when changing pricing models, increasing prices, or restructuring pricing tiers. Covers customer retention, revenue impact, competitive positioning, and implementation challenges.',
  category: 'pricing',
  difficulty: 'intermediate',
  estimatedTime: '40-60 minutes',
  tags: ['pricing', 'revenue', 'customer retention', 'monetization', 'business model'],
  author: {
    name: 'Pre-Mortem Tool',
    organization: 'Decision Intelligence Framework',
  },
  version: '1.0.0',

  decisionTemplate: {
    title: 'Change pricing from {{current_model}} to {{new_model}}',
    description: 'We are planning to change our pricing structure from {{current_model}} to {{new_model}}. This involves {{specific_changes}} with the goal of {{revenue_goal}}.',
    context: 'Our current pricing has been in place for {{duration}}. We have {{customer_count}} customers with an average revenue of {{arpu}}. Market analysis shows {{market_insight}}. Our competitors price at {{competitor_pricing}}. We believe the new pricing better reflects {{value_rationale}}.',
    goals: [
      'Increase revenue by {{revenue_increase_target}}% within {{timeframe}}',
      'Improve customer lifetime value (LTV) to {{ltv_target}}',
      'Maintain churn rate below {{acceptable_churn}}%',
      'Achieve {{adoption_target}}% adoption of new pricing by existing customers',
    ],
    constraints: [
      'Must grandfather existing customers for {{grandfathering_period}}',
      'Cannot exceed {{price_ceiling}} to maintain competitive positioning',
      'Implementation deadline: {{implementation_date}}',
      'Engineering resources: {{technical_constraints}}',
    ],
    stakeholders: [
      'Existing customers',
      'Sales team',
      'Customer success team',
      'Finance team',
      'Product team',
      'Executive leadership',
      'Board/investors',
    ],
    timeframe: '{{announcement_date}} - {{evaluation_date}}',
  },

  scenarioTemplates: [
    {
      title: 'Massive Customer Churn',
      description: 'A significant portion of customers (>20%) cancel their subscriptions in response to the pricing change. Even with grandfathering, many customers perceive the change as a violation of trust and leave for competitors. Revenue initially drops despite higher prices.',
      likelihood: 'medium',
      impact: 'critical',
      category: 'market',
      rationale: 'Pricing changes are one of the most sensitive actions a company can take. Customers often react emotionally, especially if they feel blindsided or undervalued.',
    },
    {
      title: 'Value Perception Disconnect',
      description: 'Customers do not perceive the product improvements or value justification for the price increase. Feedback indicates the pricing no longer feels fair relative to alternatives. Sales conversion rates drop significantly.',
      likelihood: 'high',
      impact: 'high',
      category: 'market',
      rationale: 'Price increases must be matched with clear value delivery. If customers do not see commensurate improvements, they view it as pure revenue extraction.',
    },
    {
      title: 'Implementation and Billing Errors',
      description: 'The new pricing system has technical issues: customers are charged incorrectly, grandfathering rules fail to apply, or invoicing becomes confused. This creates customer service nightmares and damages trust during a sensitive transition.',
      likelihood: 'high',
      impact: 'high',
      category: 'technical',
      rationale: 'Pricing changes involve complex billing logic, edge cases, and legacy customer states. Implementation bugs are extremely common and highly visible.',
    },
    {
      title: 'Competitive Exploitation',
      description: 'Competitors see the pricing change as an opportunity and launch targeted campaigns to poach your customers. They offer special migration deals or match your old pricing, positioning themselves as the customer-friendly alternative.',
      likelihood: 'medium',
      impact: 'high',
      category: 'strategic',
      rationale: 'Pricing changes create vulnerable moments. Savvy competitors monitor these windows and prepare counter-campaigns.',
    },
    {
      title: 'Sales Team Resistance and Confusion',
      description: 'The sales team struggles to explain and defend the new pricing. They face pushback from prospects and existing customers and lack confidence in the value story. Sales productivity drops 30-40% during the transition period.',
      likelihood: 'high',
      impact: 'high',
      category: 'organizational',
      rationale: 'Sales teams bear the brunt of pricing change conversations. Without thorough training and messaging, they become order-takers rather than advocates.',
    },
    {
      title: 'Negative Public Relations and Social Media Backlash',
      description: 'The pricing change generates negative press coverage and viral social media complaints. Public perception of the brand suffers. Potential customers cite the controversy as a reason to consider alternatives.',
      likelihood: 'medium',
      impact: 'high',
      category: 'external',
      rationale: 'In the age of social media, pricing controversies can quickly become public relations crises. Examples: Adobe, Netflix, Unity pricing backlashes.',
    },
  ],

  rootCauseTemplates: [
    {
      description: 'Insufficient communication and customer education about value delivered',
      type: 'capability',
      rationale: 'Companies often announce pricing changes without adequately explaining why or demonstrating improved value to customers.',
    },
    {
      description: 'Inadequate testing of billing and implementation systems',
      type: 'capability',
      rationale: 'Pricing changes involve complex technical changes to billing infrastructure that are often under-tested.',
    },
    {
      description: 'Poor timing that coincides with economic pressure or competitive moves',
      type: 'external',
      rationale: 'Pricing changes done during recessions, budget freeze periods, or competitive upheaval face amplified resistance.',
    },
    {
      description: 'Lack of granular customer segmentation and customized approaches',
      type: 'assumption',
      rationale: 'One-size-fits-all pricing changes ignore different customer segments\' sensitivities and willingness to pay.',
    },
    {
      description: 'Revenue pressure overriding customer-centric decision-making',
      type: 'systemic',
      rationale: 'Pricing changes driven purely by revenue targets without considering customer perspective often backfire.',
    },
  ],

  mitigationTemplates: [
    {
      strategy: 'Conduct extensive customer research and test messaging before announcement',
      effort: 'medium',
      effectiveness: 'high',
      bestPractices: [
        'Run pricing surveys with representative customer sample',
        'Conduct 1-on-1 interviews with high-value customers',
        'Test different messaging frameworks for pricing rationale',
        'Identify customer segments most at-risk of churning',
        'Build FAQ addressing top 20 anticipated objections',
      ],
    },
    {
      strategy: 'Implement phased rollout with comprehensive technical testing',
      effort: 'high',
      effectiveness: 'high',
      bestPractices: [
        'Test new pricing system in staging with production data clone',
        'Start with new customers only for first 30 days',
        'Build detailed edge case matrix and test each scenario',
        'Set up real-time monitoring for billing anomalies',
        'Create rollback plan if critical issues emerge',
      ],
    },
    {
      strategy: 'Develop comprehensive internal and external communication plan',
      effort: 'medium',
      effectiveness: 'high',
      bestPractices: [
        'Announce change 60-90 days in advance',
        'Create layered communication: email, webinar, 1-on-1 for enterprise',
        'Train sales and CS teams 2 weeks before announcement',
        'Prepare executives for investor and press questions',
        'Establish dedicated pricing change support channel',
      ],
    },
    {
      strategy: 'Create targeted retention offers for at-risk high-value customers',
      effort: 'low',
      effectiveness: 'medium',
      bestPractices: [
        'Identify top 20% of customers by revenue',
        'Offer extended grandfathering or custom terms',
        'Schedule executive-level check-in calls',
        'Provide early access to new features justifying price increase',
        'Build win-back campaign for churned customers',
      ],
    },
    {
      strategy: 'Tie pricing change to tangible product improvements and new capabilities',
      effort: 'high',
      effectiveness: 'high',
      bestPractices: [
        'Launch new features simultaneously with pricing change',
        'Create clear value mapping showing improvements',
        'Produce case studies demonstrating ROI',
        'Offer temporary trial period of new tier for existing customers',
        'Show clear product roadmap justifying future value',
      ],
    },
  ],

  guidanceNotes: {
    when_to_use: 'Use this template when changing pricing models (e.g., usage-based to tiered), increasing prices, restructuring tiers, or introducing new monetization strategies. Critical for SaaS, subscription businesses, and platforms.',
    common_pitfalls: [
      'Surprising customers with pricing changes without advance notice',
      'Failing to connect pricing increase with tangible value improvements',
      'Under-testing billing implementation and edge cases',
      'Not preparing sales and support teams adequately',
      'Ignoring customer segmentation and using one-size-fits-all approach',
      'Poor timing during economic downturns or budget freeze periods',
      'Inadequate grandfathering or transition options for loyal customers',
    ],
    success_patterns: [
      'Announce changes 60-90 days in advance with clear rationale',
      'Launch new features or improvements alongside pricing changes',
      'Segment customers and offer customized transition paths',
      'Provide generous grandfathering for existing customers',
      'Over-invest in communication and customer education',
      'Start with new customers before forcing existing customers to migrate',
      'Monitor churn signals closely and have retention playbook ready',
      'Be prepared to adjust based on early feedback and data',
    ],
  },
};
