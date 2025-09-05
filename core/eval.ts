export interface EvalGroup {
  id: string;
  name: string;
  model: string;
  version: number;
  createdAt: string;
}

export interface EvalRecord {
  id: string;
  input: string;
  output: string;
  expected: string;
  score: number;
  inputFingerPrint: string;
  evalGroupId: string;
  duration: number;
  createdAt: string;
}

// Web interface data structures
export interface EvalGroupWithLatestRun {
  id: string;
  name: string;
  model: string;
  latestVersion: number;
  totalRuns: number;
  lastRunAt: string;
  avgScore: number;
}

export interface EvalGroupDetails {
  id: string;
  name: string;
  model: string;
  version: number;
  createdAt: string;
  results: EvalRecord[];
  avgScore: number;
  totalTests: number;
}

export interface EvalVersion {
  id: string;
  name: string;
  model: string;
  version: number;
  createdAt: string;
  avgScore: number;
  totalTests: number;
}

export interface ChartDataPoint {
  version: number;
  score: number;
  date: string;
  duration: number;
}

export interface ScoreProgressPoint {
  version: number;
  score: number;
  duration: number;
  date: string;
}

export interface EvalRepository {
  // Original methods
  getMaxVersion(name: string): Promise<number | null>;
  createEvalGroup(name: string, model: string, version: number): Promise<{ id: string }>;
  saveEvalRecord(record: Omit<EvalRecord, 'id' | 'createdAt'>): Promise<void>;
  updateEvalGroupDuration(evalGroupId: string, totalDuration: number): Promise<void>
  
  // Web interface methods
  getAllEvalGroups(): Promise<EvalGroupWithLatestRun[]>;
  getEvalGroupDetails(groupId: string): Promise<EvalGroupDetails | null>;
  getEvalVersions(name: string): Promise<EvalVersion[]>;
  getEvalHistoryChart(name: string): Promise<ChartDataPoint[]>;
  getScoreProgressByFingerprint(fingerprint: string): Promise<ScoreProgressPoint[]>;
}