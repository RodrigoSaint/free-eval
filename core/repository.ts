export interface EvalGroup {
  id: number;
  name: string;
  model: string;
  version: number;
}

export interface EvalRecord {
  input: string;
  output: string;
  expected: string;
  score: number;
  inputFingerPrint: string;
  evalGroupId: string;
}

export interface EvalRepository {
  getMaxVersion(name: string): Promise<number | null>;
  createEvalGroup(name: string, model: string, version: number): Promise<{ id: string }>;
  saveEvalRecord(record: Omit<EvalRecord, 'id'>): Promise<void>;
}