/**
 * Investment Allocation Template
 * Pre-mortem template for capital allocation and investment decisions
 */

import { PreMortemTemplate } from '@/types/premortem.v1';

export const investmentAllocationTemplate: PreMortemTemplate = {
  id: 'investment-allocation-v1',
  title: 'Investment Allocation Decision',
  description: 'Evaluate risks when allocating significant capital or resources: funding initiatives, acquisitions, infrastructure investments, or portfolio allocation decisions. Covers ROI, opportunity cost, risk management, and strategic alignment.',
  category: 'investment',
  difficulty: 'advanced',
  estimatedTime: '50-70 minutes',
  tags: ['investment', 'capital allocation', 'finance', 'strategy', 'portfolio'],
  author: {
    name: 'Pre-Mortem Tool',
    organization: 'Decision Intelligence Framework',
  },
  version: '1.0.0',

  decisionTemplate: {
    title: 'Allocate {{investment_amount}} to {{investment_target}}',
    description: 'We are deciding to invest {{investment_amount}} ({{percentage_of_budget}}% of available capital) in {{investment_target}}. This investment will {{expected_outcome}} and is justified by {{strategic_rationale}}. The expected ROI is {{roi_projection}} within {{payback_period}}.',
    context: 'Total available capital is {{total_budget}}. Alternative investment options include {{alternatives}}. Current portfolio allocation is {{current_allocation}}. This investment represents {{risk_profile}} risk relative to other options. Key assumptions include {{key_assumptions}}. Market conditions are {{market_context}}.',
    goals: [
      'Achieve {{roi_target}}% ROI within {{timeframe}}',
      'Generate {{revenue_target}} in incremental revenue',
      'Reach break-even within {{payback_period}}',
      'Create {{strategic_value}} strategic value for the business',
    ],
    constraints: [
      'Total investment: {{investment_amount}}',
      'Cannot exceed {{risk_tolerance}} risk tolerance',
      'Must maintain {{reserve_requirement}} in reserves',
      'Decision must be made by {{decision_deadline}}',
    ],
    stakeholders: [
      'Investment committee',
      'CFO and finance team',
      'Executive leadership',
      'Board of directors',
      'Business unit leaders',
      'Shareholders/investors',
      'Implementation team',
    ],
    timeframe: '{{investment_date}} - {{evaluation_date}}',
  },

  scenarioTemplates: [
    {
      title: 'ROI Failure and Capital Loss',
      description: 'The investment fails to deliver projected returns. Market conditions change, execution falters, or assumptions prove wrong. ROI is significantly below projections or negative. Capital is effectively lost with no recovery path.',
      likelihood: 'medium',
      impact: 'critical',
      category: 'financial',
      rationale: 'Investment projections are often optimistic. Market conditions, competitive responses, and execution risks frequently lead to underperformance.',
    },
    {
      title: 'Opportunity Cost and Better Alternatives Missed',
      description: 'After committing capital, a clearly superior opportunity emerges. Resources are locked up and unavailable. In hindsight, the chosen investment underperforms compared to what could have been achieved.',
      likelihood: 'medium',
      impact: 'high',
      category: 'strategic',
      rationale: 'Capital allocation is about trade-offs. Committing resources closes off other options that may prove more valuable.',
    },
    {
      title: 'Execution Complexity and Cost Overruns',
      description: 'Implementation proves far more complex and expensive than budgeted. Scope creep occurs, timelines extend, and additional capital injections are required. Total cost exceeds projections by 50-100%.',
      likelihood: 'high',
      impact: 'high',
      category: 'operational',
      rationale: 'Implementation costs are consistently underestimated. Complexity emerges during execution that was invisible during planning.',
    },
    {
      title: 'Market Timing and External Shock',
      description: 'External factors (economic downturn, regulatory change, competitive disruption, technology shift) dramatically alter market conditions. The investment thesis becomes invalid. Value is destroyed by forces outside your control.',
      likelihood: 'medium',
      impact: 'critical',
      category: 'external',
      rationale: 'Market timing risk is inherent in all investments. External shocks can invalidate even sound investment logic.',
    },
    {
      title: 'Portfolio Concentration and Liquidity Crisis',
      description: 'The investment creates over-concentration in one area. When capital is needed for other purposes (emergency, opportunity, operations), liquidity is insufficient. The company is forced into unfavorable financing or asset sales.',
      likelihood: 'low',
      impact: 'critical',
      category: 'financial',
      rationale: 'Concentrating capital reduces flexibility. Liquidity crises emerge when reserves are insufficient for unexpected needs.',
    },
    {
      title: 'Strategic Misalignment and Distraction',
      description: 'The investment pulls focus and resources away from core business. Performance in core operations suffers. The investment becomes a distraction that weakens the overall business more than it strengthens it.',
      likelihood: 'medium',
      impact: 'high',
      category: 'strategic',
      rationale: 'New investments are exciting but can distract from core business. Not all value-creating opportunities should be pursued.',
    },
  ],

  rootCauseTemplates: [
    {
      description: 'Over-optimistic financial projections and assumptions',
      type: 'assumption',
      rationale: 'Investment models tend toward optimistic scenarios. Downside cases and failure modes are under-weighted.',
    },
    {
      description: 'Insufficient scenario planning and stress testing',
      type: 'capability',
      rationale: 'Many investment analyses fail to rigorously test assumptions against adverse scenarios.',
    },
    {
      description: 'Pressure to deploy capital rather than wait for better opportunities',
      type: 'external',
      rationale: 'Having capital creates pressure to invest it. Patience to wait for the right opportunity is rare.',
    },
    {
      description: 'Inadequate due diligence and implementation planning',
      type: 'capability',
      rationale: 'Investment decisions often focus on the opportunity while under-analyzing execution risk.',
    },
    {
      description: 'Lack of clear investment criteria and decision framework',
      type: 'systemic',
      rationale: 'Without objective criteria, investment decisions become political or emotional.',
    },
  ],

  mitigationTemplates: [
    {
      strategy: 'Conduct rigorous scenario analysis and stress testing',
      effort: 'high',
      effectiveness: 'high',
      bestPractices: [
        'Model base case, upside, and downside scenarios',
        'Stress test assumptions (market size, conversion rates, costs)',
        'Calculate breakeven and payback under adverse conditions',
        'Identify key risks and model their impact',
        'Use Monte Carlo simulation for complex investments',
      ],
    },
    {
      strategy: 'Implement stage-gate process with go/no-go decision points',
      effort: 'medium',
      effectiveness: 'high',
      bestPractices: [
        'Break large investments into phases with validation gates',
        'Define clear success criteria at each gate',
        'Budget for early stages separately from full commitment',
        'Be willing to exit after validation if thesis is wrong',
        'Tie additional funding to achieving milestones',
      ],
    },
    {
      strategy: 'Maintain portfolio diversification and liquidity reserves',
      effort: 'low',
      effectiveness: 'medium',
      bestPractices: [
        'Limit single investment to <30% of available capital',
        'Maintain 6-12 months operating reserves',
        'Balance portfolio across risk profiles and time horizons',
        'Structure investments for liquidity if possible',
        'Avoid over-concentration in single thesis or market',
      ],
    },
    {
      strategy: 'Establish objective investment criteria and decision framework',
      effort: 'medium',
      effectiveness: 'high',
      bestPractices: [
        'Define required ROI thresholds by risk category',
        'Create investment scorecard with weighted criteria',
        'Require comparison of alternatives and opportunity cost analysis',
        'Document assumptions and assign probability distributions',
        'Establish independent review for large investments',
      ],
    },
    {
      strategy: 'Conduct thorough due diligence including implementation planning',
      effort: 'high',
      effectiveness: 'high',
      bestPractices: [
        'Assess market, competitive, technical, and execution risks',
        'Validate assumptions with primary research and data',
        'Develop detailed implementation plan and budget',
        'Identify required capabilities and resource gaps',
        'Build contingency plans for key risks',
      ],
    },
  ],

  guidanceNotes: {
    when_to_use: 'Use this template for significant capital allocation decisions: major initiatives, acquisitions, infrastructure investments, R&D funding, market expansion, or any decision involving substantial financial commitment. Critical when stakes are high and reversibility is limited.',
    common_pitfalls: [
      'Over-optimistic financial projections without stress testing',
      'Anchoring on single scenario without considering alternatives',
      'Pressure to deploy capital rather than waiting for better opportunities',
      'Inadequate due diligence on execution risk',
      'Underestimating implementation costs and complexity',
      'Creating portfolio over-concentration',
      'Ignoring opportunity cost of capital',
      'Failing to plan for adverse scenarios',
    ],
    success_patterns: [
      'Model multiple scenarios including realistic downside cases',
      'Use stage-gate process with go/no-go decision points',
      'Maintain portfolio diversification and liquidity buffers',
      'Conduct rigorous due diligence on all aspects',
      'Establish objective investment criteria and decision framework',
      'Compare alternatives and evaluate opportunity cost',
      'Build contingency plans for key risks',
      'Monitor investments closely and adjust based on performance',
    ],
  },
};
