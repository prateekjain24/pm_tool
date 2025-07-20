# Pre-Experiment Check Tool Implementation Plan - Part 2: AI & Calculations

## Overview
This implementation plan breaks down the Pre-Experiment Check Tool into manageable one-story-point tickets. Each ticket represents approximately 4-8 hours of work and includes clear deliverables.

This document covers tickets 66-115, focusing on:
- Phase 4: AI Integration (25 tickets)
- Phase 5: Sample Size Calculator (25 tickets)

## Tech Stack Decisions
- **Authentication**: Clerk (instead of Lucia Auth)
- **Code Quality**: Biome (instead of Prettier/ESLint)
- **Database**: PostgreSQL with Drizzle ORM
- **Cache**: Redis
- **AI Providers**: OpenAI o3-mini, Claude Sonnet 4, Google Gemini 2.5 Pro
- **Framework**: BHVR (Bun + Hono + Vite + React)

## Phase 4: AI Integration (25 tickets)

### TICKET-066: Setup OpenAI SDK with o3-mini
**Acceptance Criteria:**
- Install OpenAI SDK
- Configure API client
- Add error handling
- Test connection
**Technical Details:**
```typescript
// server/src/services/ai/openai.ts
import OpenAI from 'openai';
export const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
  model: 'o3-mini'
});
```

### TICKET-067: Setup Anthropic SDK with Claude Sonnet 4
**Acceptance Criteria:**
- Install Anthropic SDK
- Configure client
- Add retry logic
- Test API calls
**Technical Details:**
- Use official SDK
- Add timeout handling
- Configure max tokens

### TICKET-068: Setup Google AI SDK with Gemini 2.5 Pro
**Acceptance Criteria:**
- Install Google AI SDK
- Setup authentication
- Configure model
- Test generation
**Technical Details:**
- Use generative-ai package
- Add safety settings
- Configure parameters

### TICKET-069: Create AI provider abstraction layer
**Acceptance Criteria:**
- Define provider interface
- Implement adapters
- Add provider selection
- Include fallbacks
**Technical Details:**
```typescript
// server/src/services/ai/provider.ts
interface AIProvider {
  analyzeHypothesis(hypothesis: string): Promise<Analysis>;
  generateSuggestions(data: any): Promise<Suggestions>;
}
```

### TICKET-070: Implement provider selection logic
**Acceptance Criteria:**
- Add provider routing
- Include load balancing
- Support preferences
- Add cost tracking
**Technical Details:**
- Create provider manager
- Add weighted selection
- Track usage limits

### TICKET-071: Create prompt templates for analysis
**Acceptance Criteria:**
- Design analysis prompts
- Add variable injection
- Include examples
- Version templates
**Technical Details:**
- Create prompt library
- Add template engine
- Include few-shot examples

### TICKET-072: Build hypothesis scoring algorithm
**Acceptance Criteria:**
- Implement scoring logic
- Weight dimensions
- Calculate overall score
- Add explanations
**Technical Details:**
```typescript
// server/src/services/scoring/algorithm.ts
export function calculateScore(analysis: Analysis): Score {
  const weights = { clarity: 0.2, measurability: 0.3, ... };
  return dimensions.reduce((acc, dim) => 
    acc + (analysis[dim] * weights[dim]), 0
  );
}
```

### TICKET-073: Implement clarity dimension scoring
**Acceptance Criteria:**
- Define clarity criteria
- Create scoring rubric
- Add examples
- Test accuracy
**Technical Details:**
- Check specificity
- Evaluate ambiguity
- Score 0-10

### TICKET-074: Implement measurability scoring
**Acceptance Criteria:**
- Check metric quality
- Validate quantification
- Assess tracking ability
- Score dimension
**Technical Details:**
- Verify metrics exist
- Check measurement methods
- Validate targets

### TICKET-075: Implement reasoning quality scoring
**Acceptance Criteria:**
- Evaluate evidence
- Check logic flow
- Assess data support
- Generate score
**Technical Details:**
- Analyze citations
- Check causality
- Validate assumptions

### TICKET-076: Implement scope assessment scoring
**Acceptance Criteria:**
- Check focus level
- Identify scope creep
- Assess feasibility
- Calculate score
**Technical Details:**
- Count variables
- Check dependencies
- Evaluate complexity

### TICKET-077: Implement testability scoring
**Acceptance Criteria:**
- Verify testable elements
- Check constraints
- Assess practicality
- Score testability
**Technical Details:**
- Validate test design
- Check sample requirements
- Assess duration

### TICKET-078: Create feedback generation system
**Acceptance Criteria:**
- Generate actionable feedback
- Prioritize improvements
- Add examples
- Personalize messages
**Technical Details:**
- Create feedback templates
- Add context awareness
- Include success examples

### TICKET-079: Build improvement suggestions engine
**Acceptance Criteria:**
- Analyze weaknesses
- Generate suggestions
- Rank by impact
- Add implementation tips
**Technical Details:**
```typescript
// server/src/services/ai/suggestions.ts
export async function generateSuggestions(
  hypothesis: Hypothesis,
  score: Score
): Promise<Suggestion[]> {
  const weakestDimensions = getWeakestDimensions(score);
  return await ai.generateImprovements(hypothesis, weakestDimensions);
}
```

