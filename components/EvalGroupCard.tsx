import { EvalGroupWithLatestRun } from '../core/eval.ts';

interface EvalGroupCardProps {
  group: EvalGroupWithLatestRun;
  onClick: (groupId: string) => void;
}

export function EvalGroupCard({ group, onClick }: EvalGroupCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div
      onClick={() => onClick(group.id)}
      className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{group.name}</h3>
          <p className="text-sm text-gray-600">{group.model}</p>
        </div>
        <div className="text-right">
          <span className={`text-2xl font-bold ${getScoreColor(group.avgScore)}`}>
            {(group.avgScore).toFixed(0)}%
          </span>
        </div>
      </div>
      
      <div className="flex justify-between items-center text-sm text-gray-500">
        <div className="flex space-x-4">
          <span>v{group.latestVersion}</span>
          <span>{group.totalRuns} runs</span>
        </div>
        <span>{formatDate(group.lastRunAt)}</span>
      </div>
    </div>
  );
}