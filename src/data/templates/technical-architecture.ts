/**
 * Technical Architecture Template
 * Pre-mortem template for major technical architecture decisions
 */

import { PreMortemTemplate } from '@/types/premortem.v1';

export const technicalArchitectureTemplate: PreMortemTemplate = {
  id: 'technical-architecture-v1',
  title: 'Technical Architecture Decision',
  description: 'Evaluate risks when making major technical architecture choices: frameworks, databases, cloud providers, microservices migrations, or infrastructure changes. Covers technical, operational, and organizational implications.',
  category: 'technical',
  difficulty: 'advanced',
  estimatedTime: '45-60 minutes',
  tags: ['architecture', 'technical', 'infrastructure', 'migration', 'engineering'],
  author: {
    name: 'Pre-Mortem Tool',
    organization: 'Decision Intelligence Framework',
  },
  version: '1.0.0',

  decisionTemplate: {
    title: 'Adopt {{technology_name}} for {{use_case}}',
    description: 'We are deciding to adopt {{technology_name}} ({{technology_type}}) to replace/supplement {{current_solution}}. This will support {{business_objective}} and addresses limitations around {{current_limitations}}.',
    context: 'Our current architecture is based on {{current_stack}}. We are experiencing {{pain_points}}. The team has {{team_expertise}} experience with {{relevant_technologies}}. Expected scale is {{scale_requirements}}. Migration will require {{migration_scope}} across {{affected_systems}}. The decision affects {{developer_count}} engineers.',
    goals: [
      'Successfully migrate {{percentage}}% of systems within {{timeline}}',
      'Improve {{performance_metric}} by {{target_improvement}}%',
      'Reduce {{cost_metric}} by {{cost_reduction}}%',
      'Enable {{new_capability}} previously not possible',
    ],
    constraints: [
      'Budget: {{migration_budget}}',
      'Cannot disrupt production systems or violate SLAs',
      'Team learning curve: {{available_training_time}}',
      'Must maintain {{compatibility_requirements}}',
    ],
    stakeholders: [
      'Engineering team',
      'DevOps/Platform team',
      'Product team',
      'Customers (affected by reliability)',
      'Executive leadership',
      'Security team',
      'Finance team',
    ],
    timeframe: '{{decision_date}} - {{full_migration_date}}',
  },

  scenarioTemplates: [
    {
      title: 'Migration Complexity Explosion',
      description: 'The migration proves far more complex than estimated. Hidden dependencies, edge cases, and data migration challenges emerge. Timeline stretches from {{initial_estimate}} to {{realistic_timeline}}. Half-migrated state creates operational nightmares.',
      likelihood: 'high',
      impact: 'high',
      category: 'technical',
      rationale: 'Large-scale migrations always uncover unexpected complexity. Legacy systems have hidden dependencies and undocumented behaviors.',
    },
    {
      title: 'Production Outages and Reliability Issues',
      description: 'Migration causes major production incidents. Data loss, performance degradation, or availability issues impact customers. SLA violations occur. Customer trust is damaged. Rollback becomes necessary but difficult.',
      likelihood: 'medium',
      impact: 'critical',
      category: 'operational',
      rationale: 'Even well-planned migrations can cause production issues. The new system behaves differently under real-world load.',
    },
    {
      title: 'Technology Maturity and Ecosystem Gaps',
      description: 'The chosen technology is less mature than expected. Critical features are missing or buggy. Community support and tooling are inadequate. The team encounters problems without clear solutions.',
      likelihood: 'medium',
      impact: 'high',
      category: 'technical',
      rationale: 'New technologies often look great in demos but have gaps in production usage. Maturity is hard to assess from outside.',
    },
    {
      title: 'Team Knowledge Gap and Productivity Loss',
      description: 'The team lacks deep expertise in the new technology. Learning curve is steeper than expected. Development velocity drops 40-50% during transition. Senior engineers leave due to frustration with constant change.',
      likelihood: 'high',
      impact: 'high',
      category: 'organizational',
      rationale: 'Technology decisions require significant team retraining. Productivity always drops during transitions, often more than estimated.',
    },
    {
      title: 'Cost Explosion Beyond Projections',
      description: 'Operating costs (cloud, licenses, support) prove higher than projected. Hidden costs emerge: data egress, premium features, additional tooling. ROI timeline extends far beyond break-even projections.',
      likelihood: 'medium',
      impact: 'high',
      category: 'financial',
      rationale: 'Cost modeling for new technologies is often optimistic. Real-world usage patterns drive costs higher than benchmarks.',
    },
    {
      title: 'Vendor Lock-in and Loss of Flexibility',
      description: 'The technology choice creates deep vendor dependency. Switching costs become prohibitive. Vendor changes pricing, strategy, or is acquired. The company loses negotiating power and flexibility.',
      likelihood: 'medium',
      impact: 'high',
      category: 'strategic',
      rationale: 'Architectural decisions create long-term commitments. Vendor dependencies can limit future options and increase risk.',
    },
  ],

  rootCauseTemplates: [
    {
      description: 'Insufficient proof-of-concept testing with realistic workloads',
      type: 'capability',
      rationale: 'POCs often use simplified scenarios rather than production-realistic testing. Critical limitations only emerge under real conditions.',
    },
    {
      description: 'Underestimating migration complexity and hidden dependencies',
      type: 'assumption',
      rationale: 'Teams often have incomplete understanding of current system complexity and interdependencies.',
    },
    {
      description: 'Team lacks deep expertise in chosen technology',
      type: 'capability',
      rationale: 'Decisions are often made based on hype or demos rather than team capability assessment.',
    },
    {
      description: 'Pressure to modernize based on industry trends rather than actual needs',
      type: 'external',
      rationale: 'Technology decisions are sometimes driven by FOMO or resume-driven development rather than business requirements.',
    },
    {
      description: 'Inadequate total cost of ownership analysis',
      type: 'assumption',
      rationale: 'Cost projections often focus on licensing while missing operational, training, and migration costs.',
    },
  ],

  mitigationTemplates: [
    {
      strategy: 'Conduct comprehensive proof-of-concept with production-realistic scenarios',
      effort: 'high',
      effectiveness: 'high',
      bestPractices: [
        'Test with actual production data volumes and patterns',
        'Run load tests matching peak production traffic',
        'Validate all critical features and integrations',
        'Include edge cases and failure scenarios in testing',
        'Have entire team participate in POC evaluation',
      ],
    },
    {
      strategy: 'Develop detailed migration plan with staged rollout and rollback procedures',
      effort: 'high',
      effectiveness: 'high',
      bestPractices: [
        'Map all system dependencies and migration order',
        'Plan for parallel running of old and new systems',
        'Define clear success metrics and rollback criteria',
        'Start with non-critical systems for learning',
        'Build automated verification and monitoring',
      ],
    },
    {
      strategy: 'Invest in team training and knowledge building before commitment',
      effort: 'medium',
      effectiveness: 'high',
      bestPractices: [
        'Provide formal training for all engineers',
        'Build reference implementations and internal docs',
        'Assign technical leads to become deep experts',
        'Budget for external consulting during migration',
        'Create internal community of practice',
      ],
    },
    {
      strategy: 'Conduct thorough total cost of ownership analysis',
      effort: 'medium',
      effectiveness: 'medium',
      bestPractices: [
        'Model costs at 2x, 5x, and 10x current scale',
        'Include licensing, infrastructure, support, and training costs',
        'Factor in engineer productivity impact during transition',
        'Compare to fully-loaded cost of current solution',
        'Include opportunity cost of engineering time',
      ],
    },
    {
      strategy: 'Design for reversibility and avoid deep vendor lock-in',
      effort: 'medium',
      effectiveness: 'medium',
      bestPractices: [
        'Use abstraction layers to isolate vendor-specific code',
        'Avoid proprietary features that prevent migration',
        'Maintain data export and portability mechanisms',
        'Evaluate open-source alternatives for leverage',
        'Negotiate contract terms with clear exit provisions',
      ],
    },
  ],

  guidanceNotes: {
    when_to_use: 'Use this template for major technical architecture decisions: choosing cloud providers, databases, frameworks, architectural patterns (microservices), or undertaking significant migrations. Critical for decisions with long-term commitment and high switching costs.',
    common_pitfalls: [
      'Making decisions based on hype or trends rather than actual needs',
      'Inadequate proof-of-concept testing with realistic scenarios',
      'Underestimating migration complexity and timeline',
      'Ignoring team expertise and learning curve',
      'Incomplete total cost of ownership analysis',
      'Not planning for rollback or reversibility',
      'Failing to validate production performance at scale',
      'Treating migration as pure technical project vs. organizational change',
    ],
    success_patterns: [
      'Run comprehensive POC with production-realistic testing',
      'Assess team capability and invest in training before committing',
      'Plan staged migration with clear rollback procedures',
      'Start with non-critical systems to learn and iterate',
      'Model costs realistically including hidden operational costs',
      'Design for reversibility and avoid deep lock-in',
      'Communicate rationale clearly to build team buy-in',
      'Monitor production metrics closely during migration',
    ],
  },
};
