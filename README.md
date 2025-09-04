# Free Eval

A simple, flexible, and self-hostable evaluation framework for AI/LLM models. Store, test, and visualize AI evaluations without technology constraints - keeping it free, flexible, and under your control.

## Why Free Eval?

Free Eval provides a straightforward way to:
- **Store** evaluation results with version tracking and progress monitoring
- **Test** AI models with custom scoring functions and input generation
- **Visualize** results through a built-in web dashboard with charts and progress tracking
- **Self-host** everything on your own infrastructure without external dependencies
- **Customize** storage backends through a simple repository interface

## Features

- ✅ **Version Management**: Automatic version incrementing for tracking model improvements
- ✅ **Input Fingerprinting**: SHA-256 hashing enables tracking same inputs across versions
- ✅ **Flexible Scoring**: Supports both boolean (pass/fail) and numeric (0-100) scoring
- ✅ **TypeScript Support**: Fully typed with generics for Input, Output, and Expected types
- ✅ **Custom Storage**: Repository pattern allows any storage backend implementation
- ✅ **Web Dashboard**: Built-in visualization and progress monitoring
- ✅ **Self-Hostable**: Run entirely on your own infrastructure
- ✅ **Free**: Completely free to use, no strings attached

![image](./images/eval_groups.png)
![image](./images/eval_details.png)

## Quick Start

### Basic Usage

```typescript
import { EvalDomain } from "./domain/eval.ts";
import { DbEvalRepository } from "./infrastructure/eval.ts";

const evalRepository = new DbEvalRepository()
// Domain can receive any instance of EvalRepository
const evalDomain = new EvalDomain(evalRepository);

await evalDomain.run({
  name: "My Eval",              // Eval group name
  model: "gpt-4",              // Model identifier
  getInputs: async () => {     // Function returning test inputs
    return [
      { input: "Hello", expected: "Hello World!" },
      { input: "Hi", expected: "Hi World!" },
    ];
  },
  task: async (input) => {     // Your AI task implementation
    // TODO: Replace with your LLM call
    return input + " World!";
  },
  scorer: async (input, output, expected) => {  // Scoring function
    return output === expected ? 1 : 0;         // Boolean or numeric scores
  },
});
```

### Configuration Options

- **`name`**: Evaluation group identifier (string)
- **`model`**: Model name or version being evaluated (string)
- **`getInputs`**: Async function returning array of test cases with `input` and optional `expected` values
- **`task`**: Async function that performs the AI task - replace with your LLM API calls
- **`scorer`**: Async function that calculates scores - supports boolean (pass/fail) or numeric (0-100) scoring

### Example with Percentage Scoring

```typescript
await evalDomain.run({
  name: "Classification Eval",
  model: "claude-3",
  getInputs: async () => {
    return [
      { input: "This movie is great!", expected: "positive" },
      { input: "This movie is terrible!", expected: "negative" },
    ];
  },
  task: async (input) => {
    // Your sentiment classification call
    return await classifysentiment(input);
  },
  scorer: async (input, output, expected) => {
    // Return confidence score (0-100)
    return calculateConfidenceScore(output, expected);
  },
});
```

## Custom Storage Implementation

In case you want to store the data in other ways you can implement the `EvalRepository` interface to use your preferred storage backend:

```typescript
import { EvalRepository, EvalGroup, EvalRecord } from "./core/eval.ts";

class CustomEvalRepository implements EvalRepository {
  async getMaxVersion(name: string): Promise<number> {
    // Your implementation - return highest version number for eval name
  }

  async createEvalGroup(evalGroup: Omit<EvalGroup, "id">): Promise<EvalGroup> {
    // Your implementation - store eval group and return with ID
  }

  async saveEvalRecord(evalRecord: Omit<EvalRecord, "id">): Promise<void> {
    // Your implementation - store individual evaluation record
  }

  // Additional methods for web dashboard (optional)
  async getAllEvalGroups(): Promise<EvalGroup[]> { /* ... */ }
  async getEvalGroupDetails(groupId: string): Promise</* ... */> { /* ... */ }
  // ... other dashboard methods
}

// Use your custom repository
const evalDomain = new EvalDomain(new CustomEvalRepository());
```

## Web Dashboard

The framework includes a built-in web dashboard for visualizing results:

- **Evaluation Groups**: View all your evaluation runs with latest scores
- **Version History**: Track model performance improvements over time  
- **Detailed Results**: Inspect individual test cases with inputs, outputs, and scores
- **Progress Charts**: Visual representation of score trends across versions
- **Input Tracking**: See how specific inputs perform across different model versions

## Architecture

Free Eval follows clean architecture principles:

- **Core Layer** (`core/eval.ts`): Interfaces and data structures
- **Domain Layer** (`domain/eval.ts`): Business logic and evaluation orchestration  
- **Infrastructure Layer** (`infrastructure/eval.ts`): Storage implementations and external integrations


## License

MIT