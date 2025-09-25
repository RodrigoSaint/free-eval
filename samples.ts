import { setTimeout } from "node:timers/promises";
import { EvalDomain } from "./domain/eval.ts";
import { DbEvalRepository } from "./infrastructure/eval.ts";

const evalDomain = new EvalDomain(new DbEvalRepository());

evalDomain.run<{
  name: string;
  greeting: string;
}, string>({
  name: "Greetings eval",
  model: "gpt-4",
  genericPrompt: "Generate a greeting to the user [name]",
  thresholds: {
    averageScore: 60,
    goodScore: 80,
  },
  concurrency: 4,
  delay: 0,
  formatInputs(input) {
    return `${input.greeting} ${input.name}`;
  },
  formatOutputs(output) {
    return `Greeting: ${output}`;
  },
  getInputs: async () => {
    return [
      { input: { name: "Rodrigo", greeting: "Hey" } },
      { input: { name: "John", greeting: "Hi" } },
      { input: { name: "Susan", greeting: "Sup" } },
      { input: { name: "Jane", greeting: "Hello" } },
      { input: { name: "Paul", greeting: "Bye" } },
      { input: { name: "Alice", greeting: "Yo" } },
      { input: { name: "Michael", greeting: "Good morning" } },
      { input: { name: "Laura", greeting: "Howdy" } },
      { input: { name: "David", greeting: "Cheers" } },
      { input: { name: "Emma", greeting: "Welcome" } },
      { input: { name: "Chris", greeting: "Hiya" } },
      { input: { name: "Sophia", greeting: "Good evening" } },
      { input: { name: "Liam", greeting: "Hey there" } },
      { input: { name: "Olivia", greeting: "Greetings" } },
      { input: { name: "Ethan", greeting: "Salutations" } },
    ];
  },
  task: async (input): Promise<string> => {
    // - TODO: Replace with your LLM call
    await setTimeout(100 * Math.random());
    return `${input.greeting} ${input.name}`;
  },
  // The scoring methods for the eval
  scorer: async (input, output) => {
    const greetings = ["Hello", "Hi", "Hey", "Good morning", "Good evening"];
    const nameScore = output.includes(input.name) ? 50 : 0;
    let greetingScore = 0;
    if (greetings.some((greeting) => output.startsWith(greeting))) {
      greetingScore += 50;
    }
    if (greetings.some((greeting) => output.endsWith(greeting))) {
      greetingScore -= 30;
    }

    const score = nameScore + greetingScore;
    return {
      total: score,
      items: [
        { name: "name", score: nameScore, expected: input.name, output },
        {
          name: "greeting",
          score: greetingScore,
          expected: input.greeting,
          output,
        },
      ],
    };
  },
});
