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

interface EvalResultsProps {
  groupDetails: EvalGroupDetails;
  onShowVersions: (name: string) => void;
  onBack: () => void;
}

export function EvalResults({ groupDetails, onShowVersions, onBack }: EvalResultsProps) {
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
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <button
          onClick={onBack}
          className="text-blue-600 hover:text-blue-800 mb-4 flex items-center"
        >
          ← Back to evaluations
        </button>
        
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{groupDetails.name}</h1>
            <p className="text-gray-600">{groupDetails.model} • v{groupDetails.version}</p>
            <p className="text-sm text-gray-500">{formatDate(groupDetails.createdAt)}</p>
          </div>
          
          <div className="text-right">
            <div className="text-3xl font-bold text-gray-900">
              {(groupDetails.avgScore).toFixed(0)}%
            </div>
            <div className="text-sm text-gray-500">
              {groupDetails.results.filter(r => r.score === 1).length}/{groupDetails.totalTests} passed
            </div>
            <button
              onClick={() => onShowVersions(groupDetails.name)}
              className="mt-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm transition-colors"
            >
              View Versions
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {groupDetails.results.map((result) => (
          <div key={result.id} className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Input</label>
                  <div className="bg-gray-50 p-3 rounded border">
                    <code className="text-sm">{JSON.stringify(result.input)}</code>
                  </div>
                </div>
                
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Output</label>
                  <div className="bg-gray-50 p-3 rounded border">
                    <code className="text-sm">{result.output}</code>
                  </div>
                </div>
                
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expected</label>
                  <div className="bg-gray-50 p-3 rounded border">
                    <code className="text-sm">{result.expected}</code>
                  </div>
                </div>
              </div>
              
              <div className="ml-6">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(result.score)}`}>
                  {result.score > 60 ? '✓ Pass' : '✗ Fail'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}