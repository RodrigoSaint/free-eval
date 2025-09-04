import { EvalDomain } from "./domain/eval.ts";
import { DbEvalRepository } from "./infrastructure/eval.ts";

const evalDomain = new EvalDomain(new DbEvalRepository());

evalDomain.run({
  name: "My Eval",
  model: "gpt-4",
  getInputs: async () => {
    return [
      { input: "Hello", expected: "Hello World!" },
      { input: "Hellos", expected: "Hello World!" },
    ];
  },
  // The task to perform
  // - TODO: Replace with your LLM call
  task: async (input) => {
    return input + " World!";
  },
  // The scoring methods for the eval
  scorer: async (input, output, expected) => {
    return output === expected ? 1 : 0;
  },
});

evalDomain.run({
  name: "Eval with percentages",
  model: "gpt-4",
  getInputs: async () => {
    return [
      { input: Math.random().toString(), expected: Math.random().toString() },
      { input: Math.random().toString(), expected: Math.random().toString() },
      { input: Math.random().toString(), expected: Math.random().toString() },
      { input: Math.random().toString(), expected: Math.random().toString() },
      { input: Math.random().toString(), expected: Math.random().toString() },
      { input: Math.random().toString(), expected: Math.random().toString() },
      { input: Math.random().toString(), expected: Math.random().toString() },
      { input: Math.random().toString(), expected: Math.random().toString() },
      { input: Math.random().toString(), expected: Math.random().toString() },
      { input: Math.random().toString(), expected: Math.random().toString() },
      { input: Math.random().toString(), expected: Math.random().toString() },
    ];
  },
  // The task to perform
  // - TODO: Replace with your LLM call
  task: async (input) => {
    return input;
  },
  // The scoring methods for the eval
  scorer: async (input, output, expected) => {
    return Math.random() * 100
  },
});

