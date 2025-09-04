import { db, evalGroups, evals } from './db.ts';
import { eq, max, desc, count, avg } from 'drizzle-orm';
import { 
  EvalRepository, 
  EvalRecord, 
  EvalGroupWithLatestRun, 
  EvalGroupDetails, 
  EvalVersion,
  ChartDataPoint,
  ScoreProgressPoint
} from '../core/eval.ts'

export class DbEvalRepository implements EvalRepository {
  async updateEvalGroupDuration(evalGroupId: string, totalDuration: number): Promise<void> {
    await db.update(evalGroups).set({ duration: totalDuration }).where(eq(evalGroups.id, evalGroupId))
  }

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

  async saveEvalRecord(record: Omit<EvalRecord, 'id' | 'createdAt'>): Promise<void> {
    await db.insert(evals).values({
      input: record.input,
      output: record.output,
      expected: record.expected,
      score: record.score,
      inputFingerPrint: record.inputFingerPrint,
      evalGroupId: record.evalGroupId,
      duration: record.duration
    });
  }

  async getAllEvalGroups(): Promise<EvalGroupWithLatestRun[]> {
    const results = await db
      .select({
        id: evalGroups.id,
        name: evalGroups.name,
        model: evalGroups.model,
        version: evalGroups.version,
        createdAt: evalGroups.createdAt,
        totalTests: count(evals.id),
        avgScore: avg(evals.score),
      })
      .from(evalGroups)
      .leftJoin(evals, eq(evalGroups.id, evals.evalGroupId))
      .groupBy(evalGroups.id, evalGroups.name, evalGroups.model, evalGroups.version, evalGroups.createdAt)
      .orderBy(desc(evalGroups.createdAt));

    // Group by name and get the latest version for each
    const groupedByName = new Map<string, EvalGroupWithLatestRun>();
    
    for (const result of results) {
      const existing = groupedByName.get(result.name);
      const current: EvalGroupWithLatestRun = {
        id: result.id,
        name: result.name,
        model: result.model,
        latestVersion: result.version,
        totalRuns: result.totalTests || 0,
        lastRunAt: result.createdAt,
        avgScore: parseFloat(result.avgScore ?? "0") || 0,
      };

      if (!existing || result.version > existing.latestVersion) {
        groupedByName.set(result.name, current);
      }
    }

    return Array.from(groupedByName.values()).sort((a, b) => 
      new Date(b.lastRunAt).getTime() - new Date(a.lastRunAt).getTime()
    );
  }

  async getEvalGroupDetails(groupId: string): Promise<EvalGroupDetails | null> {
    const [evalGroup] = await db
      .select()
      .from(evalGroups)
      .where(eq(evalGroups.id, groupId));

    if (!evalGroup) return null;

    const evalResults = await db
      .select()
      .from(evals)
      .where(eq(evals.evalGroupId, groupId))
      .orderBy(desc(evals.createdAt));

    const avgScore = evalResults.length > 0 
      ? evalResults.reduce((sum, result) => sum + result.score, 0) / evalResults.length 
      : 0;

    return {
      id: evalGroup.id,
      name: evalGroup.name,
      model: evalGroup.model,
      version: evalGroup.version,
      createdAt: evalGroup.createdAt,
      results: evalResults as EvalRecord[],
      avgScore,
      totalTests: evalResults.length,
    };
  }

  async getEvalVersions(name: string): Promise<EvalVersion[]> {
    const results = await db
      .select({
        id: evalGroups.id,
        name: evalGroups.name,
        model: evalGroups.model,
        version: evalGroups.version,
        createdAt: evalGroups.createdAt,
        totalTests: count(evals.id),
        avgScore: avg(evals.score),
      })
      .from(evalGroups)
      .leftJoin(evals, eq(evalGroups.id, evals.evalGroupId))
      .where(eq(evalGroups.name, name))
      .groupBy(evalGroups.id, evalGroups.name, evalGroups.model, evalGroups.version, evalGroups.createdAt)
      .orderBy(desc(evalGroups.version));

    return results.map(result => ({
      id: result.id,
      name: result.name,
      model: result.model,
      version: result.version,
      createdAt: result.createdAt,
      avgScore: parseFloat(result.avgScore ?? "0") || 0,
      totalTests: result.totalTests || 0,
    }));
  }

  async getEvalHistoryChart(name: string): Promise<ChartDataPoint[]> {
    const results = await db
      .select({
        version: evalGroups.version,
        createdAt: evalGroups.createdAt,
        avgScore: avg(evals.score),
      })
      .from(evalGroups)
      .leftJoin(evals, eq(evalGroups.id, evals.evalGroupId))
      .where(eq(evalGroups.name, name))
      .groupBy(evalGroups.version, evalGroups.createdAt)
      .orderBy(evalGroups.version);

    return results.map(result => ({
      version: result.version,
      score: parseFloat(result.avgScore ?? "0") || 0,
      date: result.createdAt,
    }));
  }

  async getScoreProgressByFingerprint(fingerprint: string): Promise<ScoreProgressPoint[]> {
    const results = await db
      .select({
        version: evalGroups.version,
        createdAt: evalGroups.createdAt,
        score: evals.score,
        duration: evals.duration,
      })
      .from(evals)
      .innerJoin(evalGroups, eq(evals.evalGroupId, evalGroups.id))
      .where(eq(evals.inputFingerPrint, fingerprint))
      .orderBy(evalGroups.version);

    return results.map(result => ({
      version: result.version,
      score: result.score,
      date: result.createdAt,
      duration: result.duration
    }));
  }
}