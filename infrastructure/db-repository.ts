import { db, evalGroups, evals } from '../db.ts';
import { eq, max } from 'drizzle-orm';
import { EvalRepository, EvalRecord } from '../core/repository.ts'

export class DbEvalRepository implements EvalRepository {
  async getMaxVersion(name: string): Promise<number | null> {
    const [maxVersionResult] = await db
      .select({ maxVersion: max(evalGroups.version) })
      .from(evalGroups)
      .where(eq(evalGroups.name, name));
    
    return maxVersionResult?.maxVersion ?? null;
  }

  async createEvalGroup(name: string, model: string, version: number): Promise<{ id: string }> {
    const [evalGroup] = await db.insert(evalGroups).values({
      name,
      model,
      version,
    }).returning({ id: evalGroups.id });

    return evalGroup;
  }

  async saveEvalRecord(record: Omit<EvalRecord, 'id'>): Promise<void> {
    await db.insert(evals).values({
      input: record.input,
      output: record.output,
      expected: record.expected,
      score: record.score,
      inputFingerPrint: record.inputFingerPrint,
      evalGroupId: record.evalGroupId,
    });
  }
}