import { EvalGroupThreshold, EvalRepository } from "../core/eval.ts";
import PQueue from "p-queue";

export interface FEvalProps<Input, Output, Expected> {
  name: string;
  model: string;
  genericPrompt?: string
  thresholds?: EvalGroupThreshold
  concurrency?: number
  delay?: number
  getInputs(): Promise<
    Array<
      Promise<{ input: Input; expected?: Expected }> | {
        input: Input;
        expected?: Expected;
      }
    >
  >;
  task(input: Input): Promise<Output>;
  scorer(
    input: Input,
    output: Output,
    expected?: Expected,
  ): Promise<number | boolean>;
}

export class EvalDomain {
  constructor(private repository: EvalRepository) {}

  async run<Input, Output, Expected = void>(
    props: FEvalProps<Input, Output, Expected>,
  ): Promise<void> {
    const maxVersion = await this.repository.getMaxVersion(props.name);
    const nextVersion = (maxVersion ?? 0) + 1;

    const evalGroupStartTime = Date.now();
    const evalGroup = await this.repository.createEvalGroup({
      name: props.name,
      model: props.model,
      version: nextVersion,
      genericPrompt: props.genericPrompt,
      threshold: props.thresholds
    });

    console.debug(`Running eval group ${props.name}`)

    const inputPromises = await props.getInputs();
    const queue = new PQueue({ 
      concurrency: props.concurrency ?? 1,
      interval: props.delay ?? 0
    });

    await queue.addAll(
      inputPromises.map((inputPromise, index) => () => {
        return (async () => {
          console.debug(`${props.name}: Running case ${index} of ${inputPromises.length}`);
          const { input, expected } = await inputPromise;
          const evalStartTime = Date.now();
          const output = await props.task(input);
          const evalEndTime = Date.now();
          const duration = evalEndTime - evalStartTime;
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
          console.debug(`${props.name}: Finished running case ${index} of ${inputPromises.length}`);
        })();
      })
    );

    const evalGroupEndTime = Date.now();
    const totalDuration = evalGroupEndTime - evalGroupStartTime;
    await this.repository.updateEvalGroupDuration(evalGroup.id, totalDuration);
    console.debug(`Ending the eval group run ${props.name}`)
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