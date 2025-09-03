interface EvalVersion {
  id: string;
  name: string;
  model: string;
  version: number;
  createdAt: string;
  avgScore: number;
  totalTests: number;
}

interface VersionHistoryProps {
  versions: EvalVersion[];
  evalName: string;
  onSelectVersion: (versionId: string) => void;
  onClose: () => void;
}

export function VersionHistory({ versions, evalName, onSelectVersion, onClose }: VersionHistoryProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600';
    if (score >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Version History</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-xl"
            >
              ×
            </button>
          </div>
          <p className="text-gray-600 mt-1">{evalName}</p>
        </div>
        
        <div className="overflow-y-auto max-h-96">
          <div className="space-y-2 p-6">
            {versions.map((version) => (
              <div
                key={version.id}
                onClick={() => onSelectVersion(version.id)}
                className="flex justify-between items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex flex-col">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">v{version.version}</span>
                      {version.version === Math.max(...versions.map(v => v.version)) && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">Latest</span>
                      )}
                    </div>
                    <span className="text-sm text-gray-500">{formatDate(version.createdAt)}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500">{version.totalTests} tests</span>
                  <span className={`text-lg font-semibold ${getScoreColor(version.avgScore)}`}>
                    {(version.avgScore * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}