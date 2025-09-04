import { EvalRepository } from "../core/eval.ts";

export interface FEvalProps<Input, Output, Expected> {
  name: string;
  model: string;
  getInputs(): Promise<
    Array<
      Promise<{ input: Input; expected: Expected }> | {
        input: Input;
        expected: Expected;
      }
    >
  >;
  task(input: Input): Promise<Output>;
  scorer(
    input: Input,
    output: Output,
    expected: Expected,
  ): Promise<number | boolean>;
}

export class EvalDomain {
  constructor(private repository: EvalRepository) {}

  async run<Input, Output, Expected = void>(
    props: FEvalProps<Input, Output, Expected>,
  ): Promise<void> {
    const maxVersion = await this.repository.getMaxVersion(props.name);
    const nextVersion = (maxVersion ?? 0) + 1;

    const evalGroup = await this.repository.createEvalGroup(
      props.name,
      props.model,
      nextVersion,
    );

    const inputPromises = await props.getInputs();
    for (const inputPromise of inputPromises) {
      const { input, expected } = await inputPromise;
      const startTime = Date.now();
      const output = await props.task(input);
      const endTime = Date.now();
      const duration = endTime - startTime;
      const score = await props.scorer(input, output, expected);

      await this.repository.saveEvalRecord({
        input: JSON.stringify(input),
        output: JSON.stringify(output),
        expected: JSON.stringify(expected),
        score: typeof score === "boolean" ? (score ? 1 : 0) : score,
        duration: duration,
        inputFingerPrint: await this.generateInputFingerprint(input),
        evalGroupId: evalGroup.id,
      });
    }
  }

  private async generateInputFingerprint(input: any): Promise<string> {
    const inputString = JSON.stringify(input);
    const encoder = new TextEncoder();
    const data = encoder.encode(inputString);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = new Uint8Array(hashBuffer);
    const hashHex = Array.from(hashArray).map((b) =>
      b.toString(16).padStart(2, "0")
    ).join("");
    return hashHex;
  }
}