### TICKET-080: Implement industry context analysis
**Acceptance Criteria:**
- Identify industry
- Apply context rules
- Adjust expectations
- Add benchmarks
**Technical Details:**
- Create industry database
- Add context matching
- Include best practices

### TICKET-081: Create similar experiment finder
**Acceptance Criteria:**
- Search experiment database
- Find similar tests
- Show results/learnings
- Add relevance scoring
**Technical Details:**
- Implement vector search
- Add embedding generation
- Create similarity metrics

### TICKET-082: Build confidence score calculator
**Acceptance Criteria:**
- Assess AI confidence
- Show uncertainty ranges
- Add explanations
- Include factors
**Technical Details:**
- Calculate certainty
- Add confidence intervals
- Show contributing factors

### TICKET-083: Implement AI response caching
**Acceptance Criteria:**
- Cache AI responses
- Set TTL policies
- Add invalidation
- Monitor hit rates
**Technical Details:**
- Use Redis caching
- Add cache keys
- Implement warming

### TICKET-084: Create fallback mechanisms
**Acceptance Criteria:**
- Handle API failures
- Add backup providers
- Include offline mode
- Show degraded state
**Technical Details:**
- Implement circuit breaker
- Add fallback responses
- Create offline scoring

### TICKET-085: Build rate limiting system
**Acceptance Criteria:**
- Implement rate limits
- Add user quotas
- Show usage stats
- Handle exceeded limits
**Technical Details:**
- Use Redis counters
- Add sliding windows
- Create quota system

### TICKET-086: Create usage tracking
**Acceptance Criteria:**
- Track API calls
- Monitor costs
- Add reporting
- Create dashboards
**Technical Details:**
- Log all requests
- Calculate costs
- Create analytics

### TICKET-087: Implement cost monitoring
**Acceptance Criteria:**
- Track per-provider costs
- Add budget alerts
- Show cost breakdown
- Optimize usage
**Technical Details:**
- Create cost calculator
- Add alerting system
- Build optimization

### TICKET-088: Build A/B test for AI providers
**Acceptance Criteria:**
- Randomly assign providers
- Track performance
- Compare quality
- Analyze costs
**Technical Details:**
- Create experiment framework
- Add metrics tracking
- Build analysis tools

### TICKET-089: Create prompt optimization system
**Acceptance Criteria:**
- Test prompt variations
- Track performance
- Auto-optimize
- Version control
**Technical Details:**
- Build testing framework
- Add performance metrics
- Create optimizer

### TICKET-090: Implement response validation
**Acceptance Criteria:**
- Validate AI outputs
- Check format compliance
- Ensure quality
- Handle errors
**Technical Details:**
- Create validators
- Add schema checks
- Implement sanitization

## Phase 5: Sample Size Calculator (25 tickets)

### TICKET-091: Create calculator layout component
**Acceptance Criteria:**
- Design calculator UI
- Add input sections
- Include results area
- Support responsive
**Technical Details:**
- Create grid layout
- Add card components
- Include animations

### TICKET-092: Build baseline rate input slider
**Acceptance Criteria:**
- Create range slider
- Show current value
- Add input field
- Include validation
**Technical Details:**
```typescript
// client/src/components/calculator/BaselineSlider.tsx
export function BaselineSlider({ value, onChange }) {
  return (
    <div>
      <label>Current Conversion Rate</label>
      <input
        type="range"
        min="0"
        max="100"
        step="0.1"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}
```

### TICKET-093: Build minimum detectable effect slider
**Acceptance Criteria:**
- Create MDE slider
- Show percentage/absolute
- Add recommendations
- Include tooltips
**Technical Details:**
- Add toggle for units
- Show impact preview
- Include examples

### TICKET-094: Build confidence level selector
**Acceptance Criteria:**
- Add confidence options
- Show common values
- Explain impact
- Add custom input
**Technical Details:**
- Create dropdown
- Add 90%, 95%, 99%
- Show implications

### TICKET-095: Build statistical power selector
**Acceptance Criteria:**
- Create power selector
- Default to 80%
- Explain trade-offs
- Show impact
**Technical Details:**
- Add slider/dropdown
- Include education
- Show sample impact

### TICKET-096: Implement sample size calculation logic
**Acceptance Criteria:**
- Implement formulas
- Handle edge cases
- Add validation
- Return detailed results
**Technical Details:**
```typescript
// client/src/utils/sampleSize.ts
export function calculateSampleSize({
  baseline,
  mde,
  confidence,
  power
}): SampleSizeResult {
  // Implement statistical formulas
  const variance = baseline * (1 - baseline);
  const zAlpha = getZScore(confidence);
  const zBeta = getZScore(power);
  // ... calculation logic
}
```

### TICKET-097: Create power curve visualization
**Acceptance Criteria:**
- Build interactive chart
- Show power vs sample size
- Add current position
- Include hover details
**Technical Details:**
- Use D3 or Recharts
- Add animations
- Include tooltips

