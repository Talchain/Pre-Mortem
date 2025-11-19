# Olumi Pre-Mortem Analysis Tool

## Overview

Science-powered pre-mortem analysis tool that helps individuals and teams identify potential failure modes before committing to important decisions. Built using research-backed prospective hindsight methodology from Gary Klein and Daniel Kahneman.

## Features

- **AI-Generated Failure Scenarios**: Claude AI analyzes your decision context to identify 5-8 plausible failure scenarios
- **Root Cause Analysis**: Drill into underlying factors that could lead to failure
- **Mitigation Strategy Development**: Generate actionable preventive strategies with effort and impact assessments
- **Confidence Recalibration**: Track how your confidence changes as you uncover blind spots
- **Professional PDF Export**: Share comprehensive analysis reports with stakeholders
- **Privacy-First**: All data stored locally in your browser - no server transmission

## Technology Stack

- **React 18** + **TypeScript** - Modern, type-safe component architecture
- **Tailwind CSS** - Utility-first styling with Olumi brand colors
- **Vite** - Lightning-fast build tool and dev server
- **Claude API (Anthropic)** - AI-powered scenario and strategy generation
- **jsPDF** - Client-side PDF generation

## Getting Started

### Prerequisites

- **Node.js 18+**
- **Anthropic API key** - Get yours at [https://console.anthropic.com/](https://console.anthropic.com/)

### Installation

```bash
# Clone the repository
git clone https://github.com/olumi/premortem-tool.git
cd premortem-tool

# Install dependencies
npm install
```

### Configuration

1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

2. Add your Anthropic API key to `.env.local`:
   ```
   VITE_ANTHROPIC_API_KEY=your_api_key_here
   ```

### Development

Start the development server:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production

```bash
# Build the project
npm run build

# Preview the production build
npm run preview
```

The build output will be in the `dist/` directory.

## Project Structure

```
premortem-tool/
├── src/
│   ├── components/
│   │   ├── common/           # Reusable UI components
│   │   ├── steps/            # 8 step components for the workflow
│   │   └── features/         # Feature-specific components
│   ├── context/              # React Context + Reducer for state
│   ├── services/             # API integrations and utilities
│   ├── types/                # TypeScript type definitions
│   ├── styles/               # Global CSS and Tailwind config
│   ├── App.tsx               # Main app orchestrator
│   └── main.tsx              # Entry point
├── public/                   # Static assets
└── tests/                    # Test files (unit, integration, E2E)
```

## How It Works

### The Pre-Mortem Methodology

This tool implements Gary Klein's pre-mortem technique, which leverages **prospective hindsight**:

1. **Define Decision**: Describe your important decision and initial confidence
2. **Temporal Projection**: Imagine it's the future and your decision has failed
3. **Identify Failure Scenarios**: List all possible reasons for the failure
4. **Root Cause Analysis**: Identify underlying factors for each scenario
5. **Develop Mitigations**: Create strategies to prevent failures
6. **Recalibrate Confidence**: Adjust your confidence based on insights
7. **Export Action Plan**: Generate and share a comprehensive PDF report

### Research Foundation

- **Klein, G. (2007)**. "Performing a Project Premortem." *Harvard Business Review*
- **Kahneman, D. (2011)**. *Thinking, Fast and Slow* (Planning Fallacy)
- **Mitchell et al. (1989)**. "Back to the future: Temporal perspective in the explanation of events"

Research shows imagining an event has already occurred increases ability to identify reasons by **30%**.

## Testing

```bash
# Run unit tests
npm run test

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage

# Run E2E tests (requires Playwright)
npm run test:e2e
```

## Code Quality

```bash
# Lint code
npm run lint

# Format code
npm run format
```

## API Usage

This tool uses the Anthropic Claude API for:
- Generating failure scenarios based on decision context
- Identifying root causes for each scenario
- Creating mitigation strategies
- Generating executive summaries

**Note**: API calls are made directly from the browser (client-side) in this POC. For production deployments, consider proxying through a backend to protect API keys.

## Performance Targets

- **First Contentful Paint (FCP)**: < 1.5s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Time to Interactive (TTI)**: < 3.5s
- **Bundle Size**: < 200KB gzipped
- **API Response Times**:
  - Scenario generation: < 10s
  - Root cause analysis: < 5s
  - Mitigation strategies: < 8s

## Roadmap

### V1.0 (Current)
- ✅ Complete 8-step pre-mortem workflow
- ✅ AI-powered scenario generation
- ✅ PDF export functionality
- ✅ Local storage persistence

### Future Enhancements
- **Team Collaboration**: Run pre-mortems with multiple participants
- **Decision Journal**: Track outcomes of past decisions
- **Integration with PLoT Engine**: Causal modeling for deeper analysis
- **Template Library**: Pre-built templates for common decision types
- **Analytics Dashboard**: Aggregate insights across decisions

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines.

## License

TBD

## Support

For issues and feature requests, please use the [GitHub Issues](https://github.com/olumi/premortem-tool/issues) page.

## Acknowledgments

Built with inspiration from:
- Gary Klein's pre-mortem research
- Daniel Kahneman's work on cognitive biases
- The Anthropic team for Claude AI
- The React and Vite communities

---

**Powered by Olumi** | Making better decisions through science-backed cognitive enhancement
