import { useState, useEffect } from "preact/hooks";
import { EvalGroupCard } from "../components/EvalGroupCard.tsx";
import { EvalResults } from "../components/EvalResults.tsx";
import { VersionHistory } from "../components/VersionHistory.tsx";

interface EvalGroupWithLatestRun {
  id: number;
  name: string;
  model: string;
  latestVersion: number;
  totalRuns: number;
  lastRunAt: string;
  avgScore: number;
}

interface EvalResult {
  id: number;
  input: string;
  output: string;
  expected: string;
  score: number;
  inputFingerPrint: string;
  evalGroupId: number;
}

interface EvalGroupDetails {
  id: number;
  name: string;
  model: string;
  version: number;
  createdAt: string;
  results: EvalResult[];
  avgScore: number;
  totalTests: number;
}

interface EvalVersion {
  id: number;
  name: string;
  model: string;
  version: number;
  createdAt: string;
  avgScore: number;
  totalTests: number;
}

type View = 'list' | 'results' | 'versions';

export default function EvalDashboard() {
  const [view, setView] = useState<View>('list');
  const [evalGroups, setEvalGroups] = useState<EvalGroupWithLatestRun[]>([]);
  const [selectedGroupDetails, setSelectedGroupDetails] = useState<EvalGroupDetails | null>(null);
  const [versions, setVersions] = useState<EvalVersion[]>([]);
  const [currentEvalName, setCurrentEvalName] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEvalGroups();
  }, []);

  const fetchEvalGroups = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/eval-groups');
      const data = await response.json();
      setEvalGroups(data);
    } catch (error) {
      console.error('Error fetching eval groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEvalResults = async (groupId: number) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/eval-results/${groupId}`);
      const data = await response.json();
      setSelectedGroupDetails(data);
      setView('results');
    } catch (error) {
      console.error('Error fetching eval results:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchVersions = async (evalName: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/eval-versions/${encodeURIComponent(evalName)}`);
      const data = await response.json();
      setVersions(data);
      setCurrentEvalName(evalName);
      setView('versions');
    } catch (error) {
      console.error('Error fetching versions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectVersion = async (versionId: number) => {
    await fetchEvalResults(versionId);
    setView('results');
  };

  const handleBack = () => {
    setView('list');
    setSelectedGroupDetails(null);
  };

  const handleCloseVersions = () => {
    if (selectedGroupDetails) {
      setView('results');
    } else {
      setView('list');
    }
    setVersions([]);
    setCurrentEvalName('');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {view === 'list' && (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Evaluations</h1>
              <p className="text-gray-600">View and manage your evaluation runs</p>
            </div>
            
            {evalGroups.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg">No evaluations found</div>
                <p className="text-gray-400 mt-2">Run your first evaluation to see results here</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {evalGroups.map((group) => (
                  <EvalGroupCard
                    key={group.id}
                    group={group}
                    onClick={fetchEvalResults}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {view === 'results' && selectedGroupDetails && (
          <EvalResults
            groupDetails={selectedGroupDetails}
            onShowVersions={fetchVersions}
            onBack={handleBack}
          />
        )}

        {view === 'versions' && (
          <VersionHistory
            versions={versions}
            evalName={currentEvalName}
            onSelectVersion={handleSelectVersion}
            onClose={handleCloseVersions}
          />
        )}
      </div>
    </div>
  );
}