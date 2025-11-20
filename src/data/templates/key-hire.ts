/**
 * Key Hire Template
 * Pre-mortem template for critical hiring decisions
 */

import { PreMortemTemplate } from '@/types/premortem.v1';

export const keyHireTemplate: PreMortemTemplate = {
  id: 'key-hire-v1',
  title: 'Key Hire Decision',
  description: 'Evaluate risks when hiring for critical leadership or specialized roles. Covers cultural fit, capability assessment, team dynamics, onboarding, and retention challenges.',
  category: 'hiring',
  difficulty: 'intermediate',
  estimatedTime: '35-50 minutes',
  tags: ['hiring', 'leadership', 'team', 'culture', 'onboarding'],
  author: {
    name: 'Pre-Mortem Tool',
    organization: 'Decision Intelligence Framework',
  },
  version: '1.0.0',

  decisionTemplate: {
    title: 'Hire {{candidate_name}} as {{role_title}}',
    description: 'We are planning to hire {{candidate_name}} for the {{role_title}} position. This role is critical because {{role_importance}}. The candidate brings {{key_strengths}} and will be responsible for {{key_responsibilities}}.',
    context: 'Our team currently has {{team_size}} people. This role has been open for {{duration}}. We have interviewed {{candidate_count}} candidates. {{candidate_name}} has {{years_experience}} years of experience at {{previous_companies}}. The role will report to {{manager}} and manage {{direct_reports}}. Key objectives for first 90 days include {{initial_objectives}}.',
    goals: [
      'Successfully onboard and reach full productivity within {{ramp_time}}',
      'Achieve {{key_outcome_1}} within first 6 months',
      'Build high-performing team and improve {{team_metric}} by {{target}}%',
      'Retain hire for at least {{retention_target}} years',
    ],
    constraints: [
      'Budget: {{compensation_package}} total compensation',
      'Start date: {{start_date}}',
      'Relocation required: {{relocation_details}}',
      'Must maintain team morale during transition',
    ],
    stakeholders: [
      'Hiring manager',
      'Current team members',
      'Cross-functional partners',
      'HR/People team',
      'Executive leadership',
      'The candidate',
    ],
    timeframe: '{{start_date}} - {{90_day_review_date}}',
  },

  scenarioTemplates: [
    {
      title: 'Cultural Misalignment and Team Friction',
      description: 'The hire has the technical skills but does not fit the company culture or working style. Communication problems emerge, team morale drops, and collaboration becomes strained. Other team members express frustration or consider leaving.',
      likelihood: 'medium',
      impact: 'high',
      category: 'organizational',
      rationale: 'Cultural fit is notoriously difficult to assess in interviews. Many strong individual contributors struggle when the organizational context differs from their experience.',
    },
    {
      title: 'Capability Gap in Critical Areas',
      description: 'Once in the role, it becomes clear the hire lacks key skills or experience needed for success. They struggle with responsibilities that were glossed over in interviews. Performance does not meet expectations and remediation is needed.',
      likelihood: 'medium',
      impact: 'high',
      category: 'organizational',
      rationale: 'Interview performance does not always translate to job performance. Candidates can present well while having gaps in critical capabilities.',
    },
    {
      title: 'Onboarding Failure and Slow Ramp',
      description: 'The hire receives inadequate onboarding support. They lack context, relationships, and tools to be effective. Frustration builds as they struggle to make impact. Ramp time extends far beyond expectations, delaying critical initiatives.',
      likelihood: 'high',
      impact: 'high',
      category: 'organizational',
      rationale: 'Most companies have poor onboarding processes, especially for senior hires who are expected to "hit the ground running." This assumption rarely holds.',
    },
    {
      title: 'Management Style Mismatch',
      description: 'For leadership roles, the hire\'s management approach clashes with team expectations or company norms. Direct reports feel micromanaged, under-supported, or confused about direction. Attrition increases under the new leader.',
      likelihood: 'medium',
      impact: 'high',
      category: 'organizational',
      rationale: 'Management style is highly personal and context-dependent. What worked at their previous company may not work at yours.',
    },
    {
      title: 'Early Departure Due to Misaligned Expectations',
      description: 'Within 6-12 months, the hire leaves because the role was not what they expected. Perhaps the scope was oversold, the resources were insufficient, or the company direction changed. The team is back at square one.',
      likelihood: 'medium',
      impact: 'critical',
      category: 'organizational',
      rationale: 'Misaligned expectations are a top cause of early departure. Both sides often oversell or underspecify during hiring.',
    },
    {
      title: 'Disruption to Existing Team and Loss of Key Contributors',
      description: 'The new hire changes team dynamics in ways that cause valued existing employees to leave. Perhaps they feel passed over for promotion, disagree with new direction, or clash with the new leader. Net team capability decreases.',
      likelihood: 'medium',
      impact: 'critical',
      category: 'organizational',
      rationale: 'New hires, especially leaders, create organizational change. Existing team members may leave if they feel threatened or misaligned.',
    },
  ],

  rootCauseTemplates: [
    {
      description: 'Interview process does not adequately assess cultural fit and working style',
      type: 'capability',
      rationale: 'Most interview processes focus heavily on technical skills and experience while giving lip service to culture fit.',
    },
    {
      description: 'Pressure to fill role quickly leads to lowering of standards or red flags ignored',
      type: 'constraint',
      rationale: 'Long-open roles create pressure to compromise on candidate quality just to fill the seat.',
    },
    {
      description: 'Lack of structured onboarding program and dedicated support',
      type: 'capability',
      rationale: 'Many companies do not invest in onboarding infrastructure, especially for senior hires.',
    },
    {
      description: 'Unclear or unrealistic role definition and expectations',
      type: 'assumption',
      rationale: 'Roles are often defined vaguely or with unrealistic scope during hiring urgency.',
    },
    {
      description: 'Insufficient reference checking and background validation',
      type: 'capability',
      rationale: 'Reference checks are often perfunctory or skipped entirely, missing important red flags.',
    },
  ],

  mitigationTemplates: [
    {
      strategy: 'Implement rigorous cultural and behavioral assessment process',
      effort: 'medium',
      effectiveness: 'high',
      bestPractices: [
        'Include cultural values questions in every interview round',
        'Have candidate meet with 5-7 team members, not just hiring manager',
        'Use behavioral interview techniques focused on past situations',
        'Ask team members to assess collaboration and communication style',
        'Conduct working session or collaborative exercise',
      ],
    },
    {
      strategy: 'Conduct thorough reference checks with structured questions',
      effort: 'low',
      effectiveness: 'high',
      bestPractices: [
        'Speak with at least 3 references, including back-channel',
        'Ask specific questions about weaknesses and failure modes',
        'Request references from peers and direct reports, not just managers',
        'Ask: "Would you hire this person again? Why or why not?"',
        'Verify claims about impact and accomplishments',
      ],
    },
    {
      strategy: 'Design comprehensive 90-day onboarding plan with clear milestones',
      effort: 'medium',
      effectiveness: 'high',
      bestPractices: [
        'Create written onboarding plan with weekly milestones',
        'Assign dedicated onboarding buddy from team',
        'Schedule 1-on-1s with all key stakeholders in first 2 weeks',
        'Set explicit 30/60/90 day goals and check-ins',
        'Provide access to all context docs and systems before day one',
      ],
    },
    {
      strategy: 'Set clear expectations and mutual commitments in writing',
      effort: 'low',
      effectiveness: 'medium',
      bestPractices: [
        'Document role responsibilities, success metrics, and constraints',
        'Discuss and align on management philosophy if leadership role',
        'Be transparent about challenges and resource limitations',
        'Create shared vision doc for first 6 months',
        'Schedule monthly check-ins to revisit alignment',
      ],
    },
    {
      strategy: 'Communicate hire transparently with existing team and address concerns',
      effort: 'low',
      effectiveness: 'medium',
      bestPractices: [
        'Announce hire with clear rationale for the role',
        'Meet 1-on-1 with team members who might feel passed over',
        'Create opportunities for team to meet candidate before start',
        'Address how existing responsibilities will shift',
        'Monitor team morale closely in first 90 days',
      ],
    },
  ],

  guidanceNotes: {
    when_to_use: 'Use this template for critical hires: executives, senior leaders, specialized technical roles, or positions that significantly impact team dynamics. Especially valuable when hiring from very different company cultures or industries.',
    common_pitfalls: [
      'Focusing too heavily on resume and credentials vs. actual fit',
      'Rushing the process due to urgency and ignoring red flags',
      'Inadequate cultural and behavioral assessment',
      'Skipping thorough reference checks',
      'Poor onboarding that assumes senior hires do not need support',
      'Failing to set clear expectations and success criteria',
      'Not preparing existing team for the change',
      'Overlooking how hire will affect team dynamics',
    ],
    success_patterns: [
      'Take time to assess culture fit through multiple team interactions',
      'Conduct rigorous reference checks with specific questions',
      'Create detailed 90-day onboarding plan with clear milestones',
      'Set explicit expectations and success metrics upfront',
      'Provide dedicated support during ramp period',
      'Monitor integration closely and address issues early',
      'Maintain high bar even under pressure to fill role',
      'Check in frequently with both hire and existing team',
    ],
  },
};
