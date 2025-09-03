import { db, evalGroups, evals } from './db.ts';
import { eq, max } from 'drizzle-orm';

interface FEvalProps<Input, Output, Expected> {
  name: string
  model: string
  // prompt: string // how to handle this?
  getInputs(): Promise<Array<Promise<{input: Input, expected: Expected}> | {input: Input, expected: Expected}>>
  task(input: Input): Promise<Output>
  scorer(input: Input, output: Output, expected: Expected): Promise<number | boolean>
}

async function generateInputFingerprint(input: any): Promise<string> {
  const inputString = JSON.stringify(input);
  const encoder = new TextEncoder();
  const data = encoder.encode(inputString);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = new Uint8Array(hashBuffer);
  const hashHex = Array.from(hashArray).map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

const fEval = async <Input, Output, Expected = void>(props: FEvalProps<Input, Output, Expected>): Promise<void> => {
  // Get next version for this eval group name
  const [maxVersionResult] = await db
    .select({ maxVersion: max(evalGroups.version) })
    .from(evalGroups)
    .where(eq(evalGroups.name, props.name));
  
  const nextVersion = (maxVersionResult?.maxVersion ?? 0) + 1;

  // Create eval group
  const [evalGroup] = await db.insert(evalGroups).values({
    name: props.name,
    model: props.model,
    version: nextVersion,
  }).returning({ id: evalGroups.id });

  const inputPromises = await props.getInputs()
  for (const inputPromise of inputPromises) {
    const {input, expected} = await inputPromise
    const output = await props.task(input)
    const score = await props.scorer(input, output, expected)
    
    // Save eval record
    await db.insert(evals).values({
      input: JSON.stringify(input),
      output: JSON.stringify(output),
      expected: JSON.stringify(expected),
      score: typeof score === 'boolean' ? (score ? 1 : 0) : score,
      inputFingerPrint: await generateInputFingerprint(input),
      evalGroupId: evalGroup.id,
    });
    
    console.log(score)
  }
}

fEval({
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
    return output === expected? 1: 0
  },
});