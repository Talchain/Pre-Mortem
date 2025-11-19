# Pre-Mortem Analysis Tool - Developer Guide

**Version 2.0** | Technical Documentation

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Project Structure](#project-structure)
3. [Core Technologies](#core-technologies)
4. [Key Components](#key-components)
5. [Data Models](#data-models)
6. [Services](#services)
7. [State Management](#state-management)
8. [AI Integration](#ai-integration)
9. [Styling System](#styling-system)
10. [Testing](#testing)
11. [Build & Deployment](#build--deployment)
12. [Contributing](#contributing)

---

## Architecture Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     React Frontend                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ UI Components│  │ Chat Interface│  │ Help & Layout│  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │        DecisionSessionContext (State)            │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │AI Orchestration│ │ localStorage │ │ Sandbox API  │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
           │                │                 │
           ▼                ▼                 ▼
    ┌──────────┐    ┌──────────┐    ┌──────────────┐
    │Anthropic │    │ Browser  │    │   Scenario   │
    │   API    │    │localStorage   │   Sandbox    │
    └──────────┘    └──────────┘    └──────────────┘
    ┌──────────┐
    │ OpenAI   │
    │   API    │
    └──────────┘
```

### Design Principles

1. **Privacy First**: All data stored locally, minimal external calls
2. **Conversational UX**: Natural dialogue over rigid forms
3. **AI-Powered**: Multi-agent reasoning for comprehensive analysis
4. **Modular**: Component-based architecture for maintainability
5. **Accessible**: WCAG 2.1 AA compliance, keyboard navigation
6. **Responsive**: Mobile-first design, works on all devices

---

## Project Structure

```
pre-mortem-tool/
├── public/                 # Static assets
├── src/
│   ├── components/         # React components
│   │   ├── chat/          # Chat interface components
│   │   ├── common/        # Shared components (Button, ErrorBoundary)
│   │   ├── help/          # HelpModal
│   │   ├── integration/   # ContinueToSandbox
│   │   ├── layout/        # AppHeader, AppFooter
│   │   ├── postmortem/    # Post-mortem tracking
│   │   ├── scenarios/     # Scenario display
│   │   └── *.tsx          # Main flow components
│   ├── context/           # React Context providers
│   │   └── DecisionSessionContext.tsx
│   ├── services/          # Business logic & API calls
│   │   ├── aiOrchestration.ts
│   │   ├── aiService.ts
│   │   ├── claudeAPI.ts
│   │   ├── openaiAPI.ts
│   │   ├── localStorage.ts
│   │   ├── sessionStorage.ts
│   │   ├── pdfExport.ts
│   │   └── scenarioSandboxIntegration.ts
│   ├── styles/            # Global styles & design system
│   │   ├── design-system.css    # Olumi Design System v1.2
│   │   └── index.css
│   ├── types/             # TypeScript type definitions
│   │   ├── premortem.ts
│   │   └── sharedModels.ts
│   ├── App.tsx            # Main application component
│   ├── App.module.css     # App-level styles
│   └── main.tsx           # Application entry point
├── .env.example           # Environment variables template
├── package.json           # Dependencies & scripts
├── tsconfig.json          # TypeScript configuration
├── vite.config.ts         # Vite build configuration
├── vitest.config.ts       # Vitest test configuration
├── USER_GUIDE.md          # User documentation
└── DEVELOPER_GUIDE.md     # This file
```

---

## Core Technologies

### Frontend Framework

- **React 18.3+**: UI framework with hooks and context
- **TypeScript 5.5+**: Type-safe JavaScript
- **Vite 5+**: Build tool and dev server

### Styling

- **CSS Modules**: Component-scoped styles
- **Olumi Design System v1.2**: Custom design tokens and components
- **No CSS frameworks**: Pure CSS for performance

### State Management

- **React Context API**: Global state (DecisionSessionContext)
- **useState/useReducer**: Component-level state
- **localStorage**: Persistent data storage

### AI Integration

- **Anthropic Claude API**: Claude 3.5 Sonnet
- **OpenAI API**: GPT-4, GPT-4 Turbo
- **Custom orchestration**: Multi-agent reasoning

### Testing

- **Vitest**: Unit and integration tests
- **React Testing Library**: Component tests
- **Playwright** (planned): E2E tests

### Build & Deploy

- **Vite**: Fast bundling and HMR
- **Netlify**: Hosting and deployments
- **GitHub Actions** (planned): CI/CD

---

## Key Components

### App.tsx

Main application component that orchestrates the entire UI.

**Responsibilities**:
- Wraps app in `DecisionSessionProvider`
- Manages help modal state
- Renders layout components (AppHeader, AppFooter)
- Conditionally renders flow components based on session state
- Integrates ErrorBoundary for global error handling

**Key Sections**:
```tsx
<ErrorBoundary>
  <DecisionSessionProvider>
    <AppHeader onHelpClick={() => setIsHelpOpen(true)} />
    <ModelSelector />
    <DecisionEntry />
    <ContextRefiner />
    <ScenarioList />
    <ContinueToSandbox />
    <PostMortemTrigger />
    <OutcomeEntry />
    <ChatContainer />
    <AppFooter />
    <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
  </DecisionSessionProvider>
</ErrorBoundary>
```

### DecisionSessionContext

Global state management for the active decision session.

**Location**: `src/context/DecisionSessionContext.tsx`

**State Shape**:
```typescript
{
  session: DecisionSession | null;
  loading: boolean;
  error: string | null;
  selectedModel: AIModel | null;
}
```

**Actions**:
- `START_SESSION`: Initialize new decision session
- `UPDATE_SESSION`: Update session data
- `UPDATE_SCENARIOS`: Add/update failure scenarios
- `START_POSTMORTEM`: Begin post-mortem tracking
- `UPDATE_POSTMORTEM`: Record actual outcomes
- `CLEAR_SESSION`: Reset state
- `UPDATE_MODEL`: Change AI model

**Usage**:
```tsx
const { state, dispatch, updateModel } = useDecisionSession();
const { session, selectedModel, loading } = state;

// Start new session
dispatch({
  type: 'START_SESSION',
  payload: {
    question: 'Should we...?',
    context: 'Background...',
    options: [...],
  },
});
```

### Chat Components

**ChatContainer**: Main chat interface

**Location**: `src/components/chat/ChatContainer.tsx`

**Features**:
- Collapsible chat panel
- Message history display
- AI thinking indicators
- Auto-scroll to latest message
- Context extraction from conversation

**ChatMessage**: Individual message component

**Features**:
- User vs. AI message styling
- Markdown rendering
- Timestamp display
- Avatar icons

### Layout Components

**AppHeader**:
- Branding and logo
- Version badge with tooltip
- Help button
- Sticky positioning

**AppFooter**:
- Attribution and links
- Copyright information
- Social/documentation links

### Integration Components

**ContinueToSandbox**:
- Checks Scenario Sandbox availability
- Exports decision data
- Opens Sandbox in new tab
- Handles connection errors

**PostMortemTrigger**:
- Appears after decision is made
- Explains post-mortem benefits
- Prompts user to record outcome

**OutcomeEntry**:
- Form for recording actual outcome
- Success/Failure/Mixed classification
- Detailed outcome description

### Help System

**HelpModal**:
- Comprehensive in-app documentation
- What is pre-mortem analysis?
- Step-by-step usage guide
- Feature explanations
- Keyboard shortcuts
- Privacy information

---

## Data Models

### DecisionSession

Core data structure representing a decision analysis session.

**Location**: `src/types/sharedModels.ts`

```typescript
interface DecisionSession {
  id: string;
  created_at: string;
  updated_at: string;

  decision: {
    question: string;
    context: string;
    options: DecisionOption[];
    factors: DecisionFactor[];
    stakeholders: Stakeholder[];
    status: 'in_progress' | 'decided' | 'abandoned';
    selected_option_id?: string;
  };

  premortem?: PreMortemAnalysis;
  scenarios?: FailureScenario[];
  postmortem?: PostMortemData;
}
```

### FailureScenario

AI-generated failure scenario for a decision option.

```typescript
interface FailureScenario {
  id: string;
  option_id: string;
  title: string;
  description: string;
  likelihood: number; // 0-100
  impact_level: 'minor' | 'moderate' | 'major' | 'catastrophic';
  impact_description: string;
  root_causes: string[];
  warning_signs: string[];
  mitigation_strategies: string[];
  status: 'active' | 'mitigated' | 'accepted';
}
```

### Message

Chat message in conversational interface.

```typescript
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  metadata?: {
    model?: string;
    confidence?: number;
    thinking?: string;
  };
}
```

### PostMortemData

Actual outcome tracking for learning and improvement.

```typescript
interface PostMortemData {
  outcome: 'success' | 'failure' | 'mixed';
  description: string;
  lessons_learned: string[];
  scenarios_that_occurred: string[]; // IDs of scenarios that happened
  unexpected_outcomes: string[];
  what_worked: string[];
  what_failed: string[];
  recommendations: string[];
}
```

---

## Services

### AI Orchestration Service

**Location**: `src/services/aiOrchestration.ts`

**Purpose**: Coordinates multi-agent AI reasoning and conversation management.

**Key Functions**:

```typescript
// Multi-agent reasoning (Optimist, Pessimist, Realist)
async function runMultiAgentDialogue(
  prompt: string,
  context: string,
  aiModel: AIModel
): Promise<MultiAgentReasoning>

// Main orchestration function
export async function orchestrateResponse(
  userMessage: string,
  conversationHistory: Message[],
  session: DecisionSession | null,
  aiModel: AIModel
): Promise<OrchestratedResponse>

// Extract structured context from conversation
async function extractContextFromConversation(
  conversationHistory: Message[],
  aiModel: AIModel
): Promise<Partial<ExtractedContext>>

// Classify user intent
async function classifyIntent(
  message: string,
  context: string,
  aiModel: AIModel
): Promise<ConversationIntent>
```

**Multi-Agent Flow**:
1. User sends message
2. Classify intent (greeting, question, analysis request)
3. Run parallel agent reasoning (if analysis needed)
4. Synthesize agent perspectives
5. Generate user-facing response
6. Extract any new context

### Anthropic Claude API

**Location**: `src/services/claudeAPI.ts`

**Functions**:
```typescript
export async function callClaude(
  prompt: string,
  options?: CallOptions
): Promise<string>

export async function callClaudeStreaming(
  prompt: string,
  options?: CallOptions
): AsyncGenerator<string>
```

**Supported Models**:
- `claude-3-5-sonnet-20241022` (default, recommended)
- `claude-3-opus-20240229` (most capable)
- `claude-3-haiku-20240307` (fastest, cheapest)

### OpenAI API

**Location**: `src/services/openaiAPI.ts`

**Functions**:
```typescript
export async function callOpenAI(
  prompt: string,
  options?: CallOptions
): Promise<string>

export async function callOpenAIStreaming(
  prompt: string,
  options?: CallOptions
): AsyncGenerator<string>
```

**Supported Models**:
- `gpt-4-turbo-preview` (recommended)
- `gpt-4` (most capable)
- `gpt-3.5-turbo` (faster, cheaper)

### Scenario Sandbox Integration

**Location**: `src/services/scenarioSandboxIntegration.ts`

**Purpose**: Integrate with Scenario Sandbox for advanced probabilistic modeling.

**Key Functions**:
```typescript
class ScenarioSandboxIntegrationService {
  // Check if Sandbox is available
  async checkAvailability(): Promise<{
    available: boolean;
    version?: string;
    error?: string;
  }>

  // Prepare decision data for handoff
  prepareHandoff(session: DecisionSession): HandoffPayload

  // Send data to Sandbox
  async sendToSandbox(session: DecisionSession): Promise<{
    success: boolean;
    sandboxUrl?: string;
    sessionId?: string;
    error?: string;
  }>

  // Retrieve outcome from Sandbox (for post-mortem)
  async retrieveOutcome(sessionId: string): Promise<{
    success: boolean;
    outcome?: any;
    error?: string;
  }>
}

// Singleton instance
export const scenarioSandbox = new ScenarioSandboxIntegrationService({...})
```

**Configuration** (`.env`):
```bash
VITE_ENABLE_SCENARIO_SANDBOX_INTEGRATION=true
VITE_SCENARIO_SANDBOX_API_URL=http://localhost:3000/api
```

### Local Storage Service

**Location**: `src/services/localStorage.ts`

**Functions**:
```typescript
export function saveSession(session: DecisionSession): void
export function loadSession(sessionId: string): DecisionSession | null
export function loadAllSessions(): DecisionSession[]
export function deleteSession(sessionId: string): void
export function clearAllSessions(): void
```

**Storage Keys**:
- `premortem_sessions`: Array of all session IDs
- `premortem_session_{id}`: Individual session data
- `premortem_current_session_id`: Active session ID

### Session Storage Service

**Location**: `src/services/sessionStorage.ts`

**Purpose**: Manage conversation history and temporary state.

**Functions**:
```typescript
export function saveConversationHistory(
  sessionId: string,
  messages: Message[]
): void

export function loadConversationHistory(sessionId: string): Message[]

export function clearConversationHistory(sessionId: string): void
```

### PDF Export Service

**Location**: `src/services/pdfExport.ts`

**Purpose**: Export decision analysis as PDF report.

**Functions**:
```typescript
export async function exportSessionToPDF(
  session: DecisionSession
): Promise<Blob>
```

**Report Includes**:
- Decision question and context
- All options considered
- Failure scenarios with details
- Mitigation strategies
- Decision outcome (if decided)
- Post-mortem data (if available)

---

## State Management

### Context Provider Pattern

**DecisionSessionProvider** manages global state using `useReducer`:

```typescript
const DecisionSessionContext = createContext<DecisionSessionContextType | null>(null);

export function DecisionSessionProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(sessionReducer, initialState);

  // Load persisted session on mount
  useEffect(() => {
    const currentSessionId = localStorage.getItem('premortem_current_session_id');
    if (currentSessionId) {
      const session = loadSession(currentSessionId);
      if (session) {
        dispatch({ type: 'SET_SESSION', payload: session });
      }
    }
  }, []);

  // Persist session on changes
  useEffect(() => {
    if (state.session) {
      saveSession(state.session);
      localStorage.setItem('premortem_current_session_id', state.session.id);
    }
  }, [state.session]);

  return (
    <DecisionSessionContext.Provider value={{ state, dispatch, ... }}>
      {children}
    </DecisionSessionContext.Provider>
  );
}
```

### Action Handlers

**Reducer Pattern**:
```typescript
function sessionReducer(
  state: DecisionSessionState,
  action: SessionAction
): DecisionSessionState {
  switch (action.type) {
    case 'START_SESSION':
      return {
        ...state,
        session: {
          id: generateId(),
          created_at: new Date().toISOString(),
          decision: action.payload,
          ...
        },
      };

    case 'UPDATE_SESSION':
      return {
        ...state,
        session: state.session
          ? { ...state.session, ...action.payload }
          : null,
      };

    // ... other cases
  }
}
```

---

## AI Integration

### Multi-Agent Reasoning

**Three Perspectives**:

1. **Optimist Agent**:
   - Focus: Opportunities and positive scenarios
   - Temperature: 0.7 (slightly creative)
   - Role: Identify what could go right

2. **Pessimist Agent**:
   - Focus: Risks, vulnerabilities, failure modes
   - Temperature: 0.7 (thorough exploration)
   - Role: Conduct pre-mortem analysis

3. **Realist Agent**:
   - Focus: Balanced assessment
   - Temperature: 0.6 (grounded)
   - Role: Synthesize and provide practical perspective

**Parallel Execution**:
```typescript
const [optimistResp, pessimistResp, realistResp] = await Promise.all([
  callAI(agentPrompts.optimist, aiModel, 0.7),
  callAI(agentPrompts.pessimist, aiModel, 0.7),
  callAI(agentPrompts.realist, aiModel, 0.6),
]);
```

**Synthesis**:
```typescript
const synthesisPrompt = `
You are synthesizing perspectives from three agents analyzing a decision:

OPTIMIST: ${optimistResp}
PESSIMIST: ${pessimistResp}
REALIST: ${realistResp}

Synthesize these into a balanced, actionable response for the user.
`;

const synthesis = await callAI(synthesisPrompt, aiModel, 0.5);
```

### Conversation Intent Classification

**Intent Types**:
- `greeting`: User says hello
- `initial_question`: First decision statement
- `context_clarification`: Providing more details
- `analysis_request`: Ask for scenario generation
- `question`: General inquiry
- `scenario_discussion`: Discussing specific scenarios
- `mitigation_discussion`: Talking about risk mitigation
- `other`: Catch-all

**Classification Logic**:
```typescript
async function classifyIntent(
  message: string,
  context: string,
  aiModel: AIModel
): Promise<ConversationIntent> {
  const prompt = `
  Classify the user's intent. Context: ${context}
  User message: "${message}"

  Return JSON:
  {
    "type": "greeting|initial_question|...",
    "confidence": 0-100,
    "needsMoreContext": boolean
  }
  `;

  const response = await callAI(prompt, aiModel, 0.3);
  return JSON.parse(response);
}
```

### Context Extraction

**Extracting Structured Data**:
```typescript
interface ExtractedContext {
  stakeholders?: Stakeholder[];
  factors?: DecisionFactor[];
  constraints?: string[];
  goals?: string[];
  risks?: string[];
}

async function extractContextFromConversation(
  conversationHistory: Message[],
  aiModel: AIModel
): Promise<Partial<ExtractedContext>> {
  const conversationText = conversationHistory
    .map(m => `${m.role}: ${m.content}`)
    .join('\n');

  const prompt = `
  Extract structured information from this conversation:

  ${conversationText}

  Return JSON with:
  - stakeholders: [{name, role, concerns}]
  - factors: [{name, description, importance}]
  - constraints: [string]
  - goals: [string]
  - risks: [string]
  `;

  const response = await callAI(prompt, aiModel, 0.3);
  return JSON.parse(response);
}
```

---

## Styling System

### Olumi Design System v1.2

**Location**: `src/styles/design-system.css`

**CSS Custom Properties**:

```css
:root {
  /* Colors - Neutrals */
  --ink-900: #1a1a1a;
  --ink-700: #4a4a4a;
  --stone-100: #f5f5f5;

  /* Colors - Brand */
  --lilac-400: #9e9af1;
  --lilac-500: #8a85e8;

  /* Colors - Semantic */
  --mint-500: #67c89e;    /* Success */
  --carrot-500: #ea7b4b;  /* Error */
  --sun-500: #f5c433;     /* Warning */

  /* Spacing */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;

  /* Typography */
  --font-primary: 'Inter', -apple-system, sans-serif;
  --font-mono: 'Fira Code', 'Courier New', monospace;

  --text-label: 13px;
  --text-body: 15px;
  --text-heading-sm: 20px;
  --text-heading-md: 24px;
  --text-heading-lg: 32px;

  --weight-regular: 400;
  --weight-medium: 500;
  --weight-semibold: 600;
  --weight-bold: 700;

  /* Border Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;

  /* Shadows */
  --shadow-1: 0 1px 3px rgba(0,0,0,0.1);
  --shadow-2: 0 4px 6px rgba(0,0,0,0.1);
  --shadow-3: 0 10px 15px rgba(0,0,0,0.1);

  /* Animation */
  --duration-fast: 150ms;
  --duration-base: 250ms;
  --ease-out: cubic-bezier(0.33, 1, 0.68, 1);

  /* Z-Index */
  --z-sticky: 100;
  --z-modal: 1000;
}
```

### CSS Modules

**Component-Scoped Styles**:

Each component has its own `.module.css` file:

```css
/* Button.module.css */
.button {
  font-family: var(--font-primary);
  font-size: var(--text-body);
  padding: var(--space-md) var(--space-lg);
  background: var(--lilac-400);
  border-radius: var(--radius-md);
  transition: all var(--duration-base) var(--ease-out);
}

.button:hover {
  background: var(--lilac-500);
  transform: translateY(-2px);
}
```

**Usage in Components**:
```tsx
import styles from './Button.module.css';

export function Button({ children }) {
  return <button className={styles.button}>{children}</button>;
}
```

### Responsive Design

**Breakpoints**:
```css
/* Mobile First */
@media (max-width: 768px) { /* Tablet */ }
@media (max-width: 480px) { /* Mobile */ }
```

**Accessibility**:
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition: none !important;
  }
}

@media (prefers-color-scheme: dark) {
  /* Dark mode support (future) */
}
```

---

## Testing

### Unit Tests (Vitest)

**Configuration**: `vitest.config.ts`

**Running Tests**:
```bash
npm run test          # Run once
npm run test:watch    # Watch mode
npm run test:coverage # With coverage report
```

**Example Test**:
```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click</Button>);

    await userEvent.click(screen.getByText('Click'));
    expect(onClick).toHaveBeenCalledOnce();
  });
});
```

### Component Tests

**Testing Library Approach**:
- Query by role, label, text (not implementation details)
- Test user interactions
- Assert on visible output

**Example**:
```typescript
describe('ContinueToSandbox', () => {
  it('checks availability on mount', async () => {
    const mockCheckAvailability = vi.fn().mockResolvedValue({
      available: true,
      version: '1.0.0',
    });

    vi.mock('@/services/scenarioSandboxIntegration', () => ({
      scenarioSandbox: {
        checkAvailability: mockCheckAvailability,
      },
    }));

    render(<ContinueToSandbox />);

    await waitFor(() => {
      expect(mockCheckAvailability).toHaveBeenCalled();
    });
  });
});
```

### E2E Tests (Playwright - Planned)

**Planned Test Scenarios**:
1. Complete pre-mortem flow
2. AI conversation
3. Scenario generation
4. Export to Scenario Sandbox
5. Post-mortem tracking

**Configuration**: `playwright.config.ts`

```typescript
export default defineConfig({
  testDir: './e2e',
  use: {
    baseURL: 'http://localhost:5173',
  },
});
```

---

## Build & Deployment

### Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint
npm run lint:fix
```

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

**Output**: `dist/` directory

### Deployment (Netlify)

**Configuration**: `netlify.toml`

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**Environment Variables** (Netlify Dashboard):
- Not needed in production (API keys are client-side only)
- All `VITE_*` variables embedded at build time

### Performance Optimization

**Code Splitting**:
```typescript
// Lazy load components
const HelpModal = lazy(() => import('./components/help/HelpModal'));

<Suspense fallback={<Loading />}>
  <HelpModal />
</Suspense>
```

**Bundle Analysis**:
```bash
npm run build -- --report
```

**Lighthouse CI** (Planned):
- Target: >90 in all categories
- Automated checks in CI/CD

---

## Contributing

### Code Style

- **TypeScript**: Strict mode enabled
- **Formatting**: Prettier (2 spaces, single quotes)
- **Linting**: ESLint with React rules
- **Naming**:
  - Components: PascalCase (`Button.tsx`)
  - Hooks: camelCase with `use` prefix (`useDecisionSession`)
  - CSS Modules: camelCase (`button.module.css` → `styles.button`)

### Git Workflow

1. **Create Feature Branch**:
   ```bash
   git checkout -b feature/scenario-comparison
   ```

2. **Commit Conventions**:
   ```
   feat: Add scenario comparison view
   fix: Correct likelihood calculation
   docs: Update API documentation
   style: Format code with Prettier
   refactor: Extract scenario logic
   test: Add tests for AI orchestration
   chore: Update dependencies
   ```

3. **Pull Request**:
   - Clear title and description
   - Reference related issues
   - Include screenshots for UI changes
   - Ensure tests pass

### Adding New AI Models

1. **Create API Service** (`src/services/{provider}API.ts`):
   ```typescript
   export async function callNewProvider(
     prompt: string,
     options?: CallOptions
   ): Promise<string> {
     // Implementation
   }
   ```

2. **Update AI Service** (`src/services/aiService.ts`):
   ```typescript
   export async function callAI(
     prompt: string,
     model: AIModel,
     temperature: number = 0.7
   ): Promise<string> {
     switch (model.provider) {
       case 'anthropic': return callClaude(...);
       case 'openai': return callOpenAI(...);
       case 'newprovider': return callNewProvider(...);
     }
   }
   ```

3. **Update Types** (`src/types/premortem.ts`):
   ```typescript
   export type AIProvider = 'anthropic' | 'openai' | 'newprovider';

   export interface AIModel {
     provider: AIProvider;
     name: string;
     displayName: string;
   }
   ```

4. **Update ModelSelector**:
   - Add new models to the selector dropdown
   - Update model descriptions

### Adding New Components

1. **Create Component** (`src/components/feature/NewComponent.tsx`):
   ```tsx
   /**
    * NewComponent
    * Purpose and description
    * Olumi Design System v1.2
    */

   import styles from './NewComponent.module.css';

   export function NewComponent() {
     return <div className={styles.container}>...</div>;
   }
   ```

2. **Create Styles** (`src/components/feature/NewComponent.module.css`):
   ```css
   /**
    * NewComponent Styles
    * Olumi Design System v1.2
    */

   .container {
     /* Use design system tokens */
   }
   ```

3. **Create Tests** (`src/components/feature/__tests__/NewComponent.test.tsx`):
   ```typescript
   describe('NewComponent', () => {
     it('renders correctly', () => {
       // Test implementation
     });
   });
   ```

4. **Update Documentation**:
   - Add to USER_GUIDE.md if user-facing
   - Document in this file if technical

---

## Troubleshooting

### Common Development Issues

**TypeScript Errors**:
```bash
# Clear TypeScript cache
rm -rf node_modules/.vite
npm run type-check
```

**Build Failures**:
```bash
# Clear build cache
rm -rf dist node_modules/.vite
npm install
npm run build
```

**Hot Module Reload Not Working**:
- Check Vite dev server is running
- Clear browser cache
- Restart dev server

**localStorage Not Persisting**:
- Check browser is not in private/incognito mode
- Verify localStorage quota not exceeded
- Check browser console for errors

### Debug Mode

**Enable Debug Logging** (`.env`):
```bash
VITE_DEBUG_MODE=true
```

**Mock AI Responses** (for development without API keys):
```bash
VITE_MOCK_AI_RESPONSES=true
```

---

## API Reference

### Environment Variables

All environment variables must be prefixed with `VITE_` to be accessible in client code.

```bash
# AI Provider API Keys
VITE_ANTHROPIC_API_KEY=sk-ant-...
VITE_OPENAI_API_KEY=sk-...

# App Configuration
VITE_APP_VERSION=2.0.0

# Scenario Sandbox Integration
VITE_ENABLE_SCENARIO_SANDBOX_INTEGRATION=true
VITE_SCENARIO_SANDBOX_API_URL=http://localhost:3000/api

# Development
VITE_DEBUG_MODE=false
VITE_MOCK_AI_RESPONSES=false

# Analytics (Optional)
VITE_ANALYTICS_ID=
```

---

## Resources

- **React Docs**: https://react.dev
- **Vite Docs**: https://vitejs.dev
- **TypeScript Handbook**: https://www.typescriptlang.org/docs
- **Anthropic API**: https://docs.anthropic.com
- **OpenAI API**: https://platform.openai.com/docs
- **Vitest**: https://vitest.dev
- **Testing Library**: https://testing-library.com

---

**Version 2.0** | © 2025 Olumi | [GitHub](https://github.com/yourusername/pre-mortem-tool)
