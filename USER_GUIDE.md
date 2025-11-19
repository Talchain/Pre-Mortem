# Pre-Mortem Analysis Tool - User Guide

**Version 2.0** | Powered by Olumi

---

## Table of Contents

1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Core Concepts](#core-concepts)
4. [Step-by-Step Guide](#step-by-step-guide)
5. [Features](#features)
6. [Best Practices](#best-practices)
7. [Troubleshooting](#troubleshooting)
8. [Privacy & Data](#privacy--data)
9. [FAQ](#faq)

---

## Introduction

### What is Pre-Mortem Analysis?

Pre-mortem analysis is a proactive risk assessment technique where you imagine your decision has already failed, then work backward to identify what could have caused that failure. This "prospective hindsight" approach helps surface risks that might otherwise be overlooked in traditional planning.

### Why Use This Tool?

The Olumi Pre-Mortem Analysis Tool combines:

- **AI-Powered Analysis**: Advanced AI models (Claude and GPT) with multi-agent reasoning
- **Conversational Interface**: Natural dialogue makes analysis easier and more thorough
- **Structured Methodology**: Proven pre-mortem framework adapted for modern decision-making
- **Privacy First**: All data stored locally in your browser
- **Scenario Sandbox Integration**: Optional export to advanced probabilistic modeling

---

## Getting Started

### Prerequisites

1. **API Key**: You'll need an API key from either:
   - [Anthropic](https://console.anthropic.com/) (for Claude models)
   - [OpenAI](https://platform.openai.com/api-keys) (for GPT models)

2. **Modern Browser**: Chrome, Firefox, Safari, or Edge (latest versions)

### Setup

1. **Configure Environment**:
   - Create a `.env` file based on `.env.example`
   - Add your API key:
     ```bash
     VITE_ANTHROPIC_API_KEY=your_key_here
     # OR
     VITE_OPENAI_API_KEY=your_key_here
     ```

2. **Start the Application**:
   ```bash
   npm install
   npm run dev
   ```

3. **Open in Browser**:
   - Navigate to `http://localhost:5173`
   - Select your preferred AI model (Claude or GPT)

---

## Core Concepts

### Decision Session

A **Decision Session** represents one decision you're analyzing. It includes:

- **Decision Question**: The core decision you need to make
- **Context**: Background information, constraints, and considerations
- **Options**: The choices you're considering
- **Scenarios**: AI-generated failure scenarios for each option
- **Post-Mortem** (optional): Tracking actual outcomes for learning

### Failure Scenarios

For each option, the AI generates realistic **failure scenarios** that include:

- **Scenario Description**: What went wrong
- **Likelihood**: Probability of occurrence (0-100%)
- **Impact Level**: Severity (Minor, Moderate, Major, Catastrophic)
- **Root Causes**: Why the failure occurred
- **Warning Signs**: Early indicators to watch for
- **Mitigation Strategies**: How to prevent or reduce the failure

### Multi-Agent Reasoning

Behind the scenes, the AI uses three perspectives to analyze your decision:

- **Optimist**: Identifies opportunities and positive scenarios
- **Pessimist**: Focuses on risks, vulnerabilities, and failure modes
- **Realist**: Provides balanced assessment of both sides

This multi-agent approach ensures comprehensive analysis from multiple angles.

---

## Step-by-Step Guide

### Step 1: Start a Decision Session

1. **Describe Your Decision**:
   - Enter a clear, specific question (e.g., "Should we launch Product X in Q2?")
   - Provide context: market conditions, constraints, goals
   - List 2-5 options you're considering

2. **Example**:
   ```
   Decision: Should we launch our new mobile app in Q2 2025?

   Context:
   - Market research shows 60% user interest
   - Development is 85% complete
   - Budget: $50K remaining for marketing
   - Competition launching similar app in Q3

   Options:
   1. Launch in Q2 as planned
   2. Delay to Q3 for more features
   3. Soft launch in Q2, full launch Q3
   ```

### Step 2: Chat with the AI

After creating your session, engage in conversation with the AI:

1. **AI Will Ask Clarifying Questions**:
   - About stakeholders and their concerns
   - About success metrics and goals
   - About resources and constraints
   - About risks you've already considered

2. **Provide Honest, Detailed Answers**:
   - The more context you provide, the better the analysis
   - Don't hide concerns or challenges
   - Include relevant data and metrics

3. **Example Conversation**:
   ```
   AI: "Who are the key stakeholders in this decision?"

   You: "Executive team (CEO, CTO), Product team (5 people),
         Marketing (3 people), and our early beta users (500+)"

   AI: "What would success look like for this launch?"

   You: "10K downloads in first month, 4.5+ app store rating,
         <5% crash rate, positive press coverage"
   ```

### Step 3: Review Failure Scenarios

Once you've provided enough context, the AI generates failure scenarios:

1. **For Each Option, Review**:
   - What could go wrong
   - How likely it is to occur
   - How severe the impact would be
   - What causes the failure
   - What early warning signs to watch for
   - How to prevent or mitigate the failure

2. **Example Scenario**:
   ```
   Scenario: "App crashes frequently on iOS devices"
   Likelihood: 35% (Medium)
   Impact: Major

   Root Causes:
   - Insufficient iOS testing
   - Memory leaks in Swift code
   - Compatibility issues with iOS 17

   Warning Signs:
   - Beta testers report crashes
   - QA finds reproducible crash bugs
   - Memory usage spikes in profiling

   Mitigation:
   - Increase iOS testing coverage to 90%
   - Hire iOS QA specialist
   - Implement automated crash reporting
   - Budget extra 2 weeks for iOS fixes
   ```

3. **Compare Options**:
   - Look at failure scenarios across all options
   - Identify which risks are most concerning
   - Consider which failures are preventable

### Step 4: Make Your Decision

Based on the pre-mortem analysis:

1. **Weigh the Risks**:
   - Which option has the most manageable risks?
   - Which failures would be catastrophic vs. recoverable?
   - Do you have mitigation strategies for the major risks?

2. **Consider Your Risk Tolerance**:
   - High-risk, high-reward options vs. safer choices
   - Can you afford the worst-case scenarios?
   - What's your backup plan?

3. **Make the Call**:
   - Select your decision
   - Document your reasoning
   - Implement mitigation strategies proactively

### Step 5: Continue to Scenario Sandbox (Optional)

For deeper analysis, export your pre-mortem to Scenario Sandbox:

1. **Click "Continue to Scenario Sandbox"** (appears after scenarios are generated)

2. **Scenario Sandbox Provides**:
   - Monte Carlo simulations for risk probabilities
   - Second-order effects analysis (cascading impacts)
   - Decision confidence intervals
   - Sensitivity analysis for key variables

3. **Requirements**:
   - Scenario Sandbox must be running locally or accessible
   - Configure in `.env`: `VITE_ENABLE_SCENARIO_SANDBOX_INTEGRATION=true`

### Step 6: Track Outcomes (Optional Post-Mortem)

After your decision plays out, record what actually happened:

1. **Record the Outcome**:
   - Success, Failure, or Mixed
   - What actually occurred vs. predictions

2. **Identify Lessons**:
   - Which scenarios came true?
   - Which risks did you successfully mitigate?
   - What surprised you?
   - What would you do differently?

3. **Improve Future Decisions**:
   - Build institutional knowledge
   - Refine your risk assessment skills
   - Learn from both successes and failures

---

## Features

### AI Model Selection

**Claude (Anthropic)**:
- Excellent at reasoning and analysis
- Strong at identifying subtle risks
- Recommended for complex, high-stakes decisions

**GPT-4 (OpenAI)**:
- Fast and capable
- Good general-purpose analysis
- Recommended for routine decisions

**How to Switch**:
- Use the model selector in the top-right corner
- Your API key determines which models are available

### Local Data Storage

**All data is stored in your browser**:
- Decision sessions saved to localStorage
- Nothing sent to external servers (except AI API calls)
- Data persists across browser sessions
- Clear data anytime via browser settings

**Export/Import**:
- Export sessions as JSON for backup
- Import previous sessions to continue work
- Share sessions with team members (excluding API keys)

### Conversational Interface

**Natural Dialogue**:
- Chat with AI like a consultant
- Ask questions, get clarifications
- Build context incrementally
- No rigid forms or wizards

**Context Extraction**:
- AI automatically extracts structured data from conversation
- Identifies stakeholders, factors, constraints
- Builds comprehensive decision model

### Keyboard Shortcuts

- **Esc**: Close help modal
- **?**: Open help (when available)

---

## Best Practices

### 1. Be Specific and Honest

**Good Decision Question**:
> "Should we migrate our infrastructure from AWS to Google Cloud by Q3 2025?"

**Too Vague**:
> "Should we change our infrastructure?"

**Provide Real Context**:
- Actual numbers, timelines, constraints
- Known risks and concerns
- Political and organizational factors

### 2. Include Multiple Perspectives

When chatting with the AI, consider:
- **Technical perspective**: Can it be done? How?
- **Business perspective**: What's the ROI? Market impact?
- **User perspective**: How will customers react?
- **Organizational perspective**: Can the team execute?

### 3. Don't Dismiss Unlikely Risks

Even low-probability scenarios matter if:
- The impact would be catastrophic
- There are early warning signs you can monitor
- Simple mitigations exist

**Example**: 5% chance of data breach = very serious even if unlikely

### 4. Use Pre-Mortem Before Committing

**Best Time**: After preliminary planning, before final decision

**Too Early**: Not enough information to assess risks

**Too Late**: Already committed, can't change course

### 5. Involve Stakeholders

While the tool is for individual use:
- Share scenarios with team members
- Discuss mitigation strategies together
- Get buy-in on risk acceptance
- Build shared understanding

### 6. Revisit Regularly

For ongoing decisions:
- Update context as conditions change
- Generate new scenarios periodically
- Track which scenarios materialized
- Adjust mitigation strategies

---

## Troubleshooting

### "API Key Invalid" Error

**Solution**:
1. Check `.env` file has correct key
2. Verify key is active in your AI provider dashboard
3. Ensure key has sufficient credits/quota
4. Restart development server after changing `.env`

### "Failed to Generate Scenarios"

**Causes**:
- API rate limiting
- Network connection issues
- Insufficient API credits
- AI model timeout

**Solutions**:
- Wait a few minutes and try again
- Check your API quota/credits
- Verify internet connection
- Try switching AI models

### Scenarios Seem Generic

**To Improve Quality**:
1. Provide more specific context
2. Include relevant data and metrics
3. Answer all AI clarifying questions
4. Mention industry-specific concerns

### Can't Connect to Scenario Sandbox

**Check**:
1. Scenario Sandbox is running (`http://localhost:3000`)
2. `.env` has `VITE_ENABLE_SCENARIO_SANDBOX_INTEGRATION=true`
3. `VITE_SCENARIO_SANDBOX_API_URL` is correct
4. No firewall blocking local connections

### Data Lost After Browser Restart

**Causes**:
- Browser in private/incognito mode (no localStorage)
- Browser cleared data
- Different browser/device

**Prevention**:
- Export sessions regularly
- Don't use incognito mode for important sessions
- Consider backing up browser localStorage

---

## Privacy & Data

### What Data is Stored Locally

- Decision sessions (questions, context, options)
- Failure scenarios generated by AI
- Chat conversation history
- Selected AI model preference
- Post-mortem outcomes (if recorded)

### What Data Leaves Your Browser

**AI API Calls Only**:
- Your decision context and questions
- Chat messages
- Request for scenario generation

**Where It Goes**:
- Anthropic servers (if using Claude)
- OpenAI servers (if using GPT)

**What Happens There**:
- Per provider's data policy
- Anthropic: Not used for training (as of 2025)
- OpenAI: Check current data usage policy

**Never Sent to Olumi or Third Parties**:
- Your full decision sessions
- Historical data
- Personal information

### API Key Security

**Important**:
- API keys stored in `.env` file (never in code)
- `.env` is git-ignored (never committed)
- Keys never sent to external servers except API provider

**Best Practices**:
- Rotate API keys periodically
- Use read-only or limited-scope keys if available
- Don't share `.env` file
- Revoke keys if compromised

---

## FAQ

### Do I need both Claude and GPT API keys?

No, you only need one. Choose based on your preference and budget.

### Can I use this for personal decisions?

Yes! Pre-mortem works for any decision: career moves, purchases, life changes, etc.

### How long does analysis take?

- Initial session setup: 2-5 minutes
- AI conversation: 5-15 minutes
- Scenario generation: 1-2 minutes

Total: 10-20 minutes for thorough analysis.

### Can I share sessions with my team?

Yes! Export the session as JSON and share the file. Note: This doesn't include API keys.

### Is there a limit to the number of sessions?

Only your browser's localStorage limit (~5-10MB). In practice, hundreds of sessions.

### Can I use this offline?

No, AI API calls require internet connection. However, you can review past sessions offline.

### What if the AI disagrees with me?

The AI is a tool, not a decision-maker. Use its analysis as input, but trust your judgment and domain expertise.

### Can I edit generated scenarios?

Not directly in v2.0, but you can:
- Export session and edit JSON
- Use scenarios as starting point for manual analysis
- Provide feedback to AI to regenerate

### How accurate are the failure scenarios?

Scenarios are AI-generated hypotheses based on the context you provide. They should be:
- Treated as thought starters, not predictions
- Validated with domain experts
- Updated as you learn more

### Does this replace traditional risk assessment?

No, it complements it. Use pre-mortem alongside:
- SWOT analysis
- Risk registers
- Expert consultation
- Formal risk frameworks

---

## Getting Help

- **In-App Help**: Click the "?" button in the top-right corner
- **Documentation**: See `DEVELOPER_GUIDE.md` for technical details
- **Issues**: Report bugs at [GitHub Issues](https://github.com/yourusername/pre-mortem-tool/issues)
- **Support**: Contact [support@olumi.ai](mailto:support@olumi.ai)

---

**Version 2.0** | © 2025 Olumi | [olumi.ai](https://olumi.ai)