### TICKET-098: Build MDE trade-off graph
**Acceptance Criteria:**
- Show MDE vs sample size
- Add interactive elements
- Highlight sweet spots
- Include guidelines
**Technical Details:**
- Create curve chart
- Add zoom/pan
- Show benchmarks

### TICKET-099: Create duration timeline component
**Acceptance Criteria:**
- Calculate test duration
- Show calendar view
- Add milestone markers
- Include warnings
**Technical Details:**
- Use date calculations
- Add visual timeline
- Show key dates

### TICKET-100: Implement traffic calculator
**Acceptance Criteria:**
- Input daily traffic
- Calculate duration
- Show projections
- Add variations
**Technical Details:**
- Create traffic input
- Add growth factors
- Show scenarios

### TICKET-101: Build traffic pattern input
**Acceptance Criteria:**
- Add weekly patterns
- Include seasonality
- Support custom patterns
- Show impact
**Technical Details:**
- Create pattern editor
- Add preset patterns
- Calculate adjustments

### TICKET-102: Create preset scenarios selector
**Acceptance Criteria:**
- Add common scenarios
- Include descriptions
- Auto-fill values
- Show use cases
**Technical Details:**
```typescript
const presets = [
  { name: 'High-stakes Revenue Test', confidence: 99, power: 90 },
  { name: 'Quick Iteration', confidence: 90, power: 80 },
  { name: 'Standard A/B Test', confidence: 95, power: 80 }
];
```

### TICKET-103: Implement multi-variant support
**Acceptance Criteria:**
- Add variant count input
- Adjust calculations
- Show per-variant needs
- Add warnings
**Technical Details:**
- Modify formulas
- Add Bonferroni correction
- Show total sample

### TICKET-104: Build visual results display
**Acceptance Criteria:**
- Show key numbers
- Add visualizations
- Include explanations
- Support sharing
**Technical Details:**
- Create result cards
- Add infographics
- Include insights

### TICKET-105: Create calculation explanation
**Acceptance Criteria:**
- Explain methodology
- Show formulas
- Add examples
- Include resources
**Technical Details:**
- Create expandable section
- Add LaTeX rendering
- Include references

### TICKET-106: Implement tooltip explanations
**Acceptance Criteria:**
- Add help tooltips
- Explain terms
- Include examples
- Support mobile
**Technical Details:**
- Create tooltip system
- Add to all inputs
- Include diagrams

### TICKET-107: Build export calculations feature
**Acceptance Criteria:**
- Export to PDF
- Include all inputs
- Add visualizations
- Support sharing
**Technical Details:**
- Generate PDF report
- Add charts
- Include methodology

### TICKET-108: Create calculation history
**Acceptance Criteria:**
- Save calculations
- Show history list
- Allow comparison
- Add notes
**Technical Details:**
- Store in database
- Add timestamps
- Create comparison view

### TICKET-109: Implement comparison mode
**Acceptance Criteria:**
- Compare scenarios
- Show differences
- Highlight trade-offs
- Export comparison
**Technical Details:**
- Create split view
- Add diff highlighting
- Include recommendations

### TICKET-110: Build mobile-optimized calculator
**Acceptance Criteria:**
- Optimize for touch
- Simplify inputs
- Maintain functionality
- Test thoroughly
**Technical Details:**
- Create mobile layout
- Add number pads
- Optimize charts

### TICKET-111: Create keyboard shortcuts
**Acceptance Criteria:**
- Add shortcuts
- Show help menu
- Include navigation
- Support accessibility
**Technical Details:**
- Implement handlers
- Add documentation
- Include discovery

### TICKET-112: Implement undo/redo functionality
**Acceptance Criteria:**
- Track changes
- Add undo/redo
- Show history
- Include shortcuts
**Technical Details:**
- Create state history
- Add UI controls
- Implement shortcuts

### TICKET-113: Build print layout for results
**Acceptance Criteria:**
- Create print view
- Format for paper
- Include all data
- Add branding
**Technical Details:**
- Add print styles
- Hide controls
- Format charts

### TICKET-114: Create shareable calculator links
**Acceptance Criteria:**
- Generate URLs
- Encode parameters
- Add preview
- Track usage
**Technical Details:**
- Create URL scheme
- Add compression
- Include analytics

### TICKET-115: Implement calculation validation
**Acceptance Criteria:**
- Validate inputs
- Check feasibility
- Show warnings
- Suggest fixes
**Technical Details:**
- Add validation rules
- Check boundaries
- Provide guidance

## Summary

This document covers tickets 66-115 of the Pre-Experiment Check Tool implementation, focusing on:

1. **AI Integration** - Setting up multiple AI providers, implementing scoring algorithms, and creating intelligent feedback systems
2. **Sample Size Calculator** - Building interactive calculators with visualizations, preset scenarios, and comprehensive export capabilities

Each ticket is designed to be completed in 4-8 hours (1 story point) with clear acceptance criteria and technical implementation details.

The AI integration phase leverages multiple providers (OpenAI o3-mini, Claude Sonnet 4, Gemini 2.5 Pro) with fallback mechanisms and cost optimization. The calculator phase creates a comprehensive statistical planning tool with visual feedback and educational components.