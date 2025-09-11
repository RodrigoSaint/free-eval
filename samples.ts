import { setTimeout } from "node:timers/promises";
import { EvalDomain } from "./domain/eval.ts";
import { DbEvalRepository } from "./infrastructure/eval.ts";

const evalDomain = new EvalDomain(new DbEvalRepository());

evalDomain.run({
  name: "Greetings eval",
  model: "gpt-4",
  genericPrompt: "Generate a greeting to the user [name]",
  thresholds: {
    averageScore: 60,
    goodScore: 80
  },
  concurrency: 4,
  delay: 0,
  getInputs: async () => {
    return [
      { input: {name: "Rodrigo", greeting: "Hey"} },
      { input: {name: "John", greeting: "Hi"} },
      { input: {name: "Susan", greeting: "Sup"} },
      { input: {name: "Jane", greeting: "Hello"} },
      { input: {name: "Paul", greeting: "Bye"} },
      { input: {name: "Alice", greeting: "Yo"} },
      { input: {name: "Michael", greeting: "Good morning"} },
      { input: {name: "Laura", greeting: "Howdy"} },
      { input: {name: "David", greeting: "Cheers"} },
      { input: {name: "Emma", greeting: "Welcome"} },
      { input: {name: "Chris", greeting: "Hiya"} },
      { input: {name: "Sophia", greeting: "Good evening"} },
      { input: {name: "Liam", greeting: "Hey there"} },
      { input: {name: "Olivia", greeting: "Greetings"} },
      { input: {name: "Ethan", greeting: "Salutations"} },
    ];
  },
  task: async (input) => {
    // - TODO: Replace with your LLM call
    await setTimeout(100 * Math.random())
    return `${input.greeting} ${input.name}`;
  },
  // The scoring methods for the eval
  scorer: async (input, output) => {
    const greetings = ["Hello", "Hi", "Hey", "Good morning", "Good evening"]
    let score = 0
    if(output.includes(input.name)) score += 50
    if(greetings.some(greeting => output.startsWith(greeting))) score += 50
    if(greetings.some(greeting => output.endsWith(greeting))) score -= 30
    return score
  },
});


