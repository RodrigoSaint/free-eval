interface FEvalProps<Input, Output, Expected> {
  name: string
  model: string
  // prompt: string // how to handle this?
  getInputs(): Promise<Array<Promise<{input: Input, expected: Expected}> | {input: Input, expected: Expected}>>
  task(input: Input): Promise<Output>
  scorer(input: Input, output: Output, expected: Expected): Promise<number | boolean>
}

const fEval = async <Input, Output, Expected = void>(props: FEvalProps<Input, Output, Expected>): Promise<void> => {
  const inputPromises = await props.getInputs()
  for (const inputPromise of inputPromises) {
    const {input, expected} = await inputPromise
    const output = await props.task(input)
    const score = await props.scorer(input, output, expected)
    console.log(score)
    // TODO: Save an ID and allow users to provide their evals saving both
  }
}

fEval({
  name: "My Eval",
  model: "",
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