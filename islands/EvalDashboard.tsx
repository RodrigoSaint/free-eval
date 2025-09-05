import { useState, useEffect } from "preact/hooks";
import { Sidebar } from "../components/Sidebar.tsx";
import { MainContent } from "../components/MainContent.tsx";
import { VersionHistory } from "../components/VersionHistory.tsx";
import { 
  EvalGroupWithLatestRun, 
  EvalRecord as EvalResult, 
  EvalGroupDetails, 
  EvalVersion 
} from "../core/eval.ts";

export default function EvalDashboard() {
  const [evalGroups, setEvalGroups] = useState<EvalGroupWithLatestRun[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [selectedGroupDetails, setSelectedGroupDetails] = useState<EvalGroupDetails | null>(null);
  const [versions, setVersions] = useState<EvalVersion[]>([]);
  const [currentEvalName, setCurrentEvalName] = useState<string>('');
  const [showVersions, setShowVersions] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEvalGroups();
  }, []);

  // Auto-select latest eval when groups are loaded
  useEffect(() => {
    if (evalGroups.length > 0 && selectedGroupId === null) {
      const latestGroup = evalGroups.reduce((latest, current) => 
        new Date(current.lastRunAt) > new Date(latest.lastRunAt) ? current : latest
      );
      handleSelectGroup(latestGroup.id);
    }
  }, [evalGroups, selectedGroupId]);

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

  const handleSelectGroup = async (groupId: string) => {
    console.log('Selecting group:', groupId);
    setSelectedGroupId(groupId);
    setLoading(true);
    try {
      const response = await fetch(`/api/eval-results/${groupId}`);
      const data = await response.json();
      console.log('Fetched data for group', groupId, ':', data);
      setSelectedGroupDetails(data);
    } catch (error) {
      console.error('Error fetching eval results:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShowVersions = async (evalName: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/eval-versions/${encodeURIComponent(evalName)}`);
      const data = await response.json();
      setVersions(data);
      setCurrentEvalName(evalName);
      setShowVersions(true);
    } catch (error) {
      console.error('Error fetching versions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectVersion = async (versionId: string) => {
    await handleSelectGroup(versionId);
    setShowVersions(false);
  };

  const handleCloseVersions = () => {
    setShowVersions(false);
    setVersions([]);
    setCurrentEvalName('');
  };

  if (loading && evalGroups.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        evalGroups={evalGroups}
        selectedGroupId={selectedGroupId}
        onSelectGroup={handleSelectGroup}
        onShowVersions={handleShowVersions}
      />
      
      <MainContent
        groupDetails={selectedGroupDetails}
        onShowVersions={handleShowVersions}
        loading={loading}
      />

      {showVersions && (
        <VersionHistory
          versions={versions}
          evalName={currentEvalName}
          onSelectVersion={handleSelectVersion}
          onClose={handleCloseVersions}
        />
      )}
    </div>
  );
